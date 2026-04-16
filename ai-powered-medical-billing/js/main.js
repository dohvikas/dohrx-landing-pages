$(function () {
  console.log("jQuery is ready!");
  $(".form_rendered_at").val(Date.now().toString());
});

// Smooth scroll with offset for header CTA
$('a[href=".contact-us"]').on("click", function (e) {
  e.preventDefault();
  const target = $($(this).attr("href"));
  if (target.length) {
    $("html, body").animate(
      {
        scrollTop: target.offset().top - 300,
      },
      800
    );
  }
});

window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

function initMobileSlider() {
  if (window.innerWidth < 767) {
    if (!$(".testimonials-grid").hasClass("slick-initialized")) {
      $(".testimonials-grid").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false,
      });
    }

    if (!$(".features-grid-large").hasClass("slick-initialized")) {
      $(".features-grid-large").slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
        arrows: false,
      });
    }
  } else {
    if ($(".testimonials-grid").hasClass("slick-initialized")) {
      $(".testimonials-grid").slick("unslick");
    }

    if ($(".features-grid-large").hasClass("slick-initialized")) {
      $(".features-grid-large").slick("unslick");
    }
  }
}

// run on load
initMobileSlider();

// run on resize
$(window).on("resize", function () {
  initMobileSlider();
});

// UTM Parameter Handling
const urlParams = new URLSearchParams(window.location.search);
const utmData = {
  campaign: urlParams.get("utm_campaign"),
  source: urlParams.get("utm_source"),
  medium: urlParams.get("utm_medium"),
  term: urlParams.get("utm_term"),
  content: urlParams.get("utm_content"),
};

if (utmData.campaign) $(".utm_campaign").val(utmData.campaign);
if (utmData.source) $(".utm_source").val(utmData.source);
if (utmData.term) $(".utm_term").val(utmData.term);
$(".page_url").val(window.location.href);
$(".lead_source").val("Website");
if (utmData.medium) $(".utm_medium").val(utmData.medium);
if (utmData.content) $(".utm_content").val(utmData.content);

// Prevent Copy/Paste
$("#first_name, #last_name, #phone, #email").on(
  "paste contextmenu",
  function (e) {
    e.preventDefault();
  }
);

$("input").on("input", function () {
  // Remove leading spaces
  this.value = this.value.replace(/^\s+/, "");
});

// Block numbers and special characters in name fields
$("#first_name, #last_name").on("keypress", function (e) {
  const char = String.fromCharCode(e.which);
  if (!/[a-zA-Z\s]/.test(char)) {
    e.preventDefault();
  }
});

// Real-time Validation
$(document).on("input", ".first_name", function () {
  const $field = $(this);
  const value = $field.val();
  const $form = $field.closest("form");
  const $error = $form.find(".first-name-error");

  if (!/^[a-zA-Z\s]+$/.test(value) && value !== "") {
    $error.text("Only letters and spaces allowed");
    $field.addClass("error");
  } else if (value.length > 50) {
    $error.text("Maximum 50 characters allowed");
    $field.addClass("error");
  } else {
    $error.text("");
    $field.removeClass("error");
  }
});

$(document).on("input", ".last_name", function () {
  const $field = $(this);
  const value = $field.val();
  const $form = $field.closest("form");
  const $error = $form.find(".last-name-error");

  if (!/^[a-zA-Z\s]+$/.test(value) && value !== "") {
    $error.text("Only letters and spaces allowed");
    $field.addClass("error");
  } else if (value.length > 50) {
    $error.text("Maximum 50 characters allowed");
    $field.addClass("error");
  } else {
    $error.text("");
    $field.removeClass("error");
  }
});

$(document).on("input", ".phone", function () {
  const $field = $(this);
  let value = $field.val().replace(/\D/g, "");
  const $form = $field.closest("form");
  const $error = $form.find(".phone-error");

  if (value.length > 0 && value.charAt(0) < "2") {
    value = value.slice(1);
  }

  $field.val(value);

  if (value.length !== 10) {
    $error.text("Enter a valid 10-digit US phone number");
    $field.addClass("error");
  } else {
    $error.text("");
    $field.removeClass("error");
  }
});

