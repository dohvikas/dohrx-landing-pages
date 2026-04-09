// Helper: Get UTM parameters from URL
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    utm_term: params.get("utm_term") || null,
    utm_content: params.get("utm_content") || null,
  };
}

// Ensure trackEvent is globally accessible
window.trackEvent = function (eventName, eventData = {}) {
  try {
    const utmParams = getUTMParams();

    // Enhanced event data with GA4 + UTM parameters
    const enhancedData = {
      event: eventName,
      event_category: "engagement",
      event_label: eventData.label || eventName,
      page_title: document.title,
      page_location: window.location.href,

      // UTM parameters
      ...utmParams,

      // Custom event data (if any)
      ...eventData,
    };

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Push to GTM dataLayer
    window.dataLayer.push(enhancedData);
    console.log("Pushed to dataLayer:", enhancedData);

    // Direct GA4 fallback
    const gtagFunc = typeof gtag !== "undefined" ? gtag : (window.gtag || function () { });

    if (typeof gtagFunc === "function") {
      gtagFunc("event", eventName, {
        event_category: enhancedData.event_category,
        event_label: enhancedData.event_label,
        page_title: enhancedData.page_title,
        page_location: enhancedData.page_location,
        ...utmParams,
        ...eventData,
      });
      // console.log("Direct GA4 call:", eventName, enhancedData);
    }
  } catch (err) {
    console.error("trackEvent error:", err);
  }
};

// Initialize tracking
document.addEventListener("DOMContentLoaded", function () {
  console.log("Improved tracking script v11 loaded (Capture Mode)");

  // 1. Popup Open Tracking (Explicit Listener)
  const popupOpenBtns = document.querySelectorAll(".js-open-contact-modal");
  popupOpenBtns.forEach((btn) => {
    // Remove inline onclick if present to avoid conflicts/duplicates
    btn.removeAttribute("onclick");

    btn.addEventListener("click", function (e) {
      // Logic for specific buttons based on text/href
      let eventName = "popup_open"; // Default

      // Override for specific buttons if needed for backward compatibility
      if (this.textContent.includes("Get Started")) {
        // Optional: specialized event name if required, otherwise generic
      }

      window.trackEvent(eventName, {
        section: "Contact Popup",
        button_text: this.textContent.trim(),
        button_location: this.closest("section")?.id || "unknown"
      });
    });
  });

  // 1b. Legacy Button Tracking (Get Started / Get In Touch)
  // Ensure we catch buttons that might not have class js-open-contact-modal but have specific text
  // ... (Removed redundant logic if covered by class above, or keep if specific IDs used)


  // 2. Form Field Tracking & Form Start
  let popupFormStarted = false;

  document.addEventListener("focusin", function (e) {
    const target = e.target;
    if (target.tagName === "INPUT" && target.closest("#pop-up-contact form")) {
      if (!popupFormStarted) {
        window.trackEvent("form_start", {
          form_name: "contact-us-popup",
          form_location: "Popup Form"
        });
        popupFormStarted = true;
      }
    }
  }, true); // Capture phase

  document.addEventListener("focusout", function (e) {
    const target = e.target;

    // Check if input is part of a contact form
    if (
      target.tagName === "INPUT" &&
      target.name &&
      target.closest("form") &&
      (target.closest("form").classList.contains("contact-us") || target.closest("form").classList.contains("popup-form")) &&
      target.type !== "hidden" &&
      target.type !== "submit"
    ) {
      const val = target.value.trim();
      if (val) {
        const form = target.closest("form");
        // Detect location based on parent container
        const isPopup = form.closest("#pop-up-contact") !== null || form.classList.contains("popup-form");
        const formLocation = isPopup ? "Popup Form" : "Banner Form";

        const rawName = target.getAttribute("name"); // e.g., "first_name"

        // Track field fill
        window.trackEvent(rawName, {
          field_name: rawName,
          field_value: val, // Be careful with PII regulations here; usually tracking *that* it was filled is enough
          form_location: formLocation
        });
      }
    }
  }, true);


  // 3. Popup Close Tracking
  document.addEventListener("click", function (e) {
    if (e.target.closest(".modal-close") || e.target.id === "pop-up-contact") {
      window.trackEvent("popup_closed", {
        section: "Contact Popup",
      });
      // Reset form start state if needed
      // popupFormStarted = false; 
    }
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const popup = document.getElementById("pop-up-contact");
      if (popup && (popup.classList.contains("is-active") || popup.style.display === "block")) {
        window.trackEvent("popup_closed", { section: "Contact Popup" });
      }
    }
  }, true);
});

