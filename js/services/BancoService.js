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
    //  instancia real de Usuario.
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
    // Esta instrucción limina la referencia a la instancia actual.
    this._banco = null;
    return this.cargarBanco();
  }
  //Crear GuardarBanco()
  guardarBanco() {
    const banco = this.obtenerInstanciaBanco(); //obtenemos la instancia del banco
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
    // Recorre todas las cuentas del usuario y obtiene sus movimientos.
    const movimientosSinFiltrar =
      // El flatMap() combina los resultados  en un único array.
      cuentas.flatMap((cuenta) => banco.obtenerMovimientosDeCuenta(cuenta.id));
    //Ahora bien eliminaremos los movimientos duplicados con filter
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
    // Destructuring: extraemos directamente las propiedades que necesitamos del objeto retornado.
    const { usuario, cuentas, movimientos } =
      this.obtenerDatosUsuario(usuarioId);
    //Sumamos el saldo de todas las cuentas
    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0,
    );
    return {
      usuario,
      cuentas,
      movimientos,
      saldoTotal,
      totalCuentas:
        // Número de cuentas del usuario.
        cuentas.length,
      // Número de movimientos encontrados.
      totalMovimientos: movimientos.length,
    };
  }
}
//Ahora agregamos el export para poder importar a otro file
export const bancoService = new BancoService();
