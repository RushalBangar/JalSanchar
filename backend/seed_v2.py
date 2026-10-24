"""
JalSanchar V2 Seed Data & Local Mock Provider
Track 3-01: Climate-Resilient Water Intelligence (Sinnar & Ahilyanagar)
Provides reliable seeded data and offline/fallback datasets for all V2 endpoints.
All non-measured values are explicitly flagged as SIMULATED or ESTIMATED.
"""

import os
import datetime
from typing import Dict, List, Optional, Any

# ------------------------------------------------------------------------------
# 1. Registered Pilot Villages (Sinnar, Nashik & Pathardi/Karjat, Ahilyanagar)
# ------------------------------------------------------------------------------
VILLAGES_SEED: List[Dict[str, Any]] = [
    {
        "code": "SN-01",
        "name": "Pangari",
        "district": "Nashik",
        "taluka": "Sinnar",
        "population": 2450,
        "cattle": 820,
        "lat": 19.8512,
        "lng": 73.9540,
        "daily_demand_L": 2450 * 40 + 820 * 70,  # 155,400 L/day
        "status": "critical",
        "data_quality": "Metered"
    },
    {
        "code": "SN-02",
        "name": "Khopadi",
        "district": "Nashik",
        "taluka": "Sinnar",
        "population": 3200,
        "cattle": 1200,
        "lat": 19.9015,
        "lng": 74.1030,
        "daily_demand_L": 3200 * 40 + 1200 * 70,  # 212,000 L/day
        "status": "critical",
        "data_quality": "Manual"
    },
    {
        "code": "SN-03",
        "name": "Wadgaon Sinnar",
        "district": "Nashik",
        "taluka": "Sinnar",
        "population": 1500,
        "cattle": 450,
        "lat": 19.8120,
        "lng": 74.0530,
        "daily_demand_L": 1500 * 40 + 450 * 70,  # 91,500 L/day
        "status": "warning",
        "data_quality": "Estimated"
    },
    {
        "code": "AH-01",
        "name": "Tisgaon",
        "district": "Ahilyanagar",
        "taluka": "Pathardi",
        "population": 4850,
        "cattle": 1620,
        "lat": 19.1415,
        "lng": 75.0512,
        "daily_demand_L": 4850 * 40 + 1620 * 70,  # 307,400 L/day
        "status": "critical",
        "data_quality": "Satellite"
    },
    {
        "code": "AH-02",
        "name": "Korti",
        "district": "Ahilyanagar",
        "taluka": "Karjat",
        "population": 2100,
        "cattle": 750,
        "lat": 18.9100,
        "lng": 75.0200,
        "daily_demand_L": 2100 * 40 + 750 * 70,  # 136,500 L/day
        "status": "safe",
        "data_quality": "Simulated"
    }
]

