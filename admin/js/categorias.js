// ====================================
// CATEGORÍAS
// ====================================

let categorias = [];

// ====================================
// CARGAR CATEGORÍAS
// ====================================

async function cargarCategorias() {

    try {

        mostrarLoader();

        categorias = await apiObtenerCategorias();

        renderCategorias();
        cargarSelectCategorias();

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error cargando categorías");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// RENDER TABLA
// ====================================

function renderCategorias() {

    const tabla = $("listaCategorias");

    if (!tabla) return;

    if (categorias.length === 0) {

        tabla.innerHTML = `

            <tr>

                <td colspan="4">

                    No hay categorías.

                </td>

            </tr>

        `;

        return;

    }

    tabla.innerHTML = categorias
        .map(crearFilaCategoria)
        .join("");

}

// ====================================
// CREAR FILA
// ====================================

function crearFilaCategoria(categoria) {

    return `

        <tr>

            <td>${categoria.id}</td>

            <td>${categoria.nombre}</td>

            <td>${categoria.slug}</td>

            <td>

                <button
                    class="btn-edit-cat"
                    data-id="${categoria.id}">

                    ✏️

                </button>

                <button
                    class="btn-delete-cat"
                    data-id="${categoria.id}">

                    🗑️

                </button>

            </td>

        </tr>

    `;

}

// ====================================
// SELECTS
// ====================================

function cargarSelectCategorias() {

    const selectAgregar = $("add-categoria");
    const selectEditar = $("edit-categoria");

    if (!selectAgregar || !selectEditar) return;

    selectAgregar.innerHTML = "";
    selectEditar.innerHTML = "";

    categorias.forEach(categoria => {

        agregarOpcion(selectAgregar, categoria);

        agregarOpcion(selectEditar, categoria);

    });

}

// ====================================
// AGREGAR OPCIÓN
// ====================================

function agregarOpcion(select, categoria) {

    const option = document.createElement("option");

    option.value = categoria.id;      // ✅ Enviar el ID
    option.textContent = categoria.nombre;

    select.appendChild(option);

}

// ====================================
// CREAR
// ====================================

async function crearCategoria() {

    delete $("guardarCategoria").dataset.id;

    try {

        const nombre =
            $("categoriaNombre")
            .value
            .trim();

        if (estaVacio(nombre)) {

            mostrarToast(
                "Ingresá un nombre."
            );

            return;

        }

        mostrarLoader();

        await apiCrearCategoria({

            nombre,

            slug: generarSlug(nombre)

        });

        mostrarToast(
            "Categoría creada correctamente."
        );

        cerrarModalCategoria();

        await cargarCategorias();

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
// ABRIR EDITAR
// ====================================

async function abrirEditarCategoria(id) {

    try {

        mostrarLoader();
        const categoria =
            await apiObtenerCategoria(id);

        if (!categoria) {

            mostrarToast("Categoría no encontrada");

            return;

        }

        $("guardarCategoria").dataset.id =
            categoria.id;

        abrirModalCategoria(categoria);

    }
    catch (error) {

        console.error(error);

        mostrarToast(
            "Error cargando categoría"
        );

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// GUARDAR (CREAR / EDITAR)
// ====================================

async function guardarCategoria() {

    const id = $("guardarCategoria").dataset.id;

    if (id) {
        return editarCategoria(id);
    }

    return crearCategoria();

}

// ====================================
// EDITAR
// ====================================

async function editarCategoria(id) {

    try {

        mostrarLoader();

        const nombre =
            $("categoriaNombre")
                .value
                .trim();

        if (estaVacio(nombre)) {

            mostrarToast(
                "Ingresá un nombre."
            );

            return;

        }

        await apiActualizarCategoria(

            id,

            {

                nombre,

                slug: generarSlug(nombre)

            }

        );

        delete $("guardarCategoria").dataset.id;

        cerrarModalCategoria();

        mostrarToast(
            "Categoría actualizada."
        );

        await cargarCategorias();

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
// ELIMINAR
// ====================================

async function eliminarCategoria(id) {

    if (!confirmar("¿Eliminar esta categoría?")) {

        return;

    }

    try {

        mostrarLoader();

        await apiEliminarCategoria(id);

        mostrarToast(
            "Categoría eliminada correctamente."
        );

        await cargarCategorias();

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
// EVENTOS TABLA
// ====================================

function manejarClickCategorias(e) {

    const editar =
        e.target.closest(".btn-edit-cat");

    if (editar) {

        abrirEditarCategoria(
            editar.dataset.id
        );

        return;

    }

    const eliminar =
        e.target.closest(".btn-delete-cat");

    if (eliminar) {

        eliminarCategoria(
            eliminar.dataset.id
        );

    }

}

// ====================================
// INICIAR
// ====================================

function iniciarCategorias() {

    cargarCategorias();

    $("listaCategorias")
        ?.addEventListener(
            "click",
            manejarClickCategorias
        );

    $("guardarCategoria")
        ?.addEventListener(
            "click",
            guardarCategoria
        );

    $("btnNuevaCategoria")
        ?.addEventListener(
            "click",
            () => abrirModalCategoria()
        );

    $("cerrarModalCategoria")
        ?.addEventListener(
            "click",
            cerrarModalCategoria
        );

}