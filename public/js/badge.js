/**
 * JalSanchar V2 - Data Quality & Provenance Badge System
 * Rule: Every number in the UI MUST carry a data-quality badge:
 * [Satellite | Manual | Metered | Estimated | Simulated]
 */

(function (window) {
  "use strict";

  const BADGE_CONFIG = {
    Metered: {
      label: "Metered",
      marathi: "मीटर मोजलेले",
      hindi: "मीटर से मापा गया",
      icon: "activity",
      classes: "bg-[#E8F8F5] text-[#148F77] border-[#A2D9CE]",
      tooltip: "Direct telemetry from calibrated electromagnetic/ultrasonic meter."
    },
    Manual: {
      label: "Manual",
      marathi: "प्रत्यक्ष मोजणी",
      hindi: "मैन्युअल माप",
      icon: "user-check",
      classes: "bg-[#EBF5FB] text-[#1A5276] border-[#AED6F1]",
      tooltip: "Ground-truth physical reading verified by Gram Panchayat staff."
    },
    Satellite: {
      label: "Satellite",
      marathi: "उपग्रह निरीक्षण",
      hindi: "उपग्रह अवलोकन",
      icon: "satellite",
      classes: "bg-[#F4ECF7] text-[#8E44AD] border-[#D2B4DE]",
      tooltip: "Derived from NASA SMAP / Sentinel-2 radar & optical telemetry."
    },
    Estimated: {
      label: "Estimated",
      marathi: "अंदाजित",
      hindi: "अनुमानित",
      icon: "help-circle",
      classes: "bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]",
      tooltip: "Hydrological mathematical model estimation from historical trends."
    },
    Simulated: {
      label: "Simulated",
      marathi: "सिम्युलेटेड (नमुना)",
      hindi: "सिम्युलेटेड (डेमो)",
      icon: "cpu",
      classes: "bg-[#FDEDEC] text-[#C0392B] border-[#FADBD8]",
      tooltip: "Simulated test baseline for offline or demonstration validation."
    }
  };

  const JalBadge = {
    /**
     * Renders an HTML badge string for a data quality type.
     * @param {string} quality - 'Metered' | 'Manual' | 'Satellite' | 'Estimated' | 'Simulated'
     * @param {string} [lang='en'] - 'en' | 'mr' | 'hi'
     * @returns {string} Safe HTML string for badge element
     */
    render(quality, lang = "en") {
      const q = quality || "Estimated";
      const config = BADGE_CONFIG[q] || BADGE_CONFIG.Estimated;
      const text = lang === "mr" ? config.marathi : (lang === "hi" ? config.hindi : config.label);

      return `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.classes} shadow-xs" title="${config.tooltip}">
          <i data-lucide="${config.icon}" class="w-3 h-3"></i>
          <span>${text}</span>
        </span>
      `.trim();
    },

    /**
     * Returns tooltip description for given quality tag.
     */
    getTooltip(quality) {
      return (BADGE_CONFIG[quality] || BADGE_CONFIG.Estimated).tooltip;
    }
  };

  window.JalBadge = JalBadge;
})(window);
