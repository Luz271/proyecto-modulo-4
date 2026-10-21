//Importar modelo de movimiento
import { Movimiento } from "./Movimiento.js";

//Modelo del banco
export class Banco {
  constructor({ usuarios = [], cuentas = [], movimientos = [] } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }
  //Agregar usuario, permite registrar un usuario dentro del bando siempre que no exista otro usuario con el mismo ID
  agregarUsuario(usuario) {
    //some comprueba si al menos un elemanto del array cumple la condición
    const existe = this.usuarios.some((u) => u.id === usuario.id);
    //Se detiene la operación si no se encuentra un usuario con el mismo identificador
    if (existe) {
      throw new Error("El usuario ya existe");
    }
    //Si no existe Agregamos el usuario al array
    this.usuarios.push(usuario);
    return usuario;
  }
  //Buscar usuario por ID
  buscarUsuarioPorId(UsuarioId) {
    return this.usuarios.find((usuario) => usuario.id === UsuarioId) || null;
  }

  //Agregar Cuenta
  agregarCuenta(cuenta) {
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);
    // Si el usuario no existe termina el metodo aqui y manda un mensaje
    if (!usuario) {
      throw new Error("El usuario propietario de la cuenta no existe.");
    }
    // Consideramos duplicada una cuenta si coincide su ID o su número.
    const existe = this.cuentas.some(
      (c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta,
    );
    // Si existe la cuenta duplicada termina el metodo y manda un mensaje
    if (existe) {
      throw new Error("La cuenta ya existe.");
    }
    // Si no existe simplemente REGISTRAR CUENTA
    this.cuentas.push(cuenta);
    return cuenta;
  }
  //Buscar cuenta por ID
  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }
  //Buscar cuenta por Número
  buscarCuentaPorNumero(numeroCuenta) {
    return (
      this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
      null
    );
  }
  //Obtener cuentas e usuario
  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }
  //Registrar Movimiento
  registrarMovimiento(movimiento) {
    this.movimientos.push(movimiento);

    return movimiento;
  }
  //Realizar Deposito
  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    //Convertir Monto
    const montoNumerico = Number(monto);
    //El monto debe ser un número válido y mayor que 0
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto Invalido, el monto debe ser mayor a 0");
    }
    //Buscar cuenta y validamos
    const cuenta = this.buscarCuentaPorId(cuentaId);
    if (!cuenta) {
      throw new Error("La cuenta no existe");
    }
    //Actualizar Saldo
    cuenta.depositar(montoNumerico);
    //registro de la operación automatico
    const movimiento = new Movimiento({
      tipo: "DEPOSITO",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });
    //Registrar Movimiento
    this.registrarMovimiento(movimiento);
    return movimiento;
  }
  //Obtener Movimientos de una cuenta
  obtenerMovimientosDeCuenta(cuentaId) {
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId,
    );
  }
}
