var categories = [
    // { name: 'aaaa', type: 'line', color: '#FFA500', icon: null, layers: [] },
    // { name: 'bbbb', type: 'point', color: '#0000FF', icon: null, layers: [] },
    // { name: 'cccc', type: 'polygon', color: '#228B22', icon: null, layers: [] },
];


function renderCategories()
{
    var categoryList = document.getElementById("category-list");
    categoryList.innerHTML = '';
    categories.forEach(function (category, index)
    {
        var categoryRow = document.createElement("tr");
        categoryRow.innerHTML = `
            <td>${category.name}</td>
            <td>
                <div class="category-menu">
                    <span>⋮</span>
                    <div class="category-menu-content">
                        <a href="#" onclick="startDrawing(${index})">Draw</a>
                        <a href="#" onclick="editCategory(${index})">Edit</a>
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
    setRandomColor();
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
        resetForm();
    } else
    {
        alert('Please fill in all fields.');
    }
}

function resetForm()
{
    document.getElementById('category-name').value = '';
    document.getElementById('category-type').value = '';
    setRandomColor();
}

function setRandomColor()
{
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    document.getElementById('category-color').value = randomColor;
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

function openCategoryModal()
{
    document.getElementById('category-modal').style.display = 'block';
    setRandomColor();
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
        resetForm();
    } else
    {
        alert('Please fill in all fields.');
    }
}

function editCategory(index)
{
    var category = categories[index];
    document.getElementById('edit-category-name').value = category.name;
    document.getElementById('edit-category-type').value = category.type;
    document.getElementById('edit-category-color').value = category.color;
    document.getElementById('edit-category-modal').style.display = 'block';
    document.getElementById('save-edit-category-btn').setAttribute('data-index', index);
}

function closeEditCategoryModal()
{
    document.getElementById('edit-category-modal').style.display = 'none';
}

function saveEditCategory()
{
    var index = document.getElementById('save-edit-category-btn').getAttribute('data-index');
    var categoryName = document.getElementById('edit-category-name').value;
    var categoryType = document.getElementById('edit-category-type').value;
    var categoryColor = document.getElementById('edit-category-color').value;

    if (categoryName && categoryType && categoryColor)
    {
        categories[index].name = categoryName;
        categories[index].type = categoryType;
        categories[index].color = categoryColor;
        renderCategories();
        closeEditCategoryModal();
    } else
    {
        alert('Please fill in all fields.');
    }
}

function resetForm()
{
    document.getElementById('category-name').value = '';
    document.getElementById('category-type').value = '';
    setRandomColor();
}

function setRandomColor()
{
    var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.getElementById('category-color').value = randomColor;
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
