const http = require("http");
const app = require("./app");
const { type } = require("os");

const port = process.env.PORT || 3000;
app.set("port", port);

const server = http.createServer(app);

// Gestion des erreurs du serveur HTTP
server.on("error", (error) => {
    console.error("Erreur serveur :", error);
    process.exit(1);
});

server.on("listening", () => {
    console.log(`Server listening on port ${port}`);
});

server.listen(port);
