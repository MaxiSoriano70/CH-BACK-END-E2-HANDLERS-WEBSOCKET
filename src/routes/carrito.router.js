import express from "express";
import CarritoManager from "../CarritoManager.js";

const carritosRouter = express.Router();
const manager = new CarritoManager("./src/data/carritos.json");

carritosRouter.post("", (req, res) => {
    const { productos } = req.body;
    const nuevoCarrito = manager.agregarCarrito(productos);
    res.status(201).send(nuevoCarrito);
});

carritosRouter.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const carritoId = manager.getCarritoPorId(id);
    if(typeof carritoId === "string"){
        res.status(400).send({ message: carritoId });
    }
    res.status(200).send(carritoId);
});

carritosRouter.post("/:id/producto/:pid", (req, res) => {
    const idCarrito = parseInt(req.params.id);
    const idProducto = parseInt(req.params.pid);
    const cantidad = req.body.cantidad;

    if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).send({ message: "Cantidad no válida." });
    }

    const carrito = manager.agregarProductoAlCarrito(idCarrito, idProducto , cantidad);

    if (carrito.error) {
        res.status(400).send({ message: carrito.error });
    }
    res.status(200).send(carrito);
});

export default carritosRouter;