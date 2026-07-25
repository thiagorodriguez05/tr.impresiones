async function cargarDashboard(){

    const datos = await apiDashboard();

    $("card-ventas").textContent =
        `$${datos.ventas.toLocaleString("es-AR")}`;

    $("card-pedidos").textContent =
        datos.pendientes;

    $("card-clientes").textContent =
        datos.clientes;

    $("total-productos").textContent =
        datos.productos;

}