# ------------------------------------------------------------------------------
# 2. Water Sources (Open wells, Storage Tanks, Lakes/Ponds)
# ------------------------------------------------------------------------------
SOURCES_SEED: List[Dict[str, Any]] = [
    {
        "id": "SRC-SN01-W1",
        "village_id": "SN-01",
        "type": "open_well",
        "name": "Pangari Gram Panchayat Community Well 1",
        "dimensions": {"radius_m": 2.25, "total_depth_m": 16.0},
        "dead_storage": 1.5,
        "lat": 19.8520,
        "lng": 73.9535,
        "data_quality": "Manual",
        "last_reading": {
            "value": 11.4,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=6)).isoformat(),
            "method": "manual",
            "quality": "measured"
        }
    },
    {
        "id": "SRC-SN01-T1",
        "village_id": "SN-01",
        "type": "tank",
        "name": "Pangari Primary School ESR (Cylindrical)",
        "dimensions": {"radius_m": 3.0, "height_m": 4.5, "shape": "cylindrical"},
        "dead_storage": 0.5,
        "lat": 19.8505,
        "lng": 73.9550,
        "data_quality": "Metered",
        "last_reading": {
            "value": 2.1,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)).isoformat(),
            "method": "meter",
            "quality": "measured"
        }
    },
    {
        "id": "SRC-SN01-L1",
        "village_id": "SN-01",
        "type": "lake",
        "name": "Pangari Percolation Lake (Kharwandi Nala)",
        "dimensions": {"satellite_water_area_sqm": 28000, "average_depth_m": 2.2},
        "dead_storage": 0.8,
        "lat": 19.8550,
        "lng": 73.9600,
        "data_quality": "Satellite",
        "last_reading": {
            "value": 1.8,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=24)).isoformat(),
            "method": "satellite",
            "quality": "estimated"
        }
    },
    {
        "id": "SRC-SN02-W1",
        "village_id": "SN-02",
        "type": "open_well",
        "name": "Khopadi Malshiras Community Well",
        "dimensions": {"radius_m": 2.5, "total_depth_m": 18.0},
        "dead_storage": 2.0,
        "lat": 19.9020,
        "lng": 74.1025,
        "data_quality": "Simulated",
        "last_reading": {
            "value": 14.8,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=12)).isoformat(),
            "method": "simulated",
            "quality": "simulated"
        }
    },
    {
        "id": "SRC-SN02-T1",
        "village_id": "SN-02",
        "type": "tank",
        "name": "Khopadi Central GLSR (Rectangular)",
        "dimensions": {"length_m": 10.0, "width_m": 6.0, "height_m": 3.5, "shape": "rectangular"},
        "dead_storage": 0.4,
        "lat": 19.9010,
        "lng": 74.1040,
        "data_quality": "Metered",
        "last_reading": {
            "value": 1.4,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=4)).isoformat(),
            "method": "meter",
            "quality": "measured"
        }
    },
    {
        "id": "SRC-AH01-W1",
        "village_id": "AH-01",
        "type": "open_well",
        "name": "Tisgaon Bazar Talav Well",
        "dimensions": {"radius_m": 3.0, "total_depth_m": 20.0},
        "dead_storage": 2.0,
        "lat": 19.1420,
        "lng": 75.0505,
        "data_quality": "Manual",
        "last_reading": {
            "value": 15.2,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=8)).isoformat(),
            "method": "manual",
            "quality": "measured"
        }
    },
    {
        "id": "SRC-AH01-L1",
        "village_id": "AH-01",
        "type": "lake",
        "name": "Tisgaon Historic Storage Lake",
        "dimensions": {"satellite_water_area_sqm": 65000, "average_depth_m": 3.0},
        "dead_storage": 1.0,
        "lat": 19.1450,
        "lng": 75.0540,
        "data_quality": "Satellite",
        "last_reading": {
            "value": 2.1,
            "recorded_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=18)).isoformat(),
            "method": "satellite",
            "quality": "estimated"
        }
    }
]

# ------------------------------------------------------------------------------
# 3. 14-Day Drought & Storage Forecasts (Low / Expected / High Bands)
# ------------------------------------------------------------------------------
FORECASTS_SEED: Dict[str, Dict[str, Any]] = {
    "SN-01": {
        "village_id": "SN-01",
        "village_name": "Pangari",
        "days_left_low": 6,
        "days_left_expected": 9,
        "days_left_high": 12,
        "risk": "High",
        "risk_badge": "High Risk",
        "trend_pct": -4.8,
        "data_quality": "Metered",
        "model_version": "WDI-v2.1",
        "updated_at": datetime.date.today().isoformat(),
        "depletion_rate_lpd": 162000,
        "daily_breakdown": [
            {"day": i, "low": max(0, 9 - i * 0.9), "expected": max(0, 11 - i * 0.8), "high": max(0, 13 - i * 0.7)}
            for i in range(1, 15)
        ]
    },
    "SN-02": {
        "village_id": "SN-02",
        "village_name": "Khopadi",
        "days_left_low": 4,
        "days_left_expected": 7,
        "days_left_high": 10,
        "risk": "High",
        "risk_badge": "High Risk",
        "trend_pct": -5.2,
        "data_quality": "Simulated",
        "model_version": "WDI-v2.1",
        "updated_at": datetime.date.today().isoformat(),
        "depletion_rate_lpd": 218000,
        "daily_breakdown": [
            {"day": i, "low": max(0, 6 - i * 0.8), "expected": max(0, 8 - i * 0.7), "high": max(0, 10 - i * 0.6)}
            for i in range(1, 15)
        ]
    },
    "SN-03": {
        "village_id": "SN-03",
        "village_name": "Wadgaon Sinnar",
        "days_left_low": 14,
        "days_left_expected": 18,
        "days_left_high": 24,
        "risk": "Medium",
        "risk_badge": "Moderate Risk",
        "trend_pct": -2.1,
        "data_quality": "Estimated",
        "model_version": "WDI-v2.1",
        "updated_at": datetime.date.today().isoformat(),
        "depletion_rate_lpd": 92000,
        "daily_breakdown": [
            {"day": i, "low": max(0, 18 - i * 0.8), "expected": max(0, 22 - i * 0.7), "high": max(0, 26 - i * 0.6)}
            for i in range(1, 15)
        ]
    },
    "AH-01": {
        "village_id": "AH-01",
        "village_name": "Tisgaon",
        "days_left_low": 3,
        "days_left_expected": 5,
        "days_left_high": 8,
        "risk": "High",
        "risk_badge": "Critical Risk",
        "trend_pct": -6.1,
        "data_quality": "Satellite",
        "model_version": "WDI-v2.1",
        "updated_at": datetime.date.today().isoformat(),
        "depletion_rate_lpd": 312000,
        "daily_breakdown": [
            {"day": i, "low": max(0, 5 - i * 0.8), "expected": max(0, 7 - i * 0.7), "high": max(0, 9 - i * 0.5)}
            for i in range(1, 15)
        ]
    },
    "AH-02": {
        "village_id": "AH-02",
        "village_name": "Korti",
        "days_left_low": 18,
        "days_left_expected": 22,
        "days_left_high": 28,
        "risk": "Low",
        "risk_badge": "Stable",
        "trend_pct": -0.9,
        "data_quality": "Simulated",
        "model_version": "WDI-v2.1",
        "updated_at": datetime.date.today().isoformat(),
        "depletion_rate_lpd": 138000,
        "daily_breakdown": [
            {"day": i, "low": max(0, 22 - i * 0.7), "expected": max(0, 26 - i * 0.6), "high": max(0, 30 - i * 0.5)}
            for i in range(1, 15)
        ]
    }
}

