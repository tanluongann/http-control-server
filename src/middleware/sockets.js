import io from 'socket.io-client';
import {refreshDevice, refreshCommand, updateAuthentication} from '../action_creators';
 
var socket = null;
var url = 'wss://ujust.watch:443';

export function socketMiddleware(store) {
  return next => action => {

    if (socket) {
      if (action.type === 'SEND_COMMAND_TO_DEVICE') {
        console.log('[WSIO] Sending a command execution to '+action.deviceId);
        var c = {
          "deviceid": action.deviceId, 
          "command": action.command,
          "timeout": action.timeout,
        }
        socket.emit('sendcommand', c);
      }
      if (action.type === 'SETUP_DEVICE') {
        console.log('[WSIO] Sending a setup order to '+action.device.id);
        var c = {
          "deviceid": action.deviceId,
        }
        socket.emit('setupdevice', c);
      }
    }
    if (action.type === 'AUTHENTICATE') {
      console.log('[WSIO] Logging in with '+action.login);
      socket = initSocket(store, socket, url, action.login, action.password);
    }
   
    return next(action);
  };
}

export function initSocket(store, socket, url, id, pw) {

  console.log("[WSIO] Connecting to " + url);
  socket = io(url, { 
    "secure": true,
    "timeout": 50000,
    "reconnection": true,
    "reconnectionAttempts": Infinity,    
    "reconnectionDelayMax": 60000
  });

  socket.on('connect', () => {
    console.log('[WSIO] Connection hanshake OK');
    console.log('[WSIO] Authenticating (' + id + ')');
    socket.emit('authentication', { username: id, password: pw });
  });

  socket.on('authenticated', () => {
    console.log('[WSIO] Connected as admin ('+ id +')');
    console.log('[WSIO] Posting a refresh request to broadcast address');
    socket.emit('refresh', { devices: ["all"] });
    store.dispatch(updateAuthentication({ "connected": true, "identity": id }));  
  });

  socket.on('unauthorized', function(err){
    console.log("[WSIO] Error with the authentication", err.message); 
  });  

  socket.on('status', function(status) {
    if (status.id) {
      console.log('[WSIO] Got status');
      console.log(status);
      store.dispatch(refreshDevice(status));  
    }
  });
  
  socket.on('command', function(commandDetails) {
    console.log('[WSIO] Got command update');
    console.log(commandDetails);
    store.dispatch(refreshCommand(
      commandDetails.id,
      commandDetails
    ));  
  });
  
  socket.on('message', function(message) {
    console.log("[WSIO] Message: " + message);
  });

  socket.on('disconnect', function() {
    console.log('[WSIO] Disconnected from the server');
  });

  return socket;

}

export default function(store) {

  socket = null

}
