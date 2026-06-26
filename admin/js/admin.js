document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".sidebar a");
    const sections = document.querySelectorAll(".content-section");

    // ======================
    // NAVEGACIÓN
    // ======================

    links.forEach(link => {

        link.addEventListener("click", e => {

            e.preventDefault();

            const sectionName = link.dataset.section;

            if (!sectionName) return;

            links.forEach(l =>
                l.classList.remove("active")
            );

            link.classList.add("active");

            sections.forEach(section =>
                section.classList.add("hidden")
            );

            const target = document.getElementById(
                `${sectionName}-section`
            );

            if (target) {
                target.classList.remove("hidden");
            }

        });

    });

    // ======================
    // CERRAR MODAL
    // ======================

    document
    .getElementById("btnCancelar")
    .addEventListener("click", () => {

        document
        .getElementById("modalEditar")
        .classList.add("hidden");

    });

    // ======================
    // GUARDAR
    // ======================

    document
    .getElementById("btnGuardar")
    .addEventListener(
        "click",
        guardarProducto
    );

            cargarProductos();

            cargarCategorias();
            document
        .getElementById("btnAbrirAgregar")
        .addEventListener("click", () => {

            document
            .getElementById("modalAgregar")
            .classList.remove("hidden");

        });

    document
    .getElementById("btnCancelarAgregar")
    .addEventListener("click", () => {

        document
        .getElementById("modalAgregar")
        .classList.add("hidden");

    });

    document
    .getElementById("btnAgregar")
    .addEventListener(
        "click",
        agregarProducto
    );

});

// ====================================
// CARGAR PRODUCTOS
// ====================================

async function cargarProductos() {

    try {

        mostrarLoader();
        const respuesta =
        await fetch("/api/productos");

        const productos = await respuesta.json();

        console.log(productos);
        console.log(productos[0]);
        console.log(productos[0].imagenes);
        console.log(JSON.stringify(productos, null, 2));

        const tabla =
        document.getElementById(
            "tabla-productos"
        );

        tabla.innerHTML = "";

        const total =
        document.getElementById(
            "total-productos"
        );

        if (total) {
            total.textContent =
            productos.length;
        }

            productos.forEach(producto=>{

                let estado="";

                if(producto.stock==0){

                    estado="🔴 Sin stock";

                }
                else if(producto.stock<=5){

                    estado="🟡 Poco stock";

                }
                else{

                    estado="🟢 Disponible";

                }
           tabla.innerHTML += `
                <tr>

                    <td>
                    <img
                            src="${
                                producto.imagenes && producto.imagenes.length > 0
                                    ? "/" + producto.imagenes[0]
                                    : "/img/no-image.png"
                            }"
                            class="product-img"
                            alt="${producto.nombre}"
                        >
                    </td>

                    <td>${producto.nombre}</td>

                    <td>$${Number(producto.precio).toLocaleString("es-AR")}</td>

                    <td>${producto.stock}</td>

                    <td>${estado}</td>

                    <td>${producto.categoria}</td>

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

        });

        activarBotonesEditar();
        activarBotonesEliminar();

    }
    catch(error){

        console.error(
            "Error cargando productos:",
            error
        );

    }
    finally{
        ocultarLoader();
    }

}

// ====================================
// EDITAR
// ====================================

function activarBotonesEditar() {

    document
    .querySelectorAll(".btn-edit")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            async () => {

                try {

                    const id = btn.dataset.id;

                    mostrarLoader();
                    const respuesta =
                    await fetch(
                        `/api/productos/${id}`
                    );

                    const producto =
                    await respuesta.json();

                    document.getElementById(
                        "edit-id"
                    ).value = producto.id;

                    document.getElementById(
                        "nombre-producto-modal"
                    ).textContent =
                    producto.nombre;

                    document.getElementById(
                        "edit-precio"
                    ).value =
                    producto.precio;

                    document.getElementById(
                        "edit-stock"
                    ).value =
                    producto.stock;

                    document.getElementById(
                        "edit-descripcion"
                    ).value =
                    producto.descripcion || "";

                    // Imagen
                    const preview =
                    document.getElementById(
                        "preview-imagen"
                    );

                    if (producto.imagenes && producto.imagenes.length > 0) {

                        preview.src = "/" + producto.imagenes[0];

                    } else {

                        preview.src = "";

                    }

                    document
                    .getElementById(
                        "modalEditar"
                    )
                    .classList.remove("hidden");

                }
                catch(error){

                    console.error(
                        "Error editando:",
                        error
                    );

                }
                finally{
                        ocultarLoader();
                    }

            }
        );

    });

}

// ====================================
// ELIMINAR
// ====================================

function activarBotonesEliminar() {

    document
    .querySelectorAll(".btn-delete")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            async () => {

                const id =
                btn.dataset.id;

                const confirmar =
                confirm(
                    "¿Eliminar producto?"
                );

                if (!confirmar) return;

                mostrarLoader();
                await fetch(
                    `/api/productos/${id}`,
                    {
                        method: "DELETE"
                    }
                );
                ocultarLoader();

                cargarProductos();

            }
        );

    });

}


// ====================================
// GUARDAR PRODUCTO
// ====================================

async function guardarProducto() {

    try {

        mostrarLoader();
        const id =
        document.getElementById(
            "edit-id"
        ).value;
        await fetch(
            `/api/productos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    precio: Number(
                        document.getElementById(
                            "edit-precio"
                        ).value
                    ),

                    stock: Number(
                        document.getElementById(
                            "edit-stock"
                        ).value
                    ),

                    descripcion:
                    document.getElementById(
                        "edit-descripcion"
                    ).value

                })
                

            }
        );

        console.log({
            precio: Number(
                document.getElementById("edit-precio").value
            ),
            stock: Number(
                document.getElementById("edit-stock").value
            ),
            descripcion:
                document.getElementById("edit-descripcion").value
        });

        document
        .getElementById(
            "modalEditar"
        )
        .classList.add("hidden");

        cargarProductos();

    }
    catch(error){

        console.error(
            "Error actualizando:",
            error
        );

    }
    finally{
        ocultarLoader();
    }

}

