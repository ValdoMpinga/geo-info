var map = L.map('map').setView([-25.9692, 32.5732], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initial categories
var categories = [
    { name: 'Agricultural Land', type: 'polygon', color: '#228B22', icon: null },
    { name: 'Sanitation', type: 'point', color: '#0000FF', icon: null },
    { name: 'Natural Gas', type: 'line', color: '#FFA500', icon: null },
    { name: 'Parish Council', type: 'point', color: '#8B0000', icon: null }
];

function renderCategories()
{
    var categoryList = document.getElementById("category-list");
    categoryList.innerHTML = ''; // Clear existing categories
    categories.forEach(function (category, index)
    {
        var categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
            <td>${category.name}</td>
            <td><input type="checkbox" checked data-index="${index}" onchange="toggleCategory(event)"></td>
        `;
        categoryList.appendChild(categoryRow);
    });
}

function openCategoryModal()
{
    document.getElementById('category-modal').style.display = 'block';
}

function closeCategoryModal()
{
    document.getElementById('category-modal').style.display = 'none';
}

function saveCategory()
{
    var categoryName = document.getElementById('category-name').value;
    var categoryType = document.getElementById('category-type').value;
    var categoryColor = document.getElementById('category-color').value;

    if (categoryName && categoryType && categoryColor)
    {
        categories.push({ name: categoryName, type: categoryType, color: categoryColor, icon: null });
        renderCategories();
        closeCategoryModal();
    } else
    {
        alert('Please fill in all fields.');
    }
}

function toggleCategory(event)
{
    var index = event.target.getAttribute("data-index");
    var isActive = event.target.checked;
    // Handle activation/deactivation logic for the category
    console.log(`Category ${categories[index].name} is now ${isActive ? 'active' : 'inactive'}`);
}

renderCategories();
