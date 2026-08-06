// ====================================
// PRODUCTOS
// ====================================

let productos = [];

// ====================================
// CARGAR PRODUCTOS
// ====================================

async function cargarProductos() {

    try {

        mostrarLoader();

        productos = await apiObtenerProductos();

        renderProductos();

        $("total-productos").textContent = productos.length;

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error cargando productos");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// RENDER
// ====================================
function renderProductos() {

    const tabla = $("tabla-productos");

    if (!tabla) return;

    if (productos.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="7">

                    No hay productos registrados.

                </td>

            </tr>

        `;

        return;

    }

    tabla.innerHTML = productos
        .map(crearFilaProducto)
        .join("");

}

// ====================================
// CREAR FILA
// ====================================

function crearFilaProducto(producto) {

    const imagen =

        producto.imagenes &&
        producto.imagenes.length > 0

            ? "/" + producto.imagenes[0]

            : "/img/no-image.png";

    return `

        <tr>

            <td>

                <img
                    src="${imagen}"
                    class="product-img"
                    alt="${producto.nombre}">

            </td>


            <td>

                ${producto.nombre}

            </td>

            <td>

                ${producto.material
                    ? producto.material.toUpperCase()
                    : "-"}

            </td>

            <td>

                ${producto.gramos
                    ? `${producto.gramos} g`
                    : "-"}

            </td>

            <td>

                $${formatearPrecio(producto.precio)}

            </td>

            <td>

                ${producto.stock}

            </td>

            <td>

                ${obtenerEstadoStock(producto.stock)}

            </td>

            <td>

                ${producto.categoria_nombre}

            </td>

            <td>

                <button
                    class="btn-edit"
                    data-id="${producto.id}">

                    ✏️

                </button>

                <button
                    class="btn-delete"
                    data-id="${producto.id}">

                    🗑️

                </button>

            </td>

        </tr>

    `;

}

// ====================================
// OBTENER DATOS DEL FORMULARIO
// ====================================

function obtenerDatosProducto(prefijo) {

    return {

        nombre:
            $(`${prefijo}-nombre`).value.trim(),

        precio:
            Number(
                $(`${prefijo}-precio`).value
            ),

        stock:
            Number(
                $(`${prefijo}-stock`).value
            ),

        categoria:
            $(`${prefijo}-categoria`).value,

        descripcion:
            $(`${prefijo}-descripcion`)
                .value
                .trim(),

        material:
            $(`${prefijo}-material`)?.value || null,

        gramos:
            Number(
                $(`${prefijo}-gramos`)?.value || 0
            )
    };

}

// ====================================
// SUBIR IMÁGENES
// ====================================

async function subirImagenesProducto() {

    const archivos = $("add-imagen").files;

    if (!archivos.length) {

        return [];

    }

    const formData = new FormData();

    for (const archivo of archivos) {

        formData.append(
            "imagenes",
            archivo
        );

    }

    const respuesta =
        await apiSubirImagenes(formData);

    return respuesta.map(img => img.ruta);

}
// ====================================
// AGREGAR PRODUCTO
// ====================================

async function agregarProducto() {

    try {

        mostrarLoader();

        const producto =
            obtenerDatosProducto("add");

        if (

            estaVacio(producto.nombre)

            || producto.precio <= 0

            || producto.stock < 0

        ) {

            mostrarToast(
                "Completá correctamente los datos."
            );

            return;

        }

       producto.imagenes =
            await subirImagenesProducto();

        console.log(producto.imagenes);

        await apiCrearProducto(producto);

        cerrarModalAgregarProducto();

        mostrarToast(
            "Producto agregado correctamente"
        );

        await cargarProductos();

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error agregando producto"
        );

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// GUARDAR PRODUCTO
// ====================================

async function guardarProducto() {

    try {

        mostrarLoader();

        const id =
            $("edit-id").value;

        const producto =
            obtenerDatosProducto("edit");

        const archivos =
            $("edit-imagen")?.files;

        if (archivos && archivos.length > 0) {

            const formData = new FormData();

            for (const archivo of archivos) {

                formData.append(
                    "imagenes",
                    archivo
                );

            }

            const respuesta =
                await apiSubirImagenes(formData);

            producto.imagenes =
                respuesta.map(img => img.ruta);

        }

        await apiActualizarProducto(
            id,
            producto
        );

        cerrarModalEditarProducto();

        mostrarToast(
            "Producto actualizado correctamente"
        );

        await cargarProductos();

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error actualizando producto"
        );

    }
    finally {

        ocultarLoader();

    }

}
// ====================================
// ELIMINAR PRODUCTO
// ====================================

async function eliminarProducto(id) {

    if (!confirmar("¿Eliminar este producto?")) {

        return;

    }

    try {

        mostrarLoader();

        await apiEliminarProducto(id);

        mostrarToast(
            "Producto eliminado correctamente"
        );

        await cargarProductos();

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error eliminando producto"
        );

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// INICIAR
// ====================================

function iniciarProductos() {

    cargarProductos();

    $("tabla-productos")
        ?.addEventListener(
            "click",
            manejarClickTablaProductos
        );

    $("btnAbrirAgregar")
        ?.addEventListener(
            "click",
            abrirModalAgregarProducto
        );

    $("btnCancelarAgregar")
        ?.addEventListener(
            "click",
            cerrarModalAgregarProducto
        );

    $("btnAgregar")
        ?.addEventListener(
            "click",
            agregarProducto
        );

    $("btnCancelar")
        ?.addEventListener(
            "click",
            cerrarModalEditarProducto
        );

    $("btnGuardar")
        ?.addEventListener(
            "click",
            guardarProducto
        );

    // ===============================
    // CALCULAR PRECIOS AUTOMÁTICAMENTE
    // ===============================

    $("add-material")
        ?.addEventListener(
            "change",
            () => calcularPrecioProducto("add")
        );

    $("add-gramos")
        ?.addEventListener(
            "input",
            () => calcularPrecioProducto("add")
        );

    $("edit-material")
        ?.addEventListener(
            "change",
            () => calcularPrecioProducto("edit")
        );

    $("edit-gramos")
        ?.addEventListener(
            "input",
            () => calcularPrecioProducto("edit")
        );
}

// ====================================
// EVENTOS TABLA
// ====================================

function manejarClickTablaProductos(e) {

    const botonEditar =
        e.target.closest(".btn-edit");

    if (botonEditar) {

        abrirModalEditarProducto(

            botonEditar.dataset.id

        );

        return;

    }

    const botonEliminar =
        e.target.closest(".btn-delete");

    if (botonEliminar) {

        eliminarProducto(

            botonEliminar.dataset.id

        );

    }

}