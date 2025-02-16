import fs from 'fs';
import ProductManager from './ProductoManager.js';

class Carrito {
    static id = 1;

    constructor(productos) {
        this.id = Carrito.id++;
        this.productos = productos || [];
    }
}

class CarritoManager{
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.productoManager = new ProductManager('./src/data/productos.json');
    }

    cargaDeCarritos (){
        if (fs.existsSync(this.nombreArchivo)) {
            const datos = fs.readFileSync(this.nombreArchivo, 'utf-8');
            const carritosJson = JSON.parse(datos);
            Carrito.id = carritosJson.length > 0 ? carritosJson[carritosJson.length - 1].id + 1 : 1;
            return carritosJson;
        }
        else{
            console.log("Archivo no encontrado. Creando nuevo archivo JSON.");
            fs.writeFileSync(this.nombreArchivo, JSON.stringify([]));
            return [];
        }
    }

    guardarCarritos(carritos) {
        try {
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(carritos, null, 2));
        } catch (error) {
            console.error("Error al guardar los carritos en el archivo JSON:", error);
        }
    }

    agregarCarrito(productos){
        const carritos = this.cargaDeCarritos();
        const nuevoCarrito = new Carrito(productos);
        carritos.push(nuevoCarrito);
        this.guardarCarritos(carritos);
        return nuevoCarrito;
    }

    getCarritoPorId(id) {
        const carritos = this.cargaDeCarritos();
        const carritoId = carritos.find(carrito => carrito.id === id);
        if(!carritoId){
            return "Carrito no encontrado."
        }
        else{
            const productosDetalles = [];
            carritoId.productos.forEach(item => {
                const producto = this.productoManager.getProductoPorId(item.id);
                if (producto === null) {
                    productosDetalles.push({
                        id: item.id,
                        message: "El producto ya no existe",
                        cantidad: item.cantidad
                    });
                }
                else {
                    productosDetalles.push({
                        id: producto.id,
                        titulo: producto.titulo,
                        descripcion: producto.descripcion,
                        precio: producto.precio,
                        cantidad: item.cantidad
                    });
                }
            });
            return {
                id: carritoId.id,
                productos: productosDetalles
            };
        }
    }

    agregarProductoAlCarrito(idCarrito, idProducto, cantidad){
        const carritos = this.cargaDeCarritos();
        const carrito = carritos.find(carrito => carrito.id === idCarrito);
        if (!carrito) {
            return { error: "Carrito no encontrado" };
        }

        const producto = this.productoManager.getProductoPorId(idProducto);
        if (!producto) {
            return { error: "Producto no encontrado" };
        }

        if (cantidad > producto.stock) {
            return { error: "Cantidad solicitada excede el stock disponible" };
        }

        const productoEnCarrito = carrito.productos.find(item => item.id === idProducto);
        if (productoEnCarrito) {
            if (productoEnCarrito.cantidad + cantidad > producto.stock) {
                return { error: "Cantidad total excede el stock disponible" };
            }
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.productos.push({ id: idProducto, cantidad });
        }

        this.guardarCarritos(carritos);
        return carrito;
    }
}

export default CarritoManager;