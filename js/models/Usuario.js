//Importar utilidades
//Importamos generarId()
import { generarId } from "../utils/helpers.js";

export class Usuario {
  // El constructor se ejecutará cada vez que creemos una nueva instancia
  constructor({
    id = generarId(),
    nombre,
    email,
    telefono = "",
    password,
    activo = true,
  }) {
    //Asignar propiedades
    this.id = id;
    this.nombre = nombre;

    this.email = email;
    this.telefono = telefono;
    this.password = password;
    this.activo = activo;
  }
}
