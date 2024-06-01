var map = L.map('map').setView([-25.9692, 32.5732], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initial categories
var categories = [
    { name: 'Agricultural Land', type: 'polygon', color: '#228B22', icon: null, layers: [] },
    { name: 'Sanitation', type: 'point', color: '#0000FF', icon: null, layers: [] },
    { name: 'Natural Gas', type: 'line', color: '#FFA500', icon: null, layers: [] },
    { name: 'Parish Council', type: 'point', color: '#8B0000', icon: null, layers: [] }
];

var drawingCategoryIndex = null;

function renderCategories()
{
    var categoryList = document.getElementById("category-list");
    categoryList.innerHTML = ''; // Clear existing categories
    categories.forEach(function (category, index)
    {
        var categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
            <td>${category.name}</td>
            <td>
                <div class="category-menu">
                    <span>⋮</span>
                    <div class="category-menu-content">
                        <a href="#" onclick="startDrawing(${index})">Draw on Map</a>
                    </div>
                </div>
            </td>
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
        categories.push({ name: categoryName, type: categoryType, color: categoryColor, icon: null, layers: [] });
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
    var layers = categories[index].layers;
    layers.forEach(function (layer)
    {
        if (isActive)
        {
            layer.addTo(map);
        } else
        {
            map.removeLayer(layer);
        }
    });
    console.log(`Category ${categories[index].name} is now ${isActive ? 'active' : 'inactive'}`);
}

function startDrawing(index)
{
    drawingCategoryIndex = index;
    var category = categories[drawingCategoryIndex];
    document.getElementById('stop-drawing-btn').style.display = 'block';

    switch (category.type)
    {
        case 'point':
            map.on('click', function (e)
            {
                if (drawingCategoryIndex !== null)
                {
                    var marker = L.marker(e.latlng, { icon: category.icon }).addTo(map);
                    marker.categoryIndex = drawingCategoryIndex;
                    category.layers.push(marker);
                }
            });
            break;
        case 'line':
            var polyline = null;
            map.on('click', function (e)
            {
                if (drawingCategoryIndex !== null)
                {
                    if (polyline === null)
                    {
                        polyline = L.polyline([e.latlng], { color: category.color }).addTo(map);
                        category.layers.push(polyline);
                    } else
                    {
                        polyline.addLatLng(e.latlng);
                    }
                }
            });
            break;
        case 'polygon':
            var polygon = null;
            map.on('click', function (e)
            {
                if (drawingCategoryIndex !== null)
                {
                    if (polygon === null)
                    {
                        polygon = L.polygon([e.latlng], { color: category.color }).addTo(map);
                        category.layers.push(polygon);
                    } else
                    {
                        polygon.addLatLng(e.latlng);
                    }
                }
            });
            break;
    }
}

function stopDrawing()
{
    drawingCategoryIndex = null;
    map.off('click');
    document.getElementById('stop-drawing-btn').style.display = 'none';
}

renderCategories();
