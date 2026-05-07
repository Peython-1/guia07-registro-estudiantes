let estudiantes = [];
let indiceEditando = null;

const formEstudiante = document.getElementById("formEstudiante");
const tablaEstudiantes = document.getElementById("tablaEstudiantes");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador");
const btnGuardar = document.getElementById("btnGuardar");
const btnLimpiar = document.getElementById("btnLimpiar");

formEstudiante.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const nombres = document.getElementById("nombres").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const carrera = document.getElementById("carrera").value;
    const semestre = document.getElementById("semestre").value;
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const promedio = document.getElementById("promedio").value.trim();
    const observacion = document.getElementById("observacion").value.trim();

    if (
        codigo === "" ||
        nombres === "" ||
        apellidos === "" ||
        carrera === "" ||
        semestre === "" ||
        correo === "" ||
        telefono === "" ||
        promedio === ""
    ) {
        mostrarMensaje("Complete todos los campos obligatorios.", "error");
        return;
    }

    if (!validarCorreo(correo)) {
        mostrarMensaje("Ingrese un correo electrónico válido.", "error");
        return;
    }

    if (telefono.length < 9) {
        mostrarMensaje("El teléfono debe tener al menos 9 dígitos.", "error");
        return;
    }

    if (promedio < 0 || promedio > 20) {
        mostrarMensaje("El promedio debe estar entre 0 y 20.", "error");
        return;
    }

    const estudiante = {
        codigo,
        nombres,
        apellidos,
        carrera,
        semestre,
        correo,
        telefono,
        promedio,
        observacion
    };

    if (indiceEditando === null) {
        estudiantes.push(estudiante);
        mostrarMensaje("Estudiante registrado correctamente.", "correcto");
    } else {
        estudiantes[indiceEditando] = estudiante;
        indiceEditando = null;
        btnGuardar.textContent = "Registrar estudiante";
        mostrarMensaje("Datos del estudiante actualizados correctamente.", "correcto");
    }

    guardarEnLocalStorage();
    mostrarEstudiantes();
    limpiarFormulario();
});

btnLimpiar.addEventListener("click", function() {
    limpiarFormulario();
    indiceEditando = null;
    btnGuardar.textContent = "Registrar estudiante";
    mostrarMensaje("Formulario limpiado.", "correcto");
});

function mostrarEstudiantes() {
    tablaEstudiantes.innerHTML = "";

    estudiantes.forEach(function(estudiante, indice) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${estudiante.codigo}</td>
            <td>${estudiante.nombres} ${estudiante.apellidos}</td>
            <td>${estudiante.carrera}</td>
            <td>${estudiante.semestre}</td>
            <td>${estudiante.correo}</td>
            <td>${estudiante.promedio}</td>
            <td>
                <button class="btn-editar" onclick="editarEstudiante(${indice})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEstudiante(${indice})">Eliminar</button>
            </td>
        `;

        tablaEstudiantes.appendChild(fila);
    });

    contador.textContent = estudiantes.length + " registrados";
}

function editarEstudiante(indice) {
    const estudiante = estudiantes[indice];

    document.getElementById("codigo").value = estudiante.codigo;
    document.getElementById("nombres").value = estudiante.nombres;
    document.getElementById("apellidos").value = estudiante.apellidos;
    document.getElementById("carrera").value = estudiante.carrera;
    document.getElementById("semestre").value = estudiante.semestre;
    document.getElementById("correo").value = estudiante.correo;
    document.getElementById("telefono").value = estudiante.telefono;
    document.getElementById("promedio").value = estudiante.promedio;
    document.getElementById("observacion").value = estudiante.observacion;

    indiceEditando = indice;
    btnGuardar.textContent = "Actualizar estudiante";

    mostrarMensaje("Editando datos del estudiante.", "correcto");
}

function eliminarEstudiante(indice) {
    const confirmar = confirm("¿Está seguro de eliminar este estudiante?");

    if (confirmar) {
        estudiantes.splice(indice, 1);
        guardarEnLocalStorage();
        mostrarEstudiantes();
        mostrarMensaje("Estudiante eliminado correctamente.", "correcto");
    }
}

function limpiarFormulario() {
    formEstudiante.reset();
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo;

    setTimeout(function() {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }, 3000);
}

function validarCorreo(correo) {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresion.test(correo);
}

function guardarEnLocalStorage() {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
}

function cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem("estudiantes");

    if (datosGuardados !== null) {
        estudiantes = JSON.parse(datosGuardados);
        mostrarEstudiantes();
    }
}

cargarDesdeLocalStorage();