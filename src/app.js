import express from "express";
import productosRouter from "./routes/productos.router.js";
import carritosRouter from "./routes/carrito.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductoManager from "./ProductoManager.js";

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

const productoManager = new ProductoManager("./src/data/productos.json")
/* Web Socket */
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("nuevoProducto", async(productoDatos) => {
        try {
            console.log("Producto recibido en el servidor:", productoDatos);
            const nuevoProducto = await productoManager.agregarProducto(
                productoDatos["titulo"],
                productoDatos["descripcion"],
                Number(productoDatos["precio"]),
                productoDatos["codigo"],
                Number(productoDatos["stock"]),
                productoDatos["categoria"],
                productoDatos["urlImagen"]
            );
            if (nuevoProducto === 1) {
                console.error("Error al crear un nuevo producto");
            }

            if (typeof nuevoProducto === "string") {
                console.error(nuevoProducto);
            }

            io.emit("productoAgregado", nuevoProducto);
        } catch (error) {
            console.error("Error al agregar producto");
        }
    });
});

io.on("connection", (socket) => {
    socket.on("eliminarProducto", async (productoId) => {
        try {
            const id = parseInt(productoId);
            const respuesta = await productoManager.eliminarProducto(id);
            if(respuesta === 1){
                console.error("Error al eliminar producto");
            }
            /* Para el usuario que elimino */
            socket.emit("productoEliminado", productoId);
            /* Para los demas usuarios */
            socket.broadcast.emit("productoRemovido", productoId);
        } catch (error) {
            console.error("Error en el servidor al eliminar producto", error);
        }
    });
});



server.listen(8081, () =>{
    console.log("Servidor iniciado en: http://localhost:8081");
});