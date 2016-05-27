import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {updatePassword, updateLogin, authenticateHTTP} from '../action_creators';

import {HTTPLoginBoxContainer} from '../components/HTTPLoginBox'

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {

    var accessbox = '';
    var loginbox = <HTTPLoginBoxContainer visible={ !this.props.auth || !this.props.auth.connected } device={ this.props.params.device }></HTTPLoginBoxContainer>;

    return <div className="accesspage">
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
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

