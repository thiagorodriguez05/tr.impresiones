// ====================================
// MODAL PRODUCTOS
// ====================================

const CAMPOS_PRODUCTO = [

    "add-nombre",
    "add-precio",
    "add-stock",
    "add-descripcion",
    "add-imagen"

];

// ====================================
// ABRIR EDITAR
// ====================================

async function abrirModalEditarProducto(id) {

    try {

        mostrarLoader();

        const producto =
            await apiObtenerProducto(id);

        cargarFormularioEditar(producto);

        actualizarPreview(producto.imagenes);

        abrirModal("modalEditar");

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error cargando producto"
        );

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// CARGAR FORMULARIO
// ====================================

function cargarFormularioEditar(producto) {

    $("edit-id").value =
        producto.id;

    $("nombre-producto-modal").textContent =
        producto.nombre;

    $("edit-nombre").value =
        producto.nombre;

    $("edit-precio").value =
        producto.precio;

    $("edit-stock").value =
        producto.stock;

    $("edit-descripcion").value =
        producto.descripcion || "";

    $("edit-categoria").value =
        producto.categoria;

}

// ====================================
// PREVIEW
// ====================================

function actualizarPreview(imagenes) {

    $("preview-imagen").src =

        imagenes && imagenes.length > 0

            ? "/" + imagenes[0]

            : "/img/no-image.png";

}

// ====================================
// CERRAR EDITAR
// ====================================

function cerrarModalEditarProducto() {

    cerrarModal("modalEditar");

}

// ====================================
// ABRIR AGREGAR
// ====================================

function abrirModalAgregarProducto() {

    limpiarFormulario(
        CAMPOS_PRODUCTO
    );

    abrirModal("modalAgregar");

}

// ====================================
// CERRAR AGREGAR
// ====================================

function cerrarModalAgregarProducto() {

    limpiarFormulario(
        CAMPOS_PRODUCTO
    );

    cerrarModal("modalAgregar");

}