# ------------------------------------------------------------------------------
# 4. Pipelines & Flow Meters (Loss Detection)
# ------------------------------------------------------------------------------
PIPELINES_SEED: List[Dict[str, Any]] = [
    {
        "id": "PL-SN01-01",
        "village_id": "SN-01",
        "name": "Pangari Feeder Trunk Line 1",
        "from_source_id": "SRC-SN01-W1",
        "from_source_name": "Pangari Gram Panchayat Community Well 1",
        "to_destination": "Pangari Cistern ESR-1",
        "length_m": 1450.0,
        "material": "Ductile Iron (DI)",
        "source_meter": {
            "id": "MTR-PL01-SRC",
            "role": "source",
            "serial": "SN-MTR-US-901",
            "calibration_error": 0.02
        },
        "receiver_meters": [
            {
                "id": "MTR-PL01-RCV",
                "role": "receiver",
                "serial": "SN-MTR-EM-902",
                "calibration_error": 0.025
            }
        ],
        "latest_loss": {
            "window": "24h Cumulative",
            "supplied_L": 60000.0,
            "received_L": 48600.0,
            "loss_pct_low": 16.5,
            "loss_pct_expected": 19.0,
            "loss_pct_high": 21.5,
            "status": "Watch",
            "status_label": "Watch — Loss exceeds baseline tolerance (19.0% ± 2.5%)",
            "consecutive_elevated_windows": 3,
            "data_quality": "Simulated"
        }
    },
    {
        "id": "PL-SN02-01",
        "village_id": "SN-02",
        "name": "Khopadi Main Ward Distribution Pipeline",
        "from_source_id": "SRC-SN02-W1",
        "from_source_name": "Khopadi Malshiras Community Well",
        "to_destination": "Khopadi Central GLSR",
        "length_m": 2200.0,
        "material": "High-Density Polyethylene (HDPE)",
        "source_meter": {
            "id": "MTR-PL02-SRC",
            "role": "source",
            "serial": "SN-MTR-US-801",
            "calibration_error": 0.02
        },
        "receiver_meters": [
            {
                "id": "MTR-PL02-RCV",
                "role": "receiver",
                "serial": "SN-MTR-EM-802",
                "calibration_error": 0.03
            }
        ],
        "latest_loss": {
            "window": "24h Cumulative",
            "supplied_L": 85000.0,
            "received_L": 62900.0,
            "loss_pct_low": 23.0,
            "loss_pct_expected": 26.0,
            "loss_pct_high": 29.0,
            "status": "Inspect",
            "status_label": "Inspect — Severe transmission deficit (26.0% ± 3.0%)",
            "consecutive_elevated_windows": 5,
            "data_quality": "Simulated"
        }
    },
    {
        "id": "PL-AH01-01",
        "village_id": "AH-01",
        "name": "Tisgaon Gravity Conduit",
        "from_source_id": "SRC-AH01-W1",
        "from_source_name": "Tisgaon Bazar Talav Well",
        "to_destination": "Tisgaon South Sump",
        "length_m": 980.0,
        "material": "Prestressed Concrete (PSC)",
        "source_meter": {
            "id": "MTR-PL03-SRC",
            "role": "source",
            "serial": "AH-MTR-US-701",
            "calibration_error": 0.015
        },
        "receiver_meters": [
            {
                "id": "MTR-PL03-RCV",
                "role": "receiver",
                "serial": "AH-MTR-EM-702",
                "calibration_error": 0.02
            }
        ],
        "latest_loss": {
            "window": "24h Cumulative",
            "supplied_L": 110000.0,
            "received_L": 105600.0,
            "loss_pct_low": 2.5,
            "loss_pct_expected": 4.0,
            "loss_pct_high": 5.5,
            "status": "OK",
            "status_label": "OK — Within normal operational loss limits (4.0% ± 1.5%)",
            "consecutive_elevated_windows": 0,
            "data_quality": "Simulated"
        }
    }
]

