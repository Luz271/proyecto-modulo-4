//coroborar que main.js esta cargando correctamente
console.log("Sistema de Gestión Bancaria - v0.2.0");
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

//punto de entrada de la aplicacion
// Mostramos la versión actual del proyecto
console.log("Sistema de Gestión Bancaria - v0.2.0");
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
