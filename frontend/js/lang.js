/**
 * JalSanchar — Universal Multilingual Localization Engine (V1 + V2)
 * Supports English (en), Marathi (mr), and Hindi (hi).
 * Works across ALL pages via:
 *   1. Key-based translations ([data-i18n], [data-i18n-placeholder])
 *   2. Automatic phrase dictionary translation for DOM text nodes
 *   3. Synced localStorage ('jalsanchar_lang') & #langSwitcher across pages
 */

(function (window, document) {
  "use strict";

  // ----------------------------------------------------------------------------
  // 1. Key-Based Translation Dictionaries
  // ----------------------------------------------------------------------------
  const translations = {
    en: {
      // Global Navigation & Common
      nav_brand: "JalSanchar (जलसंचार)",
      nav_pillars: "How It Works",
      nav_features: "Features",
      nav_portals: "Portals & Roles",
      nav_panchayat: "Panchayat Portal",
      nav_faq: "FAQ",
      nav_login: "Portal Login",
      nav_signout: "Sign Out",
      nav_dashboard: "Command Center",
      nav_tracker: "Track Tanker",
      nav_village: "Village Water",
      nav_pipelines: "Pipelines Monitor",
      nav_sources: "Sources Portal",
      topbar_title: "JalSanchar • Rural Drought Water Supply & Tanker Telemetry Grid",
      topbar_sector: "Ahilyanagar & Sinnar Pilot Sector",
      topbar_text_size: "Text:",
      topbar_skip: "Skip to Content",

      // Landing / Hero
      hero_title: "Guaranteed Clean Water For Every Drought-Hit Village",
      hero_desc: "JalSanchar tracks rural water tankers using GPS telemetry and dual QR verification to prevent diversion and ensure rural families get their fair share of clean drinking water.",
      hero_badge: "SMART WATER SUPPLY CHAIN (जलसंचार)",
      hero_quota_badge: "Daily Water Relief Quota",
      hero_quota_desc: "Ensuring 40L per person & 70L per livestock daily minimum across drought-hit hamlets.",
      nav_tech: "Technology",
      nav_telemetry: "Live Tanker Map",
      nav_audit: "Delivery Records",
      nav_impact: "Deployment",
      hero_btn_discover: "Explore Platform Portals",
      hero_btn_access: "View Water Dashboard",
      pillars_title: "How JalSanchar Solves the Water Crisis",
      pillar1_title: "1. Early Water Shortage Warning",
      pillar1_desc: "Using weather and satellite data, we predict which village wells will run dry up to 14 days in advance, so water tankers are sent before taps run completely dry.",
      pillar2_title: "2. Stop Water Theft & Diversion",
      pillar2_desc: "Stop private resale of public water. Tanker drivers must scan a QR code at the village water tank with local panchayat officials to confirm delivery before payment is released.",
      pillar3_title: "3. Fair Daily Water For Everyone",
      pillar3_desc: "Smart route planning ensures fast and fair distribution, guaranteeing at least 40 liters daily for every person and 70 liters for cattle, without missing remote hamlets.",
      stat_depleted: "Villages Needing Water",
      stat_warning: "Villages on Low Water",
      stat_human: "People: 40L Daily",
      stat_cattle: "Cattle: 70L Daily",
      btn_dispatch: "Send Emergency Water Tanker",
      btn_freeze: "Hold Contractor Payment",
      audit_title: "Water Delivery Audit Records",

      // Login & Auth
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

      // V2 Subsystems
      v2_village_water_title: "Village Water Intelligence",
      v2_village_water_subtitle: "Storage calculations, live telemetry & 14-day drought predictions",
      v2_days_left_title: "Days of Usable Water Remaining",
      v2_water_depletion_forecast: "14-Day Hydrological Depletion Forecast",
      v2_source_cards_title: "Village Water Sources (Wells, Tanks & Lakes)",
      v2_source_type_well: "Community Open Well",
      v2_source_type_tank: "Storage Reservoir (ESR/GLSR)",
      v2_source_type_lake: "Percolation Lake / Pond",
      v2_water_level: "Water Level",
      v2_usable_capacity: "Usable Volume",
      v2_daily_demand: "Statutory Daily Demand",
      v2_pop_stat: "Human Quota (40L/person)",
      v2_cattle_stat: "Cattle Quota (70L/head)",
      v2_enter_reading: "Record Field Reading",
      v2_register_source: "Register New Water Source",
      v2_reading_value_label: "Measurement Value",
      v2_submit_reading: "Submit Measurement",
      v2_disclaimer: "This tool supports local authorities and does not replace water-quality testing."
    },

    mr: {
      // Global Navigation & Common
      nav_brand: "जलसंचार (JalSanchar)",
      nav_pillars: "कार्यपद्धती",
      nav_features: "वैशिष्ट्ये",
      nav_portals: "पोर्टल आणि भूमिका",
      nav_panchayat: "ग्रामपंचायत पोर्टल",
      nav_faq: "नेहमी विचारले जाणारे प्रश्न",
      nav_login: "पोर्टल लॉगिन",
      nav_signout: "बाहेर पडा",
      nav_dashboard: "नियंत्रण कक्ष",
      nav_tracker: "टँकर ट्रॅक करा",
      nav_village: "ग्राम जलस्थिती",
      nav_pipelines: "पाईपलाईन मॉनिटर",
      nav_sources: "जलस्रोत नोंदणी",
      topbar_title: "जलसंचार • ग्रामीण दुष्काळ पाणी पुरवठा व टँकर ट्रॅकिंग प्रणाली",
      topbar_sector: "अहिल्यानगर व सिन्नर विभाग",
      topbar_text_size: "अक्षर:",
      topbar_skip: "मुख्य भागाकडे जा",

      // Landing / Hero
      hero_title: "दुष्काळग्रस्त प्रत्येक गावाला हक्काचे पिण्याचे पाणी",
      hero_desc: "जलसंचार जीपीएस ट्रॅकिंग आणि क्यूआर कोडद्वारे टँकरच्या पाण्याची चोरी रोखते आणि प्रत्येक दुष्काळग्रस्त गावाला वेळेवर पाणी मिळण्याची खात्री करते.",
      hero_badge: "स्मार्ट पाणी पुरवठा साखळी (जलसंचार)",
      hero_quota_badge: "दैनिक हक्काचे पाणी प्रमाण",
      hero_quota_desc: "दुष्काळग्रस्त गावांसाठी दररोज प्रति व्यक्ती किमान ४० लिटर आणि जनावरांसाठी ७० लिटर पाण्याचे वाटप.",
      nav_tech: "तंत्रज्ञान",
      nav_telemetry: "थेट टँकर नकाशा",
      nav_audit: "पाणीवाटप नोंदी",
      nav_impact: "प्रकल्प विस्तार",
      hero_btn_discover: "सर्व पोर्टल पहा",
      hero_btn_access: "पाणी डॅशबोर्ड उघडा",
      pillars_title: "पाणीटंचाईवर जलसंचारचे ३ सोपे उपाय",
      pillar1_title: "१. दुष्काळाची आगाऊ पूर्वसूचना",
      pillar1_desc: "हवामान आणि सॅटेलाइट डेटावरून गावातील विहिरी पुढील १४ दिवसांत कोरड्या पडण्याचा अंदाज येतो, ज्यामुळे नळांना पाणी येणे बंद होण्यापूर्वीच टँकर पाठवले जातात.",
      pillar2_title: "२. टँकर पाणी चोरीला पूर्ण आळा",
      pillar2_desc: "टँकरमधील पाण्याची खासगी विक्री रोखणे. गावातील पाण्याच्या टाकीजवळ ग्रामपंचायत अधिकाऱ्यासमोर क्यूआर कोड स्कॅन केल्याशिवाय कंत्राटदाराचे बिल पास होत नाही.",
      pillar3_title: "३. प्रत्येक नागरिकाला पुरेसे पाणी",
      pillar3_desc: "स्मार्ट मार्ग नियोजनामुळे प्रत्येक माणसाला दररोज किमान ४० लिटर आणि जनावरांसाठी ७० लिटर पाणी वेळेवर मिळते. कोणतीही लहान वाडी किंवा वस्ती सुटत नाही.",
      stat_depleted: "पाण्याची तातडीची गरज",
      stat_warning: "पाणी कमी होत असलेली गावे",
      stat_human: "माणसांसाठी: दररोज ४० लिटर",
      stat_cattle: "जनावरांसाठी: दररोज ७० लिटर",
      btn_dispatch: "आपत्कालीन टँकर रवाना करा",
      btn_freeze: "कंत्राटदाराचे बिल रोखा",
      audit_title: "पाणीवाटप तपासणी नोंदी",

      // Login & Auth
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

      // V2 Subsystems
      v2_village_water_title: "ग्राम जलस्थिती माहिती फलक",
      v2_village_water_subtitle: "पाणी साठा गणित, भूजल स्थिती व १४ दिवसांचे टंचाई अंदाज",
      v2_days_left_title: "उपलब्ध पाणी साठा (दिवसांची श्रेणी)",
      v2_water_depletion_forecast: "१४ दिवसांचा जलसाठा अंदाज आलेख",
      v2_source_cards_title: "गावातील जलस्रोत (विहिरी, टाक्या व तलाव)",
      v2_source_type_well: "सार्वजनिक खुली विहीर",
      v2_source_type_tank: "पाण्याची टाकी (ESR / GLSR)",
      v2_source_type_lake: "पाझर तलाव / बंधारा",
      v2_water_level: "पाण्याची पातळी",
      v2_usable_capacity: "उपयुक्त पाणी साठा",
      v2_daily_demand: "दैनिक वैधानिक पाण्याची गरज",
      v2_pop_stat: "लोकसंख्या कोटा (४० लि/व्यक्ती)",
      v2_cattle_stat: "पशुधन कोटा (७० लि/जनावर)",
      v2_enter_reading: "नवीन नोंदणी करा",
      v2_register_source: "नवीन जलस्रोत नोंदणी",
      v2_reading_value_label: "मापन संख्या (मीटरमध्ये)",
      v2_submit_reading: "नोंदणी सबमिट करा",
      v2_disclaimer: "हे साधन स्थानिक प्रशासनाला सहकार्य करण्यासाठी असून ते पाणी गुणवत्ता चाचणीचा पर्याय नाही."
    },

    hi: {
      // Global Navigation & Common
      nav_brand: "जलसंचार (JalSanchar)",
      nav_pillars: "कार्यप्रणाली",
      nav_features: "विशेषताएं",
      nav_portals: "पोर्टल और भूमिकाएं",
      nav_panchayat: "ग्राम पंचायत पोर्टल",
      nav_faq: "अक्सर पूछे जाने वाले प्रश्न",
      nav_login: "पोर्टल लॉगिन",
      nav_signout: "लॉग आउट",
      nav_dashboard: "कमांड सेंटर",
      nav_tracker: "टैंकर ट्रैक करें",
      nav_village: "ग्राम जल स्थिति",
      nav_pipelines: "पाइपलाइन निगरानी",
      nav_sources: "जलस्रोत पंजीकरण",
      topbar_title: "जलसंचार • ग्रामीण सूखा जल आपूर्ति एवं टैंकर टेलीमेट्री ग्रिड",
      topbar_sector: "अहिल्यानगर व सिन्नर पायलट सेक्टर",
      topbar_text_size: "अक्षर:",
      topbar_skip: "मुख्य भाग पर जाएं",

      // Landing / Hero
      hero_title: "सूखा प्रभावित हर गाँव के लिए स्वच्छ जल की गारंटी",
      hero_desc: "जलसंचार जीपीएस टेलीमेट्री और दोहरे क्यूआर सत्यापन से टैंकर के पानी की चोरी रोकता है और ग्रामीण परिवारों को उनके हक का पानी दिलाता है।",
      hero_badge: "स्मार्ट जल आपूर्ति श्रृंखला (जलसंचार)",
      hero_quota_badge: "दैनिक जल राहत कोटा",
      hero_quota_desc: "सूखा प्रभावित बस्तियों में प्रति व्यक्ति 40L और मवेशी 70L न्यूनतम दैनिक जल सुनिश्चित करना।",
      nav_tech: "तकनीक",
      nav_telemetry: "लाइव टैंकर मैप",
      nav_audit: "वितरण रिकॉर्ड",
      nav_impact: "तैनाती",
      hero_btn_discover: "सभी पोर्टल देखें",
      hero_btn_access: "जल डैशबोर्ड खोलें",
      pillars_title: "जल संकट पर जलसंचार के 3 समाधान",
      pillar1_title: "1. जल संकट की पूर्व चेतावनी",
      pillar1_desc: "मौसम और उपग्रह डेटा से हम 14 दिन पहले बता देते हैं कि किस गाँव का कुआं सूखेगा, ताकि पानी खत्म होने से पहले टैंकर पहुंचे।",
      pillar2_title: "2. पानी की चोरी और कालाबाज़ारी पर रोक",
      pillar2_desc: "टैंकर पानी की अवैध बिक्री रोकें। गाँव की पानी की टंकी पर ग्राम पंचायत प्रतिनिधि के सामने क्यूआर कोड स्कैन किए बिना टैंकर का भुगतान नहीं होगा।",
      pillar3_title: "3. हर व्यक्ति को बराबर पानी",
      pillar3_desc: "स्मार्ट रूट प्लानिंग से हर इंसान को 40 लीटर और मवेशियों को 70 लीटर पानी रोज मिलना तय होता है, जिससे कोई भी दूरदराज की बस्ती छूटती नहीं है।",
      stat_depleted: "पानी की सख्त जरूरत वाले गाँव",
      stat_warning: "कम पानी वाले गाँव",
      stat_human: "प्रति व्यक्ति: 40 लीटर रोज",
      stat_cattle: "प्रति मवेशी: 70 लीटर रोज",
      btn_dispatch: "आपातकालीन टैंकर भेजें",
      btn_freeze: "ठेकेदार का भुगतान रोकें",
      audit_title: "जल वितरण सत्यापन रिकॉर्ड",

      // Login & Auth
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

      // V2 Subsystems
      v2_village_water_title: "ग्राम जल स्थिति डैशबोर्ड",
      v2_village_water_subtitle: "जल संचय गणना, भूजल स्थिति और 14 दिनों का सूखा पूर्वानुमान",
      v2_days_left_title: "उपलब्ध जल भंडार (दिनों की सीमा)",
      v2_water_depletion_forecast: "14 दिनों का जल स्तर पूर्वानुमान",
      v2_source_cards_title: "गांव के जलस्रोत (कुएं, टंकियां और तालाब)",
      v2_source_type_well: "सार्वजनिक खुला कुआं",
      v2_source_type_tank: "पानी की टंकी (ESR / GLSR)",
      v2_source_type_lake: "तालाब / जल संचय जलाशय",
      v2_water_level: "जल स्तर",
      v2_usable_capacity: "उपयोगी जल क्षमता",
      v2_daily_demand: "दैनिक वैधानिक जल मांग",
      v2_pop_stat: "नागरिक कोटा (40 ली/व्यक्ति)",
      v2_cattle_stat: "पशुधन कोटा (70 ली/पशु)",
      v2_enter_reading: "जल स्तर दर्ज करें",
      v2_register_source: "नया जलस्रोत पंजीकृत करें",
      v2_reading_value_label: "माप संख्या (मीटर में)",
      v2_submit_reading: "रीडिंग सबमिट करें",
      v2_disclaimer: "यह उपकरण स्थानीय प्रशासन की सहायता के लिए है और पानी की गुणवत्ता परीक्षण का विकल्प नहीं है।"
    }
  };

  // ----------------------------------------------------------------------------
  // 2. Comprehensive Phrase Translation Dictionary (Matches full UI strings)
  // ----------------------------------------------------------------------------
  const PHRASE_PAIRS = [
    // Navbar & Common Buttons
    { en: "Portal Login", mr: "पोर्टल लॉगिन", hi: "पोर्टल लॉगिन" },
    { en: "Sign Out", mr: "बाहेर पडा", hi: "लॉग आउट" },
    { en: "Command Center", mr: "नियंत्रण कक्ष", hi: "कमांड सेंटर" },
    { en: "How It Works", mr: "कार्यपद्धती", hi: "कार्यप्रणाली" },
    { en: "Portals", mr: "पोर्टल्स", hi: "पोर्टल" },
    { en: "Audit Ledger", mr: "ऑडिट लेजर", hi: "ऑडिट लेजर" },
    { en: "Track Tanker", mr: "टँकर ट्रॅक करा", hi: "टैंकर ट्रैक करें" },
    { en: "Village Water", mr: "ग्राम जलस्थिती", hi: "ग्राम जल स्थिति" },
    { en: "Pipelines Monitor", mr: "पाईपलाईन मॉनिटर", hi: "पाइपलाइन निगरानी" },
    { en: "Sources Portal", mr: "जलस्रोत नोंदणी", hi: "जलस्रोत पंजीकरण" },
    { en: "Back to Home", mr: "मुख्य पानावर परत", hi: "मुख्य पृष्ठ पर वापस" },
    { en: "Refresh", mr: "रिफ्रेश करा", hi: "रिफ्रेश करें" },
    { en: "Close", mr: "बंद करा", hi: "बंद करें" },
    { en: "Cancel", mr: "रद्द करा", hi: "रद्द करें" },
    { en: "Save", mr: "जतन करा", hi: "सहेजें" },
    { en: "Submit", mr: "सबमिट करा", hi: "सबमिट करें" },
    { en: "Online", mr: "ऑनलाइन", hi: "ऑनलाइन" },
    { en: "Offline", mr: "ऑफलाइन", hi: "ऑफलाइन" },
    { en: "Live", mr: "थेट (LIVE)", hi: "लाइव (LIVE)" },

    // Landing / Hero
    { en: "Guaranteed Clean Water For Every Drought-Hit Village", mr: "दुष्काळग्रस्त प्रत्येक गावाला हक्काचे पिण्याचे पाणी", hi: "सूखा प्रभावित हर गाँव के लिए स्वच्छ जल की गारंटी" },
    { en: "Explore Platform Portals", mr: "सर्व पोर्टल पहा", hi: "सभी पोर्टल देखें" },
    { en: "View Water Dashboard", mr: "पाणी डॅशबोर्ड उघडा", hi: "जल डैशबोर्ड खोलें" },
    { en: "Daily Water Relief Quota", mr: "दैनिक हक्काचे पाणी प्रमाण", hi: "दैनिक जल राहत कोटा" },
    { en: "How JalSanchar Solves the Water Crisis", mr: "पाणीटंचाईवर जलसंचारचे ३ सोपे उपाय", hi: "जल संकट पर जलसंचार के 3 समाधान" },
    { en: "1. Early Water Shortage Warning", mr: "१. दुष्काळाची आगाऊ पूर्वसूचना", hi: "1. जल संकट की पूर्व चेतावनी" },
    { en: "2. Stop Water Theft & Diversion", mr: "२. टँकर पाणी चोरीला पूर्ण आळा", hi: "2. पानी की चोरी और कालाबाज़ारी पर रोक" },
    { en: "3. Fair Daily Water For Everyone", mr: "३. प्रत्येक नागरिकाला पुरेसे पाणी", hi: "3. हर व्यक्ति को बराबर पानी" },
    { en: "Send Emergency Water Tanker", mr: "आपत्कालीन टँकर रवाना करा", hi: "आपातकालीन टैंकर भेजें" },
    { en: "Hold Contractor Payment", mr: "कंत्राटदाराचे बिल रोखा", hi: "ठेकेदार का भुगतान रोकें" },
    { en: "Water Delivery Audit Records", mr: "पाणीवाटप तपासणी नोंदी", hi: "जल वितरण सत्यापन रिकॉर्ड" },
    { en: "Official Briefing & Deployment Overview", mr: "अधिकृत माहिती व प्रकल्प सादरीकरण", hi: "आधिकारिक ब्रीफिंग एवं परियोजना विवरण" },

    // Dashboard & Roles
    { en: "District Collector", mr: "जिल्हाधिकारी", hi: "ज़िलाधिकारी" },
    { en: "Tanker Driver", mr: "टँकर चालक", hi: "टैंकर चालक" },
    { en: "Gram Panchayat", mr: "ग्रामपंचायत", hi: "ग्राम पंचायत" },
    { en: "Water Map & Monitoring", mr: "जल नकाशा व थेट देखरेख", hi: "जल मैप व निगरानी" },
    { en: "GPS Route & QR Code", mr: "जीपीएस मार्ग व क्यूआर कोड", hi: "जीपीएस रूट व क्यूआर कोड" },
    { en: "Village Tank & QR Scanner", mr: "गावाची टाकी व क्यूआर स्कॅनर", hi: "गाँव की पानी की टंकी व क्यूआर स्कैनर" },
    { en: "Active Tankers", mr: "सक्रिय टँकर्स", hi: "सक्रिय टैंकर" },
    { en: "Critical Depletions", mr: "अतिटंचाई गावे", hi: "अति-संकटग्रस्त गाँव" },
    { en: "Escrow Frozen", mr: "रोखलेले पेमेंट्स", hi: "रोके गए भुगतान" },
    { en: "Compliance Rate", mr: "नियम पूर्तता दर", hi: "अनुपालन दर" },
    { en: "Water Allocation Matrix", mr: "पाणी वाटप मॅट्रिक्स", hi: "जल आवंटन मैट्रिक्स" },
    { en: "Emergency Dispatch", mr: "आपत्कालीन रवानगी", hi: "आपातकालीन प्रेषण" },
    { en: "Cistern Level", mr: "टाकीतील पाणी पातळी", hi: "टंकी का जल स्तर" },

    // Quality Badges
    { en: "Metered", mr: "मीटर मोजणी", hi: "मीटर रीडिंग" },
    { en: "Manual", mr: "मॅन्युअल नोंद", hi: "मैनुअल प्रविष्टि" },
    { en: "Satellite", mr: "उपग्रह डेटा", hi: "उपग्रह डेटा" },
    { en: "Estimated", mr: "अंदाजित", hi: "अनुमानित" },
    { en: "Simulated", mr: "सिम्युलेटेड (चाचणी)", hi: "सिम्युलेटेड (परीक्षण)" },

    // Status Badges
    { en: "Normal", mr: "सर्वसाधारण", hi: "सामान्य" },
    { en: "Watch", mr: "खबरदारी", hi: "सतर्कता" },
    { en: "Inspect", mr: "तातडीची तपासणी", hi: "तुरंत निरीक्षण" },
    { en: "Critical", mr: "गंभीर टंचाई", hi: "गंभीर संकट" },
    { en: "Stable", mr: "स्थिर", hi: "स्थिर" },
    { en: "Moderate", mr: "मध्यम", hi: "मध्यम" },
    { en: "En Route to Village", mr: "गावाकडे मार्गस्थ", hi: "गाँव के रास्ते में" },
    { en: "Dispatched from Depot", mr: "डेपोतून रवाना", hi: "डिपो से रवाना" },
    { en: "Delivery Complete", mr: "वितरण पूर्ण", hi: "वितरण पूर्ण" },

    // Village Water Page
    { en: "Village Water Intelligence", mr: "ग्राम जलस्थिती माहिती फलक", hi: "ग्राम जल स्थिति डैशबोर्ड" },
    { en: "Days of Usable Water Remaining", mr: "उपलब्ध पाणी साठा (दिवसांची श्रेणी)", hi: "उपलब्ध जल भंडार (दिनों की सीमा)" },
    { en: "14-Day Hydrological Depletion Forecast", mr: "१४ दिवसांचा जलसाठा अंदाज आलेख", hi: "14 दिनों का जल स्तर पूर्वानुमान" },
    { en: "Village Water Sources (Wells, Tanks & Lakes)", mr: "गावातील जलस्रोत (विहिरी, टाक्या व तलाव)", hi: "गांव के जलस्रोत (कुएं, टंकियां और तालाब)" },
    { en: "Statutory Daily Demand", mr: "दैनिक वैधानिक पाण्याची गरज", hi: "दैनिक वैधानिक जल मांग" },
    { en: "Human Quota (40L/person)", mr: "लोकसंख्या कोटा (४० लि/व्यक्ती)", hi: "नागरिक कोटा (40 ली/व्यक्ति)" },
    { en: "Cattle Quota (70L/head)", mr: "पशुधन कोटा (७० लि/जनावर)", hi: "पशुधन कोटा (70 ली/पशु)" },
    { en: "Community Open Well", mr: "सार्वजनिक खुली विहीर", hi: "सार्वजनिक खुला कुआं" },
    { en: "Storage Reservoir (ESR/GLSR)", mr: "पाण्याची टाकी (ESR / GLSR)", hi: "पानी की टंकी (ESR / GLSR)" },
    { en: "Percolation Lake / Pond", mr: "पाझर तलाव / बंधारा", hi: "तालाब / जल संचय जलाशय" },

    // Public Tanker Tracker
    { en: "Citizen Water Tanker Transparency Tracker", mr: "नागरिक पाणी टँकर पारदर्शकता पोर्टल", hi: "नागरिक जल टैंकर पारदर्शिता पोर्टल" },
    { en: "Select District", mr: "जिल्हा निवडा", hi: "ज़िला चुनें" },
    { en: "Select Taluka", mr: "तालुका निवडा", hi: "तालुका चुनें" },
    { en: "Select Village", mr: "गाव निवडा", hi: "गाँव चुनें" },
    { en: "All Districts", mr: "सर्व जिल्हे", hi: "सभी ज़िले" },
    { en: "All Talukas", mr: "सर्व तालुके", hi: "सभी तालुका" },
    { en: "All Villages", mr: "सर्व गावे", hi: "सभी गाँव" },
    { en: "Filter Dispatches", mr: "टँकर फेऱ्या शोधा", hi: "टैंकर प्रेषण खोजें" },
    { en: "Vehicle Registration", mr: "वाहन नोंदणी क्र.", hi: "वाहन पंजीकरण संख्या" },
    { en: "Tanker ID", mr: "टँकर क्रमांक", hi: "टैंकर आईडी" },
    { en: "Estimated Arrival (ETA)", mr: "अपेक्षित आगमन वेळ (ETA)", hi: "अनुमानित आगमन (ETA)" },
    { en: "Last Verified Delivery", mr: "शेवटची पडताळणी पावती", hi: "अंतिम सत्यापित वितरण" },
    { en: "View Village Water Status", mr: "गावाची जलस्थिती पहा", hi: "गाँव की जल स्थिति देखें" },
    { en: "Citizen Privacy Guarantee", mr: "नागरिक गोपनीयता हमी", hi: "नागरिक गोपनीयता गारंटी" },

    // Pipelines Monitor
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

    // Statutory Disclaimers
    {
      en: "This tool supports local authorities and does not replace water-quality testing.",
      mr: "हे साधन स्थानिक प्रशासनाला सहकार्य करण्यासाठी असून ते पाणी गुणवत्ता चाचणीचा पर्याय नाही.",
      hi: "यह उपकरण स्थानीय प्रशासन की सहायता के लिए है और पानी की गुणवत्ता परीक्षण का विकल्प नहीं है।"
    }
  ];

  // Build indexed lookup maps
  const PHRASE_MAP = new Map();
  PHRASE_PAIRS.forEach((item) => {
    ["en", "mr", "hi"].forEach((srcLang) => {
      const srcText = (item[srcLang] || "").trim();
      if (srcText && !PHRASE_MAP.has(srcText.toLowerCase())) {
        PHRASE_MAP.set(srcText.toLowerCase(), item);
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 3. Core Translation Functions
  // ----------------------------------------------------------------------------
  let isTranslating = false;

  function translateSingleText(rawText, targetLang) {
    if (!rawText) return rawText;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    const lower = trimmed.toLowerCase();
    const entry = PHRASE_MAP.get(lower);
    if (entry && entry[targetLang]) {
      // Preserve leading and trailing whitespace
      const leadingWs = rawText.match(/^\s*/)[0];
      const trailingWs = rawText.match(/\s*$/)[0];
      return leadingWs + entry[targetLang] + trailingWs;
    }
    return rawText;
  }

  function translateDOM(targetLang) {
    if (!translations[targetLang]) targetLang = "en";
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
        // Skip script, style, and code elements
        if (el.closest("script, style, code, pre, #langSwitcher, .no-translate")) return;

        // If the element contains ONLY text nodes, translate safely
        if (el.children.length === 0) {
          const original = el.textContent;
          const translated = translateSingleText(original, targetLang);
          if (translated !== original) {
            el.textContent = translated;
          }
        } else {
          // If element has mixed icon + text, only translate text nodes
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

      // 6. Sync language pill buttons if present (e.g. pipelines.html)
      document.querySelectorAll("[data-lang-btn], .lang-pill").forEach((btn) => {
        const bLang = btn.getAttribute("data-lang") || btn.innerText.trim().toLowerCase();
        if (bLang === targetLang) {
          btn.classList.add("bg-gov-navy", "text-white", "font-bold");
          btn.classList.remove("text-gov-slate", "bg-slate-100");
        } else if (["en", "mr", "hi"].includes(bLang)) {
          btn.classList.remove("bg-gov-navy", "text-white", "font-bold");
          btn.classList.add("text-gov-slate");
        }
      });

    } catch (err) {
      console.warn("[JalSanchar I18n] Translation notice:", err);
    } finally {
      isTranslating = false;
    }
  }

  function setLanguage(lang) {
    if (!["en", "mr", "hi"].includes(lang)) lang = "mr"; // Default Marathi for Sinnar/Ahilyanagar
    try {
      localStorage.setItem("jalsanchar_lang", lang);
      localStorage.setItem("preferred_lang", lang);
      localStorage.setItem("jalsanjeevani_lang", lang);
    } catch (e) {}

    translateDOM(lang);

    // Notify other components
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
        "mr" // Default Marathi for Maharashtra pilot
      );
    } catch (e) {
      return "mr";
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Initialize and Bind Listeners
  // ----------------------------------------------------------------------------
  function initLanguageEngine() {
    const activeLang = getLanguage();

    // Bind all select elements
    const switchers = document.querySelectorAll("#langSwitcher, .lang-switcher, select[aria-label='Language Selector']");
    switchers.forEach((select) => {
      select.value = activeLang;
      select.addEventListener("change", (e) => {
        setLanguage(e.target.value);
      });
    });

    // Bind any language toggle buttons
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-lang-btn");
        if (target) setLanguage(target);
      });
    });

    // Apply translation immediately
    translateDOM(activeLang);

    // Set up MutationObserver to re-translate dynamically added content (e.g. AJAX tables/cards)
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
