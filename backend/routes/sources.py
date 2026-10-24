"""
JalSanchar V2 - Water Sources & Village Hydrological Balance Router
Implements storage mathematics, source registrations, reading logs,
and confidence-bounded 14-day days-left water calculations.
"""

import math
import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field

# Import seed provider & fallbacks
try:
    from backend.seed_v2 import (
        VILLAGES_SEED,
        SOURCES_SEED,
        FORECASTS_SEED,
        get_village_by_id,
        get_sources_for_village,
        get_forecast_for_village
    )
except ImportError:
    from seed_v2 import (
        VILLAGES_SEED,
        SOURCES_SEED,
        FORECASTS_SEED,
        get_village_by_id,
        get_sources_for_village,
        get_forecast_for_village
    )

# Import authentication dependencies from main
try:
    from backend.main import require_auth, require_role, supabase_client
except ImportError:
    from main import require_auth, require_role, supabase_client

router = APIRouter(tags=["Water Sources & Village Hydrology"])

# In-memory storage for newly added sources & readings during current runtime
_dynamic_sources: List[Dict[str, Any]] = []
_dynamic_readings: List[Dict[str, Any]] = []


# =============================================================================
# Pydantic Schemas
# =============================================================================

class SourceCreateRequest(BaseModel):
    village_id: str
    type: str  # 'open_well', 'tank', 'lake', 'pond'
    name: str
    dimensions: Dict[str, Any] = Field(default_factory=dict)
    dead_storage: float = 0.0
    lat: float
    lng: float


class ReadingCreateRequest(BaseModel):
    source_id: str
    value: float  # depth to water in meters, water height in meters, or gauge marker
    method: str = "manual"  # 'manual', 'meter', 'satellite', 'simulated'
    photo_url: Optional[str] = None
    quality: str = "measured"  # 'measured', 'estimated', 'default', 'simulated'


# =============================================================================
# Hydrological Storage Calculation Mathematics
# =============================================================================

def compute_source_volume_liters(source: Dict[str, Any], latest_reading_val: Optional[float] = None) -> Dict[str, Any]:
    """
    Computes usable storage volume in liters according to source geometry:
    - Open well: volume_L = pi * r^2 * (total_depth - depth_to_water - dead_storage) * 1000
    - Tank (rectangular): volume_L = length * width * water_height * 1000
    - Tank (cylindrical): volume_L = pi * r^2 * water_height * 1000
    - Lake/pond: volume_L = satellite_water_area * average_depth * 1000
    """
    src_type = source.get("type", "open_well").lower()
    dims = source.get("dimensions", {})
    dead_storage = float(source.get("dead_storage", 0.0))
    val = latest_reading_val

    volume_liters = 0.0
    calculation_detail = ""
    quality = source.get("data_quality", "Estimated")

    if src_type in ["open_well", "well"]:
        radius = float(dims.get("radius_m", dims.get("diameter_m", 4.0) / 2.0))
        total_depth = float(dims.get("total_depth_m", 15.0))
        depth_to_water = float(val) if val is not None else float(dims.get("default_depth_to_water_m", 11.0))
        usable_water_column = max(0.0, total_depth - depth_to_water - dead_storage)
        volume_m3 = math.pi * (radius ** 2) * usable_water_column
        volume_liters = volume_m3 * 1000.0
        calculation_detail = f"π × ({radius:.2f}m)² × ({total_depth:.1f}m - {depth_to_water:.1f}m - {dead_storage:.1f}m dead storage)"

    elif src_type == "tank":
        shape = dims.get("shape", "cylindrical").lower()
        if "rect" in shape or "length_m" in dims:
            length = float(dims.get("length_m", 8.0))
            width = float(dims.get("width_m", 5.0))
            water_height = float(val) if val is not None else float(dims.get("height_m", 3.0) * 0.5)
            usable_height = max(0.0, water_height - dead_storage)
            volume_m3 = length * width * usable_height
            volume_liters = volume_m3 * 1000.0
            calculation_detail = f"{length:.1f}m × {width:.1f}m × ({water_height:.2f}m - {dead_storage:.1f}m)"
        else:
            radius = float(dims.get("radius_m", 3.0))
            water_height = float(val) if val is not None else float(dims.get("height_m", 4.0) * 0.5)
            usable_height = max(0.0, water_height - dead_storage)
            volume_m3 = math.pi * (radius ** 2) * usable_height
            volume_liters = volume_m3 * 1000.0
            calculation_detail = f"π × ({radius:.2f}m)² × ({water_height:.2f}m - {dead_storage:.1f}m)"

    elif src_type in ["lake", "pond"]:
        area_sqm = float(dims.get("satellite_water_area_sqm", 25000.0))
        avg_depth = float(val) if val is not None else float(dims.get("average_depth_m", 2.0))
        usable_depth = max(0.0, avg_depth - dead_storage)
        volume_m3 = area_sqm * usable_depth
        volume_liters = volume_m3 * 1000.0
        calculation_detail = f"{area_sqm:,.0f} m² satellite area × ({avg_depth:.2f}m - {dead_storage:.1f}m)"

    return {
        "volume_liters": round(volume_liters),
        "volume_m3": round(volume_liters / 1000.0, 1),
        "calculation_detail": calculation_detail,
        "quality": quality
    }


