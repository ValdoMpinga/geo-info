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

function calculatePolygonArea(polygon)
{
    console.log("Calculating polygon area");
    console.log(polygon);
    var latlngs = polygon.getLatLngs()[0]; 
    console.log(latlngs);
    var area = L.GeometryUtil.geodesicArea(latlngs);
    return (area / 1000000).toFixed(2) + ' square kilometers'; 
}

function calculatePolylineLength(polyline)
{
    var latlngs = polyline.getLatLngs();
    var totalLength = 0;

    for (var i = 0; i < latlngs.length - 1; i++)
    {
        totalLength += latlngs[i].distanceTo(latlngs[i + 1]);
    }

    return (totalLength / 1000).toFixed(2) + ' kilometers';
}
