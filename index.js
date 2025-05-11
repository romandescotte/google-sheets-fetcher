import { initAuth, gapiInited } from './gapiInit.js';
import { 
  setLoggedInBtnState, 
  setNotLoggedBtnState  
} from './auth.js'

import {  
  createDropdownOptions,
  generaListaPisos,
  generaListaAmbientes,
  generaListaOrientaciones 
} from './domHelpers.js'

import { getListadoUnidades } from './sheetsService.js'

import {$getUnitsInfo,
  $inputsUsuario } from './app.js'

// Initialize auth when the page loads
document.addEventListener('DOMContentLoaded', async () => {

  try {
    sessionStorage.clear()
    initAuth();
    const token = localStorage.getItem('accessToken')
  
  
    if (!token) {
      setNotLoggedBtnState();
      return;
    }
  
    setLoggedInBtnState()    
  
    try {
      await new Promise((resolve, reject) => {
        if (gapiInited) resolve();
        const checkGapi = setInterval(() => {
          if (gapiInited) {
            clearInterval(checkGapi);
            resolve();
          }
        }, 100);
      
      setTimeout(() => {
        clearInterval(checkGapi);
        reject(new Error('Tiempo de espera agotado al inicializar GAPI'));
      }, 10000); // 10 segundos de timeout
    });
    } catch (error) {
      console.error('Error en la inicialización de GAPI:', error);
      alert('Error al inicializar la aplicación. Por favor, recargue la página.');
      return;
  
    }
    try {
      await getListadoUnidades()     

      const dropdownsSetup = [
        { id: 'lista_pisos', getData: generaListaPisos },
        { id: 'lista_ambientes', getData: generaListaAmbientes },
        { id: 'lista_orientaciones', getData: generaListaOrientaciones }
      ] 
      for (const dropdown of dropdownsSetup) {
        const success = createDropdownOptions(dropdown.id, dropdown.getData());
        if (!success) {
          throw new Error(`Error al crear el dropdown ${dropdown.id}`);
        }
      }

    } catch(error) {
      console.error('Error en la inicialización de datos:', error)
    } 
     
  } catch (error) {
    console.error('Error en la inicialización de la aplicación:', error)
  }  
});

