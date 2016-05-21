import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {sendCommandToDevice} from '../action_creators';

export const LoggedPanel = React.createClass({
    
  mixins: [PureRenderMixin],    

  submitLogin: function() {
    return this.props.loggedPanel ? this.props.loggedPanel.toArray() : [];
  },

  updateLogin: function() {
    return this.props.loggedPanel ? this.props.loggedPanel.toArray() : [];
  },

  updatePassword: function() {
    return this.props.loggedPanel ? this.props.loggedPanel.toArray() : [];
  },

  render: function() {
    return <div className="loggedpanel">
      <i className="fa fa-fw fa-check-circle"></i>
      Logged as <span className="name">{ this.props.auth.identity }</span>
    </div>;
  }

});

function mapStateToProps(state) {
  return {
    auth: state.getIn(['ui', 'auth']),
  };
}

export const LoggedPanelContainer = connect(mapStateToProps)(LoggedPanel);

