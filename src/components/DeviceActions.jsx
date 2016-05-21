import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

import {setupDevice} from '../action_creators';

export const DeviceActions = React.createClass({
    
  mixins: [PureRenderMixin],    

  componentDidUpdate: function() {
  },

  setupDevice: function() {
    this.props.dispatch(setupDevice(
      this.props.device
    ));
  },

  changePassword: function() {
    // TODO: Update to the proper function changePassword
    this.props.dispatch(setupDevice(
      this.props.device
    ));
  },

  render: function() {

    var setupInfo = {
      "yes": { "class": "done", "label": "Re-Do"},
      "no": { "class": "no", "label": "Setup"},
      "pending": { "class": "pending", "label": "Pending"},
    }
    return <div className="actions"> 
      <ul>
        <li>
          <button className={ setupInfo[this.props.device.setup].class } onClick={ this.setupDevice } >{ setupInfo[this.props.device.setup].label }</button>
          <span>Execute the initialization process to define a unique password and set device properties</span>
        </li>
        <li>
          <button className="no" onClick={ this.changePassword } >Change pwd</button>
          <span>Change the password on both the server and client side, in case it has been compromised</span>
        </li>
      </ul>
    </div>;

  }

});

function mapStateToProps(state, ownProps) {
  return {
  };
}

export const DeviceActionsContainer = connect(mapStateToProps)(DeviceActions);

