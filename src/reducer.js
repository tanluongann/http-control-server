export const SET_STATE              = 'SET_STATE';
export const SELECT_DEVICE          = 'SELECT_DEVICE';
export const SELECT_DEVICE_TAB      = 'SELECT_DEVICE_TAB';
export const REFRESH_DEVICE         = 'REFRESH_DEVICE';
export const SETUP_DEVICE           = 'SETUP_DEVICE';
export const SEND_COMMAND_TO_DEVICE = 'SEND_COMMAND_TO_DEVICE';
export const REFRESH_COMMAND        = 'REFRESH_COMMAND';
export const UPDATE_COMMAND_TEXT    = 'UPDATE_COMMAND_TEXT';
export const UPDATE_COMMAND_TIMEOUT = 'UPDATE_COMMAND_TIMEOUT';
export const UPDATE_AUTH            = 'UPDATE_AUTH';
import {Map} from 'immutable';

function setState(state, newState) {

  return state.merge(newState);
}

function selectDevice(state, deviceId) {
  console.log('Selecting device ' + deviceId);
  return state.setIn(['selectedDevice'], deviceId);
}

function selectDeviceTab(state, tab) {
  console.log('Selecting device tab ' + tab);
  return state.setIn(['selectedDeviceTab'], tab);
}

function refreshDevice(state, device) {
  console.log('Got new device info, need to refresh the state');
  const deviceId = device.id;
  if (deviceId)
    return state.setIn(['devices', deviceId], device);
  else
    return state
}

function refreshCommand(state, command) {
  console.log('Got new command info, need to refresh the state');
  const commandId = command.id;
  return state.setIn(['commands', commandId], command);
}

function updateCommandText(state, deviceId, value) {
  console.log('Updating the commandtext for ' + deviceId + ' to ' + value);
  return state.setIn(['ui', deviceId, 'commandText'], value);
}

function updateCommandTimeout(state, deviceId, value) {
  console.log('Updating the commandtimeout for ' + deviceId + ' to ' + value);
  return state.setIn(['ui', deviceId, 'commandTimeout'], value);
}

function updateAuthentication(state, status) {
  console.log('Updating the authentication info to ' + status);
  return state.setIn(['ui', 'auth'], status);
}

function updateLogin(state, value) {
  console.log('Updating the login for to ' + value);
  return state.setIn(['ui', 'logininfo', 'login'], value);
}

function updatePassword(state, value) {
  console.log('Updating the password for to ' + value);
  return state.setIn(['ui', 'logininfo', 'password'], value);
}

function authenticateHTTP(state, login, password) {
  fetch(
    '/login', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: login,
        password: password
      })
    }
  ).then(function(response) {
    dispatch(updateAuthentication({ "connected": true, "identity": response });
  }).catch(function(err) {
    dispatch(updateAuthentication({ "connected": false, "identity": {} });
  });
  return state;
}

export default function(state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'SELECT_DEVICE':
      return selectDevice(state, action.deviceId);
    case 'SELECT_DEVICE_TAB':
      return selectDeviceTab(state, action.tab);
    case 'REFRESH_DEVICE':
      return refreshDevice(state, action.device);
    case 'SETUP_DEVICE':
      return state;
    case 'SEND_COMMAND_TO_DEVICE':
      return state;
    case 'REFRESH_COMMAND':
      return refreshCommand(state, action.details);
    case 'UPDATE_COMMAND_TEXT':
      return updateCommandText(state, action.deviceId, action.value);
    case 'UPDATE_COMMAND_TIMEOUT':
      return updateCommandTimeout(state, action.deviceId, action.value);
    case 'UPDATE_AUTH':
      return updateAuthentication(state, action.status);
    case 'AUTHENTICATE_WS':
      return state;
    case 'AUTHENTICATE_HTTP':
      return authenticateHTTP(state, action.login, action.password);
    case 'UPDATE_LOGIN':
      return updateLogin(state, action.value);
    case 'UPDATE_PASSWORD':
      return updatePassword(state, action.value);
      
  }
  return state;
}
