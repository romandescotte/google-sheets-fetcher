import {
  agregarMilesimas,
  convertirANumero,
  parsearNumero,
  redondear
} from './utils.js'

import {
  updateElementText
} from './domHelpers.js'

function despliegaDetalles(unidad) {
  getId(unidad)
  getEstado(unidad)
  getPiso(unidad)
  getOrientacion(unidad)
  getTipologia(unidad)
  calculaMetrosTotales(
    getSuperficieCubierta(unidad), 
    getSuperficieTerraza(unidad),
    getSuperficiePallier(unidad)    
  )   
  getIdentificacionCochera1(unidad)
  getIdentificacionCochera2(unidad)  
  precioTotal(unidad)  
}

function getId(unidad) {   
  updateElementText('#unidad_titulo', unidad[0][0])
}

function getEstado(unidad) {   
  updateElementText('#estado span', unidad[0][2])
}

function getPiso(unidad) {  
  updateElementText('#piso span', unidad[0][4])
}

function getOrientacion(unidad) {
  updateElementText('#orientacion span', unidad[0][10])
}

function getTipologia(unidad) {
  updateElementText('#tipologia span', unidad[0][6] )
}

function getSuperficieCubierta(unidad) {  
  const superficieCubierta = unidad[0][11]
  updateElementText('#superficie_cubierta span', agregarMilesimas(unidad[0][11]))  
  return superficieCubierta
}

function getSuperficieTerraza(unidad) {
  updateElementText('#superficie_terraza span', agregarMilesimas(unidad[0][13]))  
  const superficieTerraza = unidad[0][13]  
  return superficieTerraza
}

function getSuperficiePallier(unidad) {
  updateElementText('#superficie_pallier span', agregarMilesimas(unidad[0][14])) 
  const superficiePallier = unidad[0][14]
  return superficiePallier
}

function getPrecioResidencia(unidad) {  
  updateElementText('#precio_residencia span', agregarMilesimas(parsearNumero(unidad[0][18])))  
  const precioResidencia = Number(unidad[0][18])
  sessionStorage.setItem('precioResidencia', precioResidencia)
  return precioResidencia
}

function getPrecioCochera1(unidad) {
  updateElementText('#precio_cochera1 span', agregarMilesimas(unidad[0][20]))
  const precioCochera1 = Number(unidad[0][20])  
  return validateNumberValues(precioCochera1)
}

function getIdentificacionCochera1(unidad) {
  updateElementText('#identificacion_cochera1 span', unidad[0][19])  
}

function getPrecioCochera2(unidad) {
  updateElementText('#precio_cochera2 span', agregarMilesimas(unidad[0][22])) 
  const precioCochera2 = Number(unidad[0][22])   
  return validateNumberValues(precioCochera2)
}

function getIdentificacionCochera2(unidad) {
  updateElementText('#identificacion_cochera2 span', unidad[0][21])
}

function precioBaulera(unidad) {
  updateElementText('#precio_baulera span', agregarMilesimas(unidad[0][25]))
  const precioBaulera = Number(unidad[0][25])  
  return validateNumberValues(precioBaulera)  
}

function getFilters() {
  const piso = convertirANumero(document.getElementById('lista_pisos').value) || ''
  const ambientes = document.getElementById('lista_ambientes').value || ''
  const orientacion = document.getElementById('lista_orientaciones').value || ''
  const m2Minimo = convertirANumero(document.getElementById('lista_m2_minimo').value) || ''
  const m2Maximo = convertirANumero(document.getElementById('lista_m2_maximo').value) || ''
  const disponible = document.getElementById('check_disponibles').checked
  const filtros = {
    piso: piso,
    ambientes: ambientes,
    orientacion: orientacion,
    m2Minimo: m2Minimo,
    m2Maximo: m2Maximo,
    disponible: disponible
  }
  return filtros
}

function validateNumberValues(value) {
  if(!value) {
    return 0
  } 
  return value
}

