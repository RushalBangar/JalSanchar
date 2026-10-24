/**
 * JalSanchar — Universal Multilingual Localization Engine (V1 + V2)
 * Supports English (en), Marathi (mr), and Hindi (hi).
 * Works across ALL pages via:
 *   1. Key-based translations ([data-i18n], [data-i18n-placeholder])
 *   2. Automatic whitespace-normalized phrase dictionary translation for DOM text nodes
 *   3. Synced localStorage ('jalsanchar_lang') & #langSwitcher across all pages
 */

(function (window, document) {
  "use strict";

  // ----------------------------------------------------------------------------
  // 1. Key-Based Translation Dictionaries
  // ----------------------------------------------------------------------------
  const translations = {
    en: {
      nav_brand: "JalSanchar (जलसंचार)",
      nav_pillars: "How It Works",
      nav_features: "Features",
      nav_portals: "Portals",
      nav_panchayat: "Panchayat Portal",
      nav_faq: "FAQ",
      nav_login: "Portal Login",
      nav_signout: "Sign Out",
      nav_dashboard: "Command Center",
      nav_tracker: "Track Tanker",
      nav_village: "Village Water",
      nav_pipelines: "Pipelines Monitor",
      nav_sources: "Sources Portal",
      hero_title: "Guaranteed Clean Water For Drought-Hit Villages",
      hero_desc: "JalSanchar uses satellite hydrology data and cryptographic dual-QR proof to eliminate water tanker theft and ensure every rural family gets their statutory 40 liters of clean water daily.",
      hero_btn_discover: "Explore All 4 Portals",
      hero_btn_access: "Launch Collector Dashboard",
      login_back_home: "Back to Home",
      login_badge: "Official Water Supply & Relief Management",
      login_title: "Sign in to JalSanchar",
      login_desc: "Select your role to access your dashboard, or sign in below.",
      login_tab_signin: "Sign-In",
      login_tab_register: "Register New Account",
      login_select_role: "Select Your Role:",
      role_collector: "District Collector",
      role_collector_tag: "Water Map & Monitoring",
      role_driver: "Tanker Driver",
      role_driver_tag: "GPS Route & QR Code",
      role_panchayat: "Gram Panchayat",
      role_panchayat_tag: "Village Tank & QR Scanner",
      label_email: "Email Address / Official ID",
      placeholder_email: "Enter your email or official ID",
      label_password: "Password",
      placeholder_password: "Enter your password (min 8 characters)",
      remember_session: "Keep secure session active for 24 hours",
      btn_submit_signin: "Sign In →",
      btn_demo_login: "Instant 1-Click Demo Login",
      helper_title: "View Demo Login Accounts",
      v2_village_water_title: "Village Water Intelligence",
      v2_days_left_title: "Days of Usable Water Remaining",
      v2_water_depletion_forecast: "14-Day Hydrological Depletion Forecast",
      v2_source_cards_title: "Village Water Sources (Wells, Tanks & Lakes)",
      v2_disclaimer: "This tool supports local authorities and does not replace water-quality testing."
    },

    mr: {
      nav_brand: "जलसंचार (JalSanchar)",
      nav_pillars: "कार्यपद्धती",
      nav_features: "वैशिष्ट्ये",
      nav_portals: "पोर्टल्स",
      nav_panchayat: "ग्रामपंचायत पोर्टल",
      nav_faq: "नेहमी विचारले जाणारे प्रश्न",
      nav_login: "पोर्टल लॉगिन",
      nav_signout: "बाहेर पडा",
      nav_dashboard: "नियंत्रण कक्ष",
      nav_tracker: "टँकर ट्रॅक करा",
      nav_village: "ग्राम जलस्थिती",
      nav_pipelines: "पाईपलाईन मॉनिटर",
      nav_sources: "जलस्रोत नोंदणी",
      hero_title: "दुष्काळग्रस्त प्रत्येक गावाला हक्काचे पिण्याचे पाणी",
      hero_desc: "जलसंचार उपग्रह जलविज्ञान डेटा आणि दोन-स्तरीय क्यूआर पडताळणीद्वारे पाण्याची चोरी रोखते आणि प्रत्येक ग्रामीण कुटुंबाला दररोज ४० लिटर पाणी मिळण्याची खात्री करते.",
      hero_btn_discover: "सर्व ४ पोर्टल्स पहा",
      hero_btn_access: "जिल्हाधिकारी डॅशबोर्ड उघडा",
      login_back_home: "मुख्य पानावर परत",
      login_badge: "अधिकृत पाणीपुरवठा व दुष्काळ निवारण",
      login_title: "जलसंचार पोर्टल लॉगिन",
      login_desc: "आपल्या डॅशबोर्डवर जाण्यासाठी आपली भूमिका निवडा किंवा खाली लॉगिन करा.",
      login_tab_signin: "साइन-इन",
      login_tab_register: "नवीन खाते नोंदणी",
      login_select_role: "आपली भूमिका निवडा:",
      role_collector: "जिल्हाधिकारी",
      role_collector_tag: "जल नकाशा व थेट देखरेख",
      role_driver: "टँकर चालक",
      role_driver_tag: "जीपीएस मार्ग व क्यूआर कोड",
      role_panchayat: "ग्रामपंचायत",
      role_panchayat_tag: "गावाची टाकी व क्यूआर स्कॅनर",
      label_email: "ईमेल पत्ता / अधिकृत ओळख",
      placeholder_email: "आपला ईमेल किंवा अधिकृत ओळख क्रमांक टाका",
      label_password: "पासवर्ड",
      placeholder_password: "पासवर्ड टाका (किमान ८ अक्षरे)",
      remember_session: "२४ तास सुरक्षित सत्र सुरू ठेवा",
      btn_submit_signin: "साइन इन करा →",
      btn_demo_login: "१-क्लिक डेमो लॉगिन",
      helper_title: "डेमो लॉगिन खाती पहा",
      v2_village_water_title: "ग्राम जलस्थिती माहिती फलक",
      v2_days_left_title: "उपलब्ध पाणी साठा (दिवसांची श्रेणी)",
      v2_water_depletion_forecast: "१४ दिवसांचा जलसाठा अंदाज आलेख",
      v2_source_cards_title: "गावातील जलस्रोत (विहिरी, टाक्या व तलाव)",
      v2_disclaimer: "हे साधन स्थानिक प्रशासनाला सहकार्य करण्यासाठी असून ते पाणी गुणवत्ता चाचणीचा पर्याय नाही."
    },

    hi: {
      nav_brand: "जलसंचार (JalSanchar)",
      nav_pillars: "कार्यप्रणाली",
      nav_features: "विशेषताएं",
      nav_portals: "पोर्टल",
      nav_panchayat: "ग्राम पंचायत पोर्टल",
      nav_faq: "अक्सर पूछे जाने वाले प्रश्न",
      nav_login: "पोर्टल लॉगिन",
      nav_signout: "लॉग आउट",
      nav_dashboard: "कमांड सेंटर",
      nav_tracker: "टैंकर ट्रैक करें",
      nav_village: "ग्राम जल स्थिति",
      nav_pipelines: "पाइपलाइन निगरानी",
      nav_sources: "जलस्रोत पंजीकरण",
      hero_title: "सूखा प्रभावित हर गाँव के लिए स्वच्छ जल की गारंटी",
      hero_desc: "जलसंचार उपग्रह जलविज्ञान डेटा और क्रिप्टोग्राफिक दोहरे क्यूआर सत्यापन से पानी की चोरी रोकता है और हर ग्रामीण परिवार को दैनिक 40 लीटर जल सुनिश्चित करता है।",
      hero_btn_discover: "सभी 4 पोर्टल देखें",
      hero_btn_access: "ज़िलाधिकारी डैशबोर्ड खोलें",
      login_back_home: "मुख्य पृष्ठ पर वापस",
      login_badge: "आधिकारिक जल आपूर्ति एवं सूखा राहत प्रबंधन",
      login_title: "जलसंचार पोर्टल लॉगिन",
      login_desc: "अपने डैशबोर्ड पर जाने के लिए अपनी भूमिका चुनें या लॉगिन करें।",
      login_tab_signin: "साइन-इन",
      login_tab_register: "नया खाता पंजीकरण",
      login_select_role: "अपनी भूमिका चुनें:",
      role_collector: "ज़िलाधिकारी",
      role_collector_tag: "जल मैप व निगरानी",
      role_driver: "टैंकर चालक",
      role_driver_tag: "जीपीएस रूट व क्यूआर कोड",
      role_panchayat: "ग्राम पंचायत",
      role_panchayat_tag: "गाँव की पानी की टंकी व क्यूआर स्कैनर",
      label_email: "ईमेल पता / आधिकारिक आईडी",
      placeholder_email: "अपना ईमेल या आधिकारिक आईडी दर्ज करें",
      label_password: "पासवर्ड",
      placeholder_password: "पासवर्ड दर्ज करें (कम से कम 8 अक्षर)",
      remember_session: "24 घंटे सुरक्षित सत्र सक्रिय रखें",
      btn_submit_signin: "साइन इन करें →",
      btn_demo_login: "1-क्लिक डेमो लॉगिन",
      helper_title: "डेमो लॉगिन खाते देखें",
      v2_village_water_title: "ग्राम जल स्थिति डैशबोर्ड",
      v2_days_left_title: "उपलब्ध जल भंडार (दिनों की सीमा)",
      v2_water_depletion_forecast: "14 दिनों का जल स्तर पूर्वानुमान",
      v2_source_cards_title: "गांव के जलस्रोत (कुएं, टंकियां और तालाब)",
      v2_disclaimer: "यह उपकरण स्थानीय प्रशासन की सहायता के लिए है और पानी की गुणवत्ता परीक्षण का विकल्प नहीं है।"
    }
  };

  // ----------------------------------------------------------------------------
  // 2. Comprehensive Phrase Translation Dictionary
  // ----------------------------------------------------------------------------
  const PHRASE_PAIRS = [
    // Top Bar & Branding
    { en: "JalSanchar", mr: "जलसंचार", hi: "जलसंचार" },
    { en: "Gov-Telemetry", mr: "शासकीय-टेलीमेट्री", hi: "शासकीय-टेलीमेट्री" },
    { en: "Ministry of Jal Shakti • Smart Water Supply", mr: "जलशक्ती मंत्रालय • स्मार्ट पाणीपुरवठा", hi: "जल शक्ति मंत्रालय • स्मार्ट जल आपूर्ति" },
    { en: "National Water Informatics Pilot • Sinnar & Ahilyanagar", mr: "राष्ट्रीय जल माहिती प्रकल्प • सिन्नर व अहिल्यानगर", hi: "राष्ट्रीय जल सूचना पायलट • सिन्नर व अहिल्यानगर" },
    { en: "Track 3-01 • Collector Console", mr: "ट्रॅक ३-०१ • जिल्हाधिकारी कक्ष", hi: "ट्रैक 3-01 • ज़िलाधिकारी कंसोल" },

    // Navigation Links
    { en: "How It Works", mr: "कार्यपद्धती", hi: "कार्यप्रणाली" },
    { en: "Portals", mr: "पोर्टल्स", hi: "पोर्टल" },
    { en: "Audit Ledger", mr: "ऑडिट लेजर", hi: "ऑडिट लेजर" },
    { en: "Live Delivery Audit", mr: "थेट वितरण तपासणी", hi: "लाइव वितरण ऑडिट" },
    { en: "Portal Login", mr: "पोर्टल लॉगिन", hi: "पोर्टल लॉगिन" },
    { en: "Sign Out", mr: "बाहेर पडा", hi: "लॉग आउट" },
    { en: "Command Center", mr: "नियंत्रण कक्ष", hi: "कमांड सेंटर" },
    { en: "Track Tanker", mr: "टँकर ट्रॅक करा", hi: "टैंकर ट्रैक करें" },
    { en: "Village Water", mr: "ग्राम जलस्थिती", hi: "ग्राम जल स्थिति" },
    { en: "Pipelines Monitor", mr: "पाईपलाईन मॉनिटर", hi: "पाइपलाइन निगरानी" },
    { en: "Sources Portal", mr: "जलस्रोत नोंदणी", hi: "जलस्रोत पंजीकरण" },
    { en: "Back to Home", mr: "मुख्य पानावर परत", hi: "मुख्य पृष्ठ पर वापस" },

    // Landing / Hero
    { en: "PILOT DEPLOYMENT: SINNAR & AHILYANAGAR", mr: "पायलट प्रकल्प: सिन्नर आणि अहिल्यानगर", hi: "पायलट परियोजना: सिन्नर और अहिल्यानगर" },
    { en: "Guaranteed Clean Water For Drought-Hit Villages", mr: "दुष्काळग्रस्त प्रत्येक गावाला हक्काचे पिण्याचे पाणी", hi: "सूखा प्रभावित हर गाँव के लिए स्वच्छ जल की गारंटी" },
    { en: "Guaranteed Clean Water For Every Drought-Hit Village", mr: "दुष्काळग्रस्त प्रत्येक गावाला हक्काचे पिण्याचे पाणी", hi: "सूखा प्रभावित हर गाँव के लिए स्वच्छ जल की गारंटी" },
    { en: "JalSanchar uses satellite hydrology data and cryptographic dual-QR proof to eliminate water tanker theft and ensure every rural family gets their statutory 40 liters of clean water daily.", mr: "जलसंचार उपग्रह जलविज्ञान डेटा आणि दोन-स्तरीय क्यूआर पडताळणीद्वारे पाण्याची चोरी रोखते आणि प्रत्येक ग्रामीण कुटुंबाला दररोज ४० लिटर पाणी मिळण्याची खात्री करते.", hi: "जलसंचार उपग्रह जलविज्ञान डेटा और क्रिप्टोग्राफिक दोहरे क्यूआर सत्यापन से पानी की चोरी रोकता है और हर ग्रामीण परिवार को दैनिक 40 लीटर जल सुनिश्चित करता है।" },
    { en: "Launch Collector Dashboard", mr: "जिल्हाधिकारी डॅशबोर्ड उघडा", hi: "ज़िलाधिकारी डैशबोर्ड खोलें" },
    { en: "Explore All 4 Portals", mr: "सर्व ४ पोर्टल्स पहा", hi: "सभी 4 पोर्टल देखें" },
    { en: "Explore Platform Portals", mr: "सर्व पोर्टल पहा", hi: "सभी पोर्टल देखें" },
    { en: "View Water Dashboard", mr: "पाणी डॅशबोर्ड उघडा", hi: "जल डैशबोर्ड खोलें" },

    // Video Showcase
    { en: "Field Operational Briefing", mr: "थेट क्षेत्रीय माहिती", hi: "क्षेत्रीय परिचालन ब्रीफिंग" },
    { en: "JalSanchar: Complete Platform & Field Verification Walkthrough", mr: "जलसंचार: संपूर्ण प्रणाली व क्षेत्रीय पडताळणी सादरीकरण", hi: "जलसंचार: संपूर्ण प्रणाली एवं क्षेत्रीय सत्यापन वॉकथ्रू" },
    { en: "HD Video & Narration", mr: "एचडी व्हिडिओ व माहिती", hi: "एचडी वीडियो व विवरण" },
    { en: "Deployment Sector:", mr: "कार्यक्षेत्र:", hi: "तैनाती क्षेत्र:" },
    { en: "Ahilyanagar & Sinnar Pilot Belt, Maharashtra", mr: "अहिल्यानगर व सिन्नर विभाग, महाराष्ट्र", hi: "अहिल्यानगर व सिन्नर क्षेत्र, महाराष्ट्र" },
    { en: "Dual-QR Delivery Proof • Satellite Telemetry • OR-Tools Routing", mr: "दोन-स्तरीय क्यूआर पावती • सॅटेलाइट टेलीमेट्री • ओआर-टूल्स मार्गनियोजन", hi: "दोहरा क्यूआर प्रमाण • सैटेलाइट टेलीमेट्री • ओआर-टूल्स रूटिंग" },

    // Guarantees Strip
    { en: "40L / 70L Daily Quota", mr: "४० लि / ७० लि दैनिक कोटा", hi: "40L / 70L दैनिक कोटा" },
    { en: "Guaranteed per citizen and livestock under state drought norms.", mr: "शासकीय दुष्काळ नियमांनुसार नागरिक आणि जनावरांसाठी हमी.", hi: "शासकीय सूखा नियमों के तहत नागरिक और मवेशियों हेतु गारंटी।" },
    { en: "14-Day Advance Warning", mr: "१४ दिवसांची आगाऊ पूर्वसूचना", hi: "14 दिन पूर्व चेतावनी" },
    { en: "Satellite moisture radar flags dry wells 2 weeks before taps run out.", mr: "नळांना पाणी येणे बंद होण्याच्या २ आठवडे आधी उपग्रह कोरड्या विहिरींची सूचना देतो.", hi: "उपग्रह नमी रडार नल सूखने से 2 सप्ताह पूर्व ही जल संकट की चेतावनी देता है।" },
    { en: "Zero-Theft Escrow", mr: "चोरीमुक्त सुरक्षित पेमेंट", hi: "शून्य-चोरी सुरक्षित भुगतान" },
    { en: "Dual-QR handshake confirms delivery before contractor payment unlocks.", mr: "पाण्याची टाकीवर पडताळणी झाल्यानंतरच कंत्राटदाराचे बिल पास होते.", hi: "गाँव की टंकी पर सत्यापन के बाद ही ठेकेदार का भुगतान स्वीकृत होता है।" },

    // How It Works Section
    { en: "Simple 3-Tier Workflow", mr: "३ सोप्या टप्प्यांतील कार्यपद्धती", hi: "3 सरल चरणों में कार्यप्रणाली" },
    { en: "How JalSanchar Solves Water Scarcity", mr: "पाणीटंचाईवर जलसंचारचे ३ सोपे उपाय", hi: "जल संकट पर जलसंचार के 3 समाधान" },
    { en: "A dependable system combining space satellite sensors, GPS tracking, and village-level QR confirmation.", mr: "उपग्रह सेन्सर्स, जीपीएस ट्रॅकिंग आणि गावपातळीवरील क्यूआर पडताळणीची खात्रीशीर प्रणाली.", hi: "उपग्रह सेंसर, जीपीएस ट्रैकिंग और ग्राम स्तरीय क्यूआर सत्यापन की विश्वसनीय प्रणाली।" },
    { en: "Predict Shortages Early", mr: "टंचाईचा आगाऊ अंदाज", hi: "संकट का पूर्व अनुमान" },
    { en: "NASA SMAP and Sentinel-2 satellites analyze groundwater anomalies, warning officials 14 days before a village well runs dry.", mr: "नासा एसएमएपी आणि सेंटिनेल-२ उपग्रह भूजलाचे विश्लेषण करून विहीर कोरडी पडण्याच्या १४ दिवस आधी सूचना देतात.", hi: "नासा एसएमएपी और सेंटिनेल-2 उपग्रह भूजल का विश्लेषण कर कुआं सूखने से 14 दिन पूर्व चेतावनी देते हैं।" },
    { en: "Automated Satellite Telemetry", mr: "स्वयंचलित उपग्रह टेलीमेट्री", hi: "स्वचालित उपग्रह टेलीमेट्री" },
    { en: "Prevent Tanker Diversion", mr: "टँकर पाणी चोरीला पूर्ण आळा", hi: "टैंकर डायवर्जन पर रोक" },
    { en: "Tankers are tracked with a 500m geofence. If a driver deviates off-route, their billing escrow is automatically frozen.", mr: "५०० मीटर जिओफेन्सद्वारे टँकर ट्रॅक केले जातात. चालक मार्गावरून भरकटल्यास त्याचे बिल त्वरित रोखले जाते.", hi: "500 मीटर जियोफेंस से टैंकर ट्रैक होते हैं। चालक के मार्ग भटकने पर भुगतान तुरंत रोक दिया जाता है।" },
    { en: "Strict 500m Geofence Lock", mr: "५०० मीटर जिओफेन्स सुरक्षा", hi: "सख्त 500 मीटर जियोफेंस सुरक्षा" },
    { en: "Verify at the Cistern", mr: "टाकीवर प्रत्यक्ष पडताळणी", hi: "टंकी पर प्रत्यक्ष सत्यापन" },
    { en: "The driver and village Panchayat scan a time-sensitive dual QR code at the community tank to cryptographically confirm water delivery.", mr: "चालक आणि ग्रामपंचायत गावच्या टाकीजवळ क्यूआर कोड स्कॅन करून पाणी वितरणाची खात्री करतात.", hi: "चालक और ग्राम पंचायत गाँव की टंकी पर क्यूआर कोड स्कैन करके जल वितरण की पुष्टि करते हैं।" },
    { en: "HMAC-SHA256 Handshake", mr: "सुरक्षित क्रिप्टोग्राफिक हँडशेक", hi: "सुरक्षित क्रिप्टोग्राफिक हैंडशेक" },

    // Four Dedicated Portals
    { en: "Tailored For Field Governance", mr: "प्रशासकीय पारदर्शकतेसाठी विशेष रचना", hi: "प्रशासनिक पारदर्शिता हेतु विशेष निर्मित" },
    { en: "Four Dedicated Portals", mr: "चार समर्पित पोर्टल्स", hi: "चार समर्पित पोर्टल" },
    { en: "Role-specific dashboards designed to work smoothly on mobile phones, tablets, and desktop computers.", mr: "मोबाईल, टॅब्लेट आणि कॉम्प्युटरवर सहज चालणारे स्वतंत्र डॅशबोर्ड.", hi: "मोबाइल, टैबलेट और कंप्यूटर पर सुगमता से कार्य करने वाले समर्पित डैशबोर्ड।" },
    { en: "District Collector", mr: "जिल्हाधिकारी", hi: "ज़िलाधिकारी" },
    { en: "Collector", mr: "जिल्हाधिकारी", hi: "ज़िलाधिकारी" },
    { en: "Real-time fleet GIS map, automated route dispatching, and contractor payment approvals.", mr: "थेट जीआयएस नकाशा, स्वयंचलित मार्ग नियोजन आणि कंत्राटदारांचे बिल मंजुरी.", hi: "रीयल-टाइम जीआईएस मैप, स्वचालित मार्ग नियोजन और ठेकेदार भुगतान स्वीकृति।" },
    { en: "Open Console", mr: "कंसोल उघडा", hi: "कंसोल खोलें" },
    { en: "Gram Panchayat", mr: "ग्रामपंचायत", hi: "ग्राम पंचायत" },
    { en: "Panchayat", mr: "ग्रामपंचायत", hi: "ग्राम पंचायत" },
    { en: "Mobile camera scanner to verify tanker water volume and submit urgent shortage alerts.", mr: "टँकरचे पाणी मोजण्यासाठी मोबाईल कॅमेरा स्कॅनर आणि टंचाई सूचना.", hi: "टैंकर के जल सत्यापन हेतु मोबाइल कैमरा स्कैनर और आपातकालीन चेतावनी।" },
    { en: "Open Scanner", mr: "स्कॅनर उघडा", hi: "स्कैनर खोलें" },
    { en: "Tanker Driver", mr: "टँकर चालक", hi: "टैंकर चालक" },
    { en: "Driver PWA", mr: "चालक ॲप", hi: "चालक ऐप" },
    { en: "Offline GPS trip navigation, delivery QR generator, and turn-by-turn route directions.", mr: "ऑफलाइन जीपीएस नेव्हिगेशन, वितरण क्यूआर जनरेटर आणि रस्ता मार्गदर्शन.", hi: "ऑफलाइन जीपीएस नेविगेशन, वितरण क्यूआर जनरेटर और मोड़-दर-मोड़ दिशा निर्देश।" },
    { en: "Open Driver App", mr: "चालक ॲप उघडा", hi: "चालक ऐप खोलें" },
    { en: "Role Sign In", mr: "भूमिका लॉगिन", hi: "भूमिका लॉगिन" },
    { en: "Sign In", mr: "साइन इन करा", hi: "साइन इन करें" },
    { en: "Secure authentication for government personnel, local auditors, and field operators.", mr: "शासकीय अधिकारी, स्थानिक लेखापरीक्षक आणि क्षेत्रीय कर्मचाऱ्यांसाठी सुरक्षित लॉगिन.", hi: "सरकारी कर्मियों, स्थानीय लेखा परीक्षकों और क्षेत्रीय ऑपरेटरों हेतु सुरक्षित प्रमाणीकरण।" },

    // Audit Section
    { en: "Public Transparency Stream", mr: "सार्वजनिक पारदर्शकता माहिती", hi: "सार्वजनिक पारदर्शिता धारा" },
    { en: "Recent Water Deliveries", mr: "पाणीवाटप नोंदी", hi: "हालिया जल वितरण" },
    { en: "Cryptographically attested delivery records in the Sinnar & Ahilyanagar sector.", mr: "सिन्नर आणि अहिल्यानगर विभागातील अधिकृत पाणीवाटप नोंदी.", hi: "सिन्नर और अहिल्यानगर क्षेत्र में प्रमाणित जल वितरण रिकॉर्ड।" },
    { en: "Download Audit Ledger", mr: "लेखापरीक्षण वही डाउनलोड करा", hi: "ऑडिट लेजर डाउनलोड करें" },
    { en: "Discharged 10,000 Liters • Dual QR Verified at Cistern", mr: "१०,००० लिटर वाटप • टाकीवर दोन-स्तरीय क्यूआर द्वारे सत्यापित", hi: "10,000 लीटर वितरण • टंकी पर दोहरे क्यूआर द्वारा सत्यापित" },
    { en: "Dispatched 10,000 Liters • Currently Inside Geofence", mr: "१०,००० लिटर रवाना • सध्या जिओफेन्सच्या आत", hi: "10,000 लीटर रवाना • वर्तमान में जियोफेंस के अंदर" },
    { en: "500m Off-Route Detected • Contractor Escrow Frozen", mr: "५०० मीटर मार्ग विचलन आढळले • कंत्राटदाराचे पेमेंट रोखले", hi: "500 मीटर मार्ग भटकाव • ठेकेदार भुगतान रोका गया" },
    { en: "VERIFIED", mr: "सत्यापित", hi: "सत्यापित" },
    { en: "IN TRANSIT", mr: "मार्गावर", hi: "रास्ते में" },
    { en: "HELD", mr: "रोखले", hi: "रोका गया" },

    // Dashboard Telemetry Badges & Buttons
    { en: "Active Tankers", mr: "सक्रिय टँकर्स", hi: "सक्रिय टैंकर" },
    { en: "Critical Depletions", mr: "अतिटंचाई गावे", hi: "अति-संकटग्रस्त गाँव" },
    { en: "Escrow Frozen", mr: "रोखलेले पेमेंट्स", hi: "रोके गए भुगतान" },
    { en: "Compliance Rate", mr: "नियम पूर्तता दर", hi: "अनुपालन दर" },
    { en: "Water Allocation Matrix", mr: "पाणी वाटप मॅट्रिक्स", hi: "जल आवंटन मैट्रिक्स" },
    { en: "Emergency Dispatch", mr: "आपत्कालीन रवानगी", hi: "आपातकालीन प्रेषण" },
    { en: "Water Map & Monitoring", mr: "जल नकाशा व थेट देखरेख", hi: "जल मैप व निगरानी" },
    { en: "Normal Soil", mr: "सामान्य माती ओलावा", hi: "सामान्य मृदा नमी" },
    { en: "Connected", mr: "जोडलेले", hi: "जुड़ा हुआ" },
    { en: "Confidence:", mr: "विश्वासार्हता:", hi: "विश्वसनीयता:" },
    { en: "Attested", mr: "प्रमाणित", hi: "प्रमाणित" },

    // Quality Badges
    { en: "Metered", mr: "मीटर मोजणी", hi: "मीटर रीडिंग" },
    { en: "Manual", mr: "मॅन्युअल नोंद", hi: "मैनुअल प्रविष्टि" },
    { en: "Satellite", mr: "उपग्रह डेटा", hi: "उपग्रह डेटा" },
    { en: "Estimated", mr: "अंदाजित", hi: "अनुमानित" },
    { en: "Simulated", mr: "सिम्युलेटेड (चाचणी)", hi: "सिम्युलेटेड (परीक्षण)" },
    { en: "Normal", mr: "सर्वसाधारण", hi: "सामान्य" },
    { en: "Watch", mr: "खबरदारी", hi: "सतर्कता" },
    { en: "Inspect", mr: "तातडीची तपासणी", hi: "तुरंत निरीक्षण" },
    { en: "Critical", mr: "गंभीर टंचाई", hi: "गंभीर संकट" },
    { en: "Stable", mr: "स्थिर", hi: "स्थिर" },

    // Public Tracker
    { en: "Citizen Water Tanker Transparency Tracker", mr: "नागरिक पाणी टँकर पारदर्शकता पोर्टल", hi: "नागरिक जल टैंकर पारदर्शिता पोर्टल" },
    { en: "Select District", mr: "जिल्हा निवडा", hi: "ज़िला चुनें" },
    { en: "Select Taluka", mr: "तालुका निवडा", hi: "तालुका चुनें" },
    { en: "Select Village", mr: "गाव निवडा", hi: "गाँव चुनें" },
    { en: "All Districts", mr: "सर्व जिल्हे", hi: "सभी ज़िले" },
    { en: "All Talukas", mr: "सर्व तालुके", hi: "सभी तालुका" },
    { en: "All Villages", mr: "सर्व गावे", hi: "सभी गाँव" },
    { en: "Vehicle Registration", mr: "वाहन नोंदणी क्र.", hi: "वाहन पंजीकरण संख्या" },
    { en: "Tanker ID", mr: "टँकर क्रमांक", hi: "टैंकर आईडी" },
    { en: "Estimated Arrival (ETA)", mr: "अपेक्षित आगमन वेळ (ETA)", hi: "अनुमानित आगमन (ETA)" },
    { en: "Last Verified Delivery", mr: "शेवटची पडताळणी पावती", hi: "अंतिम सत्यापित वितरण" },
    { en: "View Village Water Status", mr: "गावाची जलस्थिती पहा", hi: "गाँव की जल स्थिति देखें" },

    // Pipelines Loss Monitor
    { en: "Pipeline Conveyance Loss Monitor", mr: "पाईपलाईन गळती व वितरण नियंत्रण", hi: "पाइपलाइन रिसाव व वितरण निगरानी" },
    { en: "Monitored Lines", mr: "निरीक्षणाखालील लाईन्स", hi: "निगरानी अधीन लाइनें" },
    { en: "Normal (OK)", mr: "सर्वसाधारण (OK)", hi: "सामान्य (OK)" },
    { en: "Watch Notice", mr: "खबरदारी सूचना", hi: "सतर्कता सूचना" },
    { en: "Inspect Urgently", mr: "तातडीने तपासणी करा", hi: "तत्काल निरीक्षण करें" },
    { en: "24h Net Loss Est.", mr: "२४ तासांतील गळती अंदाज", hi: "24 घंटे में रिसाव अनुमान" },
    { en: "Record Totalizer Reading", mr: "मीटर नोंदणी करा", hi: "मीटर रीडिंग दर्ज करें" },
    { en: "Select Flow Meter", mr: "प्रवाह मीटर निवडा", hi: "फ्लो मीटर चुनें" },
    { en: "Cumulative Totalizer Reading (Liters)", mr: "एकूण टोटलिर वाचन (लिटरमध्ये)", hi: "कुल मीटर रीडिंग (लीटर में)" },
    { en: "Data Recording Method", mr: "नोंदणी पद्धती", hi: "डेटा रिकॉर्डिंग विधि" },
    { en: "Save Totalizer Reading", mr: "मीटर नोंदणी जतन करा", hi: "मीटर रीडिंग सुरक्षित करें" },
    { en: "Source Supplied (24h)", mr: "स्रोताकडून सोडलेले (२४ तास)", hi: "स्रोत से आपूर्ति (24 घंटे)" },
    { en: "Receiver Received (24h)", mr: "गावात मिळालेले (२४ तास)", hi: "गाँव में प्राप्त (24 घंटे)" },
    { en: "Net Conveyance Loss", mr: "एकूण वितरण तूट", hi: "कुल वितरण घाटा" },
    { en: "Loss Range", mr: "तूट श्रेणी (%)", hi: "घाटा सीमा (%)" },
    { en: "View Analysis", mr: "विश्लेषण पहा", hi: "विश्लेषण देखें" },
    { en: "7-Day Conveyance Loss Trend (%)", mr: "७ दिवसांचा गळती ट्रेंड (%)", hi: "7-दिवसीय रिसाव रुझान (%)" },

    // Common Buttons & Actions
    { en: "Refresh", mr: "रिफ्रेश करा", hi: "रिफ्रेश करें" },
    { en: "Close", mr: "बंद करा", hi: "बंद करें" },
    { en: "Cancel", mr: "रद्द करा", hi: "रद्द करें" },
    { en: "Save", mr: "जतन करा", hi: "सहेजें" },
    { en: "Submit", mr: "सबमिट करा", hi: "सबमिट करें" },
    { en: "Online", mr: "ऑनलाइन", hi: "ऑनलाइन" },
    { en: "Offline", mr: "ऑफलाइन", hi: "ऑफलाइन" },
    { en: "14-Day Drought & Storage Risk Map", mr: "१४ दिवसांचा दुष्काळ व पाणी साठा जोखीम नकाशा", hi: "14 दिवसीय सूखा व जल भंडारण जोखिम मानचित्र" },
    { en: "Regional Hydrological Depletion Map", mr: "प्रादेशिक जल उपसा व तुटवडा नकाशा", hi: "क्षेत्रीय जल ह्रास मानचित्र" },
    { en: "Ranked Scarcity Priority List", mr: "टंचाई प्राधान्यक्रम यादी", hi: "किल्लत प्राथमिकता सूची" },
    { en: "Estimated Usable Water Storage Horizon", mr: "अंदाजित उपयुक्त पाणी साठा कालावधी", hi: "अनुमानित उपयोगी जल भंडारण अवधि" },
    { en: "14-Day Hydrological Depletion Projection", mr: "१४ दिवसांचा जलपातळी घसरण अंदाज", hi: "14 दिवसीय जल ह्रास प्रक्षेपण" },
    { en: "Water Depletion Index (WDI)", mr: "जल तुटवडा निर्देशांक (WDI)", hi: "जल ह्रास सूचकांक (WDI)" },
    { en: "Allocate Relief", mr: "पाणी मदत वाटप", hi: "राहत जल आवंटन" },
    { en: "Critical Risk", mr: "गंभीर जोखीम", hi: "गंभीर जोखिम" },
    { en: "Moderate Watch", mr: "मध्यम खबरदारी", hi: "मध्यम सतर्कता" },
    { en: "Stable Reserves", mr: "स्थिर पाणीसाठा", hi: "स्थिर जल भंडार" },
    { en: "Inspect 14-Day Forecast", mr: "१४ दिवसांचा अंदाज पहा", hi: "14 दिवसीय पूर्वानुमान देखें" },
    {
      en: "This tool supports local authorities and does not replace water-quality testing.",
      mr: "हे साधन स्थानिक प्रशासनाला सहकार्य करण्यासाठी असून ते पाणी गुणवत्ता चाचणीचा पर्याय नाही.",
      hi: "यह उपकरण स्थानीय प्रशासन की सहायता के लिए है और पानी की गुणवत्ता परीक्षण का विकल्प नहीं है।"
    }
  ];

  // Build indexed lookup maps using clean normalized whitespace
  function normalizeText(str) {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  }

  const PHRASE_MAP = new Map();
  PHRASE_PAIRS.forEach((item) => {
    ["en", "mr", "hi"].forEach((langKey) => {
      const srcText = item[langKey];
      if (srcText) {
        const norm = normalizeText(srcText);
        if (norm && !PHRASE_MAP.has(norm)) {
          PHRASE_MAP.set(norm, item);
        }
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 3. Core DOM Translation Execution
  // ----------------------------------------------------------------------------
  let isTranslating = false;

  function translateSingleText(rawText, targetLang) {
    if (!rawText) return rawText;
    const norm = normalizeText(rawText);
    if (!norm) return rawText;

    const entry = PHRASE_MAP.get(norm);
    if (entry && entry[targetLang]) {
      const leadingWs = rawText.match(/^\s*/)[0];
      const trailingWs = rawText.match(/\s*$/)[0];
      return leadingWs + entry[targetLang] + trailingWs;
    }
    return rawText;
  }

  function translateDOM(targetLang) {
    if (!["en", "mr", "hi"].includes(targetLang)) targetLang = "en";
    if (isTranslating) return;
    isTranslating = true;

    try {
      document.documentElement.lang = targetLang;

      // 1. Attribute-based translations: [data-i18n]
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (translations[targetLang] && translations[targetLang][key]) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = translations[targetLang][key];
          } else {
            const icon = el.querySelector(".material-symbols-outlined, svg, img, i");
            if (icon) {
              const iconHtml = icon.outerHTML;
              el.innerHTML = iconHtml + " " + translations[targetLang][key];
            } else {
              el.textContent = translations[targetLang][key];
            }
          }
        }
      });

      // 2. Attribute-based placeholders: [data-i18n-placeholder]
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[targetLang] && translations[targetLang][key]) {
          el.placeholder = translations[targetLang][key];
        }
      });

      // 3. Automatic text translation across elements
      const targetSelectors = "h1, h2, h3, h4, h5, h6, p, a, button, label, span, th, td, strong, small, option, .translatable";
      document.querySelectorAll(targetSelectors).forEach((el) => {
        if (el.closest("script, style, code, pre, #langSwitcher, .no-translate")) return;

        // If the element has no child HTML elements, translate textContent directly
        if (el.children.length === 0) {
          const original = el.textContent;
          const translated = translateSingleText(original, targetLang);
          if (translated !== original) {
            el.textContent = translated;
          }
        } else {
          // Translate direct text nodes only, leaving icon elements intact
          el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim().length > 1) {
              const origVal = node.nodeValue;
              const transVal = translateSingleText(origVal, targetLang);
              if (transVal !== origVal) {
                node.nodeValue = transVal;
              }
            }
          });
        }
      });

      // 4. Translate inputs placeholder if matching phrase
      document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((input) => {
        const ph = input.getAttribute("placeholder");
        if (ph) {
          const transPh = translateSingleText(ph, targetLang);
          if (transPh !== ph) {
            input.setAttribute("placeholder", transPh);
          }
        }
      });

      // 5. Sync all language dropdowns on the page
      const switchers = document.querySelectorAll("#langSwitcher, .lang-switcher, select[aria-label='Language Selector']");
      switchers.forEach((s) => {
        if (s.value !== targetLang) {
          s.value = targetLang;
        }
      });

    } catch (err) {
      console.warn("[JalSanchar I18n] Translation notice:", err);
    } finally {
      isTranslating = false;
    }
  }

  function setLanguage(lang) {
    if (!["en", "mr", "hi"].includes(lang)) lang = "en";
    try {
      localStorage.setItem("jalsanchar_lang", lang);
      localStorage.setItem("preferred_lang", lang);
      localStorage.setItem("jalsanjeevani_lang", lang);
    } catch (e) {}

    translateDOM(lang);

    try {
      window.dispatchEvent(new CustomEvent("jalsanchar_lang_changed", { detail: { lang } }));
    } catch (e) {}
  }

  function getLanguage() {
    try {
      return (
        localStorage.getItem("jalsanchar_lang") ||
        localStorage.getItem("preferred_lang") ||
        localStorage.getItem("jalsanjeevani_lang") ||
        "en"
      );
    } catch (e) {
      return "en";
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Initialize and Bind Listeners
  // ----------------------------------------------------------------------------
  function initLanguageEngine() {
    const activeLang = getLanguage();

    const switchers = document.querySelectorAll("#langSwitcher, .lang-switcher, select[aria-label='Language Selector']");
    switchers.forEach((select) => {
      select.value = activeLang;
      select.addEventListener("change", (e) => {
        setLanguage(e.target.value);
      });
    });

    translateDOM(activeLang);

    // MutationObserver to translate dynamically loaded tables, cards, etc.
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        translateDOM(getLanguage());
      }, 150);
    });

    const mainContainer = document.querySelector("main") || document.body;
    if (mainContainer) {
      observer.observe(mainContainer, { childList: true, subtree: true });
    }
  }

  // Export to global window scope
  window.applyTranslation = setLanguage;
  window.setLanguage = setLanguage;
  window.getLanguage = getLanguage;
  window.translations = translations;
  window.JalI18n = {
    get: function (key, lang, params = {}) {
      const cur = lang || getLanguage();
      const dict = translations[cur] || translations.en;
      let val = dict[key] || translations.en[key] || key;
      for (const [pk, pv] of Object.entries(params)) {
        val = val.replace(`{${pk}}`, pv);
      }
      return val;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageEngine);
  } else {
    initLanguageEngine();
  }

})(window, document);
