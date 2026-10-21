//coroborar que main.js esta cargando correctamente
console.log("Sistema de Gestión Bancaria - v0.3.0");
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

//punto de entrada de la aplicacion
// Mostramos la versión actual del proyecto
console.log("Sistema de Gestión Bancaria - v0.3.0");
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

//Mostrar el usuario creado
console.log("Usuario: ", usuarioDemo);

//Cuenta
const cuentaDemo = new Cuenta({
  numeroCuenta: "123456789012",
  usuarioId: usuarioDemo.id,
});
//mostrar cuenta creada
console.log("Cuenta", cuentaDemo);

//Deposito demostración
cuentaDemo.depositar(1000);
//mostramos el nuevo saldo usando
console.log("Saldo después del deposito: ", formatCurrency(cuentaDemo.saldo));

//Movimiento, representamos manualmente el deposito ediante instancia de movimiento
const movimientoDemo = new Movimiento({
  tipo: "DEPOSITO",
  monto: 1000,
  descripcion: "Deposito Inicial",
  //Asociasión el movimiento a la cuenta
  cuentaOrigen: cuentaDemo.id,
  saldoResultante: cuentaDemo.saldo,
});
//Mostramos el movimiento creado
console.log("Movimiento", movimientoDemo);
console.log(usuarioDemo.id === cuentaDemo.usuarioId);
console.log(cuentaDemo.id === movimientoDemo.cuentaOrigen);
