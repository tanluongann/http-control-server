import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {updatePassword, updateLogin, authenticateHTTP} from '../action_creators';

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  onLoginSubmit: function() {
    console.log(this.props.login + '/' + this.props.password);
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
    return <div className="accesspage">
      <div className="box">
        <div className="panel2">
          <span className="avatar">?</span>
          <h2><span className="you">You</span><span className="just">Just</span><span className="watch">Watch</span></h2>
          <span className="instructions">Please login to access your content</span>
          <form className="loginform" onSubmit={ this.onLoginSubmit }>
            <input type="text" placeholder="Login" onChange={ this.onUpdateLogin } value={ this.props.login }/>
            <input type="password" placeholder="Password" onChange={ this.onUpdatePassword } value={ this.props.password }/>
            <input type="submit" value="Login" className="submit" onClick={ this.onLoginSubmit }/>
          </form>
        </div>
      </div>
    </div>
  }

});

function mapStateToProps(state) {
  return {
    login: state.getIn(['ui', 'logininfo', 'login']),
    password: state.getIn(['ui', 'logininfo', 'password']),
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

