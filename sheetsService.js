import { 
  handleAuthClick, 
  setNotLoggedBtnState,
} from './auth.js';
import { createDropdownOptions, resetFilterOption } from './domHelpers.js';
import { getFilters } from './unitDetails.js';
import { SPREADSHEET_ID } from './config.js';


let cachedListadoUnidades = null

async function getListadoUnidades() {
 
  const token = gapi.client.getToken();
  if (!token || !token.access_token) {
    console.error('Autenticación fallida: no hay token válido')
    throw new Error('Usuario no autenticado. Por favor inicie sesión.');    
  }  
    try {      
      const respuesta = await gapi.client.sheets.spreadsheets.values.get(
        {
        spreadsheetId: SPREADSHEET_ID,
        range: 'Listado de Unidades!A13:AC200',
        valueRenderOption: 'UNFORMATTED_VALUE'
      });
      const lista = respuesta.result;

      if (!lista || !lista.values || lista.values.length == 0) {
        console.warn(`getListadoUnidades(): No se encontraron valores a traer`)
        return [];
      }

      cachedListadoUnidades = lista.values
      return cachedListadoUnidades
    } catch (res) {
      console.error(`Error al fetchear lista de unidades`);
      handleAuthClick()
      setNotLoggedBtnState()
      throw new Error(`No se pudo obtener datos de la hoja de cálculo: ${res.result.error.message}`) ;        
    }
}

async function getUnitDetails(unitID) {
  let response
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Listado de Unidades!A13:AG200',
      valueRenderOption: 'UNFORMATTED_VALUE'
    });
  } catch (e) {
    console.error(`No se han obtenido los detalles de la unidad ( getUnitDetails() ${e.result.error.code} ${e.result.error.message} )`)
    throw e;
  }
  const unidades = response.result.values
  
  const unidad = await unidades.filter(e => {
    return e[0] === unitID
  })
  
  return unidad
}

const $fetchFilteredUnitsBtn = document.getElementById('fetch_filtered_units')

$fetchFilteredUnitsBtn.addEventListener('click', () => {
  
  try {
    if(!cachedListadoUnidades) {
      throw new Error('No hay datos disponibles. Por favor, refresque la página')
    }

    const filtros = getFilters()
    
    if (filtros.m2Minimo && filtros.m2Maximo && filtros.m2Minimo > filtros.m2Maximo) {
      alert('El valor mínimo de metros cuadrados no puede ser mayor al máximo')      
    }
    const filteredUnitIDList = filterUnits(
      filtros.piso,
      filtros.ambientes,
      filtros.m2Minimo,
      filtros.m2Maximo,
      filtros.orientacion,
      filtros.disponible).map(element => {
        return element[0]
    })    

    const creadoDeDropDowns = createDropdownOptions('lista_unidades_disponibles', filteredUnitIDList)
    if(!creadoDeDropDowns) {
      throw new Error('Error al actualizar la lista de unidades');
    }
    const $notifCantidadUnidades = document.getElementById('notif_cantidad_unidades')
    $notifCantidadUnidades.innerText = filteredUnitIDList.length    
  } catch(error) {
    console.error('Error al filtrar unidades:', error);    
    createDropdownOptions('lista_unidades_disponibles', []);
  }
})

function filterUnits(piso, ambientes, m2Minimo, m2Maximo, orientacion, disponible) {
  if(!cachedListadoUnidades) {
    throw new Error('Los datos aún no han sido inicializados.');
  }  

  const filteredUnits = cachedListadoUnidades.filter(unidad => {
        
    const metrosTotales = unidad[15]
    const cumplePiso = piso === '' || unidad[4] === piso;
    const cumpleAmbientes = ambientes === '' || unidad[6] === ambientes;
    const cumpleM2Minimo = m2Minimo === '' || metrosTotales >= m2Minimo;
    const cumpleM2Maximo = m2Maximo === '' || metrosTotales <= m2Maximo;
    const cumpleOrientacion = orientacion === '' || unidad[10] === orientacion;    
    const cumpleDisponible = disponible 
      ? unidad[2] === 'Disponible'
      : unidad[2] !== 'Disponible'
 
    return cumplePiso && 
            cumpleAmbientes && 
            cumpleM2Minimo && 
            cumpleM2Maximo && 
            cumpleOrientacion && 
            cumpleDisponible;
  });
  return filteredUnits 
}

const $resetFilterButton = document.getElementById('reset_filters_button')

$resetFilterButton.addEventListener('click', () => resetFilterOption())

export {
  getListadoUnidades,  
  getUnitDetails,
  filterUnits,
  cachedListadoUnidades
}