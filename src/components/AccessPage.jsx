import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

export const AccessPage = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {

   return <div>
    Accesspage
   </div>;
  }

});

function mapStateToProps(state) {
  return {
  };
}

export const AccessPageContainer = connect(mapStateToProps)(AccessPage);

