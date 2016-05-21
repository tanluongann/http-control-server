import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

// import Commands from '../components/commands'

export const DeviceCommand = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {
    return <li key={ this.props.command.id } className={ this.props.command.status } >
      <span className="command">{ this.props.command.payload}</span> 
      <span className="result">{ this.props.command.stdout}</span>
    </li>
  }

});

function mapStateToProps(state) {
  return {
    // devices: state.getIn(['devices']),
    // winner: state.get('winner')
  };
}

export const DeviceCommandContainer = connect(mapStateToProps)(DeviceCommand);