$(document).on("input", ".email", function () {
  const $field = $(this);
  const $form = $field.closest("form");
  const $error = $form.find(".email-error");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test($field.val()) && $field.val() !== "") {
    $error.text("Enter valid email address");
    $field.addClass("error");
  } else {
    $error.text("");
    $field.removeClass("error");
  }
});

// Form focus event for form start tracking
let formStarted = false;
$(".contact-us input, .contact-us select").on("focus", function () {
  if (!formStarted) {
    dataLayer.push({ event: "AM_Form_Start" });
    formStarted = true;
  }
});

$(".contact-us").on("submit", function (e) {
  e.preventDefault();

  const $form = $(this); // 🔥 CURRENT FORM
  let isValid = true;

  // Helpers
  const getField = (name) => $form.find(`[name="${name}"]`);
  const getError = (id) => $form.find(`#${id}`);

  /* -------------------------
     FIRST NAME
  ------------------------- */
  const firstName = getField("first_name").val().trim();
  if (!firstName) {
    getError("first-name-error").text("First name is required");
    getField("first_name").addClass("error");
    isValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
    getError("first-name-error").text("Only letters and spaces allowed");
    getField("first_name").addClass("error");
    isValid = false;
  } else if (firstName.length > 50) {
    getError("first-name-error").text("Maximum 50 characters allowed");
    getField("first_name").addClass("error");
    isValid = false;
  } else {
    getError("first-name-error").text("");
    getField("first_name").removeClass("error");
  }

  /* -------------------------
     LAST NAME (only if field exists)
  ------------------------- */
  const lastName = getField("last_name").val().trim();
  if (!lastName) {
    getError("last-name-error").text("Last name is required");
    getField("last_name").addClass("error");
    isValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
    getError("last-name-error").text("Only letters and spaces allowed");
    getField("last_name").addClass("error");
    isValid = false;
  } else if (lastName.length > 50) {
    getError("last-name-error").text("Maximum 50 characters allowed");
    getField("last_name").addClass("error");
    isValid = false;
  } else {
    getError("last-name-error").text("");
    getField("last_name").removeClass("error");
  }

  /* -------------------------
     EMAIL
  ------------------------- */
  const email = getField("email").val().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    getError("email-error").text("Email is required");
    getField("email").addClass("error");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    getError("email-error").text("Enter valid email address");
    getField("email").addClass("error");
    isValid = false;
  } else {
    getError("email-error").text("");
    getField("email").removeClass("error");
  }

  /* -------------------------
     PHONE
  ------------------------- */
  const phone = getField("phone").val().replace(/\D/g, "");
  if (!phone) {
    getError("phone-error").text("Contact number is required");
    getField("phone").addClass("error");
    isValid = false;
  } else if (phone.length !== 10 || parseInt(phone[0]) < 2) {
    getError("phone-error").text("Enter valid 10 digit number");
    getField("phone").addClass("error");
    isValid = false;
  } else {
    getError("phone-error").text("");
    getField("phone").removeClass("error");
  }


  /* -------------------------
     PRACTICE NAME
  ------------------------- */
  const practiceName = getField("practice_name").val().trim();
  if (!practiceName) {
    getError("practice-name-error").text("Practice name is required");
    getField("practice_name").addClass("error");
    isValid = false;
  } else {
    getError("practice-name-error").text("");
    getField("practice_name").removeClass("error");
  }

  /* -------------------------
     SPECIALTY
  ------------------------- */
  const specialty = getField("specialty").val();
  if (!specialty) {
    getError("specialty-error").text("Please select a specialty");
    getField("specialty").addClass("error");
    isValid = false;
  } else {
    getError("specialty-error").text("");
    getField("specialty").removeClass("error");
  }

  /* -------------------------
     NUMBER OF PROVIDERS
  ------------------------- */
  const numProviders = getField("num_providers").val();
  if (!numProviders) {
    getError("num-providers-error").text("Please select number of providers");
    getField("num_providers").addClass("error");
    isValid = false;
  } else {
    getError("num-providers-error").text("");
    getField("num_providers").removeClass("error");
  }

  /* -------------------------
     BEST TIME
  ------------------------- */
  const bestTime = getField("best_time").val();
  if (!bestTime) {
    getError("best-time-error").text("Please select a preferred time");
    getField("best_time").addClass("error");
    isValid = false;
  } else {
    getError("best-time-error").text("");
    getField("best_time").removeClass("error");
  }

  /* -------------------------
     SUBMIT
  ------------------------- */
  if (!isValid) return;

  const $submitBtn = $form.find(".btn-submit");
  const originalText = $submitBtn.text();
  $submitBtn.text("Submitting...").prop("disabled", true);

  const formData = new FormData(this);
  const jsonBody = {};
  formData.forEach((value, key) => { jsonBody[key] = value; });

  fetch("/api/submit-lead/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonBody),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const loc = window.location;
        window.location.href = loc.origin + "/thank-you/" + loc.search;
      } else {
        $form.find(".form-error").remove();
        $("<div/>", {
          class: "form-error",
          text: data.message,
        }).insertBefore($submitBtn);
      }
    })
    .catch(() => {
      alert("Something went wrong. Please try again.");
    })
    .finally(() => {
      $submitBtn.text(originalText).prop("disabled", false);
    });
});

