import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {requestDeviceAccessInfo} from '../action_creators';

import {HTTPLoginBoxContainer} from '../components/HTTPLoginBox';
import {AccessLinksBoxContainer} from '../components/AccessLinksBox';

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  requestAccess: function(device) {
    this.props.dispatch(requestDeviceAccessInfo(
      device
    ));
  },

  render: function() {

    var view = this;
    var authCallback = function() {
      view.requestAccess(view.props.params.device);
    }

    var connected = this.props.auth && this.props.auth.connected;
    var classNames = ['accesspage', connected ? 'auth' : 'noauth'];

    var device = null;
    if (this.props.devices) device = this.props.devices.get(view.props.params.device);

    var accessbox = <AccessLinksBoxContainer  device={ device } ></AccessLinksBoxContainer>
    var loginbox = <HTTPLoginBoxContainer device={ device } authCallback={ authCallback } ></HTTPLoginBoxContainer>;

    return <div className={ classNames.join(' ') }>
      <div className="box">
        <div className="panel2">
          <span className="avatar">?</span>
          <h2><span className="you">You</span><span className="just">Just</span><span 
          className="watch">Watch</span></h2>
          
          { loginbox }
          { accessbox }

        </div>
      </div>
    </div>
  }

});

function mapStateToProps(state) {
  return {
    auth: state.getIn(['ui', 'auth']),
    devices: state.getIn(['devices']),
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

