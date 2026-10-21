//coroborar que main.js esta cargando correctamente

console.log("Sistema de Gestión Bancaria - v0.4.0");

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

const bancoDemo = new Banco();

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

//Usuario

//Creamos nuestra primera instancia de la clase Usuario

const usuarioDemo = new Usuario({
  nombre: "Luz Elena Ruiz",

  email: "luz@correo.com",

  telefono: "5512345678",

  password: "123456",
});

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

// DEPOSITO DEMO

// Banco coordina toda la operación:

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