jQuery(document).ready(function ($) {
  const $modal = $("#pop-up-contact");

  $(".js-open-contact-modal").on("click", function (e) {
    e.preventDefault();
    $modal.addClass("is-active");
    $("body").css("overflow", "hidden");
  });

  $modal.on("click", ".modal-close", closeModal);

  $modal.on("click", function (e) {
    if ($(e.target).is("#pop-up-contact")) {
      closeModal();
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  function closeModal() {
    $modal.removeClass("is-active");
    $("body").css("overflow", "");
  }
});

jQuery(document).ready(function ($) {
  const $popup = $("#zohoBookingPopup");

  $(document).on("click", ".js-open-zoho-popup2", function (e) {
    e.preventDefault();
    $popup.addClass("is-active");
    $("body").css("overflow", "hidden");
  });

  $popup.on("click", ".popup-close", function () {
    closePopup();
  });

  $popup.on("click", function (e) {
    if ($(e.target).is("#zohoBookingPopup")) {
      closePopup();
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closePopup();
    }
  });

  function closePopup() {
    $popup.removeClass("is-active");
    $("body").css("overflow", "");
  }
});

// Exit Intent Popup
$(document).ready(function () {
  const $popup = $("#accidental-popup");
  let popupShown = localStorage.getItem('exitPopupShown') === 'true';

  function showPopup() {
    if (!popupShown) {
      $popup.addClass("show");
      $("body").css("overflow", "hidden");
      popupShown = true;
      localStorage.setItem('exitPopupShown', 'true');
    }
  }

  function hidePopup() {
    $popup.removeClass("show");
    $("body").css("overflow", "");
    localStorage.setItem('exitPopupShown', 'true');
  }

  // Desktop: Exit intent detection
  if (window.innerWidth >= 768) {
    $(document).on("mouseleave", function (e) {
      if (e.clientY <= 0) {
        showPopup();
      }
    });

    // Tab close/refresh detection
    $(window).on("beforeunload", function () {
      showPopup();
    });
  } else {
    // Mobile: Show after 10 seconds
    setTimeout(showPopup, 10000);
  }

  // Close popup handlers
  $(".close-x").on("click", hidePopup);

  $popup.on("click", function (e) {
    if (e.target === this) {
      hidePopup();
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      hidePopup();
    }
  });
});
