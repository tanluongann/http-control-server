import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

import {selectDevice} from '../action_creators';
import {selectDeviceTab} from '../action_creators';

import {DeviceCommandsContainer} from '../components/DeviceCommands';
import {DeviceDetailsContainer} from '../components/DeviceDetails';
import {DeviceActionsContainer} from '../components/DeviceActions';

export const Device = React.createClass({
    
  mixins: [PureRenderMixin],    

  selectDevice: function() {
    this.props.dispatch(selectDevice(
      this.props.device.id
    ));
  },

  selectTab: function(tab) {
    this.props.dispatch(selectDeviceTab(
      tab
    ));
  },


  render: function() {

    var actionBlocks = []
    if(!this.props.device.setup) {
      var setupActionBlock = <a className="setup" key="setupactionblock" onClick={ this.setupDevice }>Setup</a>;
      actionBlocks.push(setupActionBlock);
    }

    var tabs = { 
      "details": "",
      "commands": "",
      "actions": "",
    };
    var tab = this.props.selectedDeviceTab ? this.props.selectedDeviceTab : 'details';
    tabs[tab] = 'selected';

    var view = <DeviceDetailsContainer key="details" device={ this.props.device } />
    if(tab == 'commands') view = <DeviceCommandsContainer key="commands" device={ this.props.device } />
    if(tab == 'actions') view = <DeviceActionsContainer key="actions" device={ this.props.device } />

    return <li key={ this.props.device.id } className={ this.props.device.connected ? 'connected' : 'disconnected' } >
      <span className="header">
        <span className="name" onClick={ this.selectDevice }>{ this.props.device.id}</span>
      </span>
      <span className="version">v{ this.props.device.version}</span>
      <div className={ this.props.device.id ==  this.props.selectedDevice ? 'details selected' : 'details' }>
        <ul className="tabsbar">
          <li className={ tabs['details'] } key="detailsbtn"><a onClick={ this.selectTab.bind(this, 'details') }>Details</a></li>
          <li className={ tabs['commands'] } key="commandsbtn"><a onClick={ this.selectTab.bind(this, 'commands') }>Terminal</a></li>
          <li className={ tabs['actions'] } key="actionsbtn"><a onClick={ this.selectTab.bind(this, 'actions') }>Actions</a></li>
        </ul>
        <div className="viewpanel">
          { view }         
        </div>
      </div>
    </li>;
  }

});

function mapStateToProps(state) {
  return {
    selectedDevice: state.getIn(['selectedDevice']),
    selectedDeviceTab: state.getIn(['selectedDeviceTab']),
  };
}

export const DeviceContainer = connect(mapStateToProps)(Device);

