// app.js — unified behavior (forms, menu fetch, toast, ripple)
// Put this AFTER navbar.js in your <script> order.

import { initModal } from "./modal.js";
document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     ELEMENT REFERENCES
  ------------------------- */
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  const toast = document.getElementById("toast");

  /* -------------------------
     UTILITY FUNCTIONS
  ------------------------- */
  // Show toast
  const showToast = (msg, duration = 1600) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  };

  /* -------------------------
     FORMS: CONTACT
  ------------------------- */
  const handleFormSubmit = (form, statusEl, requiredFields, successMsg) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      for (const field of requiredFields) {
        if (!form.querySelector(field)?.value.trim()) {
          statusEl.textContent = "Please complete required fields.";
          return;
        }
      }
      // Additional email check
      const emailInput = form.querySelector('[name="email"]');
      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
          statusEl.textContent = "Please enter a valid email address.";
          return;
        }
      }
      statusEl.textContent = "Processing...";
      showToast("Processing...", 1600);
      setTimeout(() => {
        statusEl.textContent = successMsg;
        form.reset();
        showToast("Done!", 1400);
      }, 900);
    });
  };

  if (contactForm)
    handleFormSubmit(
      contactForm,
      contactStatus,
      ['[name="name"]', '[name="email"]', '[name="message"]'],
      "Thanks! Your message has been sent (simulated)."
    );

  /* -------------------------
     CLOSE COMPONENTS WHEN CLICKING ANCHORS
  ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", () => {
      // No modal to close now
    })
  );

  /* -------------------------
     LOAD MENU JSON
  ------------------------- */
  const menuItemBoxContainer = document.querySelector("#MenuItemBoxContainer");
  if (menuItemBoxContainer) {
    fetch("context/menu.json")
      .then((res) => res.json())
      .then((items) => {
        items.forEach((item) => {
          const li = document.createElement("li");
          li.className = "menu-item";
          li.innerHTML = `
            <div class="item-left">
              <p class="item-title"><strong>${item.name}</strong></p>
              <p class="item-desc">${item.description}</p>
            </div>
            <div class="item-right">
              <p class="item-price">${Number(
                item.price
              ).toLocaleString()} MMK</p>
            </div>
          `;
          menuItemBoxContainer.appendChild(li);
        });
      })
      .catch((err) => console.error("Error loading menu items:", err));
  }

  /* -------------------------
     RIPPLE EFFECT
  ------------------------- */
  const links = document.querySelectorAll("a, button");

  links.forEach((link) => {
    link.classList.add("ripple-container");

    link.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = link.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      link.appendChild(ripple);

      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  window.addEventListener("scroll", () => {
    backBtn.hidden = window.scrollY < 300;
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("DOMContentLoaded", () => {
    initModal({
      modalId: "orderModal",
      triggerSelectors: "#orderBtnTop, #orderBtnDrawer",
      closeSelector: "orderModalClose",
      formId: "orderForm",
      statusId: "orderStatus",
    });
  });
});
