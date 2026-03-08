import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderTable, resetForm, fillForm } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

// Eventos de tabla (delegación)
tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    // Eliminar item
    if (btn.classList.contains("btn-delete")) {
        if (!confirm("¿Estás seguro de eliminar este item?")) return;
        
        try {
            await deleteItem(id);
            loadItems();
        } catch (err) {
            console.error("Error eliminando:", err);
            alert("No se pudo eliminar el item.");
        }
    } 
    // Editar item
    else if (btn.classList.contains("btn-edit")) {
        try {
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
                return;
            }
            const item = await getItem(id);
            fillForm(form, item, submitBtn);
            editingId = id;
        } catch (err) {
            console.error("Error cargando item:", err);
            alert("No se pudo cargar el item para edición.");
        }
    }
});

// Envío del formulario (crear o actualizar)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const name = form.querySelector("#name").value.trim();
    const description = form.querySelector("#description").value.trim();
    const precio = parseInt(form.querySelector("#precio").value) || 0;
    const categoria = form.querySelector("#categoria").value.trim();
    const año = parseInt(form.querySelector("#año").value) || null;
    const imagen = form.querySelector("#imagen").value.trim();

    // Validación básica
    if (!name) {
        alert("El campo nombre es obligatorio");
        return;
    }

    // Objeto con los datos
    const itemData = {
        name,
        description,
        precio,
        categoria,
        año,
        imagen: imagen || "https://via.placeholder.com/300x180?text=Hot+Wheels"
    };

    try {
        if (editingId) {
            // Actualizar item existente
            await updateItem(editingId, itemData);
            editingId = null;
        } else {
            // Crear nuevo item
            await createItem(itemData);
        }

        resetForm(form, submitBtn);
        loadItems();
    } catch (err) {
        console.error("Error guardando item:", err);
        alert("No se pudo guardar el item.");
    }
});

// Cargar items al iniciar
async function loadItems() {
    try {
        const items = await getItems();
        renderTable(items, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los items.");
    }
}

// Inicializar
loadItems();