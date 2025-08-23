// app.js — unified behavior (drawer, modals, forms, ripples, menu fetch, toast)
// Place this after navbar.js in your <script> order (so the custom element is defined first).

document.addEventListener("DOMContentLoaded", function () {
  // Elements (may be inside the custom element)
  const hamburger = document.querySelector("#hamburger");
  const mobileDrawer = document.querySelector("#mobileDrawer");
  const drawerClose = document.querySelector("#drawerClose");

  const orderModal = document.getElementById("orderModal");
  const orderBtns = Array.from(
    document.querySelectorAll("#orderBtnTop, #orderBtnHero, #orderBtnDrawer")
  );
  const orderClose = document.getElementById("orderClose");
  const orderForm = document.getElementById("orderForm");
  const orderStatus = document.getElementById("orderStatus");

  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  const toast = document.getElementById("toast");

  // Helpers: drawer open/close
  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.setAttribute("aria-hidden", "false");
    mobileDrawer.classList.add("open");
    if (hamburger) hamburger.setAttribute("aria-expanded", "true");
    // focus first focusable inside drawer
    const focusable = mobileDrawer.querySelector(
      "button, a, [href], input, select, textarea"
    );
    if (focusable) focusable.focus();
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.setAttribute("aria-hidden", "true");
    mobileDrawer.classList.remove("open");
    if (hamburger) {
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.focus();
    }
    document.body.style.overflow = "";
  }

  // Helpers: modal open/close with inert support + focus trap
  function openModal(modal) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    if ("inert" in modal) modal.inert = false;
    else modal.removeAttribute("inert");

    trapFocus(modal);
    document.body.style.overflow = "hidden";

    const first = modal.querySelector("input, select, textarea, button, a");
    if (first) first.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    if ("inert" in modal) modal.inert = true;
    else modal.setAttribute("inert", "");
    document.body.style.overflow = "";
    // restore focus to a sensible control
    document.querySelector("#orderBtnTop")?.focus();
  }

  // Events: drawer
  if (hamburger) hamburger.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener("click", function (e) {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  // Events: order modal triggers
  orderBtns.forEach((b) => {
    if (!b) return;
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (orderModal) openModal(orderModal);
    });
  });
  if (orderClose)
    orderClose.addEventListener("click", () => closeModal(orderModal));
  if (orderModal) {
    orderModal.addEventListener("click", function (e) {
      if (e.target === orderModal) closeModal(orderModal);
    });
  }

  // Escape key closes modal/drawer
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (mobileDrawer && mobileDrawer.getAttribute("aria-hidden") === "false")
        closeDrawer();
      if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    }
  });

  // Simple focus trap
  function trapFocus(container) {
    const focusableSelectors =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(container.querySelectorAll(focusableSelectors));
    if (!nodes.length) return;
    const first = nodes[0],
      last = nodes[nodes.length - 1];

    function handleKey(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKey);
    const observer = new MutationObserver(function () {
      if (container.getAttribute("aria-hidden") === "true") {
        container.removeEventListener("keydown", handleKey);
        observer.disconnect();
      }
    });
    observer.observe(container, {
      attributes: true,
      attributeFilter: ["aria-hidden"],
    });
  }

  // Contact form: validation + simulated send + toast
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactStatus.textContent = "";
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        contactStatus.textContent = "Please complete all fields.";
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value)) {
        contactStatus.textContent = "Please enter a valid email address.";
        return;
      }

      contactStatus.textContent = "Sending...";
      // show toast if present
      if (toast) {
        toast.textContent = "Sending message...";
        toast.classList.add("show");
      }

      setTimeout(function () {
        contactStatus.textContent =
          "Thanks! Your message has been sent (simulated).";
        contactForm.reset();
        if (toast) {
          toast.textContent = "Message sent!";
          setTimeout(() => toast.classList.remove("show"), 1800);
        }
      }, 900);
    });
  }

  // Order form: validation + simulated send
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      orderStatus.textContent = "";
      const name = orderForm.querySelector('[name="name"]');
      const phone = orderForm.querySelector('[name="phone"]');
      const item = orderForm.querySelector('[name="item"]');
      const qty = orderForm.querySelector('[name="quantity"]');

      if (
        !name.value.trim() ||
        !phone.value.trim() ||
        !item.value ||
        !qty.value
      ) {
        orderStatus.textContent = "Please complete required fields.";
        return;
      }
      orderStatus.textContent = "Placing order...";
      if (toast) {
        toast.textContent = "Placing order...";
        toast.classList.add("show");
      }
      setTimeout(function () {
        orderStatus.textContent =
          "Order placed (simulated). We will contact you to confirm.";
        orderForm.reset();
        setTimeout(function () {
          closeModal(orderModal);
          orderStatus.textContent = "";
          if (toast) {
            toast.textContent = "Order confirmed (simulated).";
            setTimeout(() => toast.classList.remove("show"), 1600);
          }
        }, 1200);
      }, 900);
    });
  }

  // close open components when clicking in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      if (mobileDrawer && mobileDrawer.getAttribute("aria-hidden") === "false")
        closeDrawer();
      if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    });
  });

  /* -----------------------------
     MICRO-INTERACTION: click ripple
     ----------------------------- */
  // load menu items (if container exists)
  let menuItemBoxContainer = document.querySelector("#MenuItemBoxContainer");
  if (menuItemBoxContainer) {
    fetch("context/menu.json")
      .then((response) => response.json())
      .then((menuItems) => {
        menuItems.forEach((item) => {
          let li = document.createElement("li");
          li.className = "menu-item";
          li.innerHTML = `
            <div class="item-left">
              <p class="item-title"><strong>${item.name}</strong></p>
              <p class="item-desc">${item.description}</p>
            </div>
            <div class="item-right">
              <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
          `;
          menuItemBoxContainer.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading menu items:", error));
  }
}); // end DOMContentLoaded
