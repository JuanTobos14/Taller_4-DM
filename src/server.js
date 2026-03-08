const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const handleItemsRoutes = require("./routes/items");

const PORT = 3000;
const PUBLIC_PATH = path.join(__dirname, "..", "public");

// Tipos MIME para archivos estáticos
const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
    // Log de peticiones entrantes
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Manejar rutas del API primero
    if (handleItemsRoutes(req, res)) return;

    // Servir archivos estáticos
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        let pathname = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
        const ext = path.extname(pathname);
        const fullPath = path.join(PUBLIC_PATH, pathname);

        // Obtener tipo de contenido según extensión
        const contentType = MIME_TYPES[ext] || "text/plain";
        const content = await fs.readFile(fullPath);

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    } catch (err) {
        // Manejar errores de archivo no encontrado
        const statusCode = err.code === "ENOENT" ? 404 : err.statusCode || 500;

        res.writeHead(statusCode, { "Content-Type": "text/plain" });
        res.end(`${statusCode} - ${err.message}`);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});