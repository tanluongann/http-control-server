import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {

   return <div className="accesspage">

	<div className="box">

		<div className="panel1">
			<h2>Welcome to</h2>
			<h2>UJustWatch</h2>
		</div>
		
		<div className="panel2">
			loginpage
		</div>

  </div>
</div>

   </div>;
  }

});

function mapStateToProps(state) {
  return {
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