function precioTotal(unidad) {
  const precioTotal = getPrecioResidencia(unidad) + getPrecioCochera1(unidad) + getPrecioCochera2(unidad) + precioBaulera(unidad) 
  sessionStorage.setItem('precioTotal', precioTotal)
  updateElementText('#precio_total span', agregarMilesimas(parsearNumero(precioTotal)))
  return precioTotal
}

function calculaMetrosTotales(cubiertos, terraza, pallier) {
  typeof(cubiertos) !== 'number' 
  ? cubiertos = 0
  : cubiertos
  typeof(terraza) !== 'number' 
  ? terraza = 0
  : terraza
  typeof(pallier) !== 'number'
  ? pallier = 0
  : pallier

  const metrosTotales = cubiertos + terraza + pallier
  
  updateElementText('#superficie_total span', agregarMilesimas(metrosTotales))  
  sessionStorage.setItem('metrosCuadrados', metrosTotales)
  return metrosTotales
}

function muestraPagosYGastos() {  
  muestraFormaPago()
  calculaGastos()
  muestraGastos()
}

let formaDePago = {}

function calculaFormaPago() {
  try {
    const precioTotal = sessionStorage.getItem('precioTotal')

    if (!precioTotal) {
      throw new Error('No se encontró un precio total en el sessionStorage.');
    }

    const precioTotalNumerico = Number(precioTotal);
    if (isNaN(precioTotalNumerico) || precioTotalNumerico <= 0) {
      throw new Error('El precio total no es válido');
    }

    const precioResidencia = sessionStorage.getItem('precioResidencia')
    
    if (!precioResidencia) {
      throw new Error('No se encontró un precio de la residencia en el sessionStorage.');
    }

    const precioResidenciaNumerico = Number(precioResidencia);

    if (isNaN(precioResidenciaNumerico) || precioResidenciaNumerico <= 0) {
      throw new Error('El precio de la residencia no es válido');
    }    

    const porcentajeAnticipo = document.getElementById('porcentaje_anticipo');
    const porcentajeCuotaObra = document.getElementById('porcentaje_cuota_obra');
    const porcentajeRefuerzo = document.getElementById('refuerzo');
    const cantidadCuotas = document.getElementById('cantidad_cuotas');

    const anticipoValue = Number(porcentajeAnticipo.value);
    const cuotaObraValue = Number(porcentajeCuotaObra.value);
    const refuerzoValue = Number(porcentajeRefuerzo.value);
    const cuotasValue = Number(cantidadCuotas.value);

    if (isNaN(anticipoValue) || anticipoValue < 0 || anticipoValue > 100) {
      console.warn('El porcentaje de anticipo debe estar entre 0 y 100');
    }

    if (isNaN(cuotaObraValue) || cuotaObraValue < 0 || cuotaObraValue > 100) {
      console.warn('El porcentaje de cuota de obra debe estar entre 0 y 100');
    }

    if (isNaN(refuerzoValue) || refuerzoValue < 0 || refuerzoValue > 100) {
      console.warn('El porcentaje de refuerzo debe estar entre 0 y 100');
    }

    if (isNaN(cuotasValue) || cuotasValue <= 0) {
      console.warn('La cantidad de cuotas debe ser mayor a 0');
    }

    // Validar que la suma de los porcentajes no supere el 100%
    const sumaPorcentajes = anticipoValue + cuotaObraValue + refuerzoValue;
    if (sumaPorcentajes > 100) {
      console.warn('La suma de los porcentajes no puede superar el 100%');
    }  
  
    // 100% - PORCENTAJE ANTICIPO - % CUOTA INICIO OBRA - % REFUERZO
    function calculaPorcentajeSaldo() {
      return 100 - anticipoValue - cuotaObraValue - refuerzoValue
    }   
    // % ANTICIPO * PRECIO TOTAL  
    formaDePago.montoAnticipo =  redondear((anticipoValue / 100) * precioTotalNumerico)
    // % CUOTA INICIO OBRA * PRECIO TOTAL
    formaDePago.cuotaInicioObra =   redondear((cuotaObraValue / 100) * precioTotalNumerico)
    // PRECIO TOTAL * % REFUERZO HITO LOSA
    formaDePago.refuerzoHitoLosa =  redondear((refuerzoValue / 100) * precioTotalNumerico)
    // % SALDO * PRECIO TOTAL
    formaDePago.montoSaldo = redondear((calculaPorcentajeSaldo() / 100) * precioTotalNumerico)
    // MONTO SALDO / CANTIDAD DE CUOTAS
    formaDePago.valorCuota =  redondear(formaDePago.montoSaldo / cuotasValue)    
    formaDePago.porcentajeSaldo = calculaPorcentajeSaldo()  
    
    const $saldo = document.querySelector('#saldo input')
    $saldo.value = Math.round(formaDePago.porcentajeSaldo)  
    return formaDePago

  } catch (error) {
    console.error('Error en el cálculo de forma de pago: ', error)    
    return null
  }
  
}

