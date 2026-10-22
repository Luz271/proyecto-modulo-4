// Importamos modelos de usuario, cuenta y movimiento
import { Usuario } from "./models/Usuario.js";
import { Cuenta } from "./models/Cuenta.js";

// Importamos helpers, validadores y formateadores
// Importante: Asegúrate de importar generarNumeroCuenta o generarId
import { generarId, generarNumeroCuenta } from "./utils/helpers.js";

// Importamos validadores
import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";

// Importamos StorageService
import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

// Import AuthService
import { authService } from "./services/AuthService.js";

// Inicializar STORAGE
function InicializarStorage() {
  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, null);
  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, null);
  const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, null);

  if (usuarios === null) {
    storageService.guardar(STORAGE_KEYS.USUARIOS, []);
  }
  if (cuentas === null) {
    storageService.guardar(STORAGE_KEYS.CUENTAS, []);
  }
  if (movimientos === null) {
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, []);
  }
}

// Función Manejar Registro
function manejarRegistro(event) {
  event.preventDefault();

  const nombre = document.querySelector("#registroNombre").value.trim();
  const email = document
    .querySelector("#registroEmail")
    .value.trim()
    .toLowerCase();
  const telefono = document.querySelector("#registroTelefono").value.trim();
  const password = document.querySelector("#registroPassword").value;
  const confirmarPassword = document.querySelector(
    "#registroConfirmPassword",
  ).value;

  if (
    !validarCampoObligatorio(nombre) ||
    !validarCampoObligatorio(email) ||
    !validarCampoObligatorio(password)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa los campos obligatorios.",
    });
    return;
  }

  if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Contraseña inválida",
      text: "La contraseña debe tener al menos 6 caracteres.",
    });
    return;
  }

  if (password !== confirmarPassword) {
    Swal.fire({
      icon: "warning",
      title: "Contraseñas diferentes",
      text: "Las contraseñas no coinciden.",
    });
    return;
  }

  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
  const emailExistente = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === email,
  );

  if (emailExistente) {
    Swal.fire({
      icon: "error",
      title: "Correo registrado",
      text: "Ya existe un usuario con este correo.",
    });
    return;
  }

  const nuevoUsuario = new Usuario({
    nombre,
    email,
    telefono,
    password,
  });

  let numeroCuenta;
  do {
    numeroCuenta = generarNumeroCuenta();
  } while (
    storageService
      .obtener(STORAGE_KEYS.CUENTAS, [])
      .some((cuenta) => cuenta.numeroCuenta === numeroCuenta)
  );

  const nuevaCuenta = new Cuenta({
    numeroCuenta,
    tipo: "Ahorro",
    saldo: 0,
    usuarioId: nuevoUsuario.id,
  });

  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

  usuarios.push(nuevoUsuario);
  cuentas.push(nuevaCuenta);

  storageService.guardar(STORAGE_KEYS.USUARIOS, usuarios);
  storageService.guardar(STORAGE_KEYS.CUENTAS, cuentas);

  Swal.fire({
    icon: "success",
    title: "Registro exitoso",
    text: "Tu usuario y cuenta bancaria fueron creados correctamente.",
    confirmButtonText: "Continuar",
  }).then(() => {
    document.querySelector("#formRegistro").reset();
    document.querySelector("#loginEmail").value = email;
  });
}

// Manejar LOGIN (Corregido)
function manejarLogin(event) {
  event.preventDefault();

  const email = document
    .querySelector("#loginEmail")
    .value.trim()
    .toLowerCase();
  const password = document.querySelector("#loginPassword").value;

  // Validar campos dentro de la función
  if (!validarCampoObligatorio(email) || !validarCampoObligatorio(password)) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Ingresa tu correo y contraseña.",
    });
    return;
  }

  // Intentar login
  try {
    const usuario = authService.login(email, password);

    Swal.fire({
      icon: "success",
      title: `Bienvenido, ${usuario.nombre}`,
      text: "Inicio de sesión correcto.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible iniciar sesión",
      text: error.message,
    });
  }
}

// Inicializar aplicación
function init() {
  InicializarStorage();

  if (authService.getCurrentUser()) {
    window.location.href = "dashboard.html";
    return;
  }

  const formLogin = document.querySelector("#formLogin");
  const formRegistro = document.querySelector("#formRegistro");

  if (formLogin) {
    formLogin.addEventListener("submit", manejarLogin);
  }

  if (formRegistro) {
    formRegistro.addEventListener("submit", manejarRegistro);
  }
}

init();
