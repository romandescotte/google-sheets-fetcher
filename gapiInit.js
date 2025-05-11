import { CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from './config.js';
import { setLoggedInBtnState } from './auth.js';
import { getListadoUnidades } from './sheetsService.js'
import { 
  createDropdownOptions,
  generaListaAmbientes,
  generaListaOrientaciones,
  generaListaPisos  
 } from './domHelpers.js';

let tokenClient;
let gapiInited = false;
let gisInited = false;

async function initAuth() {
  window.gapiLoaded = function() {
    gapi.load('client', initializeGapiClient)
    console.log('Google API loaded')
  }

  window.gisLoaded = function() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });
    gisInited = true
    console.log('GIS loaded');
  }

  loadGoogleScripts();
}

async function initializeGapiClient() {

  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
   
    if(!API_KEY || !DISCOVERY_DOC) {
      throw new Error('Faltan configuraciones necesarias para la inicialización')
    }
    try {
      const savedToken = localStorage.getItem('accessToken');
      if(!savedToken) {
        console.warn('No se encontró token de acceso en el localStorage')
        return false
      }
      await gapi.client.setToken({access_token: savedToken})
      console.log('Token configurado correctamente')
      return true;
    } catch (tokenError) {
      console.error('Error al configurar el token', tokenError)
      localStorage.removeItem('accessToken');
      throw new Error('Token inválido o expirado. Por favor, inicie sesión nuevamente');
    }
    
  } catch (res) {
    console.error('Error en la inicializacion de gapi.client', res.error.message)
    if (error.message.includes('Token inválido')) {
      throw error; // Re-lanzar el error del token
    } else {
      throw new Error('No se pudo iniciar la conexión con Google. Por favor, intente más tarde');
    }
  } finally {
    // Asegurarnos de establecer el estado de inicialización
    gapiInited = true;
  }
}
  
function loadScript(src, onload, onerror) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onload;
  script.onerror = onerror;
  document.body.appendChild(script);
}

function loadGoogleScripts() {
  loadScript(
    'https://apis.google.com/js/api.js',
    () => {
      gapi.load('client', initializeGapiClient);
      console.log('Google API loaded');
    },
    () => console.error('Error al cargar el script de gapi')
  );

  loadScript(
    'https://accounts.google.com/gsi/client',
    () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          try {
            if (resp.error !== undefined) {
              throw new Error(resp.error);
            }
            const token = gapi.client.getToken().access_token;
            localStorage.setItem('accessToken', token);
            setLoggedInBtnState();
            console.log('Logueo correcto');

            // Una vez que gapi está listo, crear el listado
            await getListadoUnidades();

            createDropdownOptions('lista_pisos', generaListaPisos());
            createDropdownOptions('lista_ambientes', generaListaAmbientes());
            createDropdownOptions('lista_orientaciones', generaListaOrientaciones());
          } catch (res) {
            console.error('Error en el callback de tokenClient:', res);
            // console.error('Error en el callback de tokenClient:', res.error.message);
            throw new Error(`Error en el callback de tokenClient: ${res.error}`);
          }
        },
      });
      gisInited = true;
      console.log('GIS loaded');
    },
    () => console.error('Error al cargar el script de gis')
  );
}

export { 
  initAuth, 
  tokenClient,
  gapiInited
};
