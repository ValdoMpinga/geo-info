var map = L.map('map').setView([41.6935, -8.8326], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function addCategory()
{
    var categoryName = prompt("Enter category name:");
    if (categoryName)
    {
        var categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
            <td>${categoryName}</td>
            <td><input type="checkbox" checked></td>
        `;
        document.getElementById("category-list").appendChild(categoryRow);
    }
}
