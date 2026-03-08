import { getItems, getItem } from "./services/api.js";
import { renderItems, openModal, closeModal, showError } from "./ui/ui.js";

// Contenedor donde se mostrarán las tarjetas
const catalogGrid = document.getElementById("catalogGrid");

// Elementos del modal
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");

// Función principal para cargar el catálogo
async function loadCatalog() {
    try {
        // Mostrar estado de carga
        catalogGrid.innerHTML = '<div class="loading">Cargando catálogo...</div>';

        // Obtener items desde la API
        const items = await getItems();

        // Renderizar las tarjetas
        renderItems(items, catalogGrid);
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        showError(catalogGrid, "No se pudo cargar el catálogo. Intenta recargar la página.");
    }
}

// Maneja el clic en "Ver detalles" de una tarjeta
async function handleCardClick(e) {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;

    const id = btn.dataset.id;

    try {
        // Obtener el item completo desde la API
        const item = await getItem(id);
        
        // Abrir el modal con los detalles
        openModal(item);
    } catch (err) {
        console.error("Error cargando item:", err);
        alert("No se pudo cargar los detalles del item.");
    }
}

// Evento clic en el contenedor del catálogo (delegación)
catalogGrid.addEventListener("click", handleCardClick);

// Evento para cerrar el modal
modalClose.addEventListener("click", closeModal);

// Cerrar modal al hacer clic fuera del contenido
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
    }
});

// Inicializar catálogo cuando cargue la página
loadCatalog();