import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

export const HomePage = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {

   return <div>
    Homepage
   </div>;
  }

});

function mapStateToProps(state) {
  return {
  };
}

export const HomePageContainer = connect(mapStateToProps)(HomePage);

