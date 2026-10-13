/**
 * ============================================================================
 * JALSANJEEVANI (जलसंजीवनी) - 1-CLICK GOOGLE SLIDES AUTO-GENERATOR
 * ============================================================================
 * HOW TO USE IN GOOGLE SLIDES:
 * 1. Open a new Google Slides presentation (https://slides.new).
 * 2. Click "Extensions" in the top menu -> "Apps Script".
 * 3. Delete any default code in Code.gs and PASTE THIS ENTIRE SCRIPT.
 * 4. Click the "Save" (disk icon) button.
 * 5. Select "createJalSanjeevaniDeck" from the function dropdown and click "Run".
 * 6. Grant standard Google Drive/Slides permission when prompted.
 * 7. Switch back to your Google Slides tab — your entire 10-slide deck is created!
 * ============================================================================
 */

function createJalSanjeevaniDeck() {
  var presentation = SlidesApp.getActivePresentation();
  
  // Theme Colors
  var BG_COLOR = '#070D18';        // Dark Navy
  var CARD_BG = '#0B1426';         // Dark container
  var CYAN = '#00E5FF';            // Tech Cyan
  var EMERALD = '#10B981';         // Success Green
  var AMBER = '#F59E0B';           // Warning Amber
  var CRIMSON = '#EF4444';         // Alert Red
  var WHITE = '#FFFFFF';
  var TEXT_MUTED = '#94A3B8';
  var TEXT_BODY = '#CBD5E1';

  var slidesData = [
    {
      badge: "💧 Sovereign Smart Drought Logistics & Escrow Platform",
      badgeColor: CYAN,
      title: "JalSanjeevani (जलसंजीवनी)",
      subtitle: "Predicting 14-day water scarcity via satellite telemetry, stopping tanker diversion with dual-key escrow, and optimizing relief routes using Google OR-Tools.",
      layout: "3_cards",
      cards: [
        {
          title: "🛰️ Predictive Intelligence",
          bullets: ["NASA SMAP & Copernicus satellite feeds.", "Aquifer depletion projected 14 days in advance.", "Ends reactive paper-based crisis firefighting.", "Protects Article 21 constitutional water rights."],
          color: CYAN
        },
        {
          title: "🚚 CVRP Fleet Optimization",
          bullets: ["Google OR-Tools combinatorial routing solver.", "Slashing fleet diesel burn by 28.4%.", "100% Statutory Quota guarantee (40L human, 70L cattle).", "Zero skipped remote or underprivileged hamlets."],
          color: EMERALD
        },
        {
          title: "🛡️ Anti-Diversion Escrow",
          bullets: ["'No Proof = No Bill Payment' treasury lock.", "Dual-Key optical handshake (Driver key + Panchayat key).", "Geofenced cistern proximity enforcement (<100m).", "Permanently eliminates the 22% tanker mafia black market."],
          color: AMBER
        }
      ],
      footer: "Target Pilot Deployment: Sinnar (Nashik) & Ahilyanagar, Maharashtra  •  Government of Maharashtra Initiative",
      notes: "Welcome everyone. Today we are presenting JalSanjeevani—a sovereign digital governance and smart logistics platform built specifically for drought-prone regions in Maharashtra, such as Ahilyanagar and Sinnar.\n\nHistorically, relief operations suffer from two fatal failures: administration acts reactively only after aquifers dry up, and over 22% of subsidized water is diverted mid-transit by the tanker mafia. JalSanjeevani solves this end-to-end with a 3-pillar framework connecting satellite observation, mathematical route optimization, and cryptographic proof-of-delivery tied directly to state treasury disbursements."
    },
    {
      badge: "⚠️ The Problem and Why It Matters",
      badgeColor: CRIMSON,
      title: "The Triple Crisis in Maharashtra's Rain-Shadow",
      subtitle: "In talukas like Sinnar and Ahilyanagar, groundwater extraction exceeds 120% of net recharge during dry seasons.",
      layout: "3_cards_banner",
      cards: [
        {
          title: "1. Information Blindness",
          bullets: ["100% reactive administration.", "Relief orders move only after paper petitions arrive.", "Wells dry up 2 weeks before response.", "Acute human & livestock suffering."],
          color: CRIMSON
        },
        {
          title: "2. Tanker Mafia Diversion",
          bullets: ["Over 22% subsidized relief water siphoned off.", "Diverted to private vineyards and quarries.", "Paper log sheets and odometers easily forged.", "Zero link between delivery and bill clearance."],
          color: CRIMSON
        },
        {
          title: "3. Uncoordinated Logistics",
          bullets: ["Manual, ad-hoc tanker dispatch.", "Redundant overlapping paths & empty return miles.", "+30% excess fleet diesel burn.", "Remote fringe hamlets systematically skipped."],
          color: CRIMSON
        }
      ],
      banner: "Constitutional Significance (Article 21 - Right to Life & Water): Water is a fundamental constitutional right. Illicit tanker diversion forces vulnerable rural families to buy back state-subsidized water from black-market cartels at extortionate prices up to ₹2,500 per trip.",
      notes: "When summer hits Sinnar and Ahilyanagar, groundwater extraction crosses 120%.\n\nCommunities face three compounding bottlenecks: First, information blindness—the administration only learns a village is dry when paper petitions arrive days too late. Second, the Tanker Mafia—over 22% of subsidized water is siphoned to private construction and vineyards. Third, chaos in logistics—tankers crisscross inefficiently, burning diesel while marginalized hamlets are skipped.\n\nUnder Article 21, clean water is a fundamental right. When water is siphoned, citizens are forced to buy back their own water from cartels. We set out to engineer an unbreakable technological defense."
    },
    {
      badge: "💡 The Architectural Solution",
      badgeColor: EMERALD,
      title: "JalSanjeevani: The 3-Pillar Technological Framework",
      subtitle: "Connecting orbital remote sensing, combinatorial operations research, and cryptographic smart escrow.",
      layout: "3_cards",
      cards: [
        {
          title: "🛰️ Pillar 1: Predictive Scarcity",
          bullets: ["Ingests NASA SMAP root-zone soil moisture.", "Copernicus Sentinel-2 MNDWI water indices.", "Generates 14-day advance depletion warning.", "Alerts District Collector before cistern exhaustion.", "Enables planned, preemptive relief dispatch."],
          color: CYAN
        },
        {
          title: "🚚 Pillar 2: CVRP Fleet Solver",
          bullets: ["Google OR-Tools combinatorial optimization engine.", "Solves multi-depot, multi-tanker delivery routes.", "Enforces Article 21 statutory quotas (40L human, 70L cattle).", "Cuts fleet diesel burn by 28.4%.", "Turn-by-turn route manifests sent to driver PWA."],
          color: EMERALD
        },
        {
          title: "🛡️ Pillar 3: Anti-Diversion Escrow",
          bullets: ["'No Proof = No Bill Payment' sovereign treasury rule.", "Dual-Key Optical Handshake (Driver key + Panchayat key).", "Geofenced GPS proximity lock within 100m of cistern.", "Dynamic HMAC-SHA256 tokens rotated every 60 seconds.", "Instant contractor escrow freeze upon route anomaly."],
          color: AMBER
        }
      ],
      notes: "JalSanjeevani answers this crisis through three deeply integrated pillars:\n\nPillar 1 transforms governance from reactive firefighting to predictive early warning. Using NASA SMAP and Copernicus satellites, we model groundwater depletion curves 14 days ahead, alerting the District Collector before wells go dry.\n\nPillar 2 replaces political or ad-hoc routing with Google OR-Tools. It mathematically calculates optimal relief circuits departing from major water headworks, guaranteeing mandatory per-capita quotas (40L for humans, 70L for cattle) while slashing 28.4% fuel waste.\n\nPillar 3 eliminates the tanker mafia at the financial root: No Proof, No Bill Payment. Government contractor payouts are locked in smart escrow, cleared only when a dual-key cryptographic proof is verified inside a 100-meter cistern geofence."
    },
    {
      badge: "⭐ Unfair Advantage & Competitive Differentiation",
      badgeColor: CYAN,
      title: "Why Traditional GPS & Fleet Tech Fail in Drought Relief",
      subtitle: "JalSanjeevani ties physical verification directly to state treasury disbursements.",
      layout: "table_slide",
      notes: "A common question we get: 'Why not just put commercial GPS trackers on tankers?'\n\nIn the field, drivers simply unplug GPS fuses, claim bad network, or screenshot static QR codes and forward them on WhatsApp to colluding contractors. Crucially, commercial fleet tools have zero connection to government finance departments.\n\nJalSanjeevani is fundamentally different: We introduce State Treasury Escrow. No proof, no bill payment. We use dynamic HMAC-SHA256 tokens that rotate every 60 seconds, dual-factor geofencing requiring both the tanker's GPS and the village Sarpanch's device GPS to be within 100 meters, and an offline IndexedDB sync that works even in connectivity dead zones."
    },
    {
      badge: "🔐 Security & Financial Resilience",
      badgeColor: CYAN,
      title: "The Dual-Key Optical Handshake Protocol",
      subtitle: "Mathematically proving water was physically discharged into the community cistern before funds disburse.",
      layout: "2_cards",
      cards: [
        {
          title: "Driver Cockpit: Dynamic Rolling QR",
          bullets: [
            "Time-Bounded Nonce: Max 10-minute validity window.",
            "Auto-Rotation: Fresh token generated every 60 seconds.",
            "Cryptographic Payload: { tanker_id, driver_id, timestamp, nonce, coords }",
            "HMAC-SHA256 signature using driver hardware secret.",
            "Anti-Forwarding: Tokens shared via WhatsApp expire instantly.",
            "Zero-Connectivity: Signs offline using pre-synced session secrets."
          ],
          color: EMERALD
        },
        {
          title: "Panchayat Verifier: Optical Attestation",
          bullets: [
            "1. WebRTC Optical Camera Scan: Sarpanch scans dynamic QR on arrival.",
            "2. Dual-Factor Geofencing Lock: Haversine distance from cistern strictly <=100m.",
            "3. Cryptographic Nonce Deduplication: Prevents replay attacks (redeemed once).",
            "4. Dual-Key Signature Generated: Driver Key + Panchayat Private Key attest delivery.",
            "5. Automated Escrow Clearance: Valid proof unlocks payment in state database; anomalies freeze funds instantly."
          ],
          color: CYAN
        }
      ],
      notes: "Let's look at how the Dual-Key Handshake works step by step in the field.\n\nWhen a municipal tanker arrives at a village cistern, the driver opens the PWA Cockpit. The app generates a dynamic rolling QR code containing the tanker ID, GPS coordinates, timestamp, and a single-use cryptographic nonce signed with HMAC-SHA256. This token rotates every 60 seconds and is valid for a maximum of 10 minutes.\n\nThe Gram Panchayat verifier scans this QR code using their browser camera. The verifier PWA checks three things: first, that the verifier's own GPS is within 100 meters of the registered cistern; second, that the nonce hasn't been used before; and third, that the signature is valid. Once attested, state escrow unlocks payment to the contractor. If a tanker diverts off-route, escrow freezes automatically."
    },
    {
      badge: "📈 Operations Research & Routing",
      badgeColor: EMERALD,
      title: "Google OR-Tools Multi-Objective Fleet Solver",
      subtitle: "Transforming ad-hoc, politically influenced dispatch into mathematically optimal relief circuits.",
      layout: "metrics_cards",
      metrics: [
        { val: "-28.4%", sub: "Fleet Diesel Burn Reduction", desc: "Eliminates crisscrossing routes & empty return runs.", color: EMERALD },
        { val: "100%", sub: "Article 21 Quota Fulfillment", desc: "Guarantees 40L/capita human & 70L/head cattle.", color: CYAN },
        { val: "0", sub: "Skipped Vulnerable Hamlets", desc: "Fair algorithmic multi-objective scheduling.", color: AMBER }
      ],
      banner: "Capacitated Vehicle Routing Problem (CVRP) Formulation:\nDeparts multi-capacity fleet (5kL / 10kL / 12kL) from Kapurbawdi & Sinnar headworks, optimizing against village depletion curves, road gradients, and driver shift constraints to output turn-by-turn route manifests.",
      notes: "Turning to Pillar 2: Logistics optimization.\n\nIn typical relief operations, tanker dispatch is driven by paper requests and local political pull, resulting in tankers crisscrossing each other and burning taxpayer money while remote tribal hamlets get completely ignored.\n\nWe formulated this as a Capacitated Vehicle Routing Problem (CVRP) solved via Google OR-Tools. The solver departs tankers from municipal headworks, accounts for vehicle capacities—5,000 to 12,000 liters—road conditions, and cistern urgency. The results: a 28.4% reduction in fleet diesel costs, 100% fulfillment of statutory water quotas, and zero skipped hamlets."
    },
    {
      badge: "🖥️ Field Touchpoints & Interfaces",
      badgeColor: CYAN,
      title: "Four Tailored Touchpoints for Disaster Governance",
      subtitle: "Engineered specifically for the realities of rural disaster administration with zero training barrier.",
      layout: "4_cards",
      cards: [
        {
          title: "🏛️ Collector Command",
          bullets: ["District Collector console.", "3D GIS satellite map.", "Real-time anomaly radar.", "Instant escrow freeze.", "Relief Order PDF dispatch."],
          color: CYAN
        },
        {
          title: "🚛 Driver Cockpit",
          bullets: ["Tanker Pilot mobile PWA.", "Offline-first architecture.", "GPS arrival verification lock.", "Dynamic encrypted QR token.", "Emergency SOS panic beacon."],
          color: EMERALD
        },
        {
          title: "🌾 Panchayat Verifier",
          bullets: ["Sarpanch & committee portal.", "WebRTC browser camera scan.", "Cistern level gauge visualizer.", "Offline attestation queue.", "Zero app install needed."],
          color: AMBER
        },
        {
          title: "🌐 Public Ledger",
          bullets: ["Citizen transparency portal.", "Open sovereign audit trail.", "Trilingual UI (English, मराठी, हिंदी).", "Live delivery receipts & tanker audit logs."],
          color: CYAN
        }
      ],
      notes: "Technology only works if people in the field can actually use it without friction. JalSanjeevani provides four tailored interfaces:\n\nFirst, the Tactical Command Center for the District Collector and Disaster Management Authority. It gives a bird's-eye GIS map, anomaly detection radar, and one-click escrow controls.\n\nSecond, the Tanker Pilot Cockpit—an offline-first PWA for drivers with turn-by-turn routes, GPS arrival confirmation, and dynamic QR generation.\n\nThird, the Panchayat Verifier for village sarpanches and water committees. It operates directly in any mobile browser using WebRTC camera scanning—zero app store download.\n\nAnd fourth, the Public Transparency Ledger—a trilingual open audit portal in Marathi, Hindi, and English so any citizen can verify when their village water was delivered."
    },
    {
      badge: "⚙️ Engineering & Architecture",
      badgeColor: CYAN,
      title: "Robust, Sovereign, Zero-Capex Technology Stack",
      subtitle: "Built with modern open standards for speed, high resilience, and sub-second execution.",
      layout: "4_cards",
      cards: [
        {
          title: "Client / Frontend",
          bullets: ["HTML5 & Modern Vanilla JS", "Precompiled Tailwind CSS v3", "Offline-first PWA (sw.js)", "IndexedDB local data queue", "WebRTC camera optical scan", "Leaflet.js GIS mapping layers"],
          color: CYAN
        },
        {
          title: "API & Backend",
          bullets: ["Python 3.10+ async core", "FastAPI web framework", "Uvicorn ASGI server", "Pydantic schema validation", "Bcrypt password hashing (12 rounds)", "HMAC-SHA256 signature engine"],
          color: EMERALD
        },
        {
          title: "AI & Solvers",
          bullets: ["Google OR-Tools CVRP solver", "Google Earth Engine API", "Copernicus Sentinel-2 MNDWI", "NASA SMAP root-zone soil moisture", "Haversine geofence calculator"],
          color: AMBER
        },
        {
          title: "Data & Cloud",
          bullets: ["Supabase (PostgreSQL + RLS)", "Render API hosting", "Vercel Edge CDN distribution", "GitHub Actions keep-alive cron", "Strict Content-Security-Policy (CSP)"],
          color: CYAN
        }
      ],
      notes: "Here is our engineering architecture:\n\nOn the frontend, we deliberately chose modern Vanilla JavaScript, precompiled Tailwind CSS, and Service Workers over heavy JavaScript frameworks. This ensures lightning-fast load times even on low-cost 2G/3G Android phones and guarantees complete offline functionality via IndexedDB.\n\nOn the backend, Python with FastAPI provides asynchronous performance with automatic schema validation via Pydantic.\n\nOur intelligence layer leverages Google Earth Engine to process NASA SMAP and Copernicus Sentinel satellite feeds, paired with Google OR-Tools for combinatorial logistics optimization.\n\nFor the database and security, Supabase PostgreSQL with strict Row Level Security isolates government data, while Bcrypt and HMAC-SHA256 guarantee cryptographic integrity."
    },
    {
      badge: "📊 Feasibility & Potential Impact",
      badgeColor: AMBER,
      title: "Zero-Capex Economics & Quantitative Transformation",
      subtitle: "Rapidly deployable across Maharashtra without new hardware or expensive proprietary equipment.",
      layout: "impact_slide",
      metrics: [
        { val: "100%", sub: "Diversion Elimination", desc: "Zero bills clear without cryptographic proof.", color: EMERALD },
        { val: "14 Days", sub: "Advance Warning Buffer", desc: "Satellite depletion modeling ends panic shortages.", color: CYAN },
        { val: "₹2.11 Cr", sub: "Taxpayer Savings / Season", desc: "Stopped leakage + 28.4% fuel savings across 100 tankers.", color: AMBER }
      ],
      cards: [
        {
          title: "Zero-Capex Technical Feasibility",
          bullets: ["Zero New Hardware: Runs on existing commodity Android phones.", "Zero App Store Barrier: Instant browser PWA access via WebRTC.", "Rural Offline Resilience: Queues delivery receipts offline in IndexedDB.", "Open Standards: Built with battle-tested open-source libraries."],
          color: CYAN
        },
        {
          title: "Institutional & Legal Feasibility",
          bullets: ["Self-Financing: Pays for itself multiple times over by stopping leakage.", "Administrative Alignment: Maps to Collector -> Tehsildar -> Gram Panchayat.", "Section 65B Admissibility: Cryptographic logs fully admissible in Indian courts.", "Immediate Turnaround: Instant digital audit replaces 60-day paper delays."],
          color: AMBER
        }
      ],
      notes: "Let's look at the financial and administrative viability of JalSanjeevani.\n\nFirst, it requires Zero Capex. We do not require installing expensive IoT flow meters or proprietary vehicle gadgets that get vandalized or disconnected. The system runs entirely on standard smartphones already owned by drivers and sarpanches, functioning smoothly through the browser.\n\nSecond, the economic impact is immediate. In a single 90-day summer season across a 100-tanker fleet, stopping 22% diversion and cutting 28.4% fuel burn saves the state exchequer over ₹2.11 Crores.\n\nThird, our audit logs conform to Section 65B of the Indian Evidence Act, giving district collectors undisputed legal evidence against rogue contractors."
    },
    {
      badge: "🚀 Scaling & National Vision",
      badgeColor: CYAN,
      title: "The Sovereign Roadmap: From Sinnar to National Scale",
      subtitle: "A replicable blueprint for climate-resilient water resource governance across India.",
      layout: "3_cards_banner",
      cards: [
        {
          title: "Phase 1: Sinnar Pilot (Q1 2026)",
          bullets: ["Field pilot with Sinnar Disaster Authority.", "28 Gram Panchayats & 15 municipal tankers.", "Live calibration of NASA SMAP soil curves.", "Driver and Sarpanch field usability verification."],
          color: CYAN
        },
        {
          title: "Phase 2: District Rollout (Q3 2026)",
          bullets: ["Scaling across Ahilyanagar & Nashik districts.", "350+ relief tankers and 450+ village cisterns.", "Direct integration into State Treasury e-Billing.", "Citizen mobile notification broadcast."],
          color: EMERALD
        },
        {
          title: "Phase 3: National Scale (2027)",
          bullets: ["National Disaster Management Authority (NDMA) integration.", "Interoperability with Jal Jeevan Mission API.", "Deployment across 8 drought-prone Indian states.", "Open Sovereign Digital Public Infrastructure (DPI)."],
          color: AMBER
        }
      ],
      banner: "\"Guaranteeing that every liter of water allocated by the state reaches the community who needs it—with zero diversion, zero leakage, and absolute mathematical accountability.\"",
      notes: "To conclude, our roadmap begins with a focused pilot in Sinnar taluka with 28 Gram Panchayats and 15 tankers. By Q3 2026, we expand district-wide across Ahilyanagar and Nashik, integrating directly into Maharashtra's state treasury disbursement systems.\n\nOur ultimate vision is to establish JalSanjeevani as Digital Public Infrastructure under NDMA and the Jal Jeevan Mission, providing a template for water governance across drought-prone regions in India.\n\nJalSanjeevani ensures that every liter allocated by the state reaches the citizen who needs it—with zero leakage, zero diversion, and total transparency. Thank you! We are now open for questions."
    }
  ];

  // Helper to style a text range
  function formatHeader(slide, data) {
    // Background fill
    slide.getBackground().setSolidFill(BG_COLOR);

    // Header shape
    var headerBox = slide.insertTextBox(data.badge.toUpperCase(), 40, 20, 640, 25);
    var p0 = headerBox.getText().getParagraphs()[0];
    headerBox.getText().getTextStyle().setFontFamily('Arial').setFontSize(9).setBold(true).setForegroundColor(data.badgeColor);

    // Title
    var titleBox = slide.insertTextBox(data.title, 40, 42, 640, 40);
    titleBox.getText().getTextStyle().setFontFamily('Arial').setFontSize(20).setBold(true).setForegroundColor(WHITE);

    // Subtitle
    var subBox = slide.insertTextBox(data.subtitle, 40, 82, 640, 30);
    subBox.getText().getTextStyle().setFontFamily('Arial').setFontSize(10).setForegroundColor(TEXT_MUTED);
  }

  // Iterate over data to create slides
  for (var i = 0; i < slidesData.length; i++) {
    var d = slidesData[i];
    var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    formatHeader(slide, d);

    // Add Speaker Notes
    if (d.notes) {
      slide.getNotesPage().getSpeakerNotesShape().getText().setText(d.notes);
    }

    if (d.layout === "3_cards" || d.layout === "3_cards_banner") {
      var cardW = 205;
      var cardH = d.banner ? 175 : 240;
      var startY = 120;

      for (var c = 0; c < d.cards.length; c++) {
        var cardData = d.cards[c];
        var startX = 40 + c * (cardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, startY, cardW, cardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(cardData.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(cardData.title + "\n\n");
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(12).setBold(true).setForegroundColor(cardData.color);

        for (var b = 0; b < cardData.bullets.length; b++) {
          txt.appendParagraph("• " + cardData.bullets[b]);
        }
        var paras = txt.getParagraphs();
        for (var p = 1; p < paras.length; p++) {
          paras[p].getTextStyle().setFontFamily('Arial').setFontSize(8.5).setForegroundColor(TEXT_BODY);
        }
      }

      if (d.banner) {
        var bannerShape = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, 40, 310, 640, 60);
        bannerShape.getFill().setSolidFill(CARD_BG);
        bannerShape.getBorder().getLineFill().setSolidFill(AMBER);
        bannerShape.getBorder().setWeight(1.5);
        bannerShape.getText().setText(d.banner);
        bannerShape.getText().getTextStyle().setFontFamily('Arial').setFontSize(8.5).setForegroundColor(TEXT_BODY);
      } else if (d.footer) {
        var footBox = slide.insertTextBox(d.footer, 40, 370, 640, 20);
        footBox.getText().getTextStyle().setFontFamily('Arial').setFontSize(8.5).setForegroundColor(TEXT_MUTED);
      }
    } 
    else if (d.layout === "2_cards") {
      var cardW = 314;
      var cardH = 250;
      var startY = 120;

      for (var c = 0; c < d.cards.length; c++) {
        var cardData = d.cards[c];
        var startX = 40 + c * (cardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, startY, cardW, cardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(cardData.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(cardData.title + "\n\n");
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(13).setBold(true).setForegroundColor(cardData.color);

        for (var b = 0; b < cardData.bullets.length; b++) {
          txt.appendParagraph(cardData.bullets[b]);
        }
        var paras = txt.getParagraphs();
        for (var p = 1; p < paras.length; p++) {
          paras[p].getTextStyle().setFontFamily('Arial').setFontSize(9).setForegroundColor(TEXT_BODY);
        }
      }
    }
    else if (d.layout === "4_cards") {
      var cardW = 151;
      var cardH = 250;
      var startY = 120;

      for (var c = 0; c < d.cards.length; c++) {
        var cardData = d.cards[c];
        var startX = 40 + c * (cardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, startY, cardW, cardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(cardData.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(cardData.title + "\n\n");
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(11).setBold(true).setForegroundColor(cardData.color);

        for (var b = 0; b < cardData.bullets.length; b++) {
          txt.appendParagraph(cardData.bullets[b]);
        }
        var paras = txt.getParagraphs();
        for (var p = 1; p < paras.length; p++) {
          paras[p].getTextStyle().setFontFamily('Arial').setFontSize(8).setForegroundColor(TEXT_BODY);
        }
      }
    }
    else if (d.layout === "metrics_cards") {
      var cardW = 205;
      var cardH = 120;
      var startY = 120;

      for (var m = 0; m < d.metrics.length; m++) {
        var met = d.metrics[m];
        var startX = 40 + m * (cardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, startY, cardW, cardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(met.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(met.val + "\n" + met.sub + "\n" + met.desc);
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(22).setBold(true).setForegroundColor(met.color);
        txt.getParagraphs()[1].getTextStyle().setFontFamily('Arial').setFontSize(10).setBold(true).setForegroundColor(WHITE);
        txt.getParagraphs()[2].getTextStyle().setFontFamily('Arial').setFontSize(8.5).setForegroundColor(TEXT_MUTED);
      }

      var bannerShape = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, 40, 255, 640, 115);
      bannerShape.getFill().setSolidFill(CARD_BG);
      bannerShape.getBorder().getLineFill().setSolidFill(CYAN);
      bannerShape.getBorder().setWeight(1.5);
      bannerShape.getText().setText(d.banner);
      bannerShape.getText().getTextStyle().setFontFamily('Arial').setFontSize(9).setForegroundColor(TEXT_BODY);
    }
    else if (d.layout === "impact_slide") {
      var cardW = 205;
      var cardH = 100;
      var startY = 120;

      for (var m = 0; m < d.metrics.length; m++) {
        var met = d.metrics[m];
        var startX = 40 + m * (cardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, startY, cardW, cardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(met.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(met.val + "\n" + met.sub);
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(20).setBold(true).setForegroundColor(met.color);
        txt.getParagraphs()[1].getTextStyle().setFontFamily('Arial').setFontSize(9.5).setBold(true).setForegroundColor(WHITE);
      }

      var subCardW = 314;
      var subCardH = 145;
      for (var c = 0; c < d.cards.length; c++) {
        var cardData = d.cards[c];
        var startX = 40 + c * (subCardW + 12);
        var card = slide.insertShape(SlidesApp.ShapeType.ROUNDED_RECTANGLE, startX, 230, subCardW, subCardH);
        card.getFill().setSolidFill(CARD_BG);
        card.getBorder().getLineFill().setSolidFill(cardData.color);
        card.getBorder().setWeight(1.5);

        var txt = card.getText();
        txt.setText(cardData.title + "\n\n");
        txt.getParagraphs()[0].getTextStyle().setFontFamily('Arial').setFontSize(11).setBold(true).setForegroundColor(cardData.color);

        for (var b = 0; b < cardData.bullets.length; b++) {
          txt.appendParagraph(cardData.bullets[b]);
        }
        var paras = txt.getParagraphs();
        for (var p = 1; p < paras.length; p++) {
          paras[p].getTextStyle().setFontFamily('Arial').setFontSize(8).setForegroundColor(TEXT_BODY);
        }
      }
    }
    else if (d.layout === "table_slide") {
      var table = slide.insertTable(6, 4, 40, 120, 640, 245);
      var colWidths = [120, 165, 165, 190];
      for (var col = 0; col < 4; col++) {
        table.getColumn(col).setWidth(colWidths[col]);
      }

      var tableData = [
        ["Dimension", "Legacy Systems (Paper/GPS)", "Commercial Fleet Tech", "JalSanjeevani (जलसंजीवनी)"],
        ["Payment Enforcement", "Post-facto paper bills; paid regardless of leakage.", "Vehicle tracking only; zero link to state treasury.", "Smart Escrow: Zero bill payout without verified cryptographic proof."],
        ["Delivery Proof", "Forged paper logbooks & odometer slips.", "Driver single-tap button or digital signature.", "Dual-Key Optical Handshake (Driver key + Panchayat hardware key)."],
        ["Replay Defense", "None; paper slips duplicated.", "Static QR codes vulnerable to WhatsApp sharing.", "Dynamic HMAC-SHA256 (60s rotation, nonce deduplication, 10m validity)."],
        ["Geofencing", "Tanker GPS only (easily spoofed or unplugged).", "Single-point circular radius.", "Dual-Factor Geofencing: Tanker GPS + Sarpanch Device GPS <= 100m."],
        ["Offline Resilience", "Fails completely without active 4G data.", "Cloud-dependent; crashes in hill valleys.", "Sovereign IndexedDB queue + Service Worker Background Sync."]
      ];

      for (var r = 0; r < 6; r++) {
        for (var c = 0; c < 4; c++) {
          var cell = table.getCell(r, c);
          cell.getFill().setSolidFill(r === 0 ? '#0E243F' : CARD_BG);
          var txt = cell.getText();
          txt.setText(tableData[r][c]);
          var style = txt.getTextStyle();
          style.setFontFamily('Arial');
          style.setFontSize(r === 0 ? 9 : 8);
          if (r === 0) {
            style.setBold(true).setForegroundColor(c === 3 ? CYAN : WHITE);
          } else if (c === 0) {
            style.setBold(true).setForegroundColor(WHITE);
          } else if (c === 3) {
            style.setBold(true).setForegroundColor(CYAN);
          } else {
            style.setForegroundColor(TEXT_MUTED);
          }
        }
      }
    }
  }

  // Remove the initial blank slide if present
  var existingSlides = presentation.getSlides();
  if (existingSlides.length > slidesData.length) {
    existingSlides[0].remove();
  }

  Logger.log("JalSanjeevani deck created successfully!");
}
