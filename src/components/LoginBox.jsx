import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {updatePassword, updateLogin, authenticate} from '../action_creators';

export const LoginBox = React.createClass({
    
  mixins: [PureRenderMixin],    

  submitLogin: function() {
    console.log("SHOULD SUBMIT");
    console.log(this.props.login + ' / ' + this.props.password);
    this.props.dispatch(authenticate(
      this.props.login,
      this.props.password
    ));
  },

  updateLogin: function(e) {
    this.props.dispatch(updateLogin(
      e.target.value
    ));
  },

  updatePassword: function(e) {
    this.props.dispatch(updatePassword(
      e.target.value
    ));
  },

  onKeyPress: function(e) {
    if (e.key === 'Enter') {
      this.submitLogin();
    }
  },

  render: function() {
    return <div className="loginbox"><div>
      <span className="intro">
        <i className="fa fa-exclamation-triangle"></i>
        Authentication required
      </span>
      <input type="text" className="login" placeholder="Login" onKeyPress={this.onKeyPress} onChange={ this.updateLogin } />
      <input type="password" className="password" placeholder="Password" onKeyPress={this.onKeyPress} onChange={ this.updatePassword } />
      <button className="submit" onClick={ this.submitLogin }>Submit</button>
    </div></div>;
  }

});

function mapStateToProps(state) {
  return {
    login: state.getIn(['ui', 'logininfo', 'login']),
    password: state.getIn(['ui', 'logininfo', 'password']),
  };
}

export const LoginBoxContainer = connect(mapStateToProps)(LoginBox);

