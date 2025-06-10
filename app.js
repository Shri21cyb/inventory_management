// Fetch and render all items
async function renderInventory() {
  try {
    const response = await fetch("http://localhost:3000/items");
    const items = await response.json();
    const tbody = document.getElementById("inventoryBody");
    tbody.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("tr");
      const status =
        item.quantity < 10
          ? '<span class="alert">Low Stock</span>'
          : "In Stock";
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${status}</td>
        <td>
          <button onclick="updateItem('${item._id}')">Update</button>
          <button onclick="deleteItem('${item._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching items:", err);
    alert("Failed to load inventory.");
  }
}

// Add new item
async function addItem() {
  const name = document.getElementById("itemName").value;
  const quantity = parseInt(document.getElementById("itemQuantity").value);
  const price = parseFloat(document.getElementById("itemPrice").value);
  if (name && quantity >= 0 && price >= 0) {
    try {
      const response = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, price }),
      });
      if (response.ok) {
        renderInventory();
        document.getElementById("itemName").value = "";
        document.getElementById("itemQuantity").value = "";
        document.getElementById("itemPrice").value = "";
      } else {
        alert("Failed to add item.");
      }
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Error adding item.");
    }
  } else {
    alert("Please enter valid item details.");
  }
}

// Update item
async function updateItem(id) {
  const itemName = prompt("Enter new name:");
  const itemQuantity = parseInt(prompt("Enter new quantity:"));
  const itemPrice = parseFloat(prompt("Enter new price:"));
  if (itemName && itemQuantity >= 0 && itemPrice >= 0) {
    try {
      const response = await fetch(`http://localhost:3000/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          quantity: itemQuantity,
          price: itemPrice,
        }),
      });
      if (response.ok) {
        renderInventory();
      } else {
        alert("Failed to update item.");
      }
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Error updating item.");
    }
  } else {
    alert("Invalid input. Update canceled.");
  }
}

// Delete item
async function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const response = await fetch(`http://localhost:3000/items/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        renderInventory();
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item.");
    }
  }
}

// Initial render
renderInventory();
