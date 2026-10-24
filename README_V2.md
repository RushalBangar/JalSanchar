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

---

## Step 3: Public Tanker Tracker & Transparency Portal

### 1. Backend: `backend/routes/public.py`
Registered via a single line in `backend/main.py` (`app.include_router(public.router)`):
- `GET /api/villages?district=&taluka=`: Public list of pilot villages filtered by administrative jurisdiction.
- `GET /api/tankers/public?village=`: Real-time public water tanker dispatches with strict privacy controls:
  - **Citizen Privacy Guarantee**: Driver full name, phone number, and internal license keys are rigorously stripped and never exposed.
  - **Rate Limiting**: IP-based in-memory sliding window rate limiting (60 requests per minute) returning `429 Too Many Requests` on abuse.
  - Returns Tanker ID, vehicle registration, dispatch status, ETA in minutes, last verified QR delivery receipt, and telemetry data quality badge.

### 2. Frontend: `frontend/tracker.html` & `public/tracker.html`
- Citizen-first transparency tracker adhering to Government Formal Light design standards (`#1A5276`, `#148F77`, `#27AE60`, `#E67E22`).
- 3 cascading administrative dropdowns (**District** -> **Taluka** -> **Village**) with automatic URL parameter persistence (`?village=SN-02`).
- Displays live dispatch cards with:
  - Tanker ID & Vehicle Registration
  - Real-time ETA status badge
  - Last verified Panchayat dual-QR delivery timestamp and volume
  - Seamless jump link to the village's water balance page (`village.html?id=...`)
- Responsive and accessible in direct sunlight, includes offline indicator banner and formal disclaimer.

### 3. How to Test Step 3
```powershell
python -m py_compile backend/routes/public.py
python -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r1 = c.get('/api/villages?district=Nashik&taluka=Sinnar'); assert r1.status_code == 200; r2 = c.get('/api/tankers/public?village=SN-02'); assert r2.status_code == 200; assert 'driver_phone' not in str(r2.content); print('Step 3 verified successfully!')"
```

---

## Step 4: Pipeline Conveyance Loss Detection & Monitoring

### 1. Backend: `backend/routes/pipelines.py`
Registered via a single line in `backend/main.py` (`app.include_router(pipelines.router)`):
- `POST /api/meters/readings`: Field entry for cumulative ultrasonic/electromagnetic totalizers (`manual`, `metered`, `simulated`).
- `GET /api/pipelines`: Comprehensive overview of trunk transmission lines with status (`OK`, `Watch`, `Inspect`), supplied volume, received volume, and bounded loss range.
- `GET /api/pipelines/{id}/loss`: Detailed 24-hour cumulative operational window balance:
  - **Loss Balance Formula**: $\text{Loss} = \text{source\_meter\_output} - \sum \text{receiver\_meter\_inputs}$
  - **Calibration Tolerance Propagation**: Bounds loss using meter calibration margins ($e_{\text{tol}} = (e_{\text{source}} + \bar{e}_{\text{receiver}}) \times 100\%$).
  - **Bounded Output**: *"Pipeline P-X losing about X% to Y%"* (never single false precision).
  - **Integrity Rule**: Strictly states *"Never claim an exact leak position. Ground acoustic survey or physical patrol required along the segment."*
  - **Hysteresis Flagging**: Transitions to `Inspect` only when deficit exceeds baseline tolerance across consecutive windows.

### 2. Frontend: `frontend/pipelines.html` & `public/pipelines.html`
- Government Formal Light transmission cockpit for Collectors and Panchayat water engineers.
- KPI metric cards: Monitored lines, OK (normal < 10%), Watch (10% - 20%), Inspect (> 20%), and 24h net conveyance deficit.
- Interactive modal with 7-day conveyance loss trend chart (Chart.js) and meter tolerance breakdown.
- In-page cumulative totalizer reading form (`POST /api/meters/readings`).
- Direct sign-out button and statutory disclaimer: *"This tool supports local authorities and does not replace water-quality testing."*

### 3. Universal Multilingual Fix Across All 9 Pages
- **Engine**: Rewrote `frontend/js/lang.js` to provide universal automatic bidirectional text translation across English (`en`), Marathi (`mr`), and Hindi (`hi`).
- **Persistence**: Synced across `localStorage` (`jalsanchar_lang` and `preferred_lang`).
- **All Pages Supported**:
  1. `index.html` (Landing page)
  2. `login.html` (Portal Login)
  3. `dashboard.html` (Collector Command Center)
  4. `panchayat.html` (Gram Panchayat Terminal)
  5. `driver.html` (Tanker Driver Logistics)
  6. `village.html` (Citizen Village Water Status)
  7. `sources.html` (Panchayat Source Registry)
  8. `tracker.html` (Public Tanker Tracker)
  9. `pipelines.html` (Pipeline Conveyance Loss Monitor)

### 4. How to Test Step 4
```powershell
python -m py_compile backend/routes/pipelines.py
python -c "from fastapi.testclient import TestClient; from backend.main import app; c = TestClient(app); r = c.get('/api/pipelines'); assert r.status_code == 200; assert len(r.json()) == 3; print('Step 4 verified successfully!')"
```

