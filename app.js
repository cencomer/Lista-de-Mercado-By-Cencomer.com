document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const formulario = document.getElementById("formulario");
    const lista = document.getElementById("lista");
    const listaOculta = document.getElementById("listaOculta");
    const modalEditar = document.getElementById("modalEditar");
    const nuevoNombreInput = document.getElementById("nuevoNombre");
    const btnCompartirWhatsApp = document.getElementById("btnCompartirWhatsApp");
    const btnLimpiarLista = document.getElementById("btnLimpiarLista");
    const modalConfirmacion = document.getElementById("modalConfirmacion");

    // Función para cargar la lista desde el almacenamiento local
    function cargarListaDesdeLocalStorage() {
        const listaGuardada = JSON.parse(localStorage.getItem("lista")) || [];
        listaGuardada.forEach(item => {
            agregarElementoALista(item);
        });
    }

    // Función para agregar un elemento a la lista en el DOM
    function agregarElementoALista(item) {
        // Crear elementos de la lista (li, botones, etc.)
        const li = document.createElement("li");
        li.textContent = item;

        // Botón de Editar
        const btnEditar = document.createElement("button");
        const editarIcon = document.createElement("i");
        editarIcon.classList.add("fas", "fa-pencil-alt");
        btnEditar.appendChild(editarIcon);
        btnEditar.classList.add("bg-yellow-500", "text-white", "p-2", "rounded", "hover:bg-yellow-600", "mr-2");
        btnEditar.addEventListener("click", function () {
            const nombreActual = li.textContent;
            nuevoNombreInput.value = nombreActual;
            modalEditar.classList.remove("hidden");

            const modalContainer = document.querySelector(".modal-container");
            modalContainer.style.width = "80%";
            modalContainer.style.left = "10%";

            const btnGuardar = document.getElementById("btnGuardar");
            btnGuardar.addEventListener("click", function () {
                const nuevoNombre = nuevoNombreInput.value.trim();
                if (nuevoNombre !== "") {
                    li.textContent = nuevoNombre;

                    const listaActual = JSON.parse(localStorage.getItem("lista")) || [];
                    const index = listaActual.indexOf(nombreActual);
                    if (index !== -1) {
                        listaActual[index] = nuevoNombre;
                        localStorage.setItem("lista", JSON.stringify(listaActual));
                    }

                    modalEditar.classList.add("hidden");
                }
            });
        });

        // Botón de Eliminar (como antes)
        const btnEliminar = document.createElement("button");
        const eliminarIcon = document.createElement("i");
        eliminarIcon.classList.add("fas", "fa-trash-alt");
        btnEliminar.appendChild(eliminarIcon);
        btnEliminar.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600");
        btnEliminar.addEventListener("click", function () {
            li.remove();
            actualizarLista();
        });

        // Agregar elementos a la lista
        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);
        lista.appendChild(li);

        // Guardar la lista en el almacenamiento local
        actualizarLista();
    }

    // Función para actualizar la lista en el almacenamiento local
    function actualizarLista() {
        const listaActual = [];
        const elementosLi = lista.querySelectorAll("li");
        elementosLi.forEach(elemento => {
            listaActual.push(elemento.textContent);
        });
        localStorage.setItem("lista", JSON.stringify(listaActual));
        listaOculta.value = listaActual.join("\n");
    }

    // Evento para agregar elementos a la lista
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        const itemInput = document.getElementById("item");
        const item = itemInput.value.trim();

        if (item !== "") {
            agregarElementoALista(item);
            itemInput.value = "";
        }
    });

    // Evento para compartir en WhatsApp y otras opciones disponibles en el dispositivo
    btnCompartirWhatsApp.addEventListener("click", function () {
        const textoLista = listaOculta.value;

        if (navigator.share) {
            navigator.share({
                text: `Mi Lista de Mercado:\n${textoLista}`,
                title: 'Lista de Mercado' // Puedes agregar un título opcional
            })
                .then(() => console.log("Contenido compartido con éxito."))
                .catch(error => console.error("Error al compartir el contenido:", error));
        } else {
            alert("Tu navegador no admite la función de compartir. Puedes copiar manualmente el contenido.");
        }
    });


    // Evento para mostrar el modal de limpiar lista
    btnLimpiarLista.addEventListener("click", function () {
        const modalContainer = modalConfirmacion.querySelector(".modal-container");

        if (window.innerWidth >= 768) {
            modalContainer.classList.add("w-1/2");
        } else {
            modalContainer.classList.add("w-4/5");
        }

        modalConfirmacion.classList.remove("hidden");

        // Evento de confirmar eliminación
        const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
        btnConfirmarEliminar.addEventListener("click", function () {
            const elementosLi = lista.querySelectorAll("li");
            elementosLi.forEach(elemento => {
                elemento.remove();
            });

            localStorage.removeItem("lista");
            listaOculta.value = "";

            modalConfirmacion.classList.add("hidden");
        });

        // Evento de cancelar eliminación
        const btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
        btnCancelarEliminar.addEventListener("click", function () {
            modalConfirmacion.classList.add("hidden");
        });
    });

    // Cargar la lista desde el almacenamiento local al cargar la página
    cargarListaDesdeLocalStorage();
});
