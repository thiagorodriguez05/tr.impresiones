// ====================================
// PEDIDOS
// ====================================

let pedidos = [];

// ====================================
// CARGAR PEDIDOS
// ====================================

async function cargarPedidos() {

    try {

        mostrarLoader();

        pedidos = await apiObtenerPedidos();

        renderPedidos();

        $("card-pedidos").textContent = pedidos.length;

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error cargando pedidos");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// RENDER
// ====================================

function renderPedidos() {

    const tabla = $("tabla-pedidos");

    if (!tabla) return;

    if (pedidos.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    No hay pedidos registrados.

                </td>

            </tr>

        `;

        return;

    }

    tabla.innerHTML = pedidos
        .map(crearFilaPedido)
        .join("");

}


function badgeEstado(estado){

    if(estado==="Entregado"){

        return `
            <span class="badge-entregado">
                🟢 Entregado
            </span>
        `;

    }

    return `
        <span class="badge-pendiente">
            🔴 Pendiente
        </span>
    `;

}

// ====================================
// CREAR FILA
// ====================================

function crearFilaPedido(pedido){

    return `

        <tr>

            <td>${pedido.id}</td>

            <td>${pedido.nombre}</td>

            <td>${new Date(pedido.fecha).toLocaleDateString()}</td>

            <td>$${Number(pedido.total).toLocaleString()}</td>

            <td>

                ${badgeEstado(pedido.estado)}

            </td>

            <td>

                <button
                    class="btn-edit"
                    data-id="${pedido.id}">

                    ✏️

                </button>

                ${
                    pedido.estado==="Pendiente"
                    ?

                    `
                    <button
                        class="btn-entregar"
                        data-id="${pedido.id}">

                        ✅

                    </button>
                    `

                    :

                    ""

                }

                <button
                    class="btn-delete"
                    data-id="${pedido.id}">

                    🗑️

                </button>

            </td>

        </tr>

    `;

}

// ====================================
// OBTENER DATOS
// ====================================

function obtenerDatosPedido(prefijo) {

    return {

        nombre:
            $(`pedido-${prefijo}-nombre`).value.trim(),

        telefono:
            $(`pedido-${prefijo}-telefono`).value.trim(),

        email:
            $(`pedido-${prefijo}-email`).value.trim(),

        direccion:
            $(`pedido-${prefijo}-direccion`).value.trim()

    };

}

// ====================================
// AGREGAR
// ====================================

async function agregarPedido() {

    try {

        mostrarLoader();

        const cliente = {

            nombre: $("pedido-add-nombre").value.trim(),
            telefono: $("pedido-add-telefono").value.trim(),
            email: $("pedido-add-email").value.trim(),
            direccion: $("pedido-add-direccion").value.trim()

        };

        if (estaVacio(cliente.nombre)) {

            mostrarToast("Ingresá el nombre.");

            return;

        }

        const fila = document.querySelector("#detallePedido tr");

        const select = fila.querySelector(".pedido-producto");
        const cantidad = Number(
            fila.querySelector(".pedido-cantidad").value
        );

        const producto = productosDisponibles.find(
            p => p.id == select.value
        );

        const productos = [

            {

                producto_id: producto.id,
                cantidad,
                precio: Number(producto.precio)

            }

        ];

        const pedido = {

            cliente,

            productos,

            estado: $("pedido-add-estado").value,

            observaciones: "",

            total: productos.reduce(

                (s, p) => s + p.precio * p.cantidad,

                0

            )

        };

        console.log(pedido);

        await apiCrearPedido(pedido);

        cerrarModalAgregarPedido();

        mostrarToast("Pedido creado correctamente");

        await cargarPedidos();

    }
    catch (error) {

        console.error(error);

        mostrarToast(error.message);

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// GUARDAR
// ====================================

async function guardarPedido() {

    try {

        mostrarLoader();

        const id = $("pedido-edit-id").value;

        const pedido =
            obtenerDatosPedido("edit");

        await apiActualizarPedido(id, pedido);

        cerrarModalEditarPedido();

        mostrarToast("Pedido actualizado correctamente");

        await cargarPedidos();

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error actualizando pedido");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// ELIMINAR
// ====================================

async function eliminarPedido(id) {

    if (!confirmar("¿Eliminar este pedido?")) {

        return;

    }

    try {

        mostrarLoader();

        await apiEliminarPedido(id);

        mostrarToast("Pedido eliminado correctamente");

        await cargarPedidos();

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error eliminando pedido");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// INICIAR
// ====================================

function iniciarPedidos() {

    cargarPedidos();

    $("tabla-pedidos")
        ?.addEventListener(
            "click",
            manejarClickTablaPedidos
        );

    $("btnAbrirAgregarPedido")
        ?.addEventListener(
            "click",
            abrirModalAgregarPedido
        );

    $("btnCancelarAgregarPedido")
        ?.addEventListener(
            "click",
            cerrarModalAgregarPedido
        );

    $("btnGuardarPedido")
        ?.addEventListener(
            "click",
            guardarPedidoModal
        );

}

// ====================================
// EVENTOS TABLA
// ====================================

// ====================================
// EVENTOS TABLA
// ====================================

async function manejarClickTablaPedidos(e) {

    const botonEditar = e.target.closest(".btn-edit");

    if (botonEditar) {

        abrirModalEditarPedido(
            botonEditar.dataset.id
        );

        return;

    }

    const botonEliminar = e.target.closest(".btn-delete");

    if (botonEliminar) {

        eliminarPedido(
            botonEliminar.dataset.id
        );

        return;

    }

    const botonEntregar = e.target.closest(".btn-entregar");

    if (botonEntregar) {

        if (!confirm("¿Marcar este pedido como entregado?")) {
            return;
        }

        try {

            mostrarLoader();

            await apiCambiarEstadoPedido(
                botonEntregar.dataset.id
            );

            mostrarToast("Pedido entregado correctamente");

            await cargarPedidos();

        }
        catch (error) {

            console.error(error);

            mostrarToast(error.message);

        }
        finally {

            ocultarLoader();

        }

        return;

    }

}