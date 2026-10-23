import { Movimiento } from "./Movimiento.js";

export class Banco {
  /* =========================================
       CONSTRUCTOR
    ========================================= */

  constructor({ usuarios = [], cuentas = [], movimientos = [] } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }

  /* =========================================
       USUARIOS
    ========================================= */

  agregarUsuario(usuario) {
    const existe = this.usuarios.some((item) => item.id === usuario.id);

    if (existe) {
      throw new Error("El usuario ya existe.");
    }

    this.usuarios.push(usuario);

    return usuario;
  }

  buscarUsuarioPorId(usuarioId) {
    return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
  }

  /* =========================================
       CUENTAS
    ========================================= */

  agregarCuenta(cuenta) {
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

    if (!usuario) {
      throw new Error("El usuario propietario de la cuenta no existe.");
    }

    const existe = this.cuentas.some(
      (item) =>
        item.id === cuenta.id || item.numeroCuenta === cuenta.numeroCuenta,
    );

    if (existe) {
      throw new Error("La cuenta ya existe.");
    }

    this.cuentas.push(cuenta);

    return cuenta;
  }

  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }

  buscarCuentaPorNumero(numeroCuenta) {
    return (
      this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
      null
    );
  }

  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }

  /* =========================================
       MOVIMIENTOS
    ========================================= */

  registrarMovimiento(movimiento) {
    this.movimientos.push(movimiento);

    return movimiento;
  }

  obtenerMovimientosDeCuenta(cuentaId) {
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId,
    );
  }

  /* =========================================
       DEPÓSITOS
    ========================================= */

  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    // Convertimos el monto recibido
    // a un valor numérico.
    const montoNumerico = Number(monto);

    // Solamente permitimos montos
    // mayores a cero.
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // Buscamos la cuenta donde se
    // realizará el depósito.
    const cuenta = this.buscarCuentaPorId(cuentaId);

    if (!cuenta) {
      throw new Error("La cuenta no existe.");
    }

    // Modificamos el saldo utilizando
    // el comportamiento de Cuenta.
    cuenta.depositar(montoNumerico);

    // Registramos el depósito dentro
    // del historial.
    const movimiento = new Movimiento({
      tipo: "DEPOSITO",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });

    this.registrarMovimiento(movimiento);

    return movimiento;
  }

  /* =========================================
       TRANSFERENCIAS
    ========================================= */

  realizarTransferencia({
    cuentaOrigenId,
    cuentaDestinoId,
    monto,
    descripcion = "",
  }) {
    // Convertimos el monto recibido
    // a número.
    const montoNumerico = Number(monto);

    // Validamos que el monto sea
    // numérico y mayor a cero.
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // Buscamos las dos cuentas que
    // participan en la operación.
    const origen = this.buscarCuentaPorId(cuentaOrigenId);

    const destino = this.buscarCuentaPorId(cuentaDestinoId);

    if (!origen) {
      throw new Error("La cuenta origen no existe.");
    }

    if (!destino) {
      throw new Error("La cuenta destino no existe.");
    }

    // Las cuentas deben encontrarse
    // activas para operar.
    if (!origen.activa) {
      throw new Error("La cuenta origen no está activa.");
    }

    if (!destino.activa) {
      throw new Error("La cuenta destino no está activa.");
    }

    // Impedimos transferencias de una
    // cuenta hacia ella misma.
    if (origen.id === destino.id) {
      throw new Error("No puedes transferir dinero a la misma cuenta");
    }

    // La cuenta origen necesita saldo
    // suficiente para completar la operación.
    if (origen.saldo < montoNumerico) {
      throw new Error("Saldo insuficiente");
    }

    // Descontamos el dinero de la cuenta
    // origen.
    origen.retirar(montoNumerico);

    // Depositamos el mismo monto
    // en la cuenta destino.
    destino.depositar(montoNumerico);

    // Creamos el movimiento desde la
    // perspectiva del emisor.
    const movimientoEnviado = new Movimiento({
      tipo: "TRANSFERENCIA_ENVIADA",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: origen.id,
      cuentaDestino: destino.id,
      saldoResultante: origen.saldo,
    });

    // Creamos el movimiento desde la
    // perspectiva del receptor.
    const movimientoRecibido = new Movimiento({
      tipo: "TRANSFERENCIA_RECIBIDA",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: origen.id,
      cuentaDestino: destino.id,
      saldoResultante: destino.saldo,
    });

    // Guardamos ambos movimientos.
    this.registrarMovimiento(movimientoEnviado);

    this.registrarMovimiento(movimientoRecibido);

    return {
      origen,
      destino,
      movimientoEnviado,
      movimientoRecibido,
    };
  }
}
