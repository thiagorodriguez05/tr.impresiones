async function cargarConfiguracion() {

    try {

        const config = await apiObtenerConfiguracion();

        $("cfg-precio-pla").value = config.precio_pla;
        $("cfg-precio-petg").value = config.precio_petg;
        $("cfg-precio-tpu").value = config.precio_tpu;
        $("cfg-margen").value = config.margen;

    } catch (error) {

        console.error(error);

    }

}

async function guardarConfiguracion() {

    try {

        const configuracion = {

            precio_pla: Number($("cfg-precio-pla").value),
            precio_petg: Number($("cfg-precio-petg").value),
            precio_tpu: Number($("cfg-precio-tpu").value),
            margen: Number($("cfg-margen").value)

        };

        await apiActualizarConfiguracion(configuracion);

        alert("Configuración guardada correctamente");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}

async function recalcularPrecios() {

    try {

        const respuesta =
            await apiRecalcularPrecios();

        alert(respuesta.mensaje);

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    cargarConfiguracion();

    $("btnGuardarConfiguracion")
        .addEventListener(
            "click",
            guardarConfiguracion
        );

    $("btnRecalcularPrecios")
        .addEventListener(
            "click",
            recalcularPrecios
        );

});