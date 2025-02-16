import express from "express";
import productosRouter from "./routes/productos.router.js";
import carritosRouter from "./routes/carrito.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";

const app = express();

/* Creando servidor de forma explicita para configurarlo con las consultas web socket*/
const server = http.createServer(app);
const io = new Server(server);

/*Middleware permite parsear el cuerpo de las solicitudes (request body) en formato JSON*/
app.use(express.json());
/* Aceptamos formularios */
app.use(express.urlencoded({extended:true}));
/* Configuracion public */
app.use(express.static("public"));
/*Handlebars*/
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/productos", productosRouter);
app.use("/api/carritos", carritosRouter);

app.use("/", viewsRouter);

/* Web Socket */
io.on("connection", (socket)=>{
    console.log("Nuevo usuario conectado");
});

server.listen(8080, () =>{
    console.log("Servidor iniciado en: http://localhost:8080");
});