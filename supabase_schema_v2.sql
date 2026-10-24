-- ==============================================================================
-- JalSanchar V2 Supabase Database Schema & Migration
-- Track 3-01: Climate-Resilient Water Intelligence
-- Pilot: Sinnar & Ahilyanagar, Maharashtra
-- ==============================================================================
-- NOTE: In strict accordance with Hard Rule 0, existing V1 tables 
-- (villages, tankers, dispatches, delivery_receipts, escrow_actions, gov_users)
-- are completely untouched and UNMODIFIED. Only new tables are created.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Village Registry (District & Taluka Hierarchy)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.v2_villages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    taluka TEXT NOT NULL,
    population INTEGER NOT NULL DEFAULT 0,
    cattle INTEGER NOT NULL DEFAULT 0,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. Water Sources (Open wells, Storage Tanks, Lakes, Percolation Ponds)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.water_sources (
    id TEXT PRIMARY KEY,
    village_id TEXT NOT NULL REFERENCES public.v2_villages(code) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('open_well', 'tank', 'lake', 'pond')),
    name TEXT NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '{}'::jsonb,
    dead_storage DOUBLE PRECISION NOT NULL DEFAULT 0.0, -- In meters (depth) or liters
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. Source Readings (Manual dips, Gauge meters, Satellite area, Simulated)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id TEXT NOT NULL REFERENCES public.water_sources(id) ON DELETE CASCADE,
    value DOUBLE PRECISION NOT NULL, -- Depth to water in meters, or water height
    method TEXT NOT NULL CHECK (method IN ('manual', 'satellite', 'meter', 'simulated')),
    photo_url TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    quality TEXT NOT NULL DEFAULT 'measured' CHECK (quality IN ('measured', 'estimated', 'default', 'simulated'))
);

