const container = document.getElementById("cart-container");

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    container.innerHTML = `<p class="empty">🛒 Your cart is empty.</p>`;
    return;
  }

  let total = 0;
  container.innerHTML = `
    <table aria-label="Shopping cart items">
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Qty</th>
          <th scope="col">Price</th>
          <th scope="col">Total</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map((item, index) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          return `
          <tr>
            <td data-label="Item">${item.name}</td>
            <td data-label="Qty">${item.quantity}</td>
            <td data-label="Price">${item.price.toLocaleString()} Ks</td>
            <td data-label="Total">${itemTotal.toLocaleString()} Ks</td>
            <td data-label="Action">
              <button class="btn-danger" aria-label="Remove ${item.name}" onclick="removeItem(${index})">Remove</button>
            </td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
    <p class="total">Grand Total: ${total.toLocaleString()} Ks</p>
    <button class="btn-danger" onclick="clearCart()">Clear Cart</button>
  `;
}

// Remove a single item
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Clear entire cart
function clearCart() {
  if (confirm("Are you sure you want to empty the cart?")) {
    localStorage.removeItem("cart");
    renderCart();
  }
}

// Update cart dynamically if localStorage changes (other tab)
window.addEventListener("storage", renderCart);

renderCart();
