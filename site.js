/* WOW CARDS shared chrome — mobile nav, FAQ, quote mailto fallback. */
(function () {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const actions = document.querySelector(".header-actions");
  if (toggle && actions) {
    toggle.addEventListener("click", function () {
      const on = actions.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", on ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!actions.classList.contains("is-open")) return;
      if (actions.contains(e.target) || toggle.contains(e.target)) return;
      actions.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".nav-drop > button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const drop = btn.parentElement;
      const open = drop.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.querySelectorAll(".nav-drop").forEach(function (other) {
        if (other !== drop) {
          other.classList.remove("is-open");
          const b = other.querySelector("button");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".faq-item");
      const open = !item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item").forEach(function (el) {
        el.classList.remove("is-open");
        const q = el.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll("form.quote").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (location.protocol !== "file:") return;
      e.preventDefault();
      const get = function (name) {
        const el = form.querySelector("[name='" + name + "']");
        return el ? el.value.trim() : "";
      };
      const name = get("name");
      const email = get("email");
      const phone = get("phone");
      const status = form.querySelector(".form-status");
      if (!name || !email || !phone) {
        if (status) status.textContent = "Please add your name, email and phone.";
        return;
      }
      const product = get("product") || "WOW CARDS";
      const body = [
        "WOW CARDS quote request",
        "",
        "Name: " + name,
        "Business: " + get("business"),
        "Email: " + email,
        "Phone: " + phone,
        "Notes: " + get("notes"),
        "",
        "Product: " + product,
        "Quantity: " + (get("qty") || "to confirm"),
        "Total: " + (get("total") || "Ask for a quote"),
        "Per card: " + (get("per_card") || ""),
        "Extras: " + (get("extras") || "None")
      ].join("\n");
      if (status) status.textContent = "Opening your email app to send this quote to PR Australia…";
      window.location.href =
        "mailto:info@pr.com.au?subject=" +
        encodeURIComponent("WOW CARDS quote — " + product) +
        "&body=" +
        encodeURIComponent(body);
    });
  });
})();