async function agregarProducto() {

    try {

        // ==========================
        // SUBIR IMÁGENES
        // ==========================

        const archivos =
            document.getElementById("add-imagen").files;

        let rutasImagenes = [];

        if (archivos.length > 0) {

            mostrarLoader();

            const formData = new FormData();

            for (const archivo of archivos) {

                formData.append(
                    "imagenes",
                    archivo
                );

            }

            const subida =
                await fetch("/api/upload", {

                    method: "POST",

                    body: formData

                });

            rutasImagenes =
                await subida.json();

            ocultarLoader();

        }

        // ==========================
        // CREAR PRODUCTO
        // ==========================

        const producto = {

            nombre:
                document.getElementById("add-nombre").value,

            precio: Number(
                document.getElementById("add-precio").value
            ),

            stock: Number(
                document.getElementById("add-stock").value
            ),

            categoria:
                document.getElementById("add-categoria").value,

            descripcion:
                document.getElementById("add-descripcion").value,

            imagenes: rutasImagenes

        };

        const respuesta =
            await fetch("/api/productos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(producto)

            });

        if (!respuesta.ok) {

            throw new Error("No se pudo agregar");

        }

        mostrarToast("Producto agregado");

        document.getElementById("add-nombre").value = "";
        document.getElementById("add-precio").value = "";
        document.getElementById("add-stock").value = "";
        document.getElementById("add-descripcion").value = "";
        document.getElementById("add-imagen").value = "";

        document
            .getElementById("modalAgregar")
            .classList.add("hidden");

        cargarProductos();

    }
    catch (error) {

        console.error(error);

        mostrarToast("Error agregando producto");

    }
    finally {

        ocultarLoader();

    }

}

// ====================================
// CARGAR CATEGORÍAS
// ====================================

async function cargarCategorias(){
     console.log("cargarCategorias ejecutada");
    try{

        mostrarLoader();
        const respuesta = await fetch("/api/categorias");
        console.log(respuesta.status);
        const categorias = await respuesta.json();
        console.log(categorias);
        const select = document.getElementById("add-categoria");

        select.innerHTML = "";

        categorias.forEach(categoria => {

            const option = document.createElement("option");

            option.value = categoria.nombre;
            option.textContent = categoria.nombre;

            select.appendChild(option);

        });


    }
    catch(error){
        
        console.error(
            "Error cargando categorías:",
            error
        );
        
    }
    finally{
        ocultarLoader();
    }

}
function mostrarLoader() {

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "flex";
    }

}

function ocultarLoader() {

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }

}

function mostrarToast(texto) {

    alert(texto);

}