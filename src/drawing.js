var drawingCategoryIndex = null;
var selectedMarkers = [];
var polyline = null;
var polygon = null;

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
            map.on('click', drawLine);
            break;
        case 'polygon':
            map.on('click', drawPolygon);
            break;
    }
}


function stopDrawing()
{
    drawingCategoryIndex = null;
    map.off('click');
    document.getElementById('stop-drawing-btn').style.display = 'none';
    polyline = null;
    polygon = null;
}


function drawPoint(e)
{
    if (drawingCategoryIndex !== null)
    {
        var category = categories[drawingCategoryIndex];
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
}

function drawLine(e)
{
    console.log("Drawing line");
    var category = categories[drawingCategoryIndex];
    if (drawingCategoryIndex !== null)
    {
        if (polyline === null)
        {
            polyline = L.polyline([e.latlng], { color: category.color }).addTo(map);
            polyline.on('click', function ()
            {
                console.log("Polyline clicked");
                alert('Polyline length: ' + calculatePolylineLength(this)); 
            });
            category.layers.push(polyline);
        } else
        {
            polyline.addLatLng(e.latlng);
        }
    }
}


function drawPolygon(e)
{
    console.log("Drawing polygon");
    var category = categories[drawingCategoryIndex];
    if (drawingCategoryIndex !== null)
    {
        if (polygon === null)
        {
            polygon = L.polygon([e.latlng], { color: category.color }).addTo(map);
            polygon.on('click', function ()
            {
                console.log("Polygon clicked");
                alert('Polygon area: ' + calculatePolygonArea(this)); 
            });
            category.layers.push(polygon);
        } else
        {
            polygon.addLatLng(e.latlng);
        }
    }
}


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

        selectedMarkers.forEach(function (m)
        {
            m.getElement().classList.remove('selected-marker');
        });
        selectedMarkers = [];
        hideStatusMessage();
    }
}
