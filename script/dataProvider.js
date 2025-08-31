// Fetch menu data and render by category
fetch("../context/menu.json")
  .then((response) => response.json())
  .then((menuData) => {
    // Separate items by category
    const categories = {
      coffee: menuData.filter((item) => item.category === "Coffee"),
      tea: menuData.filter((item) => item.category === "Tea"),
      pastry: menuData.filter((item) => item.category === "Pastry"),
    };

    // Render each category list
    renderCategoryList("coffeeList", categories.coffee);
    renderCategoryList("teaList", categories.tea);
    renderCategoryList("pastryList", categories.pastry);

    // Debugging logs (optional)
    console.log("Coffee Items:", categories.coffee);
    console.log("Tea Items:", categories.tea);
    console.log("Pastry Items:", categories.pastry);
  })
  .catch((error) => {
    console.error("Error fetching menu data:", error);
  });

function renderCategoryList(listId, items) {
  const listElement = document.getElementById(listId);

  if (!listElement) return;
  listElement.innerHTML = "";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "menu-item";

    listItem.innerHTML = `
      <!-- Top section -->
      <div class="item-top">
        <img src="${item.image}" alt="${item.name}" class="item-image">
      </div>

      <!-- Middle section -->
      <div class="item-mid">
        <div class="item-info">
          <h3 class="item-title">${item.name}</h3>
          <p class="item-desc">${item.description}</p>
        </div>
        <div class="item-price">
          <span class="price">${item.price.toLocaleString()} Ks</span>
        </div>
      </div>

      <!-- Bottom section -->
<div class="item-actions">
        <button class="btn order-now" 
          data-id="${item.id}" 
          data-name="${item.name}" 
          data-price="${item.price}" 
          data-image="${item.image}">
          Order Now
        </button>
        <button class="btn add-to-cart" 
          data-id="${item.id}" 
          data-name="${item.name}" 
          data-price="${item.price}" 
          data-image="${item.image}">
          Add to Cart
        </button>
      </div>
    `;

    listElement.appendChild(listItem);
  });

  // Add-to-cart
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = getProductData(btn);
      addToCart(product);
    });
  });

  // Order-now
  document.querySelectorAll(".order-now").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = getProductData(btn);
      localStorage.setItem("checkoutItem", JSON.stringify(product));
      window.location.href = "checkout.html";
    });
  });
}

function getProductData(btn) {
  return {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: parseFloat(btn.dataset.price),
    image: btn.dataset.image,
    quantity: 1,
  };
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if item already exists
  const existing = cart.find(cartItem => cartItem.id === item.id);
  if (existing) {
    existing.quantity += 1; // increment quantity
  } else {
    cart.push({ ...item, quantity: 1 }); // add new item
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Notify other tabs/windows that cart changed
  window.dispatchEvent(new Event("storage"));

  alert(`${item.name} added to cart!`);
}

// Example of adding event listeners
document.querySelectorAll(".add-to-cart").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // Get item data from dataset or your menuData array
    const item = menuData[index]; // replace with your actual menuData
    addToCart(item);
  });
});
