// ====================================
// MODAL PEDIDOS
// ====================================

let modoPedido = "nuevo";
let pedidoEditando = null;
let productosDisponibles = [];

// ====================================
// CAMPOS
// ====================================

const CAMPOS_PEDIDO = [

    "pedido-add-nombre",
    "pedido-add-telefono",
    "pedido-add-email",
    "pedido-add-direccion"

];

// ====================================
// CARGAR PRODUCTOS
// ====================================

async function cargarProductosPedido() {

    productosDisponibles =
        await apiObtenerProductos();

}

// ====================================
// ABRIR NUEVO PEDIDO
// ====================================

async function abrirModalAgregarPedido() {

    modoPedido = "nuevo";

    pedidoEditando = null;

    $("pedido-id").value = "";

    await cargarProductosPedido();

    limpiarFormulario(CAMPOS_PEDIDO);

    $("pedido-add-estado").value =
        "Pendiente";

    $("detallePedido").innerHTML = "";

    agregarFilaProducto();

    actualizarTotal();

    abrirModal("modalAgregarPedido");

}

// ====================================
// ABRIR EDITAR PEDIDO
// ====================================

async function abrirModalEditarPedido(id) {

    try {

        mostrarLoader();

        modoPedido = "editar";

        pedidoEditando = id;

        await cargarProductosPedido();

        const pedido =
            await apiObtenerPedido(id);

        $("pedido-id").value =
            pedido.id;

        $("pedido-add-nombre").value =
            pedido.nombre;

        $("pedido-add-telefono").value =
            pedido.telefono;

        $("pedido-add-email").value =
            pedido.email || "";

        $("pedido-add-direccion").value =
            pedido.direccion || "";

        $("pedido-add-estado").value =
            pedido.estado;

        $("detallePedido").innerHTML = "";

        pedido.productos.forEach(producto => {

            agregarFilaProductoEditar(producto);

        });

        actualizarTotal();

        abrirModal("modalAgregarPedido");

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error cargando pedido"
        );

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// CERRAR MODAL
// ====================================

function cerrarModalAgregarPedido() {

    limpiarFormulario(CAMPOS_PEDIDO);

    $("pedido-id").value = "";

    $("pedido-add-estado").value = "Pendiente";

    $("pedido-total").textContent = "$0";

    $("detallePedido").innerHTML = "";

    pedidoEditando = null;

    modoPedido = "nuevo";

    cerrarModal("modalAgregarPedido");

}
// ====================================
// AGREGAR FILA
// ====================================

function agregarFilaProducto() {

    const tbody = $("detallePedido");

    const opciones = productosDisponibles
        .map(producto => `
            <option value="${producto.id}">
                ${producto.nombre}
            </option>
        `)
        .join("");

    tbody.insertAdjacentHTML("beforeend",`

        <tr>

            <td>

                <select class="pedido-producto">

                    <option value="">
                        Seleccione...
                    </option>

                    ${opciones}

                </select>

            </td>

            <td>

                <input
                    type="number"
                    class="pedido-cantidad"
                    value="1"
                    min="1">

            </td>

            <td class="pedido-precio">

                $0

            </td>

            <td class="pedido-subtotal">

                $0

            </td>

            <td>

                <button
                    type="button"
                    class="btnEliminarProducto">

                    🗑

                </button>

            </td>

        </tr>

    `);

    const fila = tbody.lastElementChild;

    fila
        .querySelector(".pedido-producto")
        .addEventListener(
            "change",
            () => actualizarFila(fila)
        );

    fila
        .querySelector(".pedido-cantidad")
        .addEventListener(
            "input",
            () => actualizarFila(fila)
        );

    fila
        .querySelector(".btnEliminarProducto")
        .addEventListener(
            "click",
            () => {

                fila.remove();

                if(
                    $("detallePedido").children.length===0
                ){

                    agregarFilaProducto();

                }

                actualizarTotal();

            }
        );

}

// ====================================
// AGREGAR FILA EDITAR
// ====================================

function agregarFilaProductoEditar(productoPedido){

    const tbody = $("detallePedido");

    const opciones = productosDisponibles
        .map(producto=>`

            <option
                value="${producto.id}"
                ${producto.id==productoPedido.producto_id?"selected":""}>

                ${producto.nombre}

            </option>

        `).join("");

    tbody.insertAdjacentHTML("beforeend",`

        <tr>

            <td>

                <select class="pedido-producto">

                    ${opciones}

                </select>

            </td>

            <td>

                <input
                    type="number"
                    class="pedido-cantidad"
                    value="${productoPedido.cantidad}"
                    min="1">

            </td>

            <td class="pedido-precio">

                $${Number(productoPedido.precio).toLocaleString("es-AR")}

            </td>

            <td class="pedido-subtotal">

                $${Number(
                    productoPedido.precio *
                    productoPedido.cantidad
                ).toLocaleString("es-AR")}

            </td>

            <td>

                <button
                    class="btnEliminarProducto"
                    type="button">

                    🗑

                </button>

            </td>

        </tr>

    `);

    const fila = tbody.lastElementChild;

    fila
        .querySelector(".pedido-producto")
        .addEventListener(
            "change",
            ()=>actualizarFila(fila)
        );

    fila
        .querySelector(".pedido-cantidad")
        .addEventListener(
            "input",
            ()=>actualizarFila(fila)
        );

    fila
        .querySelector(".btnEliminarProducto")
        .addEventListener(
            "click",
            ()=>{

                fila.remove();

                if(
                    $("detallePedido").children.length===0
                ){

                    agregarFilaProducto();

                }

                actualizarTotal();

            }
        );

}

// ====================================
// ACTUALIZAR FILA
// ====================================

function actualizarFila(fila){

    const producto = productosDisponibles.find(
        p => p.id == fila.querySelector(".pedido-producto").value
    );

    const cantidad =
        Number(
            fila.querySelector(".pedido-cantidad").value
        ) || 1;

    const precioCelda =
        fila.querySelector(".pedido-precio");

    const subtotalCelda =
        fila.querySelector(".pedido-subtotal");

    if(!producto){

        precioCelda.textContent="$0";
        subtotalCelda.textContent="$0";

        actualizarTotal();

        return;

    }

    const subtotal =
        producto.precio * cantidad;

    precioCelda.textContent =
        `$${Number(producto.precio).toLocaleString("es-AR")}`;

    subtotalCelda.textContent =
        `$${Number(subtotal).toLocaleString("es-AR")}`;

    actualizarTotal();

}

// ====================================
// OBTENER PRODUCTOS DEL FORMULARIO
// ====================================

function obtenerProductosFormulario() {

    const productos = [];

    document.querySelectorAll("#detallePedido tr").forEach(fila => {

        const productoId =
            Number(
                fila.querySelector(".pedido-producto").value
            );

        if (!productoId) return;

        const cantidad =
            Number(
                fila.querySelector(".pedido-cantidad").value
            ) || 1;

        const producto =
            productosDisponibles.find(
                p => p.id == productoId
            );

        if (!producto) return;

        productos.push({

            producto_id: productoId,

            cantidad,

            precio: Number(producto.precio)

        });

    });

    return productos;

}

// ====================================
// ACTUALIZAR TOTAL
// ====================================

function actualizarTotal() {

    let total = 0;

    document
        .querySelectorAll("#detallePedido tr")
        .forEach(fila => {

            const subtotal =
                fila.querySelector(".pedido-subtotal")
                    .textContent
                    .replace("$", "")
                    .replace(/\./g, "")
                    .replace(",", "")
                    .trim();

            total += Number(subtotal) || 0;

        });

    $("pedido-total").textContent =
        `$${total.toLocaleString("es-AR")}`;

}

// ====================================
// GUARDAR (NUEVO / EDITAR)
// ====================================

async function guardarPedidoModal() {

    try {

        mostrarLoader();

        const cliente = {

            nombre:
                $("pedido-add-nombre").value.trim(),

            telefono:
                $("pedido-add-telefono").value.trim(),

            email:
                $("pedido-add-email").value.trim(),

            direccion:
                $("pedido-add-direccion").value.trim()

        };

        if (estaVacio(cliente.nombre)) {

            mostrarToast("Ingresá el nombre.");

            return;

        }

        const productos =
            obtenerProductosFormulario();

        if (productos.length === 0) {

            mostrarToast(
                "Agregá al menos un producto."
            );

            return;

        }

        const pedido = {

            cliente,

            productos,

            estado:
                $("pedido-add-estado").value,

            observaciones: "",

            total:
                productos.reduce(

                    (s, p) =>

                        s + (p.precio * p.cantidad),

                    0

                )

        };

        if (modoPedido === "nuevo") {

            await apiCrearPedido(pedido);

            mostrarToast(
                "Pedido creado correctamente"
            );

        } else {

            await apiActualizarPedido(

                pedidoEditando,

                pedido

            );

            mostrarToast(
                "Pedido actualizado correctamente"
            );

        }

        cerrarModalAgregarPedido();

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
// EVENTOS
// ====================================

document.addEventListener("click", e => {

    if (e.target.id === "btnAgregarFilaPedido") {

        agregarFilaProducto();

    }

});