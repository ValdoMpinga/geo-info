var map = L.map('map').setView([-25.9692, 32.5732], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initial categories
var categories = [
    { name: 'Natural Gas', type: 'line', color: '#FFA500', icon: null, layers: [] },
    { name: 'Sanitation', type: 'point', color: '#0000FF', icon: null, layers: [] },
    { name: 'Agricultural Land', type: 'polygon', color: '#228B22', icon: null, layers: [] },
];

var drawingCategoryIndex = null;
var selectedMarkers = [];

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
                        <a href="#" onclick="deleteCategory(${index})">Delete</a>
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
                    var marker = L.marker(e.latlng, {
                        icon: L.icon({
                            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
                            iconSize: [38, 95],
                            iconAnchor: [22, 94],
                            popupAnchor: [-3, -76],
                            shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
                            shadowSize: [50, 64],
                            shadowAnchor: [4, 62]
                        })
                    }).addTo(map);
                    marker.categoryIndex = drawingCategoryIndex;
                    marker.on('click', function ()
                    {
                        handleMarkerClick(marker);
                    });
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
                        polyline.on('click', function ()
                        {
                            alert('Polyline length: ' + calculatePolylineLength(polyline));
                        });
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
                        polygon.on('click', function ()
                        {
                            alert('Polygon area: ' + calculatePolygonArea(polygon));
                        });
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

function deleteCategory(index)
{
    var category = categories[index];
    category.layers.forEach(function (layer)
    {
        map.removeLayer(layer);
    });
    categories.splice(index, 1);
    renderCategories();
}

function calculatePolylineLength(polyline)
{
    var latlngs = polyline.getLatLngs();
    var totalLength = 0;

    for (var i = 0; i < latlngs.length - 1; i++)
    {
        totalLength += latlngs[i].distanceTo(latlngs[i + 1]);
    }

    return totalLength.toFixed(2) + ' meters';
}

function calculatePolygonArea(polygon)
{
    var latlngs = polygon.getLatLngs()[0]; // get the array of latlngs
    var area = L.GeometryUtil.geodesicArea(latlngs);
    return (area / 1000000).toFixed(2) + ' square kilometers'; // convert to square kilometers
}

// Load GeometryUtil library for area calculations
L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
    geodesicArea: function (latlngs)
    {
        var pointsCount = latlngs.length,
            area = 0.0,
            d2r = Math.PI / 180,
            p1, p2;

        if (pointsCount > 2)
        {
            for (var i = 0; i < pointsCount; i++)
            {
                p1 = latlngs[i];
                p2 = latlngs[(i + 1) % pointsCount];
                area += ((p2.lng - p1.lng) * d2r) *
                    (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    }
});

function handleMarkerClick(marker)
{
    selectedMarkers.push(marker);
    marker.getElement().classList.add('selected-marker');

    if (selectedMarkers.length === 1)
    {
        showStatusMessage('First marker selected. Select the second marker.');
    }

    if (selectedMarkers.length === 2)
    {
        var distance = selectedMarkers[0].getLatLng().distanceTo(selectedMarkers[1].getLatLng());
        alert('Distance between markers: ' + (distance / 1000).toFixed(2) + ' kilometers');

        // Reset markers
        selectedMarkers.forEach(function (m)
        {
            m.getElement().classList.remove('selected-marker');
        });
        selectedMarkers = [];
        hideStatusMessage();
    }
}

function showStatusMessage(message)
{
    var statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
}

function hideStatusMessage()
{
    var statusMessage = document.getElementById('status-message');
    statusMessage.style.display = 'none';
}

renderCategories();
