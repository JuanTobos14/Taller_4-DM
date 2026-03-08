const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "items.json");

// Lee los datos del archivo JSON
function readData() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

// Escribe los datos en el archivo JSON
function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Manejador de rutas para el API de items
function handleItemsRoutes(req, res) {
    if (!req.url.startsWith("/api/items")) return false;

    res.setHeader("Content-Type", "application/json");

    // GET /api/items - Obtener todos los items
    if (req.method === "GET" && req.url === "/api/items") {
        res.end(JSON.stringify(readData()));
        return true;
    }

    // GET /api/items/:id - Obtener un item por ID
    if (req.method === "GET" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            const item = readData().find(i => i.id === id);
            
            if (item) {
                res.end(JSON.stringify(item));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Item no encontrado" }));
            }
            return true;
        }
    }

    // POST /api/items - Crear nuevo item
    if (req.method === "POST" && req.url === "/api/items") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const items = readData();
            const nuevo = JSON.parse(body);
            nuevo.id = Date.now();
            items.push(nuevo);
            writeData(items);
            res.end(JSON.stringify(nuevo));
        });
        return true;
    }

    // PUT /api/items/:id - Actualizar item existente
    if (req.method === "PUT" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                let items = readData();
                const idx = items.findIndex(i => i.id === id);

                if (idx >= 0) {
                    const updated = { ...items[idx], ...JSON.parse(body), id };
                    items[idx] = updated;
                    writeData(items);
                    res.end(JSON.stringify(updated));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: "Item no encontrado" }));
                }
            });
            return true;
        }
    }

    // DELETE /api/items/:id - Eliminar item
    if (req.method === "DELETE" && req.url.startsWith("/api/items/")) {
        const id = parseInt(req.url.split("/").pop());

        if (!isNaN(id)) {
            let items = readData();
            const newItems = items.filter(i => i.id !== id);

            if (newItems.length !== items.length) {
                writeData(newItems);
                res.end(JSON.stringify({ mensaje: "Eliminado correctamente" }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Item no encontrado" }));
            }
            return true;
        }
    }

    return false;
}

module.exports = handleItemsRoutes;