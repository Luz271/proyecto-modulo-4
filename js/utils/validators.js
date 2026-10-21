//Validaciones generales
export function validarCampoObligatorio(valor) {
  //validar existencia del valor
  return (
    // El valor no debe ser undefined ni null
    valor !== undefined && valor !== null && String(valor).trim() !== ""
  );
}
//Validar monto
export function validarMonto(monto) {
  const montoNumerico = Number(monto);
  return Number.isFinite(montoNumerico) && montoNumerico > 0;
}
