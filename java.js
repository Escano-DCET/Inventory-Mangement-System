let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

const sampleProducts = [
    { name: "Laptop", quantity: 15, price: 50000.00, dateAdded: "2023-01-01 12:30" },
    { name: "Smartphone", quantity: 30, price: 20000.00, dateAdded: "2023-02-15 14:00" },
    { name: "Headphones", quantity: 50, price: 1500.00, dateAdded: "2023-03-10 09:15" },
    { name: "Smartwatch", quantity: 25, price: 7500.00, dateAdded: "2023-03-15 11:00" },
    { name: "Tablet", quantity: 20, price: 30000.00, dateAdded: "2023-04-01 10:00" }
];

if (inventory.length === 0) {
    inventory = sampleProducts;
    saveToLocalStorage();
}

let editingIndex = -1;

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function addProduct() {
    const name = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const dateAdded = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (name && quantity > 0 && price >= 0) {
        const product = { name, quantity, price, dateAdded };
        inventory.push(product);
        saveToLocalStorage();
        renderTable();
        clearInputs();
        cancelAddProduct();
    } else {
        alert("Please fill all fields correctly.");
    }
}

function toggleAddProduct() {
    const details = document.getElementById('addProductDetails');
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

function cancelAddProduct() {
    document.getElementById('addProductDetails').style.display = 'none';
    clearInputs();
}

function renderTable() {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    inventory.forEach((product, index) => {
        const row = `<tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>₱${product.price.toFixed(2)}</td>
            <td>${product.dateAdded}</td>
            <td>
                <button class="edit-button" onclick="openEditProduct(${index})">Edit</button>
                <button class="delete-button" onclick="deleteProduct(${index})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function deleteProduct(index) {
    inventory.splice(index, 1);
    saveToLocalStorage();
    renderTable();
}

function openEditProduct(index) {
    const product = inventory[index];
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editQuantity').value = product.quantity;
    document.getElementById('editPrice').value = product.price;
    editingIndex = index;
    document.getElementById('editProductDetails').style.display = 'block';
}

/*
    PAG MAY GANITO SIT KINOPYA CODE NAMIN!
    ~ARTILLAGAS & ARCEGA
*/

function updateProduct() {
    const name = document.getElementById('editProductName').value;
    const quantity = parseInt(document.getElementById('editQuantity').value);
    const price = parseFloat(document.getElementById('editPrice').value);
    const dateAdded = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (name && quantity > 0 && price >= 0) {
        inventory[editingIndex] = { name, quantity, price, dateAdded };
        saveToLocalStorage();
        renderTable();
        clearEditInputs();
        cancelEditProduct();
    } else {
        alert("Please fill all fields correctly.");
    }
}

function cancelEditProduct() {
    document.getElementById('editProductDetails').style.display = 'none';
    clearEditInputs();
    editingIndex = -1;
}

function clearInputs() {
    document.getElementById('productName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('price').value = '';
}

function clearEditInputs() {
    document.getElementById('editProductName').value = '';
    document.getElementById('editQuantity').value = '';
    document.getElementById('editPrice').value = '';
}

function filterTable() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredInventory = inventory.filter(product => product.name.toLowerCase().includes(searchTerm));
    renderFilteredTable(filteredInventory);
}

function filterByQuantity() {
    const filterType = document.getElementById('quantityFilterType').value;
    let filteredInventory = [...inventory];

    if (filterType === 'least') {
        filteredInventory.sort((a, b) => a.quantity - b.quantity);
    } else if (filterType === 'most') {
        filteredInventory.sort((a, b) => b.quantity - a.quantity);
    }

    renderFilteredTable(filteredInventory);
}

function renderFilteredTable(filteredInventory) {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    filteredInventory.forEach((product, index) => {
        const row = `<tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>₱${product.price.toFixed(2)}</td>
            <td>${product.dateAdded}</td>
            <td class="actions">
                <button class="edit-button" onclick="openEditProduct(${index})">Edit</button>
                <button class="delete-button" onclick="deleteProduct(${index})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function sortTable() {
    const order = document.getElementById('sortOrder').value;
    if (order) {
        inventory.sort((a, b) => {
            const dateA = new Date(a.dateAdded);
            const dateB = new Date(b.dateAdded);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        renderTable();
    }
}

renderTable();