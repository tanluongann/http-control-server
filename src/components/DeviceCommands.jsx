import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import {sendCommandToDevice, updateCommandText, updateCommandTimeout} from '../action_creators';
import {DeviceCommandContainer} from '../components/DeviceCommand';

export const DeviceCommands = React.createClass({
    
  mixins: [PureRenderMixin],    

  getCommands: function(device_id) {
    if (this.props.commands) {
      const res = this.props.commands.toSeq().filter(d => d.device == device_id).sort((d1, d2) => d1.timestamp > d2.timestamp).toArray();
      return res;
    }
    else return [];
  },
  
  sendCommand: function(e) {
    this.props.dispatch(sendCommandToDevice(
      this.props.device.id,
      this.props.commandText
    ));
    this.props.dispatch(updateCommandText(
      this.props.device.id,
      ''
    ));
  },
  
  onChangeCommandText: function(e) {
    this.props.dispatch(updateCommandText(
      this.props.device.id,
      e.target.value
    ));
  },
  
  onChangeCommandTimeout: function(e) {
    this.props.dispatch(updateCommandTimeout(
      this.props.device.id,
      e.target.value
    ));
  },
  
  componentDidUpdate: function() {
    const { scrollbars } = this.refs;
    scrollbars.scrollToBottom();
  },
  
  onKeyPress: function(e) {
    if (e.key === 'Enter') {
      this.sendCommand();
    }
  },

  render: function() {
    return <div> 
      <div className="command-edition">
        <input type="text" className="command" value={ this.props.commandText } onKeyPress={this.onKeyPress} onChange={ this.onChangeCommandText } />
        <input type="text" className="timeout" value={ this.props.commandTimeout } onChange={ this.onChangeCommandTimeout } />
        <button className="send" onClick={ this.sendCommand } >Send</button>
      </div>
      <div className="command-list">
        <Scrollbars ref="scrollbars">
          <ul className="commands">
            { this.getCommands(this.props.device.id).map(command =>
              <DeviceCommandContainer key={command.id} command={command} />
            )}
          </ul>
        </Scrollbars>
      </div>
    </div>;
  }

});

function mapStateToProps(state, ownProps) {
  return {
    commands: state.getIn(['commands']),
    commandText: state.getIn(['ui', ownProps.device.id, 'commandText']),
    commandTimeout: state.getIn(['ui', ownProps.device.id, 'commandTimeout']),
  };
}

export const DeviceCommandsContainer = connect(mapStateToProps)(DeviceCommands);

