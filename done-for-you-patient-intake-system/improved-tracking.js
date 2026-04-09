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

// Improved tracking function with UTM support
function trackEvent(eventName, eventData = {}) {
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

  // Push to GTM dataLayer
  if (typeof dataLayer !== "undefined") {
    dataLayer.push(enhancedData);
    console.log("Pushed to dataLayer:", enhancedData);
  }

  // Direct GA4 fallback
  if (typeof gtag !== "undefined") {
    gtag("config", "G-PL1MD71REM");
    gtag("event", eventName, {
      event_category: enhancedData.event_category,
      event_label: enhancedData.event_label,
      page_title: enhancedData.page_title,
      page_location: enhancedData.page_location,

      // UTM parameters
      ...utmParams,

      // Custom event data
      ...eventData,
    });
    console.log("Direct GA4 call:", eventName, enhancedData);
  }
}

// Replace inline onclick handlers with improved tracking
document.addEventListener("DOMContentLoaded", function () {
  // Get Started buttons
  const getStartedBtns = document.querySelectorAll(
    'a[onclick*="AM_Get_Started"]'
  );
  getStartedBtns.forEach((btn) => {
    btn.removeAttribute("onclick");
    btn.addEventListener("click", function (e) {
      const eventName =
        this.getAttribute("href") === "#contact-us"
          ? this.textContent.includes("Brett")
            ? "AM_Get_Started_Brett"
            : "AM_Get_Started"
          : "AM_Get_Started";

      trackEvent(eventName, {
        button_text: this.textContent.trim(),
        button_location: this.closest("section")?.className || "unknown",
      });
    });
  });

  // Get in Touch buttons
  const touchBtns = document.querySelectorAll(
    'a[onclick*="AM_Get_In_Touch_With_Us"]'
  );
  touchBtns.forEach((btn) => {
    btn.removeAttribute("onclick");
    btn.addEventListener("click", function (e) {
      trackEvent("AM_Get_In_Touch_With_Us", {
        button_text: this.textContent.trim(),
        button_location: this.closest("section")?.className || "unknown",
      });
    });
  });

  // Form submission tracking
  //   const form = document.getElementById("contact-us");
  // if (form) {
  //     form.addEventListener('submit', function(e) {
  //         const utmParams = getUTMParams();

  //         // Push to dataLayer with all UTM parameters
  //         if (typeof dataLayer !== 'undefined') {
  //             dataLayer.push({
  //                 event: 'AM_Form_Submit',
  //                 event_category: 'engagement',
  //                 event_label: 'contact_form',
  //                 form_name: 'contact_form',
  //                 form_location: 'hero_section',
  //                 campaign_name: utmParams.utm_campaign,
  //                 utm_source: utmParams.utm_source,
  //                 utm_medium: utmParams.utm_medium,
  //                 utm_campaign: utmParams.utm_campaign,
  //                 utm_term: utmParams.utm_term,
  //                 utm_content: utmParams.utm_content,
  //                 page_title: document.title,
  //                 page_location: window.location.href
  //             });
  //             console.log('Form submit tracked with UTM:', utmParams);
  //         }
  //     });
  // }
});
