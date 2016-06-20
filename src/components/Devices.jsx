import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {sendCommandToDevice} from '../action_creators';

import {DeviceContainer} from '../components/Device'
import {HTTPLoginBoxContainer} from '../components/HTTPLoginBox'
import {LoggedPanelContainer} from '../components/LoggedPanel'

export const Devices = React.createClass({
    
  mixins: [PureRenderMixin],    

  getDevices: function() {
    return this.props.devices ? this.props.devices.toArray() : [];
  },

  render: function() {

    var auth = this.props.auth ? this.props.auth : { "connected": false, "identity": null };

    return <div>
      { auth.connected ? <LoggedPanelContainer></LoggedPanelContainer> : <HTTPLoginBoxContainer></HTTPLoginBoxContainer> }
      <span className="title" key="2">
        <i className="fa fw fa-hashtag"></i>
        Devices
      </span>
      <ul className="devices" key="3">
        { this.getDevices().map(device =>
          <DeviceContainer key={device.id} device={device} />
        )}
      </ul>
    </div>;
  }

});

function mapStateToProps(state) {
  return {
    devices: state.getIn(['devices']),
    auth: state.getIn(['ui', 'auth']),
  };
}

export const DevicesContainer = connect(mapStateToProps)(Devices);

