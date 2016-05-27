import {refreshDevice, refreshCommand, updateAuthentication} from '../action_creators';
 
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
            login: login,
            password: password
          })
        }
      ).then(function(response) {
        dispatch(updateAuthentication({ "connected": true, "identity": response }));
      }).catch(function(err) {
        dispatch(updateAuthentication({ "connected": false, "identity": {} }));
      });

    }
    if (action.type === 'OTHER_ACTION') {
    }
   
    return next(action);
  };
}

export default function(store) {
}
