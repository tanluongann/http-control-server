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
            login: action.login,
            password: action.password
          })
        }
      ).then(function(response) {
        store.dispatch(updateAuthentication({ "connected": response.ok, "identity": response }));
      }).catch(function(err) {
        store.dispatch(updateAuthentication({ "connected": false, "identity": {} }));
      });

    }
    if (action.type === 'OTHER_ACTION') {
    }
   
    return next(action);
  };
}

export default function(store) {
}
