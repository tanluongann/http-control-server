import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {

   	return <div className="accesspage">
		<div className="box">
			<div className="panel2">
				<span className="avatar"></span>
				<h2><span className="you">You</span><span className="just">Just</span><span className="watch">Watch</span></h2>
				<div className="form">
					<input type="text" placeholder="Login"/>
					<input type="password" placeholder="Password"/>
				</div>
			</div>
		</div>
	</div>

  }

});

function mapStateToProps(state) {
  return {
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

