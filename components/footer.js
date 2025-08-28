// Render Footer component
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
        <p class="small">Preserved © ${year}</span>
          CaféCraft- Brew Coffee with love <br>
          Address: 45 Artisan Lane, Downtown Yangon <br>
          Phone no: +95 9 876 543 210 <br>
          Email: info@cafecraft.com.mm
        </p>
        <p>
          Created by <a href="#">CafeCraft Team</a> with love. <br>
        </p>
      </div>

      <div class="footer-card" aria-hidden="false">
        <h3>Visit Us</h3>
        <p>We're always happy to see you. <br> Come by for a cup.</p>
        <ul>
          <li><strong>Hours:</strong> Mon - Fri in 7:00 - 18:00</li>
          <li><strong>Phone:</strong> +95 9 123 456 789</li>
          <li><strong>Address:</strong> 123 Bean Lane, Yangon</li>
        </ul>
      </div>

    </div>
    <nav aria-label="Footer">
      <ul class="footer-links">
        <li><a href="#menu">Menu</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </footer>
    `;
  }
}

customElements.define("cafe-footer", CafeFooter);