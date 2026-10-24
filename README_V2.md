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
