console.log("Sistema de Gestión Bancaria - v0.5.0");

//Importamos helpers, validadores y formateadores

//Importamos validadores

import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";

//importamos generar ID

import { generarId } from "./utils/helpers.js";

//Importamos funciones para preparar datos antes de mostrarlas al usuario

import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "./utils/formatters.js";

//Importamos modelos de usuario, cuenta y moimiento

import { Usuario } from "./models/usuario.js";

import { Cuenta } from "./models/Cuenta.js";

import { Movimiento } from "./models/Movimiento.js";

//Importamos Banco

import { Banco } from "./models/Banco.js";

//importamos StorageService
import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

//función que guardara el estado del banco

function guardarBanco(banco) {
  //Guardar Usuarios
  storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
  //Guaradar Cuentas
  storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
  //Guardar Movimientos
  storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}

//función para recuperar el banco
//Cargar Banco
function cargarBanco() {
  // RECUPERAR USUARIOS
  const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
  // RECUPERAR CUENTAS
  const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
  // RECUPERAR MOVIMIENTOS
  const movimientosGuardados = storageService.obtener(
    STORAGE_KEYS.MOVIMIENTOS,
    [],
  );
  // RECONSTRUIR USUARIOS
  const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));
  // RECONSTRUIR CUENTAS
  // Reconstruimos Cuenta para recuperar también sus métodos
  const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));
  // RECONSTRUIR MOVIMIENTOS
  const movimientos = movimientosGuardados.map(
    (movimiento) => new Movimiento(movimiento),
  );
  // CREAR NUEVAMENTE EL BANCO
  // Utilizamos las colecciones reconstruidas como estado inicial del Banco
  return new Banco({
    usuarios,
    cuentas,
    movimientos,
  });
}

//punto de entrada de la aplicacion

// Mostramos la versión actual del proyecto
// Validación de campo debe mostrar true

console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

// Probar validación del monto debe regresar True

console.log("Monto válido:", validarMonto(1000));

// Generamos un identificador dinámico

console.log("ID generado:", generarId());

// Convertimos 1500 a formato monetario MXN

console.log("Monto formateado:", formatCurrency(1500));

// Formateamos la fecha actual

console.log("Fecha formateada:", formatDate(new Date()));

// Separamos visualmente cada cuatro dígitos

console.log("Número de cuenta:", formatAccountNumber("123456789012"));

const bancoDemo = cargarBanco();

//validar si el banco esta vacio
if (bancoDemo.usuarios.length === 0) {
  //usuario
  const usuarioDemo = new Usuario({
    nombre: "Luz Elena Ruiz",
    email: "luz@correo.com",
    telefono: "5512345678",
    password: "123456",
  });

  //registrar usuario
  bancoDemo.agregarUsuario(usuarioDemo);

  //Mostrar el usuario creado

  console.log("Usuarios Registrados: ", bancoDemo.usuarios);

  //Cuenta

  const cuentaDemo = new Cuenta({
    numeroCuenta: "123456789012",

    usuarioId: usuarioDemo.id,
  });

  bancoDemo.agregarCuenta(cuentaDemo);

  //mostrar cuenta creada

  console.log("Cuentas Registradas: ", bancoDemo.cuentas);

  //Realizar deposito inicial
  const depositoDemo = bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: 1000,
    descripcion: "Depósito inicial",
  });

  //Mostrar saldo

  console.log("Saldo actual:", formatCurrency(cuentaDemo.saldo));

  console.log("Movimiento generado: ", depositoDemo);

  console.log("Movimientos Registrados: ", bancoDemo.movimientos);

  //Se agrega búsqueda por ID una vez ya registrado el usuario

  const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(usuarioDemo.id);

  // Mostra si lo encontro

  console.log("Usuario encontrado:", usuarioEncontrado);

  //Prueba de obtener las cuentas de usuario

  const cuentasUsuario = bancoDemo.obtenerCuentasDeUsuario(usuarioDemo.id);

  // MOSTRAMOS CUALES SON SUS CUENTAS

  console.log("Cuentas del usuario:", cuentasUsuario);

  //Purueba con regal negativa

  //Intentamos realiazar un deposito con un monto invalido

  try {
    bancoDemo.realizarDeposito({
      cuentaId: cuentaDemo.id,

      monto: -500,
    });
  } catch (error) {
    console.log("Error controlado:", error.message);
  }

  //Guardar banco
  guardarBanco(bancoDemo);
}

//Mostrar datos recuperados
// MOSTRAR BANCO RECUPERADO
console.log("Banco recuperado:", bancoDemo);
// MOSTRAR USUARIOS
console.log("Usuarios almacenados:", bancoDemo.usuarios);
// MOSTRAR CUENTAS
console.log("Cuentas almacenadas:", bancoDemo.cuentas);
// MOSTRAR MOVIMIENTOS
console.log("Movimientos almacenados:", bancoDemo.movimientos);

//obtener primera cueenta
//Si existe al menos una cuenta, guaraadamos la primera
const cuentaPrincipal = bancoDemo.cuentas[0] || null;

//mostrar saldo persistido
if (cuentaPrincipal) {
  console.log("Saldo persistido:", formatCurrency(cuentaPrincipal.saldo));
  if (cuentaPrincipal) {
    console.log(
      "¿La cuenta recuperada sigue siendo una instancia de Cuenta?",
      cuentaPrincipal instanceof Cuenta,
    );
  }
  console.log(typeof cuentaPrincipal.depositar);
}

/* Estas líneas son temporales, para poder realizar las pruebas en consola
se agregan ya que estamos trabajando con type= "module" lo cual hace que 
el proyecto quede encapsulao de manera local*/

window.storageService = storageService;
window.STORAGE_KEYS = STORAGE_KEYS;
