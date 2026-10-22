//Funciones auxiliares
export function generarId() {
  //Date.now() Devuleve la cantidad de milisegundos trascurridos
  //Math,random() genera un nuemero peseudoaleatorio
  return `${Date.now()}-${Math.random()
    .toString(36)
    /* Tomamos solamente una parte del resultado generado. */
    .substring(2, 9)}`;
}
//Generar número de cuenta
export function generarNumeroCuenta() {
  let numeroCuenta = "";
  //Generar 12 digitos aleatorios
  for (let i = 0; i < 12; i += 1) {
    numeroCuenta += Math.floor(Math.random() * 10);
  }
  //Devolver resultado
  return numeroCuenta;
}
