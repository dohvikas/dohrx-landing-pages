// Ensure dataLayer exists
window.dataLayer = window.dataLayer || [];

// Generic GTM event push helper
function pushToDataLayer(eventName, eventData = {}) {
  window.dataLayer.push({
    event: eventName,
    page_title: document.title,
    page_location: window.location.href,
    ...eventData,
  });

  console.log("GTM Event Fired:", eventName, eventData);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("GTM Tracking Script Loaded");

  /* =========================
     1. POPUP OPEN
  ========================== */
  const popupOpenBtns = document.querySelectorAll(".js-open-contact-modal");

  popupOpenBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      pushToDataLayer("popup_open", {
        popup_name: "contact_popup",
        button_text: this.textContent.trim(),
        button_location: this.closest("section")?.id || "unknown",
      });
    });
  });

  /* =========================
     2. LEGACY BUTTONS
  ========================== */
  const legacyBtns = document.querySelectorAll(
    'a[onclick*="AM_Get_Started"], a[onclick*="AM_Get_In_Touch_With_Us"]',
  );

  legacyBtns.forEach((btn) => {
    if (!btn.classList.contains("js-open-contact-modal")) {
      btn.removeAttribute("onclick");

      btn.addEventListener("click", function () {
        const eventName = this.textContent.includes("Get Started")
          ? "get_started_click"
          : "get_in_touch_click";

        pushToDataLayer(eventName, {
          button_text: this.textContent.trim(),
          button_location: this.closest("section")?.id || "unknown",
        });
      });
    }
  });

  /* =========================
     3. FORM FIELD FOCUS
  ========================== */
  document.addEventListener("focusin", function (e) {
    const target = e.target;
    console.log("focus detected", e.target);

    if (
      target.tagName === "INPUT" &&
      target.name &&
      target.type !== "hidden" &&
      target.type !== "submit"
    ) {
      const form = target.closest("form");
      if (!form) return;

      const isPopup =
        form.closest("#pop-up-contact") !== null ||
        form.classList.contains("popup-form");

      pushToDataLayer("form_field_focus", {
        field_name: target.name,
        form_location: isPopup ? "popup_form" : "banner_form",
      });
    }
  });

  /* =========================
     4. POPUP CLOSE
  ========================== */
  document.addEventListener(
    "click",
    function (e) {
      if (
        e.target.closest(".modal-close") ||
        e.target.id === "pop-up-contact"
      ) {
        pushToDataLayer("popup_closed", {
          popup_name: "contact_popup",
        });
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.key === "Escape") {
        const popup = document.getElementById("pop-up-contact");

        if (
          popup &&
          (popup.classList.contains("is-active") ||
            popup.style.display === "block")
        ) {
          pushToDataLayer("popup_closed", {
            popup_name: "contact_popup",
          });
        }
      }
    },
    true,
  );
});
