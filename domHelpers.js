import { 
  cachedListadoUnidades
} from "./sheetsService.js";

function generaListaPisos() {
  if(!cachedListadoUnidades) {
    throw new Error('Los datos aún no han sido inicializados.');
  }
  let pisos = [] 
  cachedListadoUnidades.forEach((e) => {
    pisos.push(e[4])
  })
  const pisosUnicos = new Set(pisos)
  const pisosUnicos1 = [...pisosUnicos] 
  return pisosUnicos1
}

function generaListaAmbientes() {
  if(!cachedListadoUnidades) {
    throw new Error('Los datos aún no han sido inicializados.');
  }
  
  let ambientes = [] 
  cachedListadoUnidades.forEach((e) => {
    ambientes.push(e[6])
  })
  const ambientesUnicos = new Set(ambientes)
  const ambientesUnicos1 = [...ambientesUnicos]  
  return ambientesUnicos1
}

function generaListaOrientaciones() {
  if(!cachedListadoUnidades) {
    throw new Error('Los datos aún no han sido inicializados.');
  }
 
  let orientaciones = [] 
  cachedListadoUnidades.forEach((e) => {
    orientaciones.push(e[10])
  })
  const orientacionesUnicas = new Set(orientaciones)
  const orientacionesUnicas1 = [...orientacionesUnicas]
  return orientacionesUnicas1
}

function createDropdownOptions(elementId, items) {
  try {
    const $lista = document.getElementById(elementId);
    
    $lista.innerHTML = '';

    const $opcionVacia = document.createElement('option')
    $opcionVacia.setAttribute('value', '')
    $opcionVacia.innerText = 'Seleccionar'
    $lista.appendChild($opcionVacia)
    
    items.forEach((el) => {
      const $option = document.createElement('option');
      $option.setAttribute('id', `Unidad ${el}`);
      $option.setAttribute('value', el);
      $option.innerText = el;
      $lista.appendChild($option);
    });

    console.log(`Listado ${elementId} creado`);
    return true;
  } catch(e) {
    console.error(`Error al crear dropdown para ${elementId}: ${e}`);
    return false;
  }
}

function updateElementText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    text !== '#REF! ()' 
    ? element.innerText = text
    : element.innerText = ''
  } else {    
    console.warn(`Element not found: ${selector}`);
  }
}


function resetFilterOption() {
  document.getElementById('lista_pisos').value = ''
  document.getElementById('lista_ambientes').value = ''
  document.getElementById('lista_orientaciones').value = ''
  document.getElementById('lista_m2_minimo').value = ''
  document.getElementById('lista_m2_maximo').value = ''
  document.getElementById('check_disponibles').checked = false
}

export { 
  generaListaAmbientes,
  generaListaPisos,
  generaListaOrientaciones,
  createDropdownOptions,
  updateElementText,
  resetFilterOption
}