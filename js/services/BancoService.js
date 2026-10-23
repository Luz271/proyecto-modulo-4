//Importamos
import { Banco } from "../models/Banco.js";

import { Usuario } from "../models/Usuario.js";

import { Cuenta } from "../models/Cuenta.js";

import { Movimiento } from "../models/Movimiento.js";

import { STORAGE_KEYS, storageService } from "./StorageService.js";
//CREAMOS EL SERVICIO BANCARIO
class BancoService {
  constructor() {
    this._banco = null;
  }

  cargarBanco() {
    // Recupera los usuarios almacenados.
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    // Recupera las cuentas almacenadas.
    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    // Recupera los movimientos almacenados.
    const movimientosGuardados = storageService.obtener(
      STORAGE_KEYS.MOVIMIENTOS,
      [],
    );
    // instancia real de Usuario.
    const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));
    // Reconstruye cada cuenta para recuperar sus métodos
    const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));
    // Reconstruye los movimientos utilizando la clase Movimiento
    const movimientos = movimientosGuardados.map(
      (movimiento) => new Movimiento(movimiento),
    );
    // Construye una instancia de Banco utilizando las colecciones reconstruidas.
    this._banco = new Banco({
      usuarios,
      cuentas,
      movimientos,
    });

    return this._banco;
  }
  //CREAMOS obtenerInstanciaBanco()
  obtenerInstanciaBanco() {
    //Devuleve la instancia actual si no existe la carga primero
    if (!this._banco) {
      return this.cargarBanco();
    }
    // Si ya existe, reutiliza la instancia.
    return this._banco;
  }
  //CREAMOS recargarBanco()
  //Esto obligara al servicio a reconstruir nuevamente el banco usando la informacion persistida
  recargarBanco() {
    //Esto obligara al servicio a reconstruir nuevamente el banco usando la informacion persistida
    this._banco = null;
    return this.cargarBanco();
  }
  //Crear GuardarBanco()
  guardarBanco() {
    const banco = this.obtenerInstanciaBanco();
    //Ahora guardaremos a los usuarios
    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
    //Ahora creamos guardar cuentas
    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
    //Ahora creamos guardar movimientos
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
    //Ahora agregamos un return el cual indica que la operacion termino
    return true;
  }
  //Ahora creamoos obntenerusuario
  obtenerDatosUsuario(usuarioId) {
    const banco = this.obtenerInstanciaBanco();
    // Busca al usuario utilizando una regla que ya existe
    const usuario = banco.buscarUsuarioPorId(usuarioId);
    // En caso de que el usuario no existe detenemos la operación mediante una excepción.
    if (!usuario) {
      throw new Error("El usuario no existe.");
    }
    //Ahora agragremos const cuentas para que nos ayude a obtener unicamente las cuentas pertenecientes al usuaio
    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    //Ahora bien eliminaremos los movimientos duplicados con filter
    const movimientosSinFiltrar = cuentas.flatMap((cuenta) =>
      banco.obtenerMovimientosDeCuenta(cuenta.id),
    );

    const movimientos = movimientosSinFiltrar.filter(
      (movimiento, index, array) =>
        index === array.findIndex((item) => item.id === movimiento.id),
    );
    //Agrupamos información
    return {
      usuario,
      cuentas,
      movimientos,
    };
  }
  //Ahora creamos obtenerResumenDeUsuario()
  //Este nos ayudara c construir un resumen listo para que el dasboard lo consuma
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
  //esta instrucción me ayudara a actualizar el usuariu
  actualizarUsuario(usuarioId, { nombre, email, telefono }) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe."); //en caso de que el usuario no exista mostrara ese mensaje
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
//Ahora agregamos el export para poder importar a otro file
export const bancoService = new BancoService();
