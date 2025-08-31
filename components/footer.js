class CafeFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div>
            <div class="brand-small">
              <img src="../assets/favicon.svg" alt="footer logo" width="30" height="30" loading="lazy">
              <span>CaféCraft</span>
            </div>
            <address>
            <p class="small">Preserved © ${year}</p>
              CaféCraft - Brew Coffee with love <br>
              <a href="tel:+959876543210">+95 9 876 543 210</a><br>
              Email: <a href="mailto:info@cafecraft.com.mm">info@cafecraft.com.mm</a>
            </address>
            <p>
              Created by <a href="#">CafeCraft Team</a> with love.
            </p>
          </div>

          <div class="footer-card">
            <h3>Visit Us</h3>
            <p>We're always happy to see you. <br> Come by for a cup.</p>
            <ul>
              <li><strong>Hours:</strong> Mon - Fri, 7:00 - 18:00</li>
              <li><strong>Phone:</strong> +95 9 123 456 789</li>
              <li><strong>Address:</strong> 123 Bean Lane, Yangon</li>
            </ul>
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <ul class="footer-links">
            <li><a href="menu.html">Menu</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="about.html">About</a></li>
          </ul>
        </nav>
      </footer>
    `;
  }
}

customElements.define("cafe-footer", CafeFooter);