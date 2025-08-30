// modal.js — handles order modal behavior

export const initModal = ({ modalId, triggerSelectors, closeSelector, formId, statusId }) => {
  const modal = document.getElementById(modalId);
  const triggers = document.querySelectorAll(triggerSelectors);
  const closeBtn = document.getElementById(closeSelector);
  const form = document.getElementById(formId);
  const statusEl = document.getElementById(statusId);

  if (!modal) return;

  /* -------------------------
     Focusable Elements & Focus Trap
  ------------------------- */
  const getFocusable = container => {
    if (!container) return [];
    return Array.from(container.querySelectorAll(
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null);
  };

  const attachFocusTrap = modalEl => {
    const handleKey = e => {
      if (e.key === "Tab") {
        const nodes = getFocusable(modalEl);
        if (!nodes.length) { e.preventDefault(); return; }
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      } else if (e.key === "Escape") closeModal(modalEl);
    };
    modalEl._trapHandler = handleKey;
    modalEl.addEventListener("keydown", handleKey);
  };

  const releaseFocusTrap = modalEl => {
    if (modalEl._trapHandler) {
      modalEl.removeEventListener("keydown", modalEl._trapHandler);
      delete modalEl._trapHandler;
    }
  };

  /* -------------------------
     Open / Close Modal
  ------------------------- */
  const openModal = modalEl => {
    if (!modalEl) return;
    modalEl.removeAttribute("hidden");
    modalEl.classList.add("open");
    modalEl.setAttribute("aria-hidden", "false");
    attachFocusTrap(modalEl);
    document.body.style.overflow = "hidden";

    const focusables = getFocusable(modalEl);
    if (focusables.length) focusables[0].focus();
  };

  const closeModal = modalEl => {
    if (!modalEl) return;
    modalEl.setAttribute("hidden", "");
    modalEl.classList.remove("open");
    modalEl.setAttribute("aria-hidden", "true");
    releaseFocusTrap(modalEl);
    document.body.style.overflow = "";
  };

  /* -------------------------
     Event Listeners
  ------------------------- */
  triggers.forEach(btn => btn?.addEventListener("click", e => {
    e.preventDefault();
    openModal(modal);
  }));

  closeBtn?.addEventListener("click", () => closeModal(modal));

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal(modal);
  });

  /* -------------------------
     Form Submission (Optional)
  ------------------------- */
  if (form && statusEl) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      statusEl.textContent = "";
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const item = form.querySelector('[name="item"]');
      const quantity = form.querySelector('[name="quantity"]');

      if (!name.value.trim() || !phone.value.trim() || !item.value || !quantity.value) {
        statusEl.textContent = "Please complete all required fields.";
        return;
      }

      statusEl.textContent = "Processing...";
      setTimeout(() => {
        statusEl.textContent = "Order placed (simulated). We will contact you to confirm.";
        form.reset();
        closeModal(modal);
      }, 900);
    });
  }

  return { openModal, closeModal };
};