-- ------------------------------------------------------------------------------
-- 4. Satellite Observations (NASA SMAP Soil Moisture, Sentinel-2 NDWI)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.satellite_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id TEXT NOT NULL REFERENCES public.v2_villages(code) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    soil_moisture_smap DOUBLE PRECISION, -- cm³/cm³ (0.0 to 0.5)
    ndwi DOUBLE PRECISION,               -- Normalized Difference Water Index (-1.0 to 1.0)
    rainfall_mm DOUBLE PRECISION DEFAULT 0.0,
    evapotranspiration_mm DOUBLE PRECISION DEFAULT 0.0,
    source_label TEXT DEFAULT 'NASA_SMAP_SENTINEL2',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. Weather Observations (Open-Meteo & IMD Precipitation & ET0)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id TEXT NOT NULL REFERENCES public.v2_villages(code) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    temp_c DOUBLE PRECISION,
    rainfall_forecast_14d_mm DOUBLE PRECISION DEFAULT 0.0,
    et0_mm DOUBLE PRECISION DEFAULT 0.0,
    humidity_pct DOUBLE PRECISION,
    source_label TEXT DEFAULT 'OPEN_METEO_API',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. CGWB Levels (Central Ground Water Board Reference Wells)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cgwb_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id TEXT NOT NULL REFERENCES public.v2_villages(code) ON DELETE CASCADE,
    station_code TEXT NOT NULL,
    station_name TEXT NOT NULL,
    observation_date DATE NOT NULL,
    water_level_mbgl DOUBLE PRECISION NOT NULL, -- Meters below ground level
    source_label TEXT DEFAULT 'CGWB_INDIA_WATER_PORTAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. 14-Day Drought & Storage Forecasts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_id TEXT NOT NULL REFERENCES public.v2_villages(code) ON DELETE CASCADE,
    date DATE NOT NULL,
    days_left_low INTEGER NOT NULL,
    days_left_expected INTEGER NOT NULL,
    days_left_high INTEGER NOT NULL,
    risk TEXT NOT NULL CHECK (risk IN ('High', 'Medium', 'Low')),
    model_version TEXT NOT NULL DEFAULT 'WDI-v2.1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. Water Distribution Pipelines
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pipelines (
    id TEXT PRIMARY KEY,
    from_source_id TEXT NOT NULL REFERENCES public.water_sources(id) ON DELETE CASCADE,
    to_destination TEXT NOT NULL,
    length_m DOUBLE PRECISION NOT NULL DEFAULT 1000.0,
    material TEXT NOT NULL DEFAULT 'DI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. Ultrasonic & Electromagnetic Flow Meters
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meters (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('source', 'receiver')),
    serial TEXT NOT NULL,
    calibration_error DOUBLE PRECISION NOT NULL DEFAULT 0.02, -- e.g. 2% tolerance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. Meter Cumulative Totalizer Readings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meter_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_id TEXT NOT NULL REFERENCES public.meters(id) ON DELETE CASCADE,
    cumulative_liters DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    method TEXT NOT NULL DEFAULT 'metered' CHECK (method IN ('manual', 'metered', 'simulated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 11. Pipeline Loss Results (Cumulative Balance Analysis)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loss_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id TEXT NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    supplied_L DOUBLE PRECISION NOT NULL,
    received_L DOUBLE PRECISION NOT NULL,
    loss_pct_low DOUBLE PRECISION NOT NULL,
    loss_pct_high DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('OK', 'Watch', 'Inspect')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 🔒 Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.v2_villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cgwb_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loss_results ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access for Non-Sensitive Citizen Intelligence
CREATE POLICY "Public read for v2_villages" ON public.v2_villages FOR SELECT USING (true);
CREATE POLICY "Public read for water_sources" ON public.water_sources FOR SELECT USING (true);
CREATE POLICY "Public read for source_readings" ON public.source_readings FOR SELECT USING (true);
CREATE POLICY "Public read for forecasts" ON public.forecasts FOR SELECT USING (true);
CREATE POLICY "Public read for satellite_observations" ON public.satellite_observations FOR SELECT USING (true);
CREATE POLICY "Public read for weather_observations" ON public.weather_observations FOR SELECT USING (true);
CREATE POLICY "Public read for cgwb_levels" ON public.cgwb_levels FOR SELECT USING (true);
CREATE POLICY "Public read for pipelines" ON public.pipelines FOR SELECT USING (true);
CREATE POLICY "Public read for meters" ON public.meters FOR SELECT USING (true);
CREATE POLICY "Public read for loss_results" ON public.loss_results FOR SELECT USING (true);

-- 2. Authenticated / Service Role Write Access
CREATE POLICY "Auth write for v2_villages" ON public.v2_villages FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for water_sources" ON public.water_sources FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for source_readings" ON public.source_readings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for forecasts" ON public.forecasts FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for satellite_observations" ON public.satellite_observations FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for weather_observations" ON public.weather_observations FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for cgwb_levels" ON public.cgwb_levels FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for pipelines" ON public.pipelines FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for meters" ON public.meters FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for meter_readings" ON public.meter_readings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth write for loss_results" ON public.loss_results FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role') WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');


-- ==============================================================================
-- 🌱 SEED DATA: Clearly Labelled Demonstration Data (Sinnar & Ahilyanagar)
-- ==============================================================================

-- 1. Villages Directory (Pilot: Sinnar, Nashik & Pathardi/Karjat, Ahilyanagar)
INSERT INTO public.v2_villages (code, name, district, taluka, population, cattle, lat, lng) VALUES
('SN-01', 'Pangari', 'Nashik', 'Sinnar', 2450, 820, 19.8512, 73.9540),
('SN-02', 'Khopadi', 'Nashik', 'Sinnar', 3200, 1200, 19.9015, 74.1030),
('SN-03', 'Wadgaon Sinnar', 'Nashik', 'Sinnar', 1500, 450, 19.8120, 74.0530),
('AH-01', 'Tisgaon', 'Ahilyanagar', 'Pathardi', 4850, 1620, 19.1415, 75.0512),
('AH-02', 'Korti', 'Ahilyanagar', 'Karjat', 2100, 750, 18.9100, 75.0200)
ON CONFLICT (code) DO NOTHING;

-- 2. Water Sources for Registered Villages
INSERT INTO public.water_sources (id, village_id, type, name, dimensions, dead_storage, lat, lng) VALUES
-- Pangari sources (SN-01)
('SRC-SN01-W1', 'SN-01', 'open_well', 'Pangari Gram Panchayat Community Well 1', '{"radius_m": 2.25, "total_depth_m": 16.0}', 1.5, 19.8520, 73.9535),
('SRC-SN01-T1', 'SN-01', 'tank', 'Pangari Primary School ESR (Round)', '{"radius_m": 3.0, "height_m": 4.5, "shape": "cylindrical"}', 0.5, 19.8505, 73.9550),
('SRC-SN01-L1', 'SN-01', 'lake', 'Pangari Percolation Lake (Kharwandi Nala)', '{"satellite_water_area_sqm": 28000, "average_depth_m": 2.2}', 0.8, 19.8550, 73.9600),

-- Khopadi sources (SN-02)
('SRC-SN02-W1', 'SN-02', 'open_well', 'Khopadi Malshiras Community Well', '{"radius_m": 2.5, "total_depth_m": 18.0}', 2.0, 19.9020, 74.1025),
('SRC-SN02-T1', 'SN-02', 'tank', 'Khopadi Central GLSR (Rectangular)', '{"length_m": 10.0, "width_m": 6.0, "height_m": 3.5, "shape": "rectangular"}', 0.4, 19.9010, 74.1040),

-- Tisgaon sources (AH-01)
('SRC-AH01-W1', 'AH-01', 'open_well', 'Tisgaon Bazar Talav Well', '{"radius_m": 3.0, "total_depth_m": 20.0}', 2.0, 19.1420, 75.0505),
('SRC-AH01-L1', 'AH-01', 'lake', 'Tisgaon Historic Storage Lake', '{"satellite_water_area_sqm": 65000, "average_depth_m": 3.0}', 1.0, 19.1450, 75.0540)
ON CONFLICT (id) DO NOTHING;

-- 3. Source Readings (Clearly labelled: manual, meter, or simulated)
INSERT INTO public.source_readings (source_id, value, method, photo_url, recorded_at, quality) VALUES
('SRC-SN01-W1', 11.4, 'manual', NULL, timezone('utc'::text, now() - interval '6 hours'), 'measured'),
('SRC-SN01-T1', 2.1, 'meter', NULL, timezone('utc'::text, now() - interval '2 hours'), 'measured'),
('SRC-SN01-L1', 1.8, 'satellite', NULL, timezone('utc'::text, now() - interval '24 hours'), 'estimated'),
('SRC-SN02-W1', 14.8, 'simulated', NULL, timezone('utc'::text, now() - interval '12 hours'), 'simulated'),
('SRC-AH01-W1', 15.2, 'manual', NULL, timezone('utc'::text, now() - interval '8 hours'), 'measured'),
('SRC-AH01-L1', 2.1, 'satellite', NULL, timezone('utc'::text, now() - interval '18 hours'), 'estimated');

-- 4. 14-Day Forecasts (Ranges and Risks)
INSERT INTO public.forecasts (village_id, date, days_left_low, days_left_expected, days_left_high, risk, model_version) VALUES
('SN-01', CURRENT_DATE, 6, 9, 12, 'High', 'WDI-v2.1'),
('SN-02', CURRENT_DATE, 4, 7, 10, 'High', 'WDI-v2.1'),
('SN-03', CURRENT_DATE, 14, 18, 24, 'Medium', 'WDI-v2.1'),
('AH-01', CURRENT_DATE, 3, 5, 8, 'High', 'WDI-v2.1'),
('AH-02', CURRENT_DATE, 18, 22, 28, 'Low', 'WDI-v2.1');

-- 5. Pipelines & Flow Meters
INSERT INTO public.pipelines (id, from_source_id, to_destination, length_m, material) VALUES
('PL-SN01-01', 'SRC-SN01-W1', 'Pangari Cistern ESR-1', 1450.0, 'Ductile Iron (DI)'),
('PL-SN02-01', 'SRC-SN02-W1', 'Khopadi Main Ward Distribution Tank', 2200.0, 'High-Density Polyethylene (HDPE)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.meters (id, pipeline_id, role, serial, calibration_error) VALUES
('MTR-PL01-SRC', 'PL-SN01-01', 'source', 'SN-MTR-US-901', 0.02),
('MTR-PL01-RCV', 'PL-SN01-01', 'receiver', 'SN-MTR-EM-902', 0.025),
('MTR-PL02-SRC', 'PL-SN02-01', 'source', 'SN-MTR-US-801', 0.02),
('MTR-PL02-RCV', 'PL-SN02-01', 'receiver', 'SN-MTR-EM-802', 0.03)
ON CONFLICT (id) DO NOTHING;

-- 6. Meter Totalizer Readings (Simulated 24-Hour Windows)
INSERT INTO public.meter_readings (meter_id, cumulative_liters, recorded_at, method) VALUES
('MTR-PL01-SRC', 184500.0, timezone('utc'::text, now() - interval '24 hours'), 'simulated'),
('MTR-PL01-SRC', 244500.0, timezone('utc'::text, now()), 'simulated'),
('MTR-PL01-RCV', 142000.0, timezone('utc'::text, now() - interval '24 hours'), 'simulated'),
('MTR-PL01-RCV', 190600.0, timezone('utc'::text, now()), 'simulated');

-- 7. Pipeline Loss Analysis Result (e.g. 19% loss with tolerance band)
INSERT INTO public.loss_results (pipeline_id, window_start, window_end, supplied_L, received_L, loss_pct_low, loss_pct_high, status) VALUES
('PL-SN01-01', timezone('utc'::text, now() - interval '24 hours'), timezone('utc'::text, now()), 60000.0, 48600.0, 16.5, 21.5, 'Watch');
