let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let productoEditando = null;

function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensajeLogin");

  if (usuario === "admin" && password === "1234") {
    document.getElementById("login").classList.add("oculto");
    document.getElementById("sistema").classList.remove("oculto");
    mostrarInventario();
  } else {
    mensaje.textContent = "Usuario o contraseña incorrectos";
    mensaje.className = "error";
  }
}

function cerrarSesion() {
  document.getElementById("sistema").classList.add("oculto");
  document.getElementById("login").classList.remove("oculto");
}

function guardarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim();
  const fisico = Number(document.getElementById("cantidadProducto").value);
  const sistema = Number(document.getElementById("cantidadSistema").value);
  const unidad = document.getElementById("unidadProducto").value;
  if (!nombre || !unidad || fisico < 0 || sistema < 0) {
    alert("Completa correctamente todos los campos.");
    return;
  }

  if (productoEditando) {
    inventario = inventario.map(producto => {
      if (producto.id === productoEditando) {
        return { id: producto.id, nombre, fisico, sistema };
      }
      return producto;
    });
    productoEditando = null;
    document.getElementById("tituloFormulario").textContent = "Registro de producto";
  } else {
   inventario.push({
  id: Date.now(),
  nombre,
  unidad,
  fisico,
  sistema
});
  }

  limpiarFormulario();
  guardarDatos();
  mostrarInventario();
}

function mostrarInventario() {
  const tabla = document.getElementById("tablaInventario");
  const busqueda = document.getElementById("buscador")?.value.toLowerCase() || "";

  tabla.innerHTML = "";

  let correctos = 0;
  let discrepancias = 0;

  const filtrados = inventario.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda)
  );

  filtrados.forEach(producto => {
    const diferencia = producto.fisico - producto.sistema;
    const estado = diferencia === 0 ? "Correcto" : "Discrepancia";

    if (diferencia === 0) correctos++;
    else discrepancias++;

    tabla.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.unidad}</td>
        <td>${producto.fisico}</td>
        <td>${producto.sistema}</td>
        <td>${diferencia}</td>
        <td class="${diferencia === 0 ? "correcto" : "error"}">${estado}</td>
        <td>
          <button onclick="editarProducto(${producto.id})">Editar</button>
          <button class="btn-peligro" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  actualizarReporte(correctos, discrepancias);
}

function editarProducto(id) {
  const producto = inventario.find(p => p.id === id);

  document.getElementById("nombreProducto").value = producto.nombre;
  document.getElementById("cantidadProducto").value = producto.fisico;
  document.getElementById("cantidadSistema").value = producto.sistema;
  document.getElementById("unidadProducto").value = producto.unidad;
  
  productoEditando = id;
  document.getElementById("tituloFormulario").textContent = "Editar producto";
}

function eliminarProducto(id) {
  inventario = inventario.filter(producto => producto.id !== id);
  guardarDatos();
  mostrarInventario();
}

function limpiarInventario() {
  const confirmar = confirm("¿Seguro que deseas borrar todo el inventario?");
  if (!confirmar) return;

  inventario = [];
  guardarDatos();
  mostrarInventario();
}

function cancelarEdicion() {
  productoEditando = null;
  limpiarFormulario();
  document.getElementById("tituloFormulario").textContent = "Registro de producto";
}

function limpiarFormulario() {
  document.getElementById("nombreProducto").value = "";
  document.getElementById("cantidadProducto").value = "";
  document.getElementById("cantidadSistema").value = "";
}

function guardarDatos() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

function actualizarReporte(correctos, discrepancias) {
  document.getElementById("totalProductos").textContent = inventario.length;
  document.getElementById("totalCorrectos").textContent = correctos;
  document.getElementById("totalDiscrepancias").textContent = discrepancias;

  document.getElementById("reporte").textContent =
    `El sistema registra ${inventario.length} productos. Se detectaron ${discrepancias} discrepancias y ${correctos} productos correctos.`;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}