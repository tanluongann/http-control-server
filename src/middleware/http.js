import {refreshDevice, refreshCommand, updateAuthentication, updateDevice} from '../action_creators';
 
export function httpMiddleware(store) {

  return next => action => {

    if (action.type === 'AUTHENTICATE_HTTP') {
      console.log('Performing the auth action');
      fetch(
        '/login', 
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            login: action.login,
            password: action.password
          })
        }
      ).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {  
            console.log(data);  
            store.dispatch(updateAuthentication({ "connected": true, "identity": data }));
          });
        }
        else {
          store.dispatch(updateAuthentication({ "connected": false, "identity": {} }));
        }
      }).catch(function(err) {
        store.dispatch(updateAuthentication({ "connected": false, "identity": {} }));
      });

    }
    if (action.type === 'REQ_DEVICE_ACCESS_INFO') {
      console.log('Getting device access info for ' + action.device);
      fetch(
        '/ip/'+action.device, 
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {  
            console.log(data);  
            store.dispatch(refreshDevice(data));
          });
        }
      });

    }
   
    return next(action);
  };
}

export default function(store) {
}
