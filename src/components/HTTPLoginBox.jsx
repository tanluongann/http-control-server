import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {updatePassword, updateLogin, authenticateHTTP} from '../action_creators';

export const HTTPLoginBox = React.createClass({
    
  mixins: [PureRenderMixin],    

  onLoginSubmit: function() {
    console.log(this.props.login + '/' + this.props.password+'/'+this.props.device);
    this.props.dispatch(authenticateHTTP(
      this.props.login,
      this.props.password,
      this.props.authCallback
    ));
  },

  onUpdateLogin: function(e) {
    this.props.dispatch(updateLogin(
      e.target.value
    ));
  },

  onUpdatePassword: function(e) {
    this.props.dispatch(updatePassword(
      e.target.value
    ));
  },

  render: function() {
    var activeClass = this.props.visible ? 'httploginbox' : 'httploginbox hidden';
    return <div className={ activeClass }><span className="instructions">Please login to access your content</span>
      <form className="loginform" onSubmit={ this.onLoginSubmit } target="passwordIframe" method='POST' action="blank">
        <input type="text" placeholder="Login" onChange={ this.onUpdateLogin } value={ this.props.login }/>
        <input type="password" placeholder="Password" onChange={ this.onUpdatePassword } value={ this.props.password }/>
        <input type="submit" value="Login" className="submit" />
      </form>
      <iframe id="passwordIframe" name="passwordIframe" className="trick"></iframe>
    </div>;
  }

});

function mapStateToProps(state) {
  return {
    login: state.getIn(['ui', 'logininfo', 'login']),
    password: state.getIn(['ui', 'logininfo', 'password']),
  };
}

export const HTTPLoginBoxContainer = connect(mapStateToProps)(HTTPLoginBox);

