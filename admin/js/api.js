// ====================================
// API BASE
// ====================================

async function request(url, opciones = {}) {

    const respuesta = await fetch(url, opciones);

    if (!respuesta.ok) {

        let mensaje = `Error ${respuesta.status}`;

        try {

            const error = await respuesta.json();

            mensaje =
                error.error ||
                error.mensaje ||
                mensaje;

        }
        catch {

            mensaje = await respuesta.text();

        }

        throw new Error(mensaje);

    }

    return await respuesta.json();

}

// ====================================
// API - PRODUCTOS
// ====================================

// Obtener todos los productos
async function apiObtenerProductos() {

    return request("/api/productos");

}

// Obtener un producto
async function apiObtenerProducto(id) {

    return request(`/api/productos/${id}`);

}

// Crear producto
async function apiCrearProducto(producto) {

    return request("/api/productos", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(producto)

    });

}

// Actualizar producto
async function apiActualizarProducto(id, producto) {

    return request(`/api/productos/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(producto)

    });

}

// Eliminar producto
async function apiEliminarProducto(id) {

    return request(`/api/productos/${id}`, {

        method: "DELETE"

    });

}

// ====================================
// API - CATEGORÍAS
// ====================================

// Obtener todas
async function apiObtenerCategorias() {

    return request("/api/categorias");

}

// Obtener una
async function apiObtenerCategoria(id) {

    return request(`/api/categorias/${id}`);

}

// Crear
async function apiCrearCategoria(categoria) {

    return request("/api/categorias", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(categoria)

    });

}

// Actualizar
async function apiActualizarCategoria(id, categoria) {

    return request(`/api/categorias/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(categoria)

    });

}

// Eliminar
async function apiEliminarCategoria(id) {

    return request(`/api/categorias/${id}`, {

        method: "DELETE"

    });

}

// ====================================
// API - UPLOAD
// ====================================

// Subir imágenes
async function apiSubirImagenes(formData) {

    return request("/api/upload", {

        method: "POST",

        body: formData

    });

}

// ====================================
// API - CONFIGURACIÓN
// ====================================

// Obtener configuración
async function apiObtenerConfiguracion() {

    return request("/api/configuracion");

}

// Actualizar configuración
async function apiActualizarConfiguracion(configuracion) {

    return request("/api/configuracion", {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(configuracion)

    });

}

// Recalcular precios
async function apiRecalcularPrecios() {

    return request("/api/configuracion/recalcular-precios", {

        method: "PUT"

    });

}

// ====================================
// API - PEDIDOS
// ====================================

// Obtener todos
async function apiObtenerPedidos() {

    return request("/api/pedidos");

}

// Obtener uno
async function apiObtenerPedido(id) {

    return request(`/api/pedidos/${id}`);

}

// Crear
async function apiCrearPedido(pedido) {

    return request("/api/pedidos", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(pedido)

    });

}

// Actualizar
async function apiActualizarPedido(id, pedido) {

    return request(`/api/pedidos/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(pedido)

    });

}

// Eliminar
async function apiEliminarPedido(id) {

    return request(`/api/pedidos/${id}`, {

        method: "DELETE"

    });

}

// Cambiar estado
async function apiCambiarEstadoPedido(id) {

    return request(`/api/pedidos/${id}/estado`, {

        method: "PUT"

    });

}

async function apiDashboard(){

    return request("/api/dashboard");

}