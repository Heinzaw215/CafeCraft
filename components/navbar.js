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
          </div>
        </div>
      </header>
      </div>
    `;

    // Highlight current page
    const currentPage = window.location.pathname.split("/").pop();
    this.querySelectorAll("nav a, .drawer-nav a").forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
      // Theme toggle button
      const toggleBtn = document.getElementById("themeToggle");
      const userTheme = localStorage.getItem("theme");
      
      if (userTheme) document.body.dataset.theme = userTheme;
      
      toggleBtn.addEventListener("click", () => {
        const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        document.body.dataset.theme = newTheme;
        localStorage.setItem("theme", newTheme);
      });
  }
}


// Register the component
customElements.define("cafe-navbar", CafeNavbar);