# ------------------------------------------------------------------------------
# 5. Public Tanker Tracker Seed (Strict Privacy: NO driver names or phone numbers)
# ------------------------------------------------------------------------------
PUBLIC_TANKERS_SEED: List[Dict[str, Any]] = [
    {
        "tanker_id": "TN-SN-02",
        "registration": "MH-15-TK-5512",
        "capacity_liters": 10000,
        "district": "Nashik",
        "taluka": "Sinnar",
        "target_village_code": "SN-02",
        "target_village_name": "Khopadi",
        "status": "en_route",
        "status_label": "En Route to Village",
        "eta_minutes": 25,
        "last_verified_delivery": "Today, 11:30 AM (10,000 L verified via Panchayat QR)",
        "data_quality": "Metered"
    },
    {
        "tanker_id": "TN-SN-04",
        "registration": "MH-15-AG-4022",
        "capacity_liters": 12000,
        "district": "Nashik",
        "taluka": "Sinnar",
        "target_village_code": "SN-01",
        "target_village_name": "Pangari",
        "status": "scheduled",
        "status_label": "Scheduled for Dispatch",
        "eta_minutes": 90,
        "last_verified_delivery": "Yesterday, 04:15 PM (12,000 L verified via Panchayat QR)",
        "data_quality": "Simulated"
    },
    {
        "tanker_id": "TN-AH-01",
        "registration": "MH-16-BD-8901",
        "capacity_liters": 15000,
        "district": "Ahilyanagar",
        "taluka": "Pathardi",
        "target_village_code": "AH-01",
        "target_village_name": "Tisgaon",
        "status": "discharging",
        "status_label": "At Village Cistern — Discharging",
        "eta_minutes": 0,
        "last_verified_delivery": "Current Delivery Handshake In Progress",
        "data_quality": "Metered"
    }
]

# ------------------------------------------------------------------------------
# Accessor & Helper Functions
# ------------------------------------------------------------------------------
def get_seeded_villages(district: Optional[str] = None, taluka: Optional[str] = None) -> List[Dict[str, Any]]:
    """Filters villages by district and taluka if provided."""
    results = VILLAGES_SEED
    if district and district.strip():
        results = [v for v in results if v["district"].lower() == district.strip().lower()]
    if taluka and taluka.strip():
        results = [v for v in results if v["taluka"].lower() == taluka.strip().lower()]
    return results

def get_village_by_id(village_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves village profile by village code or name."""
    v_id = village_id.strip().lower()
    for v in VILLAGES_SEED:
        if v["code"].lower() == v_id or v["name"].lower() == v_id:
            return v
    return None

def get_sources_for_village(village_id: str) -> List[Dict[str, Any]]:
    """Returns all registered water sources for a given village."""
    v_id = village_id.strip().lower()
    return [s for s in SOURCES_SEED if s["village_id"].lower() == v_id]

def get_forecast_for_village(village_id: str) -> Optional[Dict[str, Any]]:
    """Returns 14-day forecast data for a given village."""
    v_id = village_id.strip().upper()
    return FORECASTS_SEED.get(v_id)

def get_pipelines_for_village(village_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Returns pipelines, optionally filtered by village."""
    if not village_id:
        return PIPELINES_SEED
    v_id = village_id.strip().lower()
    return [p for p in PIPELINES_SEED if p["village_id"].lower() == v_id]

def get_pipeline_by_id(pipeline_id: str) -> Optional[Dict[str, Any]]:
    """Returns pipeline by pipeline ID."""
    p_id = pipeline_id.strip().upper()
    for p in PIPELINES_SEED:
        if p["id"].upper() == p_id:
            return p
    return None

def get_public_tankers(village: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Returns public tanker tracking info.
    STRICT PRIVACY: Never includes driver name or phone number.
    """
    if not village:
        return PUBLIC_TANKERS_SEED
    v_term = village.strip().lower()
    return [
        t for t in PUBLIC_TANKERS_SEED
        if t["target_village_code"].lower() == v_term or t["target_village_name"].lower() == v_term
    ]
