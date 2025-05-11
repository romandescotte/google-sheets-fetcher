import { tokenClient } from './gapiInit.js';
 
const $authorizeButton = document.getElementById('authorize_button')
const $refreshButton = document.getElementById('refresh_button')
const $signoutButton = document.getElementById('signout_button')


// Sign in the user upon button click.
$authorizeButton.addEventListener('click', handleAuthClick) 
function handleAuthClick() {
  
  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

$refreshButton.addEventListener('click', handleRefreshClick)

function handleRefreshClick() {  

  const token = localStorage.getItem('accessToken');
  if (token) {
    console.log("handlerefresh")
    gapi.client.setToken({ access_token: token });    
    // $creaDropdownUnidadesDisponibles()
  } else {
    console.log("handleauth")
    handleAuthClick();  // Si no hay token, solicita el login
  }
}

//Sign out the user upon button click. 
$signoutButton.addEventListener('click', handleSignoutClick)
window.signout = handleSignoutClick
function handleSignoutClick() {
  
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    localStorage.removeItem('accessToken');  
    console.log('Deslogueado correctamente!')
    setNotLoggedBtnState()
  }
}

function setNotLoggedBtnState() {
  //comprobar si ya tenian el disabled anter de sacar/poner
     $authorizeButton.removeAttribute('disabled')    
     $signoutButton.setAttribute('disabled', '')
     $refreshButton.setAttribute('disabled', '')
 }
 
function setLoggedInBtnState() {
   $signoutButton.removeAttribute('disabled')
   $authorizeButton.setAttribute('disabled', '')
   $refreshButton.removeAttribute('disabled')
 }

export {
  setLoggedInBtnState,
  setNotLoggedBtnState,
  handleAuthClick,
  handleRefreshClick,
  handleSignoutClick
}
