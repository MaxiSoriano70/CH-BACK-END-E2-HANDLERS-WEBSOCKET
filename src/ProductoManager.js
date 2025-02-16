import fs from 'fs';

class Producto{
    static id = 1;

    constructor(titulo, descripcion, precio, codigo, stock, categoria, urlImagen) {
        this.id = Producto.id++;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.codigo = codigo;
        this.stock = stock;
        this.estado = true;
        this.categoria = categoria;
        this.urlImagen = urlImagen;
    }
}

class ProductoManager {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    cargaDeProductos (){
        if (fs.existsSync(this.nombreArchivo)) {
            const datos = fs.readFileSync(this.nombreArchivo, 'utf-8');
            const productosJson = JSON.parse(datos);
            Producto.id = productosJson.length > 0 ? productosJson[productosJson.length - 1].id + 1 : 1;
            return productosJson;
        }
        else{
            console.log("Archivo no encontrado. Creando nuevo archivo JSON.");
            fs.writeFileSync(this.nombreArchivo, JSON.stringify([]));
            return [];
        }
    }

    guardarProductos(productos) {
        try {
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(productos, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos en el archivo JSON:", error);
        }
    }

    agregarProducto(titulo, descripcion, precio, codigo, stock, categoria, urlImagen) {
        if (!titulo || !descripcion || !precio || !codigo || !stock || !categoria || !urlImagen) {
            return 1;
        }

        const productos = this.cargaDeProductos();

        if (productos.some(producto => producto.codigo === codigo)) {
            return `El código ${codigo} pertenece a un producto.`;
        }

        const nuevoProducto = new Producto(titulo, descripcion, precio, codigo, stock, categoria, urlImagen);
        productos.push(nuevoProducto);
        this.guardarProductos(productos);
        return nuevoProducto;
    }

    getProductos() {
        return this.cargaDeProductos();
    }

    getProductoPorId(id) {
        const productos = this.cargaDeProductos();
        const producto = productos.find(producto => producto.id === id);
        return producto || null;
    }

    editarProducto(id, titulo, descripcion, precio, estado, codigo, stock, categoria, urlImagen) {
        let productos = this.cargaDeProductos();
        const index = productos.findIndex(producto => producto.id === id);

        if (index === -1) {
            return 1;
        }

        let productoActual = productos[index];

        let productoActualizado = {
            ...productoActual,
            ...(titulo !== undefined && { titulo }),
            ...(descripcion !== undefined && { descripcion }),
            ...(precio !== undefined && { precio }),
            ...(estado !== undefined && { estado }),
            ...(codigo !== undefined && { codigo }),
            ...(stock !== undefined && { stock }),
            ...(categoria !== undefined && { categoria }),
            ...(urlImagen !== undefined && { urlImagen })
        };

        productos[index] = productoActualizado;
        this.guardarProductos(productos);
        return productoActualizado;
    }

    eliminarProducto(id) {
        let productos = this.cargaDeProductos();
        const productosFiltrados = productos.filter(producto => producto.id !== id);

        if (productos.length === productosFiltrados.length) {
            return 1;
        }

        this.guardarProductos(productosFiltrados);
        return "Producto eliminado correctamente.";
    }
}

export default ProductoManager;