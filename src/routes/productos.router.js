import express from "express";
import ProductoManager from "../ProductoManager.js";

const productosRouter = express.Router();
const manager = new ProductoManager("./src/data/productos.json");

/*Rutas*/
productosRouter.get("/", (req, res) => {
    res.status(200).send(manager.getProductos());
})

productosRouter.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productoId = manager.getProductoPorId(id);
    if(productoId === null){
        res.status(400).send({ message: "Producto no encontrado" });
    }
    res.status(200).send(productoId);
});

productosRouter.post("", (req, res) => {
    const {titulo, descripcion, precio, codigo, stock, categoria, urlImagen} = req.body;
    const nuevoProducto = manager.agregarProducto(titulo, descripcion, precio, codigo, stock, categoria, urlImagen);
    if(nuevoProducto === 1){
        res.status(400).send({ message: "Error al crear un nuevo producto" });
    }
    if(typeof nuevoProducto === "string"){
        res.status(400).send({ message: nuevoProducto });
    }
    res.status(201).send(nuevoProducto);
});

productosRouter.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, descripcion, precio, estado, codigo, stock, categoria, urlImagen } = req.body;
    let producto = manager.editarProducto(id, titulo, descripcion, precio, estado, codigo, stock, categoria, urlImagen);
    if(producto === 1){
        res.status(400).send({ message: "Error al editar el producto" });
    }
    res.status(201).send(producto);
});

productosRouter.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const respuesta = manager.eliminarProducto(id);
    if(respuesta === 1){
        res.status(400).send({ message: "Error al editar el producto" });
    }
    res.status(201).send({ message : respuesta});
});

export default productosRouter;