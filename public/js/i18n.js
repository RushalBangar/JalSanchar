/**
 * JalSanchar V2 - Multilingual Localization Extension
 * Extends existing translations (English, Marathi, Hindi) without replacing lang.js.
 */

(function (window) {
  "use strict";

  const v2Translations = {
    en: {
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
      v2_reading_help_well: "Distance from ground to water level (meters)",
      v2_reading_help_tank: "Water height from tank base (meters)",
      v2_reading_help_lake: "Gauge staff marker reading (meters)",
      v2_submit_reading: "Submit Measurement",
      v2_reading_success: "Reading recorded and verified successfully!",
      v2_reading_offline: "Device offline: reading saved locally and will auto-sync.",
      v2_disclaimer: "This tool supports local authorities and does not replace water-quality testing.",
      v2_risk_high: "Critical Deficit Risk",
      v2_risk_medium: "Moderate Watch",
      v2_risk_low: "Stable Storage",
      v2_state_offline: "Operating in Offline Mode (Cached Data)",
      v2_state_stale: "Last updated {days} days ago",
      v2_state_loading: "Calculating hydrological balance...",
      v2_state_error: "Unable to retrieve village status. Tap to retry."
    },
    mr: {
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
      v2_reading_help_well: "जमिनीपासून पाण्याच्या पातळीची खोली (मीटर)",
      v2_reading_help_tank: "टाकीच्या तळापासून पाण्याची उंची (मीटर)",
      v2_reading_help_lake: "गेज पट्टीवरील पाण्याची पातळी (मीटर)",
      v2_submit_reading: "नोंदणी सबमिट करा",
      v2_reading_success: "जल पातळीची नोंद यशस्वीरित्या झाली!",
      v2_reading_offline: "इंटरनेट नाही: नोंद फोनमध्ये सुरक्षित असून नेटवर्क आल्यावर आपोआप पाठवली जाईल.",
      v2_disclaimer: "हे साधन स्थानिक प्रशासनाला सहकार्य करण्यासाठी असून ते पाणी गुणवत्ता चाचणीचा पर्याय नाही.",
      v2_risk_high: "अत्यंत तीव्र टंचाई धोका",
      v2_risk_medium: "मध्यम खबरदारी",
      v2_risk_low: "समाधानकारक साठा",
      v2_state_offline: "ऑफलाइन मोड सुरू आहे (स्थानिक माहिती)",
      v2_state_stale: "शेवटचे अपडेट {days} दिवसांपूर्वी",
      v2_state_loading: "जलसाठ्याची गणना होत आहे...",
      v2_state_error: "माहिती लोड करता आली नाही. पुन्हा प्रयत्न करा."
    },
    hi: {
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
      v2_reading_help_well: "जमीन से जल स्तर की गहराई (मीटर)",
      v2_reading_help_tank: "टंकी के तल से पानी की ऊंचाई (मीटर)",
      v2_reading_help_lake: "गेज पैमाने की रीडिंग (मीटर)",
      v2_submit_reading: "रीडिंग सबमिट करें",
      v2_reading_success: "जल स्तर सफलतापूर्वक दर्ज हो गया!",
      v2_reading_offline: "डिवाइस ऑफलाइन है: रीडिंग सुरक्षित है और नेटवर्क मिलने पर सिंक होगी।",
      v2_disclaimer: "यह उपकरण स्थानीय प्रशासन की सहायता के लिए है और पानी की गुणवत्ता परीक्षण का विकल्प नहीं है।",
      v2_risk_high: "गंभीर जल संकट जोखिम",
      v2_risk_medium: "मध्यम सतर्कता",
      v2_risk_low: "स्थिर भंडार",
      v2_state_offline: "ऑफलाइन मोड सक्रिय (कैश्ड डेटा)",
      v2_state_stale: "अंतिम अपडेट {days} दिन पहले",
      v2_state_loading: "जल संतुलन गणना जारी है...",
      v2_state_error: "जानकारी लोड नहीं हो सकी। पुनः प्रयास करें।"
    }
  };

  // Merge into window.translations if existing from lang.js
  if (typeof window.translations !== "undefined") {
    for (const l of ["en", "mr", "hi"]) {
      if (window.translations[l] && v2Translations[l]) {
        Object.assign(window.translations[l], v2Translations[l]);
      }
    }
  } else {
    window.translations = v2Translations;
  }

  const JalI18n = {
    get(key, lang = "en", params = {}) {
      const currentLang = lang || localStorage.getItem("preferred_lang") || "mr";
      const dict = (window.translations && window.translations[currentLang]) || v2Translations[currentLang] || v2Translations.en;
      let text = dict[key] || v2Translations.en[key] || key;
      for (const [pKey, pVal] of Object.entries(params)) {
        text = text.replace(`{${pKey}}`, pVal);
      }
      return text;
    }
  };

  window.JalI18n = JalI18n;
})(window);
