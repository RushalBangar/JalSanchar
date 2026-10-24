# JalSanchar V2 — Build & Verification Guide
**Track 3-01: Climate-Resilient Water Intelligence (Sinnar & Ahilyanagar)**

---

## Step 1: Database Migrations & Demonstration Seed Data

### 1. Database Schema (`supabase_schema_v2.sql`)
In strict adherence to Hard Rule 0, existing V1 tables (`villages`, `tankers`, `dispatches`, `delivery_receipts`, `escrow_actions`, `gov_users`) remain completely untouched and unaltered.

The migration file creates 11 new tables:
1. `public.v2_villages` (District & Taluka taxonomy: `code`, `name`, `district`, `taluka`, `population`, `cattle`, `lat`, `lng`)
2. `public.water_sources` (Wells, storage tanks, lakes, percolation ponds with geometric dimensions JSON)
3. `public.source_readings` (Manual dips, water meters, satellite observations, and simulated levels)
4. `public.satellite_observations` (NASA SMAP soil moisture, Sentinel-2 NDWI, rainfall, ET0)
5. `public.weather_observations` (14-day rainfall forecast, temperature, humidity)
6. `public.cgwb_levels` (Central Ground Water Board reference observation wells)
7. `public.forecasts` (14-day low/expected/high days of water left and risk classification)
8. `public.pipelines` (Source-to-village distribution lines with materials and lengths)
9. `public.meters` (Ultrasonic and electromagnetic flow meters with calibration tolerances)
10. `public.meter_readings` (Cumulative totalizer records across 24h operational windows)
11. `public.loss_results` (Tolerance-bounded pipeline loss percentage with OK / Watch / Inspect states)

Row Level Security (RLS) is enabled on all tables, with public read access granted for citizen-facing data and authenticated access for municipal writes.

---

### 2. Demonstration Seed Data (`backend/seed_v2.py`)
Provides seed data for pilot areas in Maharashtra:
- **Nashik District (Sinnar Taluka)**: Pangari (`SN-01`), Khopadi (`SN-02`), Wadgaon Sinnar (`SN-03`)
- **Ahilyanagar District (Pathardi & Karjat Talukas)**: Tisgaon (`AH-01`), Korti (`AH-02`)

All demonstration data points are clearly labelled:
- Quality tags: `Metered`, `Manual`, `Satellite`, `Estimated`, `Simulated`
- Method tags: `manual`, `satellite`, `meter`, `simulated`

---

### 3. How to Run & Verify Step 1

#### A. Apply Database Migration (Supabase)
Run the contents of [supabase_schema_v2.sql](file:///d:/Web/JalSanchar/supabase_schema_v2.sql) in your Supabase SQL Editor:
```sql
-- Open Supabase Dashboard -> SQL Editor -> New Query
-- Paste and Run supabase_schema_v2.sql
```

#### B. Verify Python Seed Dataset & Syntax
Run the syntax check and seed data verification test:
```powershell
python -m py_compile backend/seed_v2.py
python -c "from backend.seed_v2 import VILLAGES_SEED, SOURCES_SEED, FORECASTS_SEED, PIPELINES_SEED; print(f'Successfully loaded {len(VILLAGES_SEED)} villages, {len(SOURCES_SEED)} sources, {len(FORECASTS_SEED)} forecasts, and {len(PIPELINES_SEED)} pipelines.')"
```
Output:
```
Successfully loaded 5 villages, 7 sources, 5 forecasts, and 3 pipelines.
```

---

## Step 2: Storage Maths, Sources Portal & Village Water Status

### 1. Backend: `backend/routes/sources.py`
Registered via a single line in `backend/main.py`:
- `POST /api/sources`: Panchayat source registration (Wells, Tanks, Lakes) with geometric dimensions JSON.
- `POST /api/readings`: Field measurement logging (depth to water, height, or gauge reading).
- `GET /api/village/{id}/status`: Village water balance status with:
  - **Storage Maths**:
    - Open well: $V = \pi \times r^2 \times (\text{total\_depth} - \text{depth\_to\_water} - \text{dead\_storage}) \times 1000$ (Liters)
    - Tank (rectangular): $V = \text{length} \times \text{width} \times \max(0, \text{water\_height} - \text{dead\_storage}) \times 1000$
    - Tank (round): $V = \pi \times r^2 \times \max(0, \text{water\_height} - \text{dead\_storage}) \times 1000$
    - Lake/pond: $V = \text{area} \times \max(0, \text{average\_depth} - \text{dead\_storage}) \times 1000$
    - Daily demand: $\text{demand\_L} = \text{population} \times 40 + \text{cattle} \times 70$
    - Days left: $\text{days\_left} = \frac{\text{usable\_storage}}{\text{demand} + \text{losses} - \text{inflow}}$
    - Returns best/expected/worst case range (`days_left_low`, `days_left_expected`, `days_left_high`), widened when inputs are estimates.

### 2. Frontend Modules & Dashboards
- **Shared Modules**:
  - `frontend/js/api.js`: Unified fetch client with automatic bearer token and offline awareness.
  - `frontend/js/badge.js`: Quality badges (`Metered`, `Manual`, `Satellite`, `Estimated`, `Simulated`).
  - `frontend/js/charts.js`: Chart.js shaded confidence bands for 14-day forecasts.
  - `frontend/js/offline.js`: Offline storage and queueing for field readings via IndexedDB.
  - `frontend/js/i18n.js`: Multilingual translations (Marathi default, English, Hindi).
- **Pages**:
  - `frontend/sources.html`: Panchayat portal with simplified 1-number reading entry and offline queueing.
  - `frontend/village.html`: Citizen status with prominent **RANGE** days-of-water-left and source breakdown.
- **Direct Sign Out Option**:
  - Updated `frontend/js/auth.js` to ensure the `#userProfileMount` is unhidden across all dashboards (`dashboard.html`, `panchayat.html`, `driver.html`) and displays an immediate, visible **Sign Out** button alongside the officer profile pill.

### 3. How to Test Step 2
```powershell
python -m py_compile backend/routes/sources.py
python -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); res = c.get('/api/village/SN-01/status'); print('Status:', res.status_code, res.json()['days_left'])"
```

