import { cachedListadoUnidades } from './sheetsService.js'
import { despliegaDetalles, muestraPagosYGastos } from './unitDetails.js';

const $getUnitsInfo = document.getElementById('fetch_units_info_button')

$getUnitsInfo.addEventListener('click', async () => {  
  try {
    const unidadSeleccionada = document.getElementById('lista_unidades_disponibles').value
    if(!unidadSeleccionada){
      throw new Error('ID de unidad inválido')
    }  
    const unidadID = Number(unidadSeleccionada)    
    if(isNaN(unidadID)) {
      throw new Error('ID de unidad inválido')
    }  
    if (!cachedListadoUnidades) {
      throw new Error('No hay datos disponibles. Por favor, refresque la página');
    }  
    const filteredUnit = cachedListadoUnidades.filter(element => {
      return element[0] === unidadID
    })   
    if (filteredUnit.length === 0) {
      throw new Error('No se encontró la unidad seleccionada');
    }  
    despliegaDetalles(filteredUnit)
    muestraPagosYGastos()
  } catch (error) {
    console.error('Error al obtener detalles de la unidad', error);
    alert(error.message)
  }  
})

let $inputsUsuario = document.getElementsByClassName('contenido_variable')

for(const input of $inputsUsuario) {
  input.addEventListener('input', () => {
    muestraPagosYGastos()
  })
}

export {
  $getUnitsInfo,
  $inputsUsuario
}