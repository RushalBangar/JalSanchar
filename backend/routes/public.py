"""
JalSanchar V2 - Public Citizen Transparency Router
Track 3-01: Climate-Resilient Water Intelligence
Provides read-only, rate-limited public APIs for:
1. Village hierarchy discovery (district, taluka, village)
2. Public tanker tracking (ETA, verified deliveries)
CRITICAL PRIVACY SAFEGUARD: NEVER exposes driver names or phone numbers to the public.
"""

import os
import time
from collections import defaultdict
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Request

# Import seed provider & fallbacks
try:
    from backend.seed_v2 import (
        VILLAGES_SEED,
        PUBLIC_TANKERS_SEED,
        get_seeded_villages,
        get_public_tankers,
        get_village_by_id
    )
except ImportError:
    from seed_v2 import (
        VILLAGES_SEED,
        PUBLIC_TANKERS_SEED,
        get_seeded_villages,
        get_public_tankers,
        get_village_by_id
    )

# Supabase client import if initialized
try:
    from backend.main import supabase_client
except ImportError:
    from main import supabase_client

router = APIRouter(tags=["Public Citizen Transparency"])

# ─── Public Rate Limiter (In-Memory Sliding Window: 60 requests / minute) ────
_public_rate_limits: Dict[str, list] = defaultdict(list)
PUBLIC_RATE_LIMIT_MAX = 60
PUBLIC_RATE_LIMIT_WINDOW = 60  # seconds


def check_public_rate_limit(request: Request):
    """Enforces rate limiting on open citizen-facing endpoints."""
    client_ip = request.client.host if request.client else "anonymous"
    now = time.time()
    _public_rate_limits[client_ip] = [
        t for t in _public_rate_limits[client_ip]
        if now - t < PUBLIC_RATE_LIMIT_WINDOW
    ]
    if len(_public_rate_limits[client_ip]) >= PUBLIC_RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a few moments before searching again."
        )
    _public_rate_limits[client_ip].append(now)


# =============================================================================
# 1. GET /api/villages?district=&taluka=
# =============================================================================
@router.get("/api/villages")
async def get_public_villages(
    request: Request,
    district: Optional[str] = Query(None, description="Filter by District (e.g. Nashik, Ahilyanagar)"),
    taluka: Optional[str] = Query(None, description="Filter by Taluka (e.g. Sinnar, Pathardi, Karjat)")
):
    """
    Public Citizen Endpoint:
    Returns the village administrative directory filtered by district and taluka.
    Publicly accessible without credentials to enable citizen search.
    """
    check_public_rate_limit(request)

    # 1. Try querying Supabase v2_villages or villages table
    if supabase_client:
        try:
            query = supabase_client.table("v2_villages").select("*")
            if district and district.strip():
                query = query.ilike("district", district.strip())
            if taluka and taluka.strip():
                query = query.ilike("taluka", taluka.strip())
            res = query.order("name").execute()
            if res.data:
                return {
                    "count": len(res.data),
                    "district": district,
                    "taluka": taluka,
                    "villages": res.data
                }
        except Exception as e:
            # Fallback to local verified seed dataset
            pass

    # 2. Filter fallback seed dataset
    filtered = get_seeded_villages(district=district, taluka=taluka)
    return {
        "count": len(filtered),
        "district": district,
        "taluka": taluka,
        "villages": filtered
    }


# =============================================================================
# 2. GET /api/tankers/public?village=
# =============================================================================
@router.get("/api/tankers/public")
async def get_public_tankers_status(
    request: Request,
    village: Optional[str] = Query(None, description="Village code or name (e.g. SN-01, Khopadi)")
):
    """
    Public Citizen Tanker Tracker:
    Allows rural residents to track relief water tankers heading to their village.
    Shows: Tanker ID, registration, ETA, and last verified delivery.
    
    🔒 PRIVACY GUARANTEE:
    This endpoint NEVER returns driver names, personal phone numbers, or private credentials.
    """
    check_public_rate_limit(request)

    # Filter tankers by village
    tankers = get_public_tankers(village=village)

    # Sanitization check: strictly verify no driver names or phone numbers are exposed
    sanitized = []
    for t in tankers:
        item = {
            "tanker_id": t.get("tanker_id"),
            "registration": t.get("registration"),
            "capacity_liters": t.get("capacity_liters", 10000),
            "district": t.get("district"),
            "taluka": t.get("taluka"),
            "target_village_code": t.get("target_village_code"),
            "target_village_name": t.get("target_village_name"),
            "status": t.get("status"),
            "status_label": t.get("status_label"),
            "eta_minutes": t.get("eta_minutes"),
            "last_verified_delivery": t.get("last_verified_delivery"),
            "data_quality": t.get("data_quality", "Metered")
        }
        # Explicitly delete any sensitive keys if accidentally present
        item.pop("driver_name", None)
        item.pop("driver_phone", None)
        item.pop("phone", None)
        item.pop("driver_key", None)
        sanitized.append(item)

    village_info = None
    if village:
        village_obj = get_village_by_id(village)
        if village_obj:
            village_info = {
                "code": village_obj.get("code"),
                "name": village_obj.get("name"),
                "district": village_obj.get("district"),
                "taluka": village_obj.get("taluka")
            }

    return {
        "count": len(sanitized),
        "village": village_info,
        "tankers": sanitized,
        "meta": {
            "notice": "Public citizen transparency ledger. Sensitive operator telemetry is protected under privacy standards.",
            "disclaimer": "This tool supports local authorities and does not replace water-quality testing."
        }
    }
