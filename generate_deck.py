import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    BG_DARK = RGBColor(7, 13, 24)        # #070d18
    CARD_BG = RGBColor(11, 20, 38)       # #0b1426
    CARD_BORDER = RGBColor(30, 45, 75)   # Subtle blue border
    CYAN = RGBColor(0, 229, 255)         # #00e5ff
    EMERALD = RGBColor(16, 185, 129)     # #10b981
    AMBER = RGBColor(245, 158, 11)       # #f59e0b
    CRIMSON = RGBColor(239, 68, 68)      # #ef4444
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(148, 163, 184) # #94a3b8
    TEXT_BODY = RGBColor(203, 213, 225)  # #cbd5e1

    blank_layout = prs.slide_layouts[6] # Blank slide layout

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background() # no line
        return bg

    def add_header(slide, badge_text, title_text, subtitle_text, badge_color=CYAN):
        # Badge
        badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = badge_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = badge_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = badge_color
        p.font.name = "Arial"

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(26)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.font.name = "Arial"

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(0.55))
        tf = sub_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subtitle_text
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Arial"

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=CYAN, metric_val=None, metric_sub=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = accent_color
        card.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.2), Inches(width - 0.4), Inches(height - 0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        first_p = True

        if metric_val:
            p_val = tf.paragraphs[0]
            first_p = False
            p_val.text = metric_val
            p_val.font.size = Pt(28)
            p_val.font.bold = True
            p_val.font.color.rgb = accent_color
            p_val.font.name = "Arial"

            if metric_sub:
                p_sub = tf.add_paragraph()
                p_sub.text = metric_sub
                p_sub.font.size = Pt(12)
                p_sub.font.bold = True
                p_sub.font.color.rgb = TEXT_WHITE
                p_sub.font.name = "Arial"
                p_sub.space_after = Pt(8)

        if title:
            if first_p:
                p_title = tf.paragraphs[0]
                first_p = False
            else:
                p_title = tf.add_paragraph()
            p_title.text = title
            p_title.font.size = Pt(15)
            p_title.font.bold = True
            p_title.font.color.rgb = accent_color if not metric_val else TEXT_WHITE
            p_title.font.name = "Arial"
            p_title.space_after = Pt(8)

        for b in body_bullets:
            if first_p:
                p = tf.paragraphs[0]
                first_p = False
            else:
                p = tf.add_paragraph()
            p.text = ("• " if len(body_bullets) > 1 else "") + b
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_BODY
            p.font.name = "Arial"
            p.space_after = Pt(4)

        return card

    def add_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # ==========================================
    # SLIDE 1: Title & Executive Pitch
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)
    add_header(s1, "💧 Sovereign Smart Drought Logistics & Escrow Platform", 
               "JalSanjeevani (जलसंजीवनी)", 
               "Predicting 14-day water scarcity via satellite telemetry, stopping tanker diversion with dual-key escrow, and optimizing emergency routes using Google OR-Tools.")

    add_card(s1, 0.8, 2.2, 3.64, 4.0, "🛰️ Predictive Intelligence", [
        "NASA SMAP & Copernicus satellite observation.",
        "Groundwater depletion modeling 14 days in advance.",
        "Eliminates reactive, paper-based crisis firefighting.",
        "Protects Article 21 constitutional water rights."
    ], CYAN)

    add_card(s1, 4.84, 2.2, 3.64, 4.0, "🚚 CVRP Fleet Optimization", [
        "Google OR-Tools combinatorial routing solver.",
        "Slashing fleet diesel burn by 28.4%.",
        "100% Statutory Quota guarantee (40L human, 70L cattle).",
        "Zero skipped remote or underprivileged hamlets."
    ], EMERALD)

    add_card(s1, 8.88, 2.2, 3.64, 4.0, "🛡️ Anti-Diversion Escrow", [
        "'No Proof = No Bill Payment' state treasury lock.",
        "Dual-Key optical handshake (Driver key + Panchayat key).",
        "Geofenced cistern proximity enforcement (<100m).",
        "Permanently eliminates the 22% tanker mafia black market."
    ], AMBER)

    foot1 = s1.shapes.add_textbox(Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.4))
    tf1 = foot1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "Target Pilot Deployment: Sinnar (Nashik) & Ahilyanagar, Maharashtra  •  Government of Maharashtra Initiative"
    p1.font.size = Pt(11)
    p1.font.color.rgb = TEXT_MUTED

    add_notes(s1, 
        "SPEAKER NOTE - SLIDE 1 (TITLE):\n"
        "Welcome everyone. Today we are presenting JalSanjeevani—a sovereign digital governance and smart logistics platform "
        "built specifically for drought-prone regions in Maharashtra, such as Ahilyanagar and Sinnar.\n\n"
        "Historically, drought relief operations suffer from two fatal failures: administration acts reactively only after aquifers dry up, "
        "and over 22% of subsidized water is diverted mid-transit by cartels known as the tanker mafia. JalSanjeevani solves this end-to-end "
        "with a 3-pillar framework connecting satellite observation, mathematical route optimization, and cryptographic proof-of-delivery "
        "tied directly to state treasury disbursements."
    )

    # ==========================================
    # SLIDE 2: The Triple Crisis (Problem Statement)
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "⚠️ The Problem and Why It Matters", 
               "The Triple Crisis in Maharashtra's Rain-Shadow", 
               "In talukas like Sinnar and Ahilyanagar, groundwater extraction exceeds 120% of net recharge during dry seasons.", 
               CRIMSON)

    add_card(s2, 0.8, 2.2, 3.64, 3.3, "1. Information Blindness", [
        "100% reactive administration.",
        "Relief orders move only after paper petitions arrive.",
        "Wells dry up 2 weeks before response.",
        "Livestock distress sales and acute human suffering."
    ], CRIMSON)

    add_card(s2, 4.84, 2.2, 3.64, 3.3, "2. Tanker Mafia Diversion", [
        "Over 22% of subsidized relief water siphoned off.",
        "Tankers diverted to private vineyards and quarries.",
        "Paper log sheets and odometer slips easily forged.",
        "Zero automated connection between delivery and bill clearance."
    ], CRIMSON)

    add_card(s2, 8.88, 2.2, 3.64, 3.3, "3. Uncoordinated Logistics", [
        "Manual, ad-hoc tanker dispatch.",
        "Redundant overlapping routes and empty return miles.",
        "+30% excess fleet diesel burn.",
        "Remote fringe hamlets systematically skipped."
    ], CRIMSON)

    add_card(s2, 0.8, 5.75, 11.72, 1.25, "Constitutional Significance (Article 21 - Right to Life & Water):", [
        "Water is a fundamental constitutional right. Illicit tanker diversion forces vulnerable rural families to buy back state-subsidized water from black-market cartels at extortionate prices up to ₹2,500 per trip. JalSanjeevani restores dignity and sovereign equity."
    ], AMBER)

    add_notes(s2, 
        "SPEAKER NOTE - SLIDE 2 (PROBLEM):\n"
        "Let's look at the harsh reality on the ground in drought zones like Sinnar. When summer hits, groundwater extraction crosses 120%.\n\n"
        "Communities face three compounding bottlenecks: First, information blindness—the district administration only knows a village is dry "
        "when paper petitions reach the Collector's desk days too late. Second, the Tanker Mafia—over 22% of subsidized municipal water is siphoned "
        "off mid-route to private construction sites and vineyards while villagers go thirsty. Third, chaos in logistics—tankers crisscross "
        "inefficiently, burning diesel while marginalized hamlets are skipped.\n\n"
        "Under Article 21, clean water is a fundamental right. When water is siphoned, citizens are forced to buy their own water back from cartels. "
        "We set out to engineer a bulletproof technological solution."
    )

    # ==========================================
    # SLIDE 3: The Proposed Solution (3 Pillars)
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "💡 The Architectural Solution", 
               "JalSanjeevani: The 3-Pillar Technological Framework", 
               "Connecting orbital remote sensing, combinatorial operations research, and cryptographic smart escrow.")

    add_card(s3, 0.8, 2.2, 3.64, 4.6, "🛰️ Pillar 1: Predictive Scarcity", [
        "Ingests NASA SMAP root-zone soil moisture.",
        "Copernicus Sentinel-2 MNDWI water indices.",
        "Generates 14-day advance depletion warning.",
        "Alerts District Collector before cistern exhaustion.",
        "Enables planned, preemptive relief dispatch."
    ], CYAN)

    add_card(s3, 4.84, 2.2, 3.64, 4.6, "🚚 Pillar 2: CVRP Fleet Solver", [
        "Google OR-Tools combinatorial optimization engine.",
        "Solves multi-depot, multi-tanker delivery routes.",
        "Enforces Article 21 statutory quotas (40L human, 70L cattle).",
        "Cuts fleet diesel burn by 28.4%.",
        "Turn-by-turn route manifests dispatched to driver PWA."
    ], EMERALD)

    add_card(s3, 8.88, 2.2, 3.64, 4.6, "🛡️ Pillar 3: Anti-Diversion Escrow", [
        "'No Proof = No Bill Payment' sovereign treasury rule.",
        "Dual-Key Optical Handshake (Driver key + Panchayat key).",
        "Geofenced GPS proximity lock within 100m of cistern.",
        "Dynamic HMAC-SHA256 tokens rotated every 60 seconds.",
        "Instant contractor escrow freeze upon route anomaly."
    ], AMBER)

    add_notes(s3, 
        "SPEAKER NOTE - SLIDE 3 (SOLUTION FRAMEWORK):\n"
        "JalSanjeevani answers this crisis through three deeply integrated pillars:\n\n"
        "Pillar 1 transforms governance from reactive firefighting to predictive early warning. Using NASA SMAP and Copernicus satellites, "
        "we model groundwater depletion curves 14 days ahead, alerting the District Collector before wells go dry.\n\n"
        "Pillar 2 replaces political or ad-hoc routing with Google OR-Tools. It mathematically calculates optimal relief circuits departing from "
        "major water headworks, guaranteeing mandatory per-capita quotas (40L for humans, 70L for cattle) while slashing 28.4% fuel waste.\n\n"
        "Pillar 3 eliminates the tanker mafia at the financial root: No Proof, No Bill Payment. Government contractor payouts are locked in smart escrow, "
        "cleared only when a dual-key cryptographic proof is verified inside a 100-meter cistern geofence."
    )

    # ==========================================
    # SLIDE 4: Unfair Advantage & Matrix
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "⭐ Unfair Advantage & Competitive Differentiation", 
               "Why Traditional GPS & Fleet Tech Fail in Drought Relief", 
               "JalSanjeevani ties physical verification directly to state treasury disbursements.")

    # Comparison Table
    table_shape = s4.shapes.add_table(6, 4, Inches(0.8), Inches(2.2), Inches(11.72), Inches(4.7))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(2.32)
    tbl.columns[1].width = Inches(3.1)
    tbl.columns[2].width = Inches(3.1)
    tbl.columns[3].width = Inches(3.2)

    headers = ["Dimension", "Legacy Systems (Paper/GPS)", "Commercial Fleet Tech", "JalSanjeevani (जलसंजीवनी)"]
    for col_idx, h in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(14, 36, 63)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = CYAN if col_idx == 3 else TEXT_WHITE
        p.font.name = "Arial"

    row_data = [
        ("Payment Enforcement", "Post-facto paper bills; paid regardless of leakage.", "Vehicle tracking only; zero link to state treasury.", "Smart Escrow: Zero bill payout without verified cryptographic proof."),
        ("Delivery Proof", "Forged paper logbooks & odometer slips.", "Driver single-tap button or digital signature.", "Dual-Key Optical Handshake (Driver key + Panchayat hardware key)."),
        ("Replay Attack Defense", "None; paper slips duplicated.", "Static QR codes vulnerable to WhatsApp sharing.", "Dynamic HMAC-SHA256 (60s rotation, nonce deduplication, 10m validity)."),
        ("Geofence Verification", "Tanker GPS only (easily spoofed or unplugged).", "Single-point circular radius.", "Dual-Factor Geofencing: Tanker GPS + Sarpanch Device GPS <= 100m."),
        ("Rural Offline Resilience", "Fails completely without active 4G data.", "Cloud-dependent; crashes in hill valleys.", "Sovereign IndexedDB queue + Service Worker Background Sync.")
    ]

    for row_idx, data in enumerate(row_data, start=1):
        for col_idx, text in enumerate(data):
            cell = tbl.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = CARD_BG
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.size = Pt(10.5)
            p.font.name = "Arial"
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = TEXT_WHITE
            elif col_idx == 3:
                p.font.bold = True
                p.font.color.rgb = CYAN
            else:
                p.font.color.rgb = TEXT_MUTED

    add_notes(s4, 
        "SPEAKER NOTE - SLIDE 4 (DIFFERENTIATION):\n"
        "A common question we get: 'Why not just put commercial GPS trackers on tankers?'\n\n"
        "Here is why commercial solutions fail in government drought enforcement: In the field, drivers simply unplug GPS fuses, "
        "claim bad network, or screenshot static QR codes and forward them on WhatsApp to colluding contractors. Crucially, commercial fleet tools "
        "have zero connection to government finance departments.\n\n"
        "JalSanjeevani is fundamentally different: We introduce State Treasury Escrow. No proof, no bill payment. We use dynamic HMAC-SHA256 tokens "
        "that rotate every 60 seconds, dual-factor geofencing requiring both the tanker's GPS and the village Sarpanch's device GPS to be within 100 meters, "
        "and an offline IndexedDB sync that works even in connectivity dead zones."
    )

    # ==========================================
    # SLIDE 5: Cryptographic Dual-Key Handshake
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "🔐 Security & Financial Resilience", 
               "The Dual-Key Optical Handshake Protocol", 
               "Mathematically proving water was physically discharged into the community cistern before funds disburse.")

    add_card(s5, 0.8, 2.2, 5.66, 4.7, "Driver Cockpit: Dynamic Rolling QR", [
        "Time-Bounded Nonce: Max 10-minute validity window.",
        "Auto-Rotation: Fresh token generated every 60 seconds.",
        "Cryptographic Payload:",
        "  { tanker_id, driver_id, timestamp, nonce, coords }",
        "HMAC-SHA256 signature using driver hardware secret.",
        "Anti-Forwarding: Tokens shared via WhatsApp expire instantly.",
        "Zero-Connectivity: Signs offline using pre-synced session secrets."
    ], EMERALD)

    add_card(s5, 6.86, 2.2, 5.66, 4.7, "Panchayat Verifier: Optical Attestation", [
        "1. WebRTC Optical Camera Scan:",
        "   Sarpanch scans driver's dynamic QR code on arrival.",
        "2. Dual-Factor Geofencing Lock:",
        "   Calculates Haversine distance from cistern (strictly <=100m).",
        "3. Cryptographic Nonce Deduplication:",
        "   Prevents replay attacks; each token redeemed exactly once.",
        "4. Dual-Key Signature Generated:",
        "   Driver Key + Panchayat Private Key attest delivery.",
        "5. Automated Escrow Clearance:",
        "   Valid proof triggers treasury payment. Route anomalies trigger instant escrow freeze."
    ], CYAN)

    add_notes(s5, 
        "SPEAKER NOTE - SLIDE 5 (CRYPTOGRAPHY & ESCROW):\n"
        "Let's look at how the Dual-Key Handshake works step by step in the field.\n\n"
        "When a municipal tanker arrives at a village cistern, the driver opens the PWA Cockpit. The app generates a dynamic rolling QR code "
        "containing the tanker ID, GPS coordinates, timestamp, and a single-use cryptographic nonce signed with HMAC-SHA256. This token rotates every 60 seconds "
        "and is valid for a maximum of 10 minutes.\n\n"
        "The Gram Panchayat verifier—such as the Sarpanch or water committee head—scans this QR code using their browser camera. The verifier PWA checks "
        "three things: first, that the verifier's own GPS is within 100 meters of the registered cistern; second, that the nonce hasn't been used before; "
        "and third, that the signature is valid. Once attested, the state escrow unlocks payment to the contractor. If a tanker diverts off-route, "
        "escrow freezes automatically."
    )

    # ==========================================
    # SLIDE 6: Fleet Optimization (Google OR-Tools)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "📈 Operations Research & Routing", 
               "Google OR-Tools Multi-Objective Fleet Solver", 
               "Transforming ad-hoc, politically influenced dispatch into mathematically optimal relief circuits.")

    add_card(s6, 0.8, 2.2, 3.64, 2.5, "Fuel Conservation", [
        "Eliminates crisscrossing routes.",
        "Minimizes empty return trips from central water headworks."
    ], EMERALD, "-28.4%", "Diesel Burn Reduction")

    add_card(s6, 4.84, 2.2, 3.64, 2.5, "Statutory Quota Guarantee", [
        "40 Liters/capita/day for humans.",
        "70 Liters/head/day for cattle.",
        "Enforces Article 21 fundamental rights."
    ], CYAN, "100%", "Article 21 Fulfillment")

    add_card(s6, 8.88, 2.2, 3.64, 2.5, "Social Equity", [
        "Prevents bypassed fringe hamlets.",
        "Impartial, algorithmic multi-stop scheduling."
    ], AMBER, "0", "Skipped Vulnerable Hamlets")

    add_card(s6, 0.8, 4.95, 11.72, 1.95, "Capacitated Vehicle Routing Problem (CVRP) Formulation:", [
        "• Inputs: Departs multi-capacity fleet (5,000L / 10,000L / 12,000L) from Kapurbawdi & Sinnar municipal headworks.",
        "• Constraints: Dynamic village cistern depletion curves, road gradient factors, vehicle weight limits, and driver shift ceilings.",
        "• Output: Automated turn-by-turn route manifests dispatched straight to drivers' mobile cockpits, cutting thousands of wasted kilometers."
    ], CYAN)

    add_notes(s6, 
        "SPEAKER NOTE - SLIDE 6 (LOGISTICS OPTIMIZATION):\n"
        "Turning to Pillar 2: Logistics optimization.\n\n"
        "In typical relief operations, tanker dispatch is driven by paper requests and local political pull, resulting in tankers crisscrossing each other "
        "and burning taxpayer money on empty kilometers while remote tribal hamlets get completely ignored.\n\n"
        "We formulated this as a Capacitated Vehicle Routing Problem (CVRP) solved via Google OR-Tools. The solver departs tankers from municipal headworks, "
        "accounts for vehicle capacities—5,000 to 12,000 liters—road conditions, and cistern urgency. The results speak for themselves: a 28.4% reduction in fleet diesel costs, "
        "100% fulfillment of statutory water quotas—40 liters per human and 70 liters per cattle head—and zero skipped hamlets."
    )

    # ==========================================
    # SLIDE 7: Operational Consoles & Stakeholders
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "🖥️ Field Touchpoints & Interfaces", 
               "Four Tailored Touchpoints for Disaster Governance", 
               "Engineered specifically for the realities of rural disaster administration with zero training barrier.")

    add_card(s7, 0.8, 2.2, 2.68, 4.7, "🏛️ Collector Command", [
        "Target: District Collector & Disaster Authority",
        "• 3D GIS satellite map.",
        "• Real-time tanker anomaly radar.",
        "• Instant contractor escrow freeze.",
        "• Automated Relief Order PDF dispatch."
    ], CYAN)

    add_card(s7, 3.81, 2.2, 2.68, 4.7, "🚛 Tanker Pilot Cockpit", [
        "Target: Municipal Tanker Drivers",
        "• Offline-first mobile PWA.",
        "• GPS arrival verification lock.",
        "• Dynamic encrypted QR generator.",
        "• Emergency SOS panic beacon.",
        "• Turn-by-turn route manifests."
    ], EMERALD)

    add_card(s7, 6.82, 2.2, 2.68, 4.7, "🌾 Panchayat Verifier", [
        "Target: Village Sarpanch & Water Committee",
        "• WebRTC browser optical camera scanner.",
        "• Cistern level gauge visualizer.",
        "• Offline delivery attestation queue.",
        "• Zero app store install needed."
    ], AMBER)

    add_card(s7, 9.83, 2.2, 2.68, 4.7, "🌐 Public Ledger", [
        "Target: Citizens & Media",
        "• Open sovereign audit trail.",
        "• Trilingual UI: English, मराठी (Marathi), हिंदी (Hindi).",
        "• Transparent delivery logs & tanker accountability."
    ], CYAN)

    add_notes(s7, 
        "SPEAKER NOTE - SLIDE 7 (OPERATIONAL CONSOLES):\n"
        "Technology only works if people in the field can actually use it without friction. JalSanjeevani provides four tailored interfaces:\n\n"
        "First, the Tactical Command Center for the District Collector and Disaster Management Authority. It gives a bird's-eye GIS map, anomaly detection radar, "
        "and one-click escrow controls.\n\n"
        "Second, the Tanker Pilot Cockpit—an offline-first PWA for drivers with turn-by-turn routes, GPS arrival confirmation, and dynamic QR generation.\n\n"
        "Third, the Panchayat Verifier for village sarpanches and water committees. It operates directly in any mobile browser using WebRTC camera scanning—zero app store download.\n\n"
        "And fourth, the Public Transparency Ledger—a trilingual open audit portal in Marathi, Hindi, and English so any citizen can verify when their village water was delivered."
    )

    # ==========================================
    # SLIDE 8: The Engineering Tech Stack
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "⚙️ Engineering & Architecture", 
               "Robust, Sovereign, Zero-Capex Technology Stack", 
               "Built with modern open standards for speed, high resilience, and sub-second execution.")

    add_card(s8, 0.8, 2.2, 2.68, 4.7, "Client / Frontend", [
        "• HTML5 & Modern Vanilla JS (Zero runtime bloat)",
        "• Precompiled Tailwind CSS (v3 pipeline)",
        "• Progressive Web App (PWA with sw.js)",
        "• IndexedDB (JalSanjeevaniDB) offline queue",
        "• WebRTC camera stream for QR decoding",
        "• Leaflet.js GIS mapping layers"
    ], CYAN)

    add_card(s8, 3.81, 2.2, 2.68, 4.7, "API & Backend", [
        "• Python 3.10+ & FastAPI async engine",
        "• Uvicorn ASGI production server",
        "• Pydantic data schemas & strict validation",
        "• Bcrypt password hashing (salt rounds = 12)",
        "• HMAC-SHA256 signature generation",
        "• Bearer JWT session auth"
    ], EMERALD)

    add_card(s8, 6.82, 2.2, 2.68, 4.7, "AI & Solvers", [
        "• Google OR-Tools CVRP routing solver",
        "• Google Earth Engine API (Copernicus Sentinel MNDWI)",
        "• NASA SMAP root-zone soil moisture",
        "• 14-day depletion forecasting algorithm",
        "• Haversine distance verification engine"
    ], AMBER)

    add_card(s8, 9.83, 2.2, 2.68, 4.7, "Data & Cloud", [
        "• Supabase (PostgreSQL with Row Level Security - RLS)",
        "• Render cloud hosting (FastAPI backend)",
        "• Vercel Edge CDN (Frontend PWA)",
        "• GitHub Actions keep-alive automated cron",
        "• Strict Content-Security-Policy (CSP)"
    ], CYAN)

    add_notes(s8, 
        "SPEAKER NOTE - SLIDE 8 (TECH STACK):\n"
        "Here is our engineering architecture:\n\n"
        "On the frontend, we deliberately chose modern Vanilla JavaScript, precompiled Tailwind CSS, and Service Workers over heavy JavaScript frameworks. "
        "This ensures lightning-fast load times even on low-cost 2G/3G Android phones and guarantees complete offline functionality via IndexedDB.\n\n"
        "On the backend, Python with FastAPI provides asynchronous performance with automatic schema validation via Pydantic.\n\n"
        "Our intelligence layer leverages Google Earth Engine to process NASA SMAP and Copernicus Sentinel satellite feeds, paired with Google OR-Tools "
        "for combinatorial logistics optimization.\n\n"
        "For the database and security, Supabase PostgreSQL with strict Row Level Security isolates government data, while Bcrypt and HMAC-SHA256 guarantee cryptographic integrity."
    )

    # ==========================================
    # SLIDE 9: Feasibility, Economics & Impact
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "📊 Feasibility & Potential Impact", 
               "Zero-Capex Economics & Quantitative Transformation", 
               "Rapidly deployable across Maharashtra without new hardware or expensive proprietary equipment.")

    add_card(s9, 0.8, 2.2, 3.64, 2.3, "Diversion Elimination", [
        "Zero bills clear without cryptographic proof.",
        "Unverified diversion becomes financially impossible."
    ], EMERALD, "100%", "Leakage Prevented")

    add_card(s9, 4.84, 2.2, 3.64, 2.3, "Early Warning Buffer", [
        "Satellite depletion modeling provides 2-week warning.",
        "Ends panic-driven emergency water shortages."
    ], CYAN, "14 Days", "Advance Warning")

    add_card(s9, 8.88, 2.2, 3.64, 2.3, "Taxpayer Savings", [
        "Eliminated black-market leakage & 28.4% fuel savings.",
        "Calculated across standard 100-tanker summer fleet."
    ], AMBER, "₹2.11 Cr", "Saved Every Season")

    add_card(s9, 0.8, 4.75, 5.66, 2.25, "1. Zero-Capex Technical Feasibility:", [
        "• Zero New Hardware: Runs on existing commodity Android smartphones.",
        "• Zero App Store Barrier: Instant browser PWA access via WebRTC.",
        "• Rural Offline Resilience: Queues delivery receipts offline in IndexedDB.",
        "• Open Standards: Built with battle-tested open-source libraries."
    ], CYAN)

    add_card(s9, 6.86, 4.75, 5.66, 2.25, "2. Institutional & Legal Feasibility:", [
        "• Self-Financing: Pays for itself multiple times over by stopping leakage.",
        "• Administrative Alignment: Maps directly to Collector -> Tehsildar -> Gram Panchayat.",
        "• Section 65B Admissibility: Cryptographic logs fully admissible in Indian courts.",
        "• Immediate Turnaround: Replaces 60-day paper invoice processing with real-time audit."
    ], AMBER)

    add_notes(s9, 
        "SPEAKER NOTE - SLIDE 9 (FEASIBILITY & IMPACT):\n"
        "Let's look at the financial and administrative viability of JalSanjeevani.\n\n"
        "First, it requires Zero Capex. We do not require installing expensive IoT flow meters or proprietary vehicle gadgets that get vandalized or disconnected. "
        "The system runs entirely on standard smartphones already owned by drivers and sarpanches, functioning smoothly through the browser.\n\n"
        "Second, the economic impact is immediate. In a single 90-day summer season across a 100-tanker fleet, stopping 22% diversion and cutting 28.4% fuel burn "
        "saves the state exchequer over ₹2.11 Crores.\n\n"
        "Third, our audit logs conform to Section 65B of the Indian Evidence Act, giving district collectors undisputed legal evidence against rogue contractors."
    )

    # ==========================================
    # SLIDE 10: Scaling Roadmap & Sovereign Vision
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "🚀 Scaling & National Vision", 
               "The Sovereign Roadmap: From Sinnar to National Scale", 
               "A replicable blueprint for climate-resilient water resource governance across India.")

    add_card(s10, 0.8, 2.2, 3.64, 3.9, "Phase 1: Sinnar Pilot (Q1 2026)", [
        "• Field pilot with Sinnar Disaster Authority.",
        "• 28 Gram Panchayats & 15 municipal tankers.",
        "• Live calibration of NASA SMAP soil curves.",
        "• Driver and Sarpanch field usability verification."
    ], CYAN)

    add_card(s10, 4.84, 2.2, 3.64, 3.9, "Phase 2: District Rollout (Q3 2026)", [
        "• Scaling across Ahilyanagar & Nashik districts.",
        "• 350+ relief tankers and 450+ village cisterns.",
        "• Direct integration into Maharashtra State Treasury e-Billing.",
        "• Citizen mobile notification broadcast."
    ], EMERALD)

    add_card(s10, 8.88, 2.2, 3.64, 3.9, "Phase 3: National Scale (2027)", [
        "• National Disaster Management Authority (NDMA) integration.",
        "• Interoperability with Jal Jeevan Mission API.",
        "• Deployment across 8 drought-prone Indian states.",
        "• Open Sovereign Digital Public Infrastructure (DPI)."
    ], AMBER)

    add_card(s10, 0.8, 6.25, 11.72, 0.85, "", [
        "\"Guaranteeing that every liter of water allocated by the state reaches the community who needs it—with zero diversion, zero leakage, and absolute mathematical accountability.\""
    ], CYAN)

    add_notes(s10, 
        "SPEAKER NOTE - SLIDE 10 (ROADMAP & CONCLUSION):\n"
        "To conclude, our roadmap begins with a focused pilot in Sinnar taluka with 28 Gram Panchayats and 15 tankers. "
        "By Q3 2026, we expand district-wide across Ahilyanagar and Nashik, integrating directly into Maharashtra's state treasury disbursement systems.\n\n"
        "Our ultimate vision is to establish JalSanjeevani as Digital Public Infrastructure under NDMA and the Jal Jeevan Mission, providing a template "
        "for water governance across drought-prone regions in India.\n\n"
        "JalSanjeevani ensures that every liter allocated by the state reaches the citizen who needs it—with zero leakage, zero diversion, and total transparency. "
        "Thank you! We are now open for questions."
    )

    output_path = os.path.join(os.path.dirname(__file__), "JalSanjeevani_Master_Deck.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
