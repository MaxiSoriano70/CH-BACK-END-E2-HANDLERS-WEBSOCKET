import express from "express";
import ProductoManager from "../ProductoManager.js";

const viewsRouter =  express.Router();
const productoManager = new ProductoManager("./src/data/productos.json");

viewsRouter.get("/", (req, res) => {
    const productos = productoManager.getProductos();
    res.render("home", {productos});
});

viewsRouter.get("/realtimeproductos", (req, res) => {
    const productos = productoManager.getProductos();
    res.render("realTimeProductos", {productos});
});

export default viewsRouter;