function muestraFormaPago() {
  calculaFormaPago()
  updateElementText('#anticipo span', agregarMilesimas(formaDePago.montoAnticipo))
  updateElementText('#cuota_inicio_obra span', agregarMilesimas(formaDePago.cuotaInicioObra))
  updateElementText('#refuerzo_hito_losa span', agregarMilesimas(formaDePago.refuerzoHitoLosa))  
  updateElementText('#saldo span', agregarMilesimas(formaDePago.montoSaldo))  
  updateElementText('#valor_cuota span', agregarMilesimas(formaDePago.valorCuota)) 
}

let gastos = {}

function calculaGastos() {

  const precioTotal = parsearNumero(sessionStorage.getItem('precioTotal'))
  const metrosCuadrados = Number(sessionStorage.getItem('metrosCuadrados')) 

  function calculaBrandFee() {
    const brandFee = precioTotal * getBrandFee()
    return brandFee
  }

  function getBrandFee() {
    const BRAND_FEE = 4     
    const porcentajeBrandFee = BRAND_FEE / 100
    return porcentajeBrandFee
  }

  function calculaFondoReserva() {
    const montoFondoReserva = metrosCuadrados * getFondoReserva()
    return montoFondoReserva
  }

  function getFondoReserva() {
    const $fondoReserva = document.querySelector('#fondo_reserva')    
    const fondoReserva = parsearNumero($fondoReserva.value)  
    return fondoReserva
  }

  function calculaFondoOperativoCaja() {
    const montoFondoOperativoCaja = metrosCuadrados * getFondoOperativoCaja()
    return montoFondoOperativoCaja
  }

  function getFondoOperativoCaja() {
    const $fondoOperativoCaja = document.querySelector('#fondo_operativo_caja')  
    const fondoOperativoCaja = parsearNumero($fondoOperativoCaja.value)
    return fondoOperativoCaja
  }

  function calculaFondoEquipamiento() {
    const montoFondoEquipamiento = metrosCuadrados * getFondoEquipamiento()
    return montoFondoEquipamiento
  }
    
  function getFondoEquipamiento() {
    const $fondoEquipamiento = document.querySelector('#fondo_equipamiento')
    const fondoEquipamiento = parsearNumero($fondoEquipamiento.value)
    return fondoEquipamiento
  }
  
  gastos.brandFee = parsearNumero(calculaBrandFee())
  gastos.fondoReserva = parsearNumero(calculaFondoReserva())
  gastos.fondoOperativoCaja = parsearNumero(calculaFondoOperativoCaja())
  gastos.fondoEquipamiento = parsearNumero
  (calculaFondoEquipamiento())  
  
  return gastos  
}

function muestraGastos() {

  const gastos = calculaGastos()
  
  updateElementText('#output_gastos_firma', agregarMilesimas(gastos.brandFee))
  updateElementText('#output_fondo_reserva', agregarMilesimas(gastos.fondoReserva))
  updateElementText('#output_fondo_operativo_caja', agregarMilesimas(gastos.fondoOperativoCaja))
  updateElementText('#output_fondo_equipamiento', agregarMilesimas(gastos.fondoEquipamiento))
  updateElementText('#output_total_gastos', agregarMilesimas(gastos.fondoReserva + gastos.fondoOperativoCaja + gastos.fondoEquipamiento))
}

export { 
  muestraPagosYGastos,
  despliegaDetalles,
  getFilters  
}