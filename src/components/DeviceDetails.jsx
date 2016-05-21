import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

import {updateName} from '../action_creators';

export const DeviceDetails = React.createClass({
    
  mixins: [PureRenderMixin],    

  componentDidUpdate: function() {
  },

  onChangeName: function(e) {
    this.props.dispatch(updateName(
      this.props.device.id,
      e.target.value
    ));
  },

  render: function() {

    var setupInfo = {
      "yes": { "class": "done", "label": "Ok"},
      "no": { "class": "no", "label": "Not performed"},
      "pending": { "class": "pending", "label": "Pending"},
    }
    this.props.device.setup = this.props.device.setup || 'no';
    var infoLabel =  setupInfo[this.props.device.setup].label;

    return <div className="details"> 
      
      <div className="infogroup">

        <span className="info">
          <span className="label">Id</span>
          <span className="value">{ this.props.device.id }</span>
        </span>

        <span className="info">
          <span className="label">Status</span>
          <span className="value">{ this.props.device.connected ? 'Connected' : 'Disconnected' }</span>
        </span>

        <span className="info">
          <span className="label">Version</span>
          <span className="value">{ this.props.device.version }</span>
        </span>

        <span className="info">
          <span className="label">Setup</span>
          <span className="value">{ infoLabel }</span>
        </span>

      </div>



      <div className="infogroup">

        <span className="info">
          <span className="label">IP</span>
          <span className="value">{ this.props.device.ip }</span>
        </span>

        <span className="info">
          <span className="label">Name</span>
          <input className="value" onChange={ this.onChangeName } value={ this.props.device.name } />
        </span>

        <span className="info">
          <span className="label">Property</span>
          <span className="value">??</span>
        </span>

        <span className="info">
          <span className="label">Property</span>
          <span className="value">??</span>
        </span>

      </div>



      <div className="infogroup">

        <span className="info">
          <span className="label">Transmission</span>
          <span className="value unknown">Unknown</span>
        </span>

        <span className="info">
          <span className="label">Sonarr</span>
          <span className="value unknown">Unknown</span>
        </span>

        <span className="info">
          <span className="label">CouchPotato</span>
          <span className="value unknown">Unknown</span>
        </span>

        <span className="info">
          <span className="label">Samba</span>
          <span className="value unknown">Unknown</span>
        </span>


      </div>





    </div>;
  }

});

function mapStateToProps(state, ownProps) {
  return {
    commands: state.getIn(['details']),
  };
}

export const DeviceDetailsContainer = connect(mapStateToProps)(DeviceDetails);

