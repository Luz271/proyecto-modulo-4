//Funciones auxiliares
export function generarId() {
  //Date.now() Devuleve la cantidad de milisegundos trascurridos
  //Math,random() genera un nuemero peseudoaleatorio
  return `${Date.now()}-${Math.random()
    .toString(36)
    /* Tomamos solamente una parte del resultado generado. */
    .substring(2, 9)}`;
}
