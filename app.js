// app.js — Vanilla JS for CaféCraft
// Handles: mobile drawer, accessible modal order form, contact + order simulated sends.
// All modals/drawers close on Escape. Basic focus management implemented.

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const orderModal = document.getElementById("orderModal");
  const orderBtns = document.querySelectorAll(
    "#orderBtnTop, #orderBtnHero, #orderBtnDrawer"
  );
  const orderClose = document.getElementById("orderClose");
  const orderForm = document.getElementById("orderForm");
  const orderStatus = document.getElementById("orderStatus");
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  const yearSpan = document.getElementById("year");

  // footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // drawer open/close helpers
  function openDrawer() {
    mobileDrawer.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    const focusable = mobileDrawer.querySelector(
      "button, a, [href], input, select, textarea"
    );
    if (focusable) focusable.focus();
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    mobileDrawer.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.focus();
    document.body.style.overflow = "";
  }

  // modal open/close helpers
  function openModal(modal) {
    modal.setAttribute("aria-hidden", "false");
    if ("inert" in modal) modal.inert = false;
    else modal.removeAttribute("inert");

    trapFocus(modal);
    document.body.style.overflow = "hidden";

    const first = modal.querySelector("input, select, textarea, button, a");
    if (first) first.focus();
  }

  function closeModal(modal) {
    modal.setAttribute("aria-hidden", "true");
    if ("inert" in modal) modal.inert = true;
    else modal.setAttribute("inert", "");

    document.body.style.overflow = "";
    document.getElementById("orderBtnTop")?.focus();
  }

  // events
  hamburger && hamburger.addEventListener("click", openDrawer);
  drawerClose && drawerClose.addEventListener("click", closeDrawer);
  mobileDrawer &&
    mobileDrawer.addEventListener("click", function (e) {
      if (e.target === mobileDrawer) closeDrawer();
    });

  orderBtns.forEach(
    (b) =>
      b &&
      b.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(orderModal);
      })
  );
  orderClose &&
    orderClose.addEventListener("click", function () {
      closeModal(orderModal);
    });

  orderModal &&
    orderModal.addEventListener("click", function (e) {
      if (e.target === orderModal) closeModal(orderModal);
    });

  // escape key closes modal/drawer
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (mobileDrawer.getAttribute("aria-hidden") === "false") closeDrawer();
      if (orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    }
  });

  // simple focus trap for modals/drawers
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

  // contact form: validation + simulated send
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
      setTimeout(function () {
        contactStatus.textContent =
          "Thanks! Your message has been sent (simulated).";
        contactForm.reset();
      }, 900);
    });
  }

  // order form: validation + simulated send
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
      setTimeout(function () {
        orderStatus.textContent =
          "Order placed (simulated). We will contact you to confirm.";
        orderForm.reset();
        setTimeout(function () {
          closeModal(orderModal);
          orderStatus.textContent = "";
        }, 1200);
      }, 900);
    });
  }

  // close open components when clicking in-page links (better UX)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      if (mobileDrawer.getAttribute("aria-hidden") === "false") closeDrawer();
      if (orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    });
  });
});

/* -----------------------------
   MICRO-INTERACTION: click ripple
   ----------------------------- */

(function enableRipples() {
  // Only run if not reduced-motion
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  // Target interactive elements we want ripples on
  const rippleTargets = document.querySelectorAll(
    ".btn, .nav-list a, .drawer-nav a, .footer-links a"
  );

  function createRipple(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    // compute coordinates relative to element
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    // size: cover the larger dimension
    const maxDim = Math.max(rect.width, rect.height);
    const size = Math.ceil(maxDim * 1.2);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x - size / 2 + "px";
    ripple.style.top = y - size / 2 + "px";
    el.appendChild(ripple);
    // remove after animation
    setTimeout(() => {
      ripple.remove();
    }, 700);
  }

  rippleTargets.forEach((el) => {
    // Pointer / mouse clicks
    el.addEventListener("pointerdown", function (e) {
      // only primary button/primary touch
      if (e.button && e.button !== 0) return;
      createRipple(el, e.clientX, e.clientY);
    });

    // Keyboard activation: center the ripple for Enter/Space
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        // prevent double activation when space causes click afterwards; allow default where needed
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        createRipple(
          el,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );
        // trigger click programmatically after small delay so ripple shows
        setTimeout(() => el.click(), 60);
      }
    });
  });
})();

// open
function openModal(modal) {
  modal.removeAttribute("aria-hidden");
  // remove inert (works with polyfill or native)
  if ("inert" in modal) modal.inert = false;
  else modal.removeAttribute("inert");
  // focus handling...
}

// close
function closeModal(modal) {
  modal.setAttribute("aria-hidden", "true");
  if ("inert" in modal) modal.inert = true;
  else modal.setAttribute("inert", "");
  // restore focus...
}

let menuItemBoxContainer = document.querySelector('#MenuItemBoxContainer');
if (menuItemBoxContainer) {
  fetch('context/menu.json')
    .then(response => response.json())
    .then(menuItems => {
      menuItems.forEach(item => {
        let li = document.createElement('li');
        li.className = 'menu-item';
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
    .catch(error => console.error('Error loading menu items:', error));
}
