//Importar Utilidades
//Importamos generarId() para asignar automaticamente un identificador interno a c/cuenta
import { generarId } from "../utils/helpers.js";
//Modelo de Cuenta
export class Cuenta {
  constructor({
    id = generarId(),
    numeroCuenta,
    tipo = "Ahorro",
    saldo = 0,
    //Identificador del usuario propietario de la cuenta.
    usuarioId,
    fechaApertura = new Date().toISOString(),
    activa = true,
  }) {
    //ASIGNAR PROPIEDADES

    this.id = id;
    this.numeroCuenta = numeroCuenta;
    this.tipo = tipo;
    this.saldo = Number(saldo);
    this.usuarioId = usuarioId;
    this.fechaApertura = fechaApertura;
    this.activa = activa;
  }
  //DEPOSITAR
  depositar(monto) {
    this.saldo += Number(monto);
    return this.saldo;
  }

  //RETIRAR
  retirar(monto) {
    this.saldo -= Number(monto);
    return this.saldo;
  }
}
