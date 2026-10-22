//Importar Auth Service
import { authService } from "../services/AuthService.js";

//Mostrar Usuario
function mostrarUsuario() {
  //obtener usuario
  const usuario = authService.getCurrentUser();
  //Validar Usuario
  if (!usuario) {
    return;
  }
  //obtener elemento del DOM
  const nombreUsuario = document.querySelector("#nombreUsuario");
  //Mostrar Nombre
  if (nombreUsuario) {
    nombreUsuario.textContent = `Sesión iniciada como ${usuario.nombre}`;
  }
}

//Inicializar Logout(cerrar cesión)
function inicializarLogout() {
  //Obtener Botón
  const logoutBtn = document.querySelector("#logoutBtn");
  //Validar Botón
  if (!logoutBtn) {
    return;
  }
  //Evento click
  logoutBtn.addEventListener("click", () => {
    //confirmar salida
    Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      //Cancelar
      if (!result.isConfirmed) {
        return;
      }
      //cerrar sesión
      authService.logout();
      //Volver al login
      window.location.href = "index.html";
    });
  });
}

//Inicializar Dashboard
function init() {
  //proteger ruta
  const accesoPermitido = authService.protegerRuta();
  //Detener sin acceso
  if (!accesoPermitido) {
    return;
  }
  //Mosatrr usuario
  mostrarUsuario();
  //activarLogout
  inicializarLogout();
}
//ejecutamos
init();
