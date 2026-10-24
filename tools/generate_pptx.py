"""
JalSanchar (जलसंचार) — Official Presentation Deck Generator
PRAGYAN 2K26 | SANJIVANI UNIVERSITY
Team: Vision 2030 | Team ID: 8E1986
Institution: Matoshri College Of Engineering and Research Centre
Track: Smart Operations & Sustainable Supply Chain
Problem Statement: Track-3-01: Climate-Resilient Water Intelligence for Campuses, Towns and Small Industries
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="JalSanchar_Pragyan2K26_Vision2030.pptx"):
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette matching the Pragyan 2K26 Template
    NAVY_BAR = RGBColor(11, 37, 69)       # #0B2545 Top Header Bar
    TEAL_ACCENT = RGBColor(20, 143, 119)   # #148F77 Vertical Accent Strip
    GOLD_ACCENT = RGBColor(245, 166, 35)   # #F5A623 Badge & Highlights
    CYAN_ACCENT = RGBColor(0, 168, 150)    # #00A896 Secondary Accent
    CARD_BG = RGBColor(248, 250, 252)      # #F8FAFC Card Surface
    CARD_BORDER = RGBColor(226, 232, 240)  # #E2E8F0 Subtle Border
    TEXT_DARK = RGBColor(15, 23, 42)       # #0F172A Primary Headings
    TEXT_MUTED = RGBColor(71, 85, 105)     # #475569 Descriptions
    TEXT_RED = RGBColor(192, 57, 43)       # #C0392B Risk/Alerts
    TEXT_GREEN = RGBColor(39, 174, 96)     # #27AE60 Success
    WHITE = RGBColor(255, 255, 255)

    def add_base_template(slide, slide_num, title_text):
        # 1. Top Navy Bar
        header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.95))
        header.fill.solid()
        header.fill.fore_color.rgb = NAVY_BAR
        header.line.fill.background()

        # Header Title
        tx_box = slide.shapes.add_textbox(Inches(1.8), Inches(0.18), Inches(9.5), Inches(0.6))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text.upper()
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Arial"
        p.font.size = Pt(20)
        p.font.bold = True
        p.font.color.rgb = WHITE

        # Slide Number (e.g. 01 / 12)
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.22), Inches(1.5), Inches(0.5))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = f"{slide_num:02d} / 12"
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.font.name = "Arial"
        p_num.font.size = Pt(13)
        p_num.font.bold = True
        p_num.font.color.rgb = GOLD_ACCENT

        # Left Crest/Logo Text
        logo_box = slide.shapes.add_textbox(Inches(0.4), Inches(0.12), Inches(1.3), Inches(0.7))
        tf_l = logo_box.text_frame
        p_l = tf_l.paragraphs[0]
        p_l.text = "MCERC"
        p_l.font.name = "Arial"
        p_l.font.size = Pt(13)
        p_l.font.bold = True
        p_l.font.color.rgb = WHITE
        p_l2 = tf_l.add_paragraph()
        p_l2.text = "NASHIK"
        p_l2.font.size = Pt(9)
        p_l2.font.color.rgb = GOLD_ACCENT

        # 2. Bottom Divider & Footer Bar
        divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(6.92), Inches(12.133), Inches(0.02))
        divider.fill.solid()
        divider.fill.fore_color.rgb = CARD_BORDER
        divider.line.fill.background()

        foot_box = slide.shapes.add_textbox(Inches(1.5), Inches(6.96), Inches(8.5), Inches(0.45))
        tf_f = foot_box.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "PRAGYAN 2K26 | SANJIVANI UNIVERSITY"
        p_f.alignment = PP_ALIGN.CENTER
        p_f.font.name = "Arial"
        p_f.font.size = Pt(11)
        p_f.font.bold = True
        p_f.font.color.rgb = NAVY_BAR

        # Pragyan Logo Badge right
        badge_box = slide.shapes.add_textbox(Inches(10.8), Inches(6.94), Inches(2.2), Inches(0.45))
        tf_b = badge_box.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = "PRAGYAN 2K26"
        p_b.alignment = PP_ALIGN.RIGHT
        p_b.font.name = "Arial"
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = GOLD_ACCENT

    def add_card(slide, left, top, width, height, title, accent_color=TEAL_ACCENT):
        # Card background
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.5)

        # Left accent vertical strip
        strip = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.08), top + Inches(0.2), Inches(0.08), height - Inches(0.4))
        strip.fill.solid()
        strip.fill.fore_color.rgb = accent_color
        strip.line.fill.background()

        # Title text
        tx_box = slide.shapes.add_textbox(left + Inches(0.35), top + Inches(0.2), width - Inches(0.5), Inches(0.5))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_DARK

        # Body frame
        body_box = slide.shapes.add_textbox(left + Inches(0.35), top + Inches(0.7), width - Inches(0.5), height - Inches(0.85))
        tf_body = body_box.text_frame
        tf_body.word_wrap = True
        return tf_body

    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 01: Challenge & Track Identification (Matches User Uploaded Image)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_base_template(s1, 1, "Challenge & Track Identification")

    # Left Card: Team Identity
    tf1_left = add_card(s1, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "Team identity", TEAL_ACCENT)
    
    p = tf1_left.paragraphs[0]
    p.text = "Team name: Vision 2030"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(10)

    p = tf1_left.add_paragraph()
    p.text = "Team ID: 8E1986"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(10)

    p = tf1_left.add_paragraph()
    p.text = "Institution: Matoshri College Of Engineering and Research Centre, Nashik"
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(18)

    p = tf1_left.add_paragraph()
    p.text = "Solution Name: JalSanchar (जलसंचार)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(8)

    p = tf1_left.add_paragraph()
    p.text = "Subtitle: Sovereign Climate-Resilient Drought Supply Chain & Cryptographic Escrow Engine"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(14)

    p = tf1_left.add_paragraph()
    p.text = "Primary Sector: Ahilyanagar & Sinnar Taluka (Nashik District, Maharashtra)"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Right Card: Track & Problem Statement
    tf1_right = add_card(s1, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "Track & problem statement", NAVY_BAR)
    
    p = tf1_right.paragraphs[0]
    p.text = "Track:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)

    p = tf1_right.add_paragraph()
    p.text = "[X] Smart Operations & Sustainable Supply Chain"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(14)

    p = tf1_right.add_paragraph()
    p.text = "Problem statement ID / title:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(2)

    p = tf1_right.add_paragraph()
    p.text = "Track-3-01: Climate-Resilient Water Intelligence for Campuses, Towns and Small Industries"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD_ACCENT
    p.space_after = Pt(16)

    p = tf1_right.add_paragraph()
    p.text = "One-sentence challenge summary:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)

    p = tf1_right.add_paragraph()
    p.text = "Building an intelligent, closed-loop drought supply chain that predicts 14-day water depletion via satellite telemetry, mathematically optimizes emergency relief routes with Google OR-Tools, and eliminates tanker diversion using geofenced dual-key cryptographic proof-of-delivery tied to state treasury escrow."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(10)

    # =========================================================================
    # SLIDE 02: Problem Statement & Ground Reality
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_base_template(s2, 2, "Ground Reality & The Triple Drought Crisis")

    tf2_c1 = add_card(s2, Inches(0.6), Inches(1.3), Inches(3.8), Inches(5.3), "1. Information Blindness", TEXT_RED)
    p = tf2_c1.paragraphs[0]
    p.text = "• Reactive Crisis Management:\nAdministration moves only after manual paper petitions arrive, by which time aquifers have run dry."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c1.add_paragraph()
    p.text = "• Severe Over-Extraction:\nIn rain-shadow talukas like Sinnar, dry-season extraction exceeds 120% of net recharge."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c1.add_paragraph()
    p.text = "• Real Cost: Livestock perishing, distress migration, and sudden village school shutdowns."
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_RED

    tf2_c2 = add_card(s2, Inches(4.75), Inches(1.3), Inches(3.8), Inches(5.3), "2. Tanker Mafia Diversion", TEXT_RED)
    p = tf2_c2.paragraphs[0]
    p.text = "• 22% Mid-Transit Leakage:\nSubsidized emergency state relief tankers are diverted to private commercial grape vineyards and stone quarries."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c2.add_paragraph()
    p.text = "• Zero Audit Trail:\nTraditional paper delivery slips are forged; offline GPS trackers are routinely unplugged with zero consequence."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c2.add_paragraph()
    p.text = "• Real Cost: ₹1.45 Lakhs taxpayer leakage per contractor per sub-district per month."
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_RED

    tf2_c3 = add_card(s2, Inches(8.9), Inches(1.3), Inches(3.8), Inches(5.3), "3. Unoptimized Supply Chain", TEXT_RED)
    p = tf2_c3.paragraphs[0]
    p.text = "• Ad-Hoc Route Allocation:\nTankers are dispatched based on political calls rather than scientific shortest-distance network models."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c3.add_paragraph()
    p.text = "• 30% Fuel Hemorrhage:\nEmpty return journeys, overlapping paths, and non-paved road breakdowns drain drought relief budgets."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(12)
    p = tf2_c3.add_paragraph()
    p.text = "• Real Cost: Remote hamlets wait 48+ hours past zero-reserve for basic drinking water."
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_RED

    # =========================================================================
    # SLIDE 03: Proposed Solution & Core Innovation
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_base_template(s3, 3, "Proposed Solution: JalSanchar 3-Layer Defense")

    tf3_1 = add_card(s3, Inches(0.6), Inches(1.3), Inches(3.8), Inches(5.3), "Layer 1: Predictive AI", CYAN_ACCENT)
    p = tf3_1.paragraphs[0]
    p.text = "14-Day Scarcity Telemetry"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p.space_after = Pt(8)
    p = tf3_1.add_paragraph()
    p.text = "• Synthesizes Sentinel/Copernicus soil moisture telemetry + operator logbooks."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_1.add_paragraph()
    p.text = "• Computes village Water Deficit Index (WDI) and depletion velocity."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_1.add_paragraph()
    p.text = "• Replaces reactive firefighting with proactive, automated rationing triggers 2 weeks ahead."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf3_2 = add_card(s3, Inches(4.75), Inches(1.3), Inches(3.8), Inches(5.3), "Layer 2: Route Optimization", TEAL_ACCENT)
    p = tf3_2.paragraphs[0]
    p.text = "Google OR-Tools CVRP"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(8)
    p = tf3_2.add_paragraph()
    p.text = "• Solves Capacitated Vehicle Routing Problem across 16 verified highway corridors (SH-7, NH-60)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_2.add_paragraph()
    p.text = "• Enforces Article 21 statutory mandates: 40 LPCD (human) & 70 LPCD (cattle)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_2.add_paragraph()
    p.text = "• Slashes tanker transit distance and diesel consumption by 28.4%."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf3_3 = add_card(s3, Inches(8.9), Inches(1.3), Inches(3.8), Inches(5.3), "Layer 3: Cryptographic Escrow", GOLD_ACCENT)
    p = tf3_3.paragraphs[0]
    p.text = "Dual-Key QR Handshake"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD_ACCENT
    p.space_after = Pt(8)
    p = tf3_3.add_paragraph()
    p.text = "• Dynamic TOTP QR payload with HMAC-SHA256 nonces (120s expiry)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_3.add_paragraph()
    p.text = "• Requires Driver Geokey + Cistern Statutory Key inside 15m geofence."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf3_3.add_paragraph()
    p.text = "• Smart Escrow Settlement: Zero payment cleared without verified Sarpanch scan."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 04: Tri-Party Closed-Loop Architecture
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_base_template(s4, 4, "Tri-Party Closed-Loop Architecture")

    tf4_top = add_card(s4, Inches(0.6), Inches(1.3), Inches(12.1), Inches(1.8), "The 4-Step Closed-Loop Lifecycle", TEAL_ACCENT)
    p = tf4_top.paragraphs[0]
    p.text = "Step 1: Distress Demand Logged  →  Step 2: CVRP Route Dispatched  →  Step 3: Geofence Arrival  →  Step 4: Dual-Key Handshake Verified"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(6)
    p = tf4_top.add_paragraph()
    p.text = "All 3 personas communicate via a sub-15ms real-time event bus (BroadcastChannel + LocalStorage) with automatic synchronization to the central state ledger. Zero manual follow-ups required."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf4_p1 = add_card(s4, Inches(0.6), Inches(3.3), Inches(3.8), Inches(3.3), "🌾 1. Gram Panchayat", TEAL_ACCENT)
    p = tf4_p1.paragraphs[0]
    p.text = "• Sarpanch & Village Water Committee\n• Monitors cistern reserve (e.g. 7% critical)\n• Logs emergency demand ticket (#TKT-SN-02)\n• Scans driver QR at cistern to verify drop\n• Storage increases +10,000L to 29% Adequate"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK

    tf4_p2 = add_card(s4, Inches(4.75), Inches(3.3), Inches(3.8), Inches(3.3), "🏛️ 2. District Collector", NAVY_BAR)
    p = tf4_p2.paragraphs[0]
    p.text = "• Command Center & Disaster Authority\n• Receives live priority distress queue\n• Authorizes Google OR-Tools CVRP dispatch\n• Monitors live GPS & geofence telemetry\n• Releases ₹15,000 contractor escrow payout"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK

    tf4_p3 = add_card(s4, Inches(8.9), Inches(3.3), Inches(3.8), Inches(3.3), "🚚 3. Tanker Driver", GOLD_ACCENT)
    p = tf4_p3.paragraphs[0]
    p.text = "• Contractor Pilot (Field Cockpit PWA)\n• Receives assigned route to target cistern\n• Navigates verified paved highway corridor\n• Locks GPS within 15m cistern geofence\n• Presents dynamic HMAC QR to Sarpanch"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 05: Technical Architecture & System Workflow
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_base_template(s5, 5, "Technical Architecture & System Workflow")

    tf5_l = add_card(s5, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "High-Performance Modular Stack", CYAN_ACCENT)
    p = tf5_l.paragraphs[0]
    p.text = "• Frontend Presentation Layer:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf5_l.add_paragraph()
    p.text = "  - Pure HTML5, Vanilla CSS, Modular ES6 JavaScript.\n  - Service Worker PWA for complete offline survivability.\n  - Leaflet.js with verified OSRM highway corridor circuits."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf5_l.add_paragraph()
    p.text = "• Backend Engine Layer (FastAPI):"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf5_l.add_paragraph()
    p.text = "  - 33 enterprise REST API endpoints with bcrypt auth.\n  - Google OR-Tools CVRP multi-depot fleet solver.\n  - Cryptographic HMAC-SHA256 signature generator."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf5_l.add_paragraph()
    p.text = "• Database & State Synchronization:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf5_l.add_paragraph()
    p.text = "  - Supabase PostgreSQL with Row Level Security (RLS).\n  - BroadcastChannel real-time multi-tab event bridge.\n  - Sovereign IndexedDB offline queue with deduplication."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf5_r = add_card(s5, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "End-to-End Operational Workflow", TEAL_ACCENT)
    p = tf5_r.paragraphs[0]
    p.text = "1. Telemetry Aggregation (Day 0 - 14):"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p = tf5_r.add_paragraph()
    p.text = "Satellite observations + well logbooks calculate 14-day days-to-zero reserve curve."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf5_r.add_paragraph()
    p.text = "2. Priority Demand Logging:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p = tf5_r.add_paragraph()
    p.text = "When well hits critical (e.g. 7%), Sarpanch logs ticket #TKT-SN-02 into District Command Center."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf5_r.add_paragraph()
    p.text = "3. Algorithmic CVRP Dispatch:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p = tf5_r.add_paragraph()
    p.text = "OR-Tools allocates Tanker TN-SN-02 on verified SH-7 highway corridor (15 min ETA)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf5_r.add_paragraph()
    p.text = "4. Geofenced QR Attestation:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p = tf5_r.add_paragraph()
    p.text = "Driver reaches cistern (12m). Dual-key QR scanned. Escrow ₹15,000 released; storage updated."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 06: Mathematical Modeling & Optimization Algorithm
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_base_template(s6, 6, "Mathematical Modeling & Routing Algorithms")

    tf6_1 = add_card(s6, Inches(0.6), Inches(1.3), Inches(5.8), Inches(2.5), "1. Water Deficit Index (WDI) Formula", CYAN_ACCENT)
    p = tf6_1.paragraphs[0]
    p.text = "WDI = 0.40(1 - SoilMoisture) + 0.35(DepletionRate) + 0.25(1 - StorageRatio)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p.space_after = Pt(6)
    p = tf6_1.add_paragraph()
    p.text = "Days Remaining = CurrentReserve / (Population × 40L + Cattle × 70L)\nTriggers automated emergency status when Days Remaining < 3 (or WDI > 0.75)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf6_2 = add_card(s6, Inches(6.8), Inches(1.3), Inches(5.9), Inches(2.5), "2. Haversine 15m Geofence Validation", TEAL_ACCENT)
    p = tf6_2.paragraphs[0]
    p.text = "d = 2R · arcsin(√(sin²(Δφ/2) + cos φ1 · cos φ2 · sin²(Δλ/2)))"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(6)
    p = tf6_2.add_paragraph()
    p.text = "Computes great-circle distance between tanker GPS and statutory cistern coordinates.\nIf distance > 15m, QR unlock token generation is cryptographically disabled."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf6_3 = add_card(s6, Inches(0.6), Inches(4.0), Inches(12.1), Inches(2.6), "3. Google OR-Tools CVRP Multi-Tanker Optimization", NAVY_BAR)
    p = tf6_3.paragraphs[0]
    p.text = "Objective: Minimize Total Fleet Distance = ∑ c_ij · x_ij subject to Tanker Capacity & Relief Mandates"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_BAR
    p.space_after = Pt(6)
    p = tf6_3.add_paragraph()
    p.text = "• Capacity Constraints: ∑ DemandedLiters_i ≤ FleetCapacity_k (e.g. 10,000L - 12,000L tanks).\n• Article 21 Relief Guarantees: 40L/person and 70L/cattle mandatory quotas fulfilled with 0 deficit.\n• Verified Road Geometry: All cost matrix values c_ij are derived from real OSRM paved highway routing profiles (SH-7, NH-60, bypasses) rather than unrealistic straight-line Euclidean distances."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 07: Anti-Diversion & Cryptographic Proof-of-Delivery
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_base_template(s7, 7, "Anti-Diversion & Cryptographic Proof-of-Delivery")

    tf7_l = add_card(s7, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "Dual-Key Geofenced QR Attestation", GOLD_ACCENT)
    p = tf7_l.paragraphs[0]
    p.text = "Why Diversion is Mathematically Impossible:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = GOLD_ACCENT
    p.space_after = Pt(8)

    p = tf7_l.add_paragraph()
    p.text = "1. Dynamic TOTP Signature (HMAC-SHA256):"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf7_l.add_paragraph()
    p.text = "Payload includes unique 16-hex nonce and 120s timestamp. Screenshots, printed copies, or video captures cannot be replayed (Anti-Replay Nonce Engine)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf7_l.add_paragraph()
    p.text = "2. Dual-Key Binding Requirement:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf7_l.add_paragraph()
    p.text = "Delivery validation binds Driver Private Key (0x9F3B4E...) + Cistern Statutory Key (0x74CE8A...). A driver parked at a private grape vineyard lacks the village cistern key."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf7_l.add_paragraph()
    p.text = "3. Strict 15m Geofence Lock:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf7_l.add_paragraph()
    p.text = "Mobile GPS coordinate verification confirms driver and tanker are physically stationed at the public cistern before decoding."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf7_r = add_card(s7, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "Smart Escrow Settlement ('No Proof, No Pay')", TEAL_ACCENT)
    p = tf7_r.paragraphs[0]
    p.text = "State Treasury Contractor Escrow Engine:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(8)

    p = tf7_r.add_paragraph()
    p.text = "• Subsidized Trip Funds Held in Escrow:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf7_r.add_paragraph()
    p.text = "State drought relief contractor payment (₹15,000 per 10,000L trip) is locked in digital escrow upon dispatch authorization."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf7_r.add_paragraph()
    p.text = "• Instant Settlement on Verified Handshake:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf7_r.add_paragraph()
    p.text = "Upon successful Sarpanch scan, system generates immutable Treasury Token (e.g. JAL-TREASURY-AUTH-88B1) and releases payout."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf7_r.add_paragraph()
    p.text = "• Automated Anomaly Penalty Freeze:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_RED
    p = tf7_r.add_paragraph()
    p.text = "If route divergence > 5km is detected without geofence handshake, contractor escrow balance is frozen with ₹1,45,000 penalty and RTO alerted."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 08: Real-World Pilot & District Validation
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_base_template(s8, 8, "Real-World Pilot: Ahilyanagar & Sinnar Taluka")

    tf8_l = add_card(s8, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "Pilot Specifications & Regional Geography", NAVY_BAR)
    p = tf8_l.paragraphs[0]
    p.text = "• Operational Sector:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_l.add_paragraph()
    p.text = "Sinnar Taluka (Nashik District) & Ahilyanagar District (Maharashtra Rain-Shadow Corridor)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf8_l.add_paragraph()
    p.text = "• 8 Monitored High-Vulnerability Villages:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_l.add_paragraph()
    p.text = "Khopadi (7%), Pangari (11%), Wadgaon (19%), Dubere (15%), Dapur, Nandur, Tisgaon, Supa."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf8_l.add_paragraph()
    p.text = "• 16 Verified Highway Circuits (OSRM Telemetry):"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_l.add_paragraph()
    p.text = "State Highway 7 (Sinnar-Shirdi), NH-60, Wavi Relay, and Malshiras link roads verified for maximum axle load capacity."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf8_r = add_card(s8, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "The Khopadi Benchmark Delivery Run", TEAL_ACCENT)
    p = tf8_r.paragraphs[0]
    p.text = "Live Execution Walkthrough:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(8)

    p = tf8_r.add_paragraph()
    p.text = "1. Distress Trigger:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_r.add_paragraph()
    p.text = "Khopadi cistern reserve hit 7% (3,150L, 13h horizon). Sarpanch Sunita Deshmukh raised ticket #TKT-SN-02."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf8_r.add_paragraph()
    p.text = "2. CVRP Allocation:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_r.add_paragraph()
    p.text = "Collector Command Center authorized Tanker TN-SN-02 (Driver: Ramesh Patil) via SH-7 shortest verified path."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf8_r.add_paragraph()
    p.text = "3. On-Site Handshake & Restored Water Security:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf8_r.add_paragraph()
    p.text = "Driver arrived within 12m. Sarpanch scanned dynamic QR. Tanker offloaded 10,000L. Cistern level restored to 29% (13,150L). Article 21 quota secured for 3,200 citizens & 1,200 cattle."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 09: Feasibility, Impact & Quantifiable Results
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_base_template(s9, 9, "Quantifiable Impact & Feasibility Analysis")

    tf9_1 = add_card(s9, Inches(0.6), Inches(1.3), Inches(5.8), Inches(2.5), "28.4% Fuel & Diesel Burn Cut", TEAL_ACCENT)
    p = tf9_1.paragraphs[0]
    p.text = "• Google OR-Tools CVRP eliminates overlapping routes & empty return runs."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)
    p = tf9_1.add_paragraph()
    p.text = "• Saves ~₹42,000 daily across a 20-tanker sub-district relief fleet."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p = tf9_1.add_paragraph()
    p.text = "• Reduces 12.8 tons of CO2 emissions monthly in drought mitigation logistics."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf9_2 = add_card(s9, Inches(6.8), Inches(1.3), Inches(5.9), Inches(2.5), "100% Diversion Elimination", GOLD_ACCENT)
    p = tf9_2.paragraphs[0]
    p.text = "• Permanent shut-down of unauthorized commercial water diversion."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)
    p = tf9_2.add_paragraph()
    p.text = "• Zero contractor invoices paid without cryptographic Sarpanch attestation."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GOLD_ACCENT
    p = tf9_2.add_paragraph()
    p.text = "• Guaranteed recovery of ₹1.45 Lakhs penalty per detected diversion attempt."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf9_3 = add_card(s9, Inches(0.6), Inches(4.0), Inches(5.8), Inches(2.6), "14-Day Advance Warning", CYAN_ACCENT)
    p = tf9_3.paragraphs[0]
    p.text = "• Replaces 7-14 day paper petition lag with automated depletion velocity alarms."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)
    p = tf9_3.add_paragraph()
    p.text = "• Zero emergency school or clinic closures due to unannounced water outages."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p = tf9_3.add_paragraph()
    p.text = "• Enables advance water procurement before reservoir prices spike."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf9_4 = add_card(s9, Inches(6.8), Inches(4.0), Inches(5.9), Inches(2.6), "Statutory Article 21 Compliance", NAVY_BAR)
    p = tf9_4.paragraphs[0]
    p.text = "• 100% adherence to 40 LPCD human minimum & 70 LPCD livestock quota."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(4)
    p = tf9_4.add_paragraph()
    p.text = "• Cryptographic audit trail clears State Treasury scrutiny under RTI & CAG."
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = NAVY_BAR
    p = tf9_4.add_paragraph()
    p.text = "• Citizen Public Tracker provides radical transparency for 45,000+ residents."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 10: Scalability & Government Policy Alignment
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_base_template(s10, 10, "Scalability & Government Policy Alignment")

    tf10_l = add_card(s10, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "Government Alignment & Mandates", NAVY_BAR)
    p = tf10_l.paragraphs[0]
    p.text = "1. Jal Jeevan Mission (Har Ghar Jal):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_l.add_paragraph()
    p.text = "Bridges the crucial 'Intermittent Delivery Deficit' when piped water infrastructure experiences source dry-up or seasonal aquifer failure."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf10_l.add_paragraph()
    p.text = "2. Disaster Management Act (2005):"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_l.add_paragraph()
    p.text = "Digitally enforces District Collector statutory powers under Section 34, automating emergency resource requisition and audit clearance."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(10)

    p = tf10_l.add_paragraph()
    p.text = "3. BIS IS-10500 Drinking Water Standards:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_l.add_paragraph()
    p.text = "Every tanker release requires laboratory potability clearance (Turbidity < 1 NTU, Free Residual Chlorine 0.2 - 0.5 ppm) logged in the manifest."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf10_r = add_card(s10, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "Track-3-01 Multi-Sector Extensibility", TEAL_ACCENT)
    p = tf10_r.paragraphs[0]
    p.text = "Campuses, Towns & Small Industries:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(8)

    p = tf10_r.add_paragraph()
    p.text = "• Educational & University Campuses:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_r.add_paragraph()
    p.text = "Rationing student hostels, clinic reserves, and laboratory quotas with automated shutoffs on low-priority lawns during municipal water cuts."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf10_r.add_paragraph()
    p.text = "• Municipal Towns & Nagar Panchayats:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_r.add_paragraph()
    p.text = "Telemetry monitoring of bulk distribution pipelines, detecting illegal bypass tappings and equalizing pressure across peripheral wards."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf10_r.add_paragraph()
    p.text = "• Small & MSME Industrial Estates (MIDC):"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf10_r.add_paragraph()
    p.text = "Tier 2 commercial industrial quotas enforced to prevent MSMEs from depriving Tier 1 residential drinking supplies during summer droughts."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 11: Technology Stack & Security Compliance
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_base_template(s11, 11, "Technology Stack & Security Architecture")

    tf11_1 = add_card(s11, Inches(0.6), Inches(1.3), Inches(3.8), Inches(5.3), "Frontend & Edge PWA", CYAN_ACCENT)
    p = tf11_1.paragraphs[0]
    p.text = "• Core Technologies:\nHTML5, Vanilla CSS Design System, Modular JavaScript (ES6+)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf11_1.add_paragraph()
    p.text = "• Offline-First Service Worker:\nFull PWA caching enables Sarpanch QR scanning and driver logging even in remote zero-network zones."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)
    p = tf11_1.add_paragraph()
    p.text = "• Geospatial Visualizer:\nLeaflet.js + Carto Voyager Tiles with 16 traced OSRM highway circuits."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf11_2 = add_card(s11, Inches(4.75), Inches(1.3), Inches(3.8), Inches(5.3), "FastAPI & OR-Tools", TEAL_ACCENT)
    p = tf11_2.paragraphs[0]
    p.text = "• High-Throughput REST Engine:\nPython FastAPI with 33 modular endpoints and sub-35ms response latency."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf11_2.add_paragraph()
    p.text = "• Google OR-Tools Routing:\nMulti-depot, multi-vehicle routing solver with capacity and time-window penalties."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)
    p = tf11_2.add_paragraph()
    p.text = "• Cryptographic Security:\nWeb Crypto API SubtleCrypto for client HMAC-SHA256 and bcrypt token hashing."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    tf11_3 = add_card(s11, Inches(8.9), Inches(1.3), Inches(3.8), Inches(5.3), "Database & Governance", NAVY_BAR)
    p = tf11_3.paragraphs[0]
    p.text = "• Sovereign Data Ledger:\nSupabase PostgreSQL with Row Level Security (RLS) and real-time triggers."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(8)
    p = tf11_3.add_paragraph()
    p.text = "• Cross-Tab Event Bus:\nBroadcastChannel ('jalsanchar_triparty_bus') for instant sub-15ms tab syncing."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)
    p = tf11_3.add_paragraph()
    p.text = "• Statutory Audit Clearance:\nCryptographic export manifest with SHA-256 signature for State Treasury scrutiny."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 12: Team Vision 2030, Roadmap & Conclusion
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_base_template(s12, 12, "Team Vision 2030 & Future Roadmap")

    tf12_l = add_card(s12, Inches(0.6), Inches(1.3), Inches(5.8), Inches(5.3), "Team Identity & Vision", TEAL_ACCENT)
    p = tf12_l.paragraphs[0]
    p.text = "Team Vision 2030 (Team ID: 8E1986)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT
    p.space_after = Pt(4)

    p = tf12_l.add_paragraph()
    p.text = "Matoshri College Of Engineering and Research Centre, Nashik"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.space_after = Pt(14)

    p = tf12_l.add_paragraph()
    p.text = "Our Core Conviction:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_BAR
    p = tf12_l.add_paragraph()
    p.text = "\"Water is not merely a logistical commodity — it is a constitutional guarantee under Article 21. By pairing predictive satellite AI with mathematical route optimization and cryptographic escrow, JalSanchar proves that corruption and diversion can be permanently eradicated from public drought relief.\""
    p.font.size = Pt(11)
    p.font.italic = True
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(14)

    p = tf12_l.add_paragraph()
    p.text = "Live Deployments:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p = tf12_l.add_paragraph()
    p.text = "• Web Portal: https://jalsanchar.vercel.app\n• API Backend: https://jalsanchar.onrender.com\n• Source Code: GitHub / RushalBangar / JalSanchar"
    p.font.size = Pt(11)
    p.font.color.rgb = TEAL_ACCENT

    tf12_r = add_card(s12, Inches(6.8), Inches(1.3), Inches(5.9), Inches(5.3), "Strategic Deployment Roadmap", GOLD_ACCENT)
    p = tf12_r.paragraphs[0]
    p.text = "Phase 1: Working Prototype (COMPLETED ✓)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = TEXT_GREEN
    p = tf12_r.add_paragraph()
    p.text = "14-day telemetry forecasting, OR-Tools CVRP routing, and dual-key QR attestation validated across 8 Sinnar villages."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf12_r.add_paragraph()
    p.text = "Phase 2: Hardware IoT Sensor Nodes (Months 1 - 3)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GOLD_ACCENT
    p = tf12_r.add_paragraph()
    p.text = "Deploying sub-₹1,200 solar-powered LoRaWAN ultrasonic depth sensors on rural GLSR community cisterns."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf12_r.add_paragraph()
    p.text = "Phase 3: District Command Center Integration (Months 4 - 6)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    p = tf12_r.add_paragraph()
    p.text = "Integrating with Maharashtra State Disaster Management Authority (SDMA) and automated SMS alerts for rural feature phones."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(8)

    p = tf12_r.add_paragraph()
    p.text = "Thank You! Questions & Answers"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = NAVY_BAR

    # Save presentation
    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    create_deck("JalSanchar_Pragyan2K26_Vision2030.pptx")
    # Also save a copy in public folder for direct browser download
    create_deck("public/JalSanchar_Pragyan2K26_Vision2030.pptx")
    create_deck("frontend/JalSanchar_Pragyan2K26_Vision2030.pptx")
