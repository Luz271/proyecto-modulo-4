import { Banco } from "../models/Banco.js";

import { Usuario } from "../models/Usuario.js";

import { Cuenta } from "../models/Cuenta.js";

import { Movimiento } from "../models/Movimiento.js";

import { STORAGE_KEYS, storageService } from "./StorageService.js";

class BancoService {
  /* =========================================
       CONSTRUCTOR
    ========================================= */

  constructor() {
    this._banco = null;
  }

  /* =========================================
       CARGA Y PERSISTENCIA DEL BANCO
    ========================================= */

  cargarBanco() {
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

    const movimientosGuardados = storageService.obtener(
      STORAGE_KEYS.MOVIMIENTOS,
      [],
    );

    // Reconstruimos las instancias para
    // recuperar también sus métodos.
    const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

    const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

    const movimientos = movimientosGuardados.map(
      (movimiento) => new Movimiento(movimiento),
    );

    this._banco = new Banco({
      usuarios,
      cuentas,
      movimientos,
    });

    return this._banco;
  }

  obtenerInstanciaBanco() {
    if (!this._banco) {
      return this.cargarBanco();
    }

    return this._banco;
  }

  recargarBanco() {
    this._banco = null;

    return this.cargarBanco();
  }

  guardarBanco() {
    const banco = this.obtenerInstanciaBanco();

    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);

    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);

    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

    return true;
  }

  /* =========================================
       CONSULTAS DEL USUARIO
    ========================================= */

  obtenerDatosUsuario(usuarioId) {
    const banco = this.obtenerInstanciaBanco();

    const usuario = banco.buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    const movimientosSinFiltrar = cuentas.flatMap((cuenta) =>
      banco.obtenerMovimientosDeCuenta(cuenta.id),
    );

    // Evitamos que un mismo movimiento
    // sea incluido más de una vez.
    const movimientos = movimientosSinFiltrar.filter(
      (movimiento, index, array) =>
        index === array.findIndex((item) => item.id === movimiento.id),
    );

    return {
      usuario,
      cuentas,
      movimientos,
    };
  }

  obtenerResumenUsuario(usuarioId) {
    const { usuario, cuentas, movimientos } =
      this.obtenerDatosUsuario(usuarioId);

    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0,
    );

    return {
      usuario,
      cuentas,
      movimientos,
      saldoTotal,
      totalCuentas: cuentas.length,
      totalMovimientos: movimientos.length,
    };
  }

  /* =========================================
       OPERACIONES BANCARIAS
    ========================================= */

  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    const banco = this.obtenerInstanciaBanco();

    const movimiento = banco.realizarDeposito({
      cuentaId,
      monto,
      descripcion,
    });

    // Guardamos el nuevo saldo y
    // el movimiento generado.
    this.guardarBanco();

    return movimiento;
  }

  realizarTransferencia({
    cuentaOrigenId,
    numeroCuentaDestino,
    monto,
    descripcion = "",
  }) {
    const banco = this.obtenerInstanciaBanco();

    // Permitimos que el usuario escriba
    // el número con o sin espacios.
    const numeroDestino = String(numeroCuentaDestino).replace(/\s/g, "").trim();

    const cuentaDestino = banco.buscarCuentaPorNumero(numeroDestino);

    if (!cuentaDestino) {
      throw new Error("La cuenta destino no existe.");
    }

    const resultado = banco.realizarTransferencia({
      cuentaOrigenId,
      cuentaDestinoId: cuentaDestino.id,
      monto,
      descripcion,
    });

    // Persistimos ambos saldos y los
    // dos movimientos generados.
    this.guardarBanco();

    return resultado;
  }

  /* =========================================
       ACTUALIZAR USUARIO
    ========================================= */

  actualizarUsuario(usuarioId, { nombre, email, telefono }) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    const emailDuplicado = usuarios.some(
      (item) =>
        item.email.toLowerCase() === emailNormalizado && item.id !== usuarioId,
    );

    if (emailDuplicado) {
      throw new Error("Ya existe un usuario con este correo.");
    }

    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            nombre: nombre.trim(),
            email: emailNormalizado,
            telefono: telefono.trim(),
          }
        : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);

    this.recargarBanco();

    return usuariosActualizados.find((item) => item.id === usuarioId) || null;
  }

  /* =========================================
       CAMBIO DE CONTRASEÑA
    ========================================= */

  cambiarPassword(usuarioId, passwordActual, passwordNueva) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    if (usuario.password !== passwordActual) {
      throw new Error("La contraseña actual no es correcta.");
    }

    if (passwordNueva === passwordActual) {
      throw new Error("La nueva contraseña debe ser diferente.");
    }

    if (passwordNueva.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            password: passwordNueva,
          }
        : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);

    this.recargarBanco();

    return true;
  }

  /* =========================================
       ELIMINAR USUARIO
    ========================================= */

  eliminarUsuario(usuarioId) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

    const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    const cuentasUsuario = cuentas.filter(
      (cuenta) => cuenta.usuarioId === usuarioId,
    );

    const tieneSaldo = cuentasUsuario.some(
      (cuenta) => Number(cuenta.saldo) > 0,
    );

    if (tieneSaldo) {
      throw new Error(
        "No puedes eliminar tu cuenta mientras tengas saldo disponible.",
      );
    }

    const cuentasUsuarioIds = cuentasUsuario.map((cuenta) => cuenta.id);

    const usuariosFiltrados = usuarios.filter((item) => item.id !== usuarioId);

    const cuentasFiltradas = cuentas.filter(
      (cuenta) => cuenta.usuarioId !== usuarioId,
    );

    const movimientosFiltrados = movimientos.filter(
      (movimiento) =>
        !cuentasUsuarioIds.includes(movimiento.cuentaOrigen) &&
        !cuentasUsuarioIds.includes(movimiento.cuentaDestino),
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosFiltrados);

    storageService.guardar(STORAGE_KEYS.CUENTAS, cuentasFiltradas);

    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, movimientosFiltrados);

    this.recargarBanco();

    return true;
  }
}

export const bancoService = new BancoService();
