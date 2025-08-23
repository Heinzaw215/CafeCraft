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

  if (!listElement) return; // Exit if list element is not found
  listElement.innerHTML = ""; // Clear existing items

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "menu-item";

    listItem.innerHTML = `
      <div class="left-right">
        <div class="left">
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            class="item-image"
          >
          <h3 class="item-title">${item.name}</h3>
          <p class="item-desc">${item.description}</p>
        </div>
        <div class="right">
          <span class="price">${item.price.toLocaleString()}</span>
        </div>
      </div>
      <button class="btn add-to-cart">
        Add to Cart
      </button>
    `;

    listElement.appendChild(listItem);
  });
}
