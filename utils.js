function agregarMilesimas(numero) {  
  const numeroConMilesimas = numero.toLocaleString('es-AR')
  return numeroConMilesimas;
}

function parsearNumero(numero) {
  const numeroConvertido = convertirANumero(numero)
  const numeroRedondeado = redondear(numeroConvertido)
  return numeroRedondeado  
}

function convertirANumero(numero) {
  const numeroParseado = Number(numero)
  return numeroParseado
}

function redondear(numero) {
  const numeroRedondeado = Math.round(numero)
  return numeroRedondeado
}

export {
  agregarMilesimas,
  parsearNumero,
  convertirANumero,
  redondear
}