# =============================================================================
# API Endpoints
# =============================================================================

@router.post("/api/sources")
async def create_water_source(payload: SourceCreateRequest, session: dict = Depends(require_auth)):
    """
    Registers a new community open well, elevated storage tank, or percolation lake.
    Requires Panchayat or Collector role.
    """
    user_role = session.get("role", "")
    if user_role not in ["panchayat", "collector"]:
        raise HTTPException(status_code=403, detail="Only Gram Panchayat or Collector officers can register water sources.")

    source_id = f"SRC-{payload.village_id}-{payload.type[:3].upper()}-{int(datetime.datetime.now().timestamp()) % 10000}"
    new_source = {
        "id": source_id,
        "village_id": payload.village_id,
        "type": payload.type,
        "name": payload.name,
        "dimensions": payload.dimensions,
        "dead_storage": payload.dead_storage,
        "lat": payload.lat,
        "lng": payload.lng,
        "data_quality": "Manual",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    # Save to Supabase if available
    if supabase_client:
        try:
            supabase_client.table("water_sources").insert(new_source).execute()
        except Exception as e:
            print(f"[JalSources] Supabase insert water_sources notice: {e}")

    _dynamic_sources.append(new_source)
    return {"status": "SUCCESS", "message": "Water source registered successfully", "source": new_source}


@router.post("/api/readings")
async def record_source_reading(payload: ReadingCreateRequest, session: dict = Depends(require_auth)):
    """
    Records a field measurement (one number) for a designated water source.
    """
    reading_record = {
        "source_id": payload.source_id,
        "value": payload.value,
        "method": payload.method,
        "photo_url": payload.photo_url,
        "quality": payload.quality,
        "recorded_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    if supabase_client:
        try:
            supabase_client.table("source_readings").insert(reading_record).execute()
        except Exception as e:
            print(f"[JalSources] Supabase insert source_readings notice: {e}")

    _dynamic_readings.append(reading_record)
    return {"status": "SUCCESS", "message": "Reading recorded successfully", "reading": reading_record}


@router.get("/api/village/{id}/status")
async def get_village_status(id: str):
    """
    Public / Citizen & Authority Endpoint:
    Returns village water status with:
    - Days of water left as a RANGE (low / expected / high)
    - Detailed source cards with mathematical usable volumes
    - Data quality badge on every calculation
    - 14-day depletion projection curve
    """
    village = get_village_by_id(id)
    if not village:
        # Fallback to default village if id not found
        village = VILLAGES_SEED[0]

    v_code = village["code"]
    sources = get_sources_for_village(v_code) + [s for s in _dynamic_sources if s.get("village_id") == v_code]

    # Calculate usable storage for each source
    enriched_sources = []
    total_usable_L = 0.0
    quality_counts = {"Metered": 0, "Manual": 0, "Satellite": 0, "Estimated": 0, "Simulated": 0}

    for src in sources:
        # Check dynamic readings first
        matching_readings = [r for r in _dynamic_readings if r.get("source_id") == src.get("id")]
        if matching_readings:
            latest_val = matching_readings[-1]["value"]
            latest_date = matching_readings[-1]["recorded_at"]
            method = matching_readings[-1].get("method", "manual")
        elif "last_reading" in src:
            latest_val = src["last_reading"].get("value")
            latest_date = src["last_reading"].get("recorded_at")
            method = src["last_reading"].get("method", "manual")
        else:
            latest_val = None
            latest_date = None
            method = "estimated"

        calc = compute_source_volume_liters(src, latest_val)
        vol_L = calc["volume_liters"]
        total_usable_L += vol_L
        q = calc["quality"]
        quality_counts[q] = quality_counts.get(q, 0) + 1

        enriched_sources.append({
            "id": src.get("id"),
            "name": src.get("name"),
            "type": src.get("type"),
            "usable_liters": vol_L,
            "usable_m3": calc["volume_m3"],
            "calculation_detail": calc["calculation_detail"],
            "data_quality": q,
            "latest_reading": latest_val,
            "reading_method": method,
            "recorded_at": latest_date,
            "lat": src.get("lat"),
            "lng": src.get("lng")
        })

    # Statutory daily demand: population * 40L + cattle * 70L
    pop = village.get("population", 2000)
    cattle = village.get("cattle", 500)
    daily_demand_L = pop * 40 + cattle * 70

    # Hydrological days left range:
    # Usable storage / (demand + losses - inflow)
    # Worst case: 25% conveyance/evap loss, 0 inflow -> demand * 1.25
    # Expected: 15% loss -> demand * 1.15
    # Best case: 5% loss -> demand * 1.05
    denom_worst = daily_demand_L * 1.25
    denom_expected = daily_demand_L * 1.15
    denom_best = daily_demand_L * 1.05

    days_low = max(0, int(total_usable_L / denom_worst)) if denom_worst > 0 else 0
    days_expected = max(0, int(total_usable_L / denom_expected)) if denom_expected > 0 else 0
    days_high = max(days_expected + 1, int(total_usable_L / denom_best)) if denom_best > 0 else 0

    # If sources are sparse or estimates, widen confidence bounds
    has_defaults_or_estimates = quality_counts["Estimated"] + quality_counts["Simulated"] > 0
    if has_defaults_or_estimates:
        days_low = max(1, int(days_low * 0.85))
        days_high = int(days_high * 1.25)

    # Risk categorization
    if days_expected < 7:
        risk = "High"
        risk_label = "Critical Deficit Risk"
        risk_color = "#C0392B"
        risk_icon = "alert-triangle"
    elif days_expected <= 14:
        risk = "Medium"
        risk_label = "Moderate Watch"
        risk_color = "#E67E22"
        risk_icon = "alert-circle"
    else:
        risk = "Low"
        risk_label = "Stable Storage"
        risk_color = "#27AE60"
        risk_icon = "check-circle"

    # Derive overall village data quality badge
    if quality_counts["Metered"] >= len(enriched_sources) / 2 and quality_counts["Metered"] > 0:
        overall_quality = "Metered"
    elif quality_counts["Manual"] >= len(enriched_sources) / 2 and quality_counts["Manual"] > 0:
        overall_quality = "Manual"
    elif quality_counts["Satellite"] > 0:
        overall_quality = "Satellite"
    elif quality_counts["Simulated"] > 0:
        overall_quality = "Simulated"
    else:
        overall_quality = "Estimated"

    # 14-day projection array with shaded band
    daily_projection = []
    curr_low = float(days_low)
    curr_exp = float(days_expected)
    curr_high = float(days_high)

    for d in range(1, 15):
        curr_low = max(0.0, curr_low - 0.95)
        curr_exp = max(0.0, curr_exp - 0.85)
        curr_high = max(0.0, curr_high - 0.70)
        daily_projection.append({
            "day": d,
            "low": round(curr_low, 1),
            "expected": round(curr_exp, 1),
            "high": round(curr_high, 1)
        })

    return {
        "village": {
            "code": village["code"],
            "name": village["name"],
            "district": village["district"],
            "taluka": village["taluka"],
            "population": pop,
            "cattle": cattle,
            "lat": village["lat"],
            "lng": village["lng"]
        },
        "days_left": {
            "low": days_low,
            "expected": days_expected,
            "high": days_high,
            "range_display": f"{days_low} to {days_high} days",
            "data_quality": overall_quality,
            "risk": risk,
            "risk_label": risk_label,
            "risk_color": risk_color,
            "risk_icon": risk_icon
        },
        "storage_summary": {
            "total_usable_liters": round(total_usable_L),
            "total_usable_m3": round(total_usable_L / 1000.0, 1),
            "daily_demand_liters": daily_demand_L,
            "human_quota_liters": pop * 40,
            "cattle_quota_liters": cattle * 70,
            "sources_count": len(enriched_sources)
        },
        "sources": enriched_sources,
        "daily_projection": daily_projection,
        "meta": {
            "calculation_standard": "Government Jal Jeevan / Statutory Drought Norms",
            "statutory_quotas": "40L/capita (human) + 70L/head (cattle)",
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "disclaimer": "This tool supports local authorities and does not replace water-quality testing."
        }
    }
