//Importar Utilidades
//Importamos generarId() para asignar un identificador unico a c/movimiento
import { generarId } from "../utils/helpers.js";
//Modelo de Movimiento
export class Movimiento {
  constructor({
    id = generarId(),
    tipo,
    monto,
    descripcion = "",
    cuentaOrigen = null,
    cuentaDestino = null,
    saldoResultante = null,
    fecha = new Date().toISOString(),
  }) {
    //Asignar Propiedades
    this.id = id;
    this.tipo = tipo;
    this.monto = Number(monto);
    this.descripcion = descripcion;
    this.cuentaOrigen = cuentaOrigen;
    this.cuentaDestino = cuentaDestino;
    this.saldoResultante = saldoResultante;
    this.fecha = fecha;
  }
}
