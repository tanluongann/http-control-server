export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  };
}



export function selectDevice(deviceId) {
  return {
    type: 'SELECT_DEVICE',
    deviceId
  };
}

export function selectDeviceTab(tab) {
  return {
    type: 'SELECT_DEVICE_TAB',
    tab
  };
}

export function refreshDevice(device) {
  return {
    type: 'REFRESH_DEVICE',
    device
  };
}

export function setupDevice(device) {
  return {
    type: 'SETUP_DEVICE',
    device
  };
}



export function sendCommandToDevice(deviceId, command, timeout) {
  timeout = timeout || 0;
  return {
    type: 'SEND_COMMAND_TO_DEVICE',
    deviceId,
    command,
    timeout
  };
}

export function refreshCommand(commandId, details) {
  return {
    type: 'REFRESH_COMMAND',
    commandId: commandId,
    details: details
  };
}



export function updateCommandText(deviceId, value) {
  return {
    type: 'UPDATE_COMMAND_TEXT',
    deviceId: deviceId,
    value: value
  };
}
export function updateCommandTimeout(deviceId, value) {
  return {
    type: 'UPDATE_COMMAND_TIMEOUT',
    deviceId: deviceId,
    value: value
  };
}

export function updateAuthentication(status) {
  return {
    type: 'UPDATE_AUTH',
    status
  };
}


export function updateLogin(value) {
  return {
    type: 'UPDATE_LOGIN',
    value: value
  };
}
export function updatePassword(value) {
  return {
    type: 'UPDATE_PASSWORD',
    value: value
  };
}
export function authenticate(login, password) {
  return {
    type: 'AUTHENTICATE_WS',
    login: login,
    password: password
  };
}


export function authenticateHTTP(login, password) {
  return {
    type: 'AUTHENTICATE_HTTP',
    login: login,
    password: password
  };
}


export function requestDeviceAccessInfo(device) {
  return {
    type: 'REQ_DEVICE_ACCESS_INFO',
    device: device
  };
}


