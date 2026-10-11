"""
JalSanjeevani / HydroPulse - Supabase Operational Users Seeder
🔒 SECURED: Passwords are hashed with bcrypt before storing in Supabase.
Seeds the 3 authorized government roles (Collector, Driver, Panchayat)
into the public.gov_users table in Supabase PostgreSQL.
"""

import os
import bcrypt
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("backend/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://vzfddxiiptkeeyvrfkhl.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_KEY:
    print("[Error] SUPABASE_KEY not found in backend/.env")
    exit(1)

client = create_client(SUPABASE_URL, SUPABASE_KEY)


def hash_password(plain_password: str) -> str:
    """Hashes a plaintext password using bcrypt with auto-generated salt."""
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# 🔒 Passwords are bcrypt-hashed before being stored
GOV_USERS = [
    {
        "id": "USR-COL-01",
        "email": "collector@sinnar.jalsanjeevani.gov.in",
        "password_hash": hash_password("sovereign_water_2025"),
        "role": "collector",
        "name": "Shri. Rahul More, IAS",
        "title": "District Collector & Magistrate",
        "badge_id": "MH-IAS-0419",
        "jurisdiction": "Ahilyanagar & Sinnar Disaster Division",
        "portal_url": "dashboard.html",
        "tanker_id": None,
        "registration": None,
        "driver_key": None,
        "village": None,
        "cistern_key": None,
        "permissions": ["dispatch_approval", "escrow_freeze", "satellite_radar_view", "cvrp_optimization"],
        "is_active": True
    },
    {
        "id": "USR-DRV-15",
        "email": "driver.mh15@sinnar.jalsanjeevani.gov.in",
        "password_hash": hash_password("sovereign_water_2025"),
        "role": "driver",
        "name": "Ramesh V. Patil",
        "title": "Municipal Tanker Pilot",
        "badge_id": "RTO-MH15-WT-881",
        "jurisdiction": "Tanker TN-SN-02 (MH-15-TK-5512)",
        "portal_url": "driver.html",
        "tanker_id": "TN-SN-02",
        "registration": "MH-15-TK-5512",
        "driver_key": "0x9F3B4ED812C4",
        "village": None,
        "cistern_key": None,
        "permissions": ["gps_telemetry_broadcast", "qr_token_generation", "sos_beacon"],
        "is_active": True
    },
    {
        "id": "USR-GP-104",
        "email": "panchayat.khopadi@sinnar.jalsanjeevani.gov.in",
        "password_hash": hash_password("sovereign_water_2025"),
        "role": "panchayat",
        "name": "Sunita G. Deshmukh",
        "title": "Sarpanch & Water Vigilance Officer",
        "badge_id": "GP-SN-104",
        "jurisdiction": "Khopadi Gram Panchayat (Sinnar)",
        "portal_url": "panchayat.html",
        "tanker_id": None,
        "registration": None,
        "driver_key": None,
        "village": "Khopadi (Sinnar Taluka)",
        "cistern_key": "0x74CE8A1109B2",
        "permissions": ["optical_qr_scan", "cistern_level_attestation", "escrow_payment_release"],
        "is_active": True
    }
]

def seed_users():
    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    print("🔒 Passwords will be stored as bcrypt hashes (never plaintext).")
    try:
        # Check if table exists by querying 1 row
        res = client.table("gov_users").select("id").limit(1).execute()
        print("[Supabase Check] 'gov_users' table found!")
    except Exception as e:
        print("\n[Notice] 'gov_users' table does not exist in Supabase yet.")
        print("To create it in 10 seconds:")
        print("1. Open Supabase Dashboard -> SQL Editor")
        print("2. Paste the SQL query from 'supabase_schema.sql' (Section 6: gov_users)")
        print("3. Click 'Run'")
        print(f"\nUnderlying error: {e}")
        return

    # Upsert each user into Supabase
    for user in GOV_USERS:
        try:
            # Verify the hash is valid bcrypt
            assert user["password_hash"].startswith("$2b$"), f"Password for {user['email']} is not bcrypt hashed!"
            upsert_res = client.table("gov_users").upsert(user).execute()
            print(f"[Success] Seeded {user['role'].upper()}: {user['email']} ({user['name']}) — password bcrypt hashed ✅")
        except Exception as err:
            print(f"[Error] Failed to upsert {user['email']}: {err}")

if __name__ == "__main__":
    seed_users()
