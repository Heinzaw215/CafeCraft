// Render Navigation Bar
class CafeNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header" id="top">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="CaféCraft home">
            <img src="../assets/favicon.svg" alt="main logo illustration" 
                class="logo-img" width="40" height="40" loading="lazy">
            <span class="brand-text">CaféCraft</span>
          </a>

          <nav class="primary-nav" aria-label="Primary" id="primaryNav">
            <ul class="nav-list">
              <li><a href="index.html">Home</a></li>
              <li><a href="menu.html">Menu</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </nav>

          <div class="header-actions">
            <button type="button" class="btn btn-cta" id="orderBtnTop">Order</button>
          </div>
        </div>
      </header>

      <!-- Order Modal (site-wide) -->
      <div class="modal" id="orderModal" role="dialog" aria-modal="true" aria-labelledby="orderTitle" aria-hidden="true" inert>
        <div class="modal-panel" role="document">
          <button type="button" class="modal-close" id="orderClose" aria-label="Close order form">&times;</button>
          <h3 id="orderTitle">Place an Order</h3>

          <form id="orderForm" class="form" novalidate>
            <label for="o-name">Name</label>
            <input id="o-name" name="name" type="text" required>

            <label for="o-phone">Phone</label>
            <input id="o-phone" name="phone" type="tel" required>

            <label for="o-item">Item</label>
            <select id="o-item" name="item" required>
              <option value="">Select an item</option>
              ${fetch("../context/menu.json")
                .then((response) => response.json())
                .then((menu) =>
                  menu
                    .map(
                      (item) =>
                        `<option value="${item.name}">${item.name}</option>`
                    )
                    .join("")
                )}
            </select>

            <label for="o-qty">Quantity</label>
            <input id="o-qty" name="quantity" type="number" min="1" value="1" required>

            <label for="o-notes">Notes (optional)</label>
            <textarea id="o-notes" name="notes" rows="2"></textarea>

            <button type="submit" class="btn btn-cta">Send Order</button>
            <p id="orderStatus" class="form-status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;

    // ✅ Highlight current page
    const currentPage = window.location.pathname.split("/").pop();
    this.querySelectorAll("nav a, .drawer-nav a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  }
}

// Register the component
customElements.define("cafe-navbar", CafeNavbar);
