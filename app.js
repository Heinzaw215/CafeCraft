// app.js — unified behavior (drawer, modals, forms, menu fetch, toast)
// Put this AFTER navbar.js in your <script> order.

document.addEventListener("DOMContentLoaded", function () {
  /* -------------------------
     Element references
     ------------------------- */
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

  /* -------------------------
     Utility: set everything except a single element inert
     (works with native inert property or fallback to attribute)
     ------------------------- */
  function setPageInert(exceptEl, state = true) {
    Array.from(document.body.children).forEach((el) => {
      // don't touch the element we want active (modal) or any <script> elements
      if (el === exceptEl || el.tagName === "SCRIPT") return;
      try {
        if ("inert" in el) el.inert = state;
        else {
          if (state) el.setAttribute("inert", "");
          else el.removeAttribute("inert");
        }
      } catch (err) {
        // Some elements (like <template>) may throw — ignore
      }
    });
  }

  /* -------------------------
     Modal helpers + focus trap
     ------------------------- */
  // We'll attach a single focus-trap handler per modal and store it on the element.
  function trapFocus(container) {
    const focusableSelectors =
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(
      container.querySelectorAll(focusableSelectors)
    ).filter(
      (n) => n.offsetParent !== null || n === document.activeElement // visible or active
    );

    if (!nodes.length) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    function handleKey(e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // backwards
          if (
            document.activeElement === first ||
            document.activeElement === container
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // forwards
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        // allow ESC to be handled outside too — but close from here for convenience
        closeModal(container);
      }
    }

    // store handler so we can remove it later
    container._trapHandler = handleKey;
    container.addEventListener("keydown", handleKey);
  }

  function releaseFocusTrap(container) {
    if (!container) return;
    if (container._trapHandler) {
      container.removeEventListener("keydown", container._trapHandler);
      delete container._trapHandler;
    }
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if ("inert" in modal) modal.inert = false;
    else modal.removeAttribute("inert");

    // Make the rest of page inert (so background links are not focusable)
    setPageInert(modal, true);

    trapFocus(modal);
    document.body.style.overflow = "hidden";

    // Focus first focusable element inside modal
    const first = modal.querySelector("input, select, textarea, button, a");
    if (first) first.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    if ("inert" in modal) modal.inert = true;
    else modal.setAttribute("inert", "");

    // Restore background interactivity
    setPageInert(modal, false);

    // remove focus trap
    releaseFocusTrap(modal);

    document.body.style.overflow = "";
    // return focus to a sensible control
    document.querySelector("#orderBtnTop")?.focus();
  }

  // app.js - Unified behavior for CaféCraft
  // Load this AFTER navbar.js (so the navbar + modal markup exist).
  // Handles: accessible modal (order), forms (order/contact), menu fetch, toast, focus trap, inert toggling.

  (function () {
    "use strict";

    // Utility: safe query for the modal (tries several strategies)
    function findOrderModal() {
      // Prefer direct id lookup
      let m = document.getElementById("orderModal");
      if (m) return m;

      // fallback: query selector by id attribute
      m = document.querySelector('[id="orderModal"]');
      if (m) return m;

      // fallback: look inside common custom element if it exists (not shadowRoot)
      const navEl = document.querySelector("cafe-navbar");
      if (navEl) {
        // If navbar uses innerHTML (not shadow DOM), modal will be findable from root.
        const inside = navEl.querySelector
          ? navEl.querySelector("#orderModal")
          : null;
        if (inside) return inside;
      }

      return null;
    }

    // Utility: set inert state on all top-level body children except exceptEl
    function setPageInert(exceptEl, state = true) {
      const children = Array.from(document.body.children);
      children.forEach((el) => {
        // Don't touch scripts or the element we want to keep interactive
        if (el === exceptEl || el.tagName === "SCRIPT") return;
        try {
          if ("inert" in el) {
            el.inert = state;
          } else {
            if (state) el.setAttribute("inert", "");
            else el.removeAttribute("inert");
          }
        } catch (err) {
          // ignore elements that may throw
        }
      });
    }

    // Utility: return focusable elements inside container
    function getFocusable(container) {
      if (!container) return [];
      const selectors =
        'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selectors)).filter((el) => {
        // filter out elements hidden via display:none
        const cs = window.getComputedStyle(el);
        return cs.display !== "none" && cs.visibility !== "hidden";
      });
    }

    // Focus trap attach / release helpers
    function attachFocusTrap(container) {
      if (!container) return;
      // don't attach twice
      if (container._trapAttached) return;

      const handleKey = function (e) {
        if (e.key === "Tab") {
          const nodes = getFocusable(container);
          if (!nodes.length) {
            e.preventDefault();
            return;
          }
          const first = nodes[0];
          const last = nodes[nodes.length - 1];
          if (e.shiftKey) {
            // backward
            if (
              document.activeElement === first ||
              document.activeElement === container
            ) {
              e.preventDefault();
              last.focus();
            }
          } else {
            // forward
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        } else if (e.key === "Escape") {
          // Try to close the modal if Esc pressed
          closeModal(container);
        }
      };

      container._trapHandler = handleKey;
      container.addEventListener("keydown", handleKey);
      container._trapAttached = true;
    }

    function releaseFocusTrap(container) {
      if (!container || !container._trapAttached) return;
      container.removeEventListener("keydown", container._trapHandler);
      delete container._trapHandler;
      container._trapAttached = false;
    }

    // Ensure modal is appended to body to avoid stacking context issues
    function ensureModalOnBody(modalEl) {
      if (!modalEl) return modalEl;
      if (modalEl.parentElement !== document.body) {
        try {
          document.body.appendChild(modalEl);
        } catch (err) {
          // ignore if moving fails
        }
      }
      return modalEl;
    }

    // Open / Close modal (single source-of-truth)
    function openModal(modal) {
      if (!modal) return;
      // ensure modal sits in body (avoid stacking contexts)
      ensureModalOnBody(modal);

      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("open");
      // ensure modal itself is not inert
      if ("inert" in modal) modal.inert = false;
      else modal.removeAttribute("inert");

      // make rest of the page inert so background can't be focused or clicked
      setPageInert(modal, true);

      // attach focus trap and focus first focusable element
      attachFocusTrap(modal);
      document.body.style.overflow = "hidden";
      const focusables = getFocusable(modal);
      if (focusables.length) focusables[0].focus();
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      // mark modal inert to hide from assistive tech (optional)
      try {
        if ("inert" in modal) modal.inert = true;
        else modal.setAttribute("inert", "");
      } catch (err) {
        /* ignore */
      }

      // restore background interactivity
      setPageInert(modal, false);

      // release trap
      releaseFocusTrap(modal);

      document.body.style.overflow = "";
      // restore focus to a sensible control
      const fallback =
        document.querySelector("#orderBtnTop") ||
        document.querySelector("#orderBtnHero") ||
        document.querySelector("#orderBtnDrawer");
      if (fallback) fallback.focus();
    }

    // Wait for DOM ready (main)
    document.addEventListener("DOMContentLoaded", function () {
      // Elements related to header/modal/forms
      const hamburger = document.querySelector("#hamburger");
      const drawerClose = document.querySelector("#drawerClose");

      // Find modal (could be moved or inside navbar)
      let orderModal = findOrderModal();

      // If the modal didn't exist at DOMContentLoaded, watch for it briefly (e.g., if navbar renders after)
      if (!orderModal) {
        // Try a short-lived mutation observer to catch when the navbar injects the modal
        const obs = new MutationObserver((mutations, observer) => {
          orderModal = findOrderModal();
          if (orderModal) {
            ensureModalOnBody(orderModal);
            observer.disconnect();
          }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        // Stop trying after 3s
        setTimeout(() => obs.disconnect(), 3000);
      } else {
        ensureModalOnBody(orderModal);
      }

      const orderBtns = Array.from(
        document.querySelectorAll(
          "#orderBtnTop, #orderBtnHero, #orderBtnDrawer"
        )
      );
      const orderClose = document.getElementById("orderClose");
      const orderForm = document.getElementById("orderForm");
      const orderStatus = document.getElementById("orderStatus");

      const contactForm = document.getElementById("contactForm");
      const contactStatus = document.getElementById("contactStatus");
      const toast = document.getElementById("toast");

      /* -------------------------
        ORDER MODAL: triggers & handlers
       ------------------------- */
      // Open when order buttons clicked
      orderBtns.forEach((btn) => {
        if (!btn) return;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          orderModal = orderModal || findOrderModal();
          if (!orderModal) {
            console.warn("Order modal not found.");
            return;
          }
          openModal(orderModal);
        });
      });

      // Close button inside modal
      if (orderClose) {
        orderClose.addEventListener("click", function () {
          orderModal = orderModal || findOrderModal();
          closeModal(orderModal);
        });
      }

      // Click outside panel closes modal
      if (orderModal) {
        orderModal.addEventListener("click", function (e) {
          if (e.target === orderModal) closeModal(orderModal);
        });
      }

      /* -------------------------
       GLOBAL KEY (Escape)
       ------------------------- */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          orderModal = orderModal || findOrderModal();
          if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
            closeModal(orderModal);
        }
      });

      /* -------------------------
       FORMS: contact + order (validation + simulated send + toast)
       ------------------------- */
      // Simple toast helper
      function showToast(message, ms = 1600) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), ms);
      }

      if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();
          contactStatus.textContent = "";
          const name = contactForm.querySelector('[name="name"]');
          const email = contactForm.querySelector('[name="email"]');
          const message = contactForm.querySelector('[name="message"]');

          if (
            !name.value.trim() ||
            !email.value.trim() ||
            !message.value.trim()
          ) {
            contactStatus.textContent = "Please complete all fields.";
            return;
          }
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email.value)) {
            contactStatus.textContent = "Please enter a valid email address.";
            return;
          }

          contactStatus.textContent = "Sending...";
          showToast("Sending message...", 1800);

          setTimeout(() => {
            contactStatus.textContent =
              "Thanks! Your message has been sent (simulated).";
            contactForm.reset();
            showToast("Message sent!", 1400);
          }, 900);
        });
      }

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
          showToast("Placing order...", 1800);

          setTimeout(function () {
            orderStatus.textContent =
              "Order placed (simulated). We will contact you to confirm.";
            orderForm.reset();
            setTimeout(function () {
              orderModal = orderModal || findOrderModal();
              closeModal(orderModal);
              orderStatus.textContent = "";
              showToast("Order confirmed (simulated).", 1400);
            }, 1200);
          }, 900);
        });
      }

      /* -------------------------
       CLOSE open components when clicking in-page anchors
       ------------------------- */
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function () {
          orderModal = orderModal || findOrderModal();
          if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
            closeModal(orderModal);
        });
      });

      /* -------------------------
       MENU JSON load (if container exists)
       ------------------------- */
      const menuItemBoxContainer = document.querySelector(
        "#MenuItemBoxContainer"
      );
      if (menuItemBoxContainer) {
        fetch("context/menu.json")
          .then((res) => res.json())
          .then((menuItems) => {
            menuItems.forEach((item) => {
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
       Optional: remove any stray inline styles left on modal (safety)
       ------------------------- */
      orderModal = orderModal || findOrderModal();
      if (orderModal) {
        orderModal.style.removeProperty("display");
        orderModal.style.removeProperty("pointer-events");
        // ensure hidden by default
        if (orderModal.getAttribute("aria-hidden") !== "false") {
          orderModal.classList.remove("open");
          orderModal.setAttribute("aria-hidden", "true");
          try {
            if ("inert" in orderModal) orderModal.inert = true;
            else orderModal.setAttribute("inert", "");
          } catch (e) {}
        }
      }
    }); // end DOMContentLoaded
  })();

  /* -------------------------
     DOM Events: Order modal triggers
     ------------------------- */
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
      // click outside the dialog panel closes it
      if (e.target === orderModal) closeModal(orderModal);
    });
  }

  /* -------------------------
     Global keyboard (Escape)
     ------------------------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    }
  });

  /* -------------------------
     Contact form: validation + simulated send + toast
     ------------------------- */
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

  /* -------------------------
     Order form: validation + simulated send
     ------------------------- */
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

  /* -------------------------
     Close open components when clicking in-page anchors
     ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      if (orderModal && orderModal.getAttribute("aria-hidden") === "false")
        closeModal(orderModal);
    });
  });

  /* -------------------------
     Menu JSON load (if container exists)
     ------------------------- */
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
              <p class="item-price">${Number(
                item.price
              ).toLocaleString()} MMK</p>
            </div>
          `;
          menuItemBoxContainer.appendChild(li);
        });
      })
      .catch((error) => console.error("Error loading menu items:", error));
  }
}); // end DOMContentLoaded


// document.querySelector('.modal').addEventListener('click', (e) => {
//   if (e.target === e.currentTarget) {
//     e.currentTarget.classList.remove('open');
//     e.currentTarget.setAttribute('aria-hidden', 'true');
//   }
// });
