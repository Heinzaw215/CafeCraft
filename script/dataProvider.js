fetch("../context/menu.json")
  .then((response) => response.json())
  .then((menuData) => {
    const coffeeItems = menuData.filter((item) => item.category === "Coffee");
    const teaItems = menuData.filter((item) => item.category === "Tea");
    const pastryItems = menuData.filter((item) => item.category === "Pastry");

    renderList("coffeeList", coffeeItems);
    renderList("teaList", teaItems);
    renderList("pastryList", pastryItems);

    // Optionally, you can log the items to the console for debugging
    console.log("Coffee Items:", coffeeItems);
    console.log("Tea Items:", teaItems);
    console.log("Pastry Items:", pastryItems);
  })
  .catch((error) => {
    console.error("Error fetching menu data:", error);
  });

function renderList(listId, items) {
  const listElement = document.getElementById(listId);
  listElement.innerHTML = ""; // Clear existing items

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "menu-item";
    listItem.innerHTML = `
  <div class="left-right">
    <div class="left">
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </div>
    <div class="right">
      <span class="price">${item.price} MMK</span>
    </div>
  </div>
  <button class="add-to-cart">Add to Cart</button>
`;
    listElement.appendChild(listItem);
  });
}
