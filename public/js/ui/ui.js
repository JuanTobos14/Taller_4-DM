// Crea el HTML de una tarjeta para el catálogo
export function createItemCard(item) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img 
            src="${item.imagen}" 
            alt="${item.name}" 
            class="card-image"
            onerror="this.src='https://via.placeholder.com/300x180?text=Hot+Wheels'"
        >
        <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            <span class="card-category">${item.categoria || 'Sin categoría'}</span>
            <p class="card-price">$${item.precio ? item.precio.toLocaleString('es-CO') : '0'} COP</p>
            <button class="btn btn-primary btn-block" data-id="${item.id}">
                Ver detalles
            </button>
        </div>
    `;
    return card;
}

// Renderiza todos los items en el contenedor del catálogo
export function renderItems(items, container) {
    container.innerHTML = "";
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay autos disponibles</h3>
                <p>Agrega nuevos autos desde el panel de administración.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
}

// Renderiza los items en formato tabla para el CRUD
export function renderTable(items, tableBody) {
    tableBody.innerHTML = "";

    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">No hay items registrados</td>
            </tr>
        `;
        return;
    }

    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td class="descripcion-cell">${item.description || "-"}</td>
            <td>${item.categoria || "-"}</td>
            <td>$${item.precio ? item.precio.toLocaleString('es-CO') : '0'} COP</td>
            <td>${item.año || "-"}</td>
            <td class="table-actions">
                <button class="btn btn-secondary btn-small btn-edit" data-id="${item.id}">
                    Editar
                </button>
                <button class="btn btn-danger btn-small btn-delete" data-id="${item.id}">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Llena el formulario con datos de un item para edición
export function fillForm(form, item, submitBtn) {
    form.querySelector("#name").value = item.name || "";
    form.querySelector("#description").value = item.description || "";
    form.querySelector("#precio").value = item.precio || "";
    form.querySelector("#categoria").value = item.categoria || "";
    form.querySelector("#año").value = item.año || "";
    form.querySelector("#imagen").value = item.imagen || "";
    
    submitBtn.textContent = "Actualizar";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-secondary");
}

// Resetea el formulario a su estado inicial
export function resetForm(form, submitBtn) {
    form.reset();
    submitBtn.textContent = "Guardar";
    submitBtn.classList.remove("btn-secondary");
    submitBtn.classList.add("btn-primary");
}

// Abre el modal y muestra los detalles del item
export function openModal(item) {
    const overlay = document.getElementById("modalOverlay");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalCategory = document.getElementById("modalCategory");
    const modalDescription = document.getElementById("modalDescription");
    const modalYear = document.getElementById("modalYear");
    const modalCategoryDetail = document.getElementById("modalCategoryDetail");
    const modalPrice = document.getElementById("modalPrice");

    modalImage.src = item.imagen;
    modalImage.alt = item.name;
    modalImage.onerror = function() {
        this.src = "https://via.placeholder.com/500x250?text=Hot+Wheels";
    };
    modalTitle.textContent = item.name;
    modalCategory.textContent = item.categoria || "Sin categoría";
    modalDescription.textContent = item.description || "Sin descripción disponible.";
    modalYear.textContent = item.año || "-";
    modalCategoryDetail.textContent = item.categoria || "-";
    modalPrice.textContent = `$${item.precio ? item.precio.toLocaleString('es-CO') : '0'} COP`;

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

// Cierra el modal
export function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// Muestra mensaje de error en la UI
export function showError(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}