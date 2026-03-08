const API_URL = "/api/items";

// Obtiene todos los items desde la API
export async function getItems() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar items");
    return res.json();
}

// Obtiene un item específico por su ID
export async function getItem(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Item no encontrado");
    return res.json();
}

// Crea un nuevo item
export async function createItem(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al crear item");
    return res.json();
}

// Actualiza un item existente
export async function updateItem(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al actualizar item");
    return res.json();
}

// Elimina un item
export async function deleteItem(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar item");
    return res.json();
}