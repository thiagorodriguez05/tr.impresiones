let categoriaEditando = null;

// ====================================
// MODAL CATEGORÍA
// ====================================

function abrirModalCategoria(categoria = null) {

    categoriaEditando = categoria;

    limpiarFormularioCategoria();

    delete $("guardarCategoria").dataset.id;

    if (categoria) {

        $("categoriaNombre").value = categoria.nombre;
        $("categoriaSlug").value = categoria.slug;

        $("guardarCategoria").dataset.id = categoria.id;

        $("tituloCategoria").textContent = "Editar categoría";
        $("guardarCategoria").textContent = "Guardar";

    } else {

        $("tituloCategoria").textContent = "Nueva categoría";
        $("guardarCategoria").textContent = "Crear";

    }

    abrirModal("modalCategoria");

}

// ====================================

function cerrarModalCategoria() {

    categoriaEditando = null;

    delete $("guardarCategoria").dataset.id;

    limpiarFormularioCategoria();

    cerrarModal("modalCategoria");

}

// ====================================

function limpiarFormularioCategoria() {

    $("categoriaNombre").value = "";
    $("categoriaSlug").value = "";

}

// ====================================

function iniciarModalCategoria() {

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