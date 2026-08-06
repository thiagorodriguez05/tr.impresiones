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

        calcularPrecioProducto("edit");

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

    $("edit-stock").value =
        producto.stock;

    $("edit-descripcion").value =
        producto.descripcion || "";

    $("edit-categoria").value =
        producto.categoria;

    $("edit-material").value =
        producto.material || "pla";

    $("edit-gramos").value =
        producto.gramos || 0;

    $("edit-precio").value =
        producto.precio;

    $("precio-calculado-edit").textContent =
        `$${formatearPrecio(producto.precio)}`;

}

// ====================================
// PREVIEW
// ====================================

function actualizarPreview(imagenes) {

    const contenedor =
        $("previewEditar");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (!imagenes || imagenes.length === 0) {

        contenedor.innerHTML = `

            <img
                src="/img/no-image.png"
                class="preview-imagen">

        `;

        return;

    }

    imagenes.forEach(imagen => {

        contenedor.innerHTML += `

            <img
                src="/${imagen}"
                class="preview-imagen">

        `;

    });

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

    limpiarFormulario(CAMPOS_PRODUCTO);

    abrirModal("modalAgregar");

    calcularPrecioProducto("add");

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

// ====================================
// CALCULAR PRECIO
// ====================================

function redondearPrecio(precio) {

    return Math.round(precio / 500) * 500;

}


async function calcularPrecioProducto(prefijo) {

    try {

        const config = await apiObtenerConfiguracion();

        console.log(config);

        const material =
            $(`${prefijo}-material`).value;

        const gramos =
            Number(
                $(`${prefijo}-gramos`).value
            ) || 0;

            let precioKg = 0;

            switch (material) {

                case "pla":
                    precioKg = Number(config.precio_pla);
                    break;

                case "petg":
                    precioKg = Number(config.precio_petg);
                    break;

                case "tpu":
                    precioKg = Number(config.precio_tpu);
                    break;

            }

            const costoMaterial =
                (precioKg / 1000) * gramos;

            const costoTotal =
                costoMaterial;
                
            const margen = Number(config.margen);

            const precioFinal = redondearPrecio(
                costoTotal * (1 + margen / 100)
            );
                            
            $(`${prefijo}-precio`).value =
                precioFinal;

            if (prefijo === "add") {

                $("precio-calculado").textContent =
                    `$${formatearPrecio(precioFinal)}`;

            }
            else {

                $("precio-calculado-edit").textContent =
                    `$${formatearPrecio(precioFinal)}`;

            }


    }
    catch (error) {

        console.error(error);

    }

}