(function ($) {
  "use strict";

  $(function () {
    console.log("jQuery is ready!");
    $(".form_rendered_at").val(Date.now().toString());

    // Initialize Flatpickr
    if (typeof flatpickr !== "undefined") {
      flatpickr(".date", {
        dateFormat: "m-d-Y",
        minDate: "today",
        disableMobile: true,
      });
    }

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

    // Scroll header class toggle
    $(window).on("scroll", function () {
      const header = $(".header");
      if ($(window).scrollTop() > 10) {
        header.addClass("scrolled");
      } else {
        header.removeClass("scrolled");
      }
    });

    // Mobile Slider Initialization
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

    // Run slider init on load and resize
    initMobileSlider();
    $(window).on("resize", initMobileSlider);

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

    // Prevent Copy/Paste on inputs
    $(".contact-us input").on("paste contextmenu", function (e) {
      e.preventDefault();
    });

    // Input constraints
    $("input").on("input", function () {
      this.value = this.value.replace(/^\s+/, "");
    });

    $(".first_name, .last_name").on("keypress", function (e) {
      const char = String.fromCharCode(e.which);
      if (!/[a-zA-Z\s]/.test(char)) {
        e.preventDefault();
      }
    });

    // Real-time Validation
    $(document).on("input", ".first_name", function () {
      const $field = $(this);
      const value = $field.val();
      const $error = $field.siblings(".error-msg");

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
      const $error = $field.siblings(".error-msg");

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
      const $error = $field.siblings(".error-msg");

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
      const $error = $field.siblings(".error-msg");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test($field.val()) && $field.val() !== "") {
        $error.text("Enter valid email address");
        $field.addClass("error");
      } else {
        $error.text("");
        $field.removeClass("error");
      }
    });

    // Form Submit Handler
    $(".contact-us").on("submit", function (e) {
      e.preventDefault();
      const $form = $(this);
      let isValid = true;

      // Helper to find field within THIS form
      const getField = (name) => $form.find(`[name="${name}"]`);
      const getError = (name) => getField(name).siblings(".error-msg");

      // Validate First Name
      const fName = getField("first_name");
      const fNameVal = fName.val().trim();
      if (!fNameVal) {
        getError("first_name").text("First name is required");
        fName.addClass("error");
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(fNameVal)) {
        getError("first_name").text("Only letters and spaces allowed");
        fName.addClass("error");
        isValid = false;
      } else {
        getError("first_name").text("");
        fName.removeClass("error");
      }

      // Validate Last Name
      const lName = getField("last_name");
      const lNameVal = lName.val().trim();
      if (!lNameVal) {
        getError("last_name").text("Last name is required");
        lName.addClass("error");
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(lNameVal)) {
        getError("last_name").text("Only letters and spaces allowed");
        lName.addClass("error");
        isValid = false;
      } else {
        getError("last_name").text("");
        lName.removeClass("error");
      }

      // Validate Email
      const emailField = getField("email");
      const emailVal = emailField.val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        getError("email").text("Email is required");
        emailField.addClass("error");
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        getError("email").text("Enter valid email address");
        emailField.addClass("error");
        isValid = false;
      } else {
        getError("email").text("");
        emailField.removeClass("error");
      }

      // Validate Phone
      const phoneField = getField("phone");
      const phoneVal = phoneField.val().replace(/\D/g, "");
      if (!phoneVal) {
        getError("phone").text("Contact number is required");
        phoneField.addClass("error");
        isValid = false;
      } else if (phoneVal.length !== 10) {
        getError("phone").text("Enter exactly 10 digits");
        phoneField.addClass("error");
        isValid = false;
      } else {
        getError("phone").text("");
        phoneField.removeClass("error");
      }

      // Validate Date
      const dateField = getField("date_selection");
      if (dateField.length && !dateField.val()) {
        getError("date_selection").text("Date is required");
        dateField.addClass("error");
        isValid = false;
      } else if (dateField.length) {
        getError("date_selection").text("");
        dateField.removeClass("error");
      }

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

    // Modal / Popup Logic
    const $modal = $("#pop-up-contact");
    const $zohoPopup = $("#zohoBookingPopup");
    const $exitPopup = $("#accidental-popup");

    // Contact Popup Open/Close
    $(".js-open-contact-modal").on("click", function (e) {
      e.preventDefault();
      $modal.addClass("is-active");
      $("body").css("overflow", "hidden");
      // Tracking handled by improved-tracking.js via separate listener
    });

    $modal.on("click", ".modal-close", function () {
      $modal.removeClass("is-active");
      $("body").css("overflow", "");
    });

    $modal.on("click", function (e) {
      if ($(e.target).is("#pop-up-contact")) {
        $modal.removeClass("is-active");
        $("body").css("overflow", "");
      }
    });

    // Zoho Popup
    $(document).on("click", ".js-open-zoho-popup2", function (e) {
      e.preventDefault();
      $zohoPopup.addClass("is-active");
      $("body").css("overflow", "hidden");
    });
    $zohoPopup.on("click", ".popup-close", function () {
      $zohoPopup.removeClass("is-active");
      $("body").css("overflow", "");
    });
    $zohoPopup.on("click", function (e) {
      if (e.target.id === "zohoBookingPopup") {
        $zohoPopup.removeClass("is-active");
        $("body").css("overflow", "");
      }
    });

    // Exit Intent Popup
    let exitPopupShown = localStorage.getItem("exitPopupShown") === "true";

    function showExitPopup() {
      if (!exitPopupShown) {
        $exitPopup.addClass("show");
        $("body").css("overflow", "hidden");
        exitPopupShown = true;
        localStorage.setItem("exitPopupShown", "true");
      }
    }

    function hideExitPopup() {
      $exitPopup.removeClass("show");
      $("body").css("overflow", "");
    }

    if (window.innerWidth >= 768) {
      $(document).on("mouseleave", function (e) {
        if (e.clientY <= 0) showExitPopup();
      });
    } else {
      setTimeout(showExitPopup, 10000);
    }

    $(".close-x").on("click", hideExitPopup);
    $exitPopup.on("click", function (e) {
      if (e.target === this) hideExitPopup();
    });

    // Global Keydown (Escape) to close all popups
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        $modal.removeClass("is-active");
        $zohoPopup.removeClass("is-active");
        hideExitPopup();
        $("body").css("overflow", "");
      }
    });

    // FAQ Accordion
    const $faqItems = $(".faq-item");
    $faqItems.find(".faq-answer").hide();
    $faqItems.first().addClass("active").find(".faq-answer").show();

    $(".faq-question").on("click", function () {
      const $item = $(this).closest(".faq-item");
      const $answer = $item.find(".faq-answer");
      if ($item.hasClass("active")) return;
      $faqItems.removeClass("active").find(".faq-answer").slideUp(300);
      $item.addClass("active");
      $answer.slideDown(300);
    });

    // Slick Slider Initialization
    if ($(".slider-class").length) {
      $(".slider-class").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        arrows: false,
        dots: false,
        infinite: true,
        responsive: [
          { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
      });
    }
  });
})(jQuery);