import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {updatePassword, updateLogin, authenticateHTTP} from '../action_creators';

export const AccessLinksBox = React.createClass({
    
  mixins: [PureRenderMixin],    

  render: function() {
    var activeClass = this.props.visible ? 'accesslinksbox' : 'accesslinksbox hidden';

    var content = 'No device info';
    if (this.props.device) {
      var links = {
        "sonarr": "http://"+this.props.device.ip+":8989/calendar",
        "couchpotato": "http://"+this.props.device.ip+":5050",
        "transmission": "http://"+this.props.device.ip+":9091",
        "kodi": "http://"+this.props.device.ip+":8080",
      }
      content = <div><span className="instructions">Select the service you want to open</span>
        <ul className="links">
          <li>
            <a href= { links['sonarr'] }>
              <i className="fa fa-fw fa-calendar-check-o"></i>
              <span className="name">TV Shows</span>
            </a>
          </li>
          <li>
            <a href= { links['couchpotato'] }>
              <i className="fa fa-fw fa-ticket"></i>
              <span className="name">Movies</span>
            </a>
          </li>
          <li>
            <a href= { links['transmission'] }>
              <i className="fa fa-fw fa-cloud-download"></i>
              <span className="name">Downloads</span>
            </a>
          </li>
          <li>
            <a href= { links['kodi'] }>
              <i className="fa fa-fw fa-television"></i>
              <span className="name">TV Playrt</span>
            </a>
          </li>
        </ul>
      </div>
    }

    return <div className={ activeClass }>
      { content }
    </div>;
  }

});

function mapStateToProps(state) {
  return {
  };
}

export const AccessLinksBoxContainer = connect(mapStateToProps)(AccessLinksBox);

