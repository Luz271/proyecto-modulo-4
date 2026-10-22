//Claves del almacenamiento
export const STORAGE_KEYS = {
  USUARIOS: "usuarios",
  CUENTAS: "cuentas",
  MOVIMIENTOS: "movimientos",
  SESION: "sesion",
};

//Creamos la clase de StorageService y centraliza toda la comunicación con LocalStorage
class StorageService {
  //Guardar información
  guardar(clave, valor) {
    const valorJSON = JSON.stringify(valor);

    //Guardamos el JSON utilizando la clave recibida
    localStorage.setItem(clave, valorJSON);
  }
  //Metodo obtener información
  obtener(clave, valorPorDefecto = null) {
    /* getItem() devuelve el contenido almacenado como texto. Si la clave no
existe devuelve null. */
    const valor = localStorage.getItem(clave);
    // VALIDAR SI EXISTE INFORMACIÓN
    if (valor === null) {
      return valorPorDefecto;
    }
    // CONVERTIR JSON
    try {
      return JSON.parse(valor);
    } catch (error) {
      console.error(
        `No fue posible leer la clave "${clave}" de LocalStorage.`,
        error,
      );
      /* Si ocurre un error regresamos el valor predeterminado. */
      return valorPorDefecto;
    }
  }
  //metodo eliminar información
  eliminar(clave) {
    localStorage.removeItem(clave);
  }
  //Limpiar localstorage
  limpiar() {
    localStorage.clear();
  }
}

//Crear instancia del servicio
export const storageService = new StorageService();
