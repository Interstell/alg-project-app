import React from 'react';
import { Rect, Ellipse, Line } from 'react-konva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShapes,
  faAngleDown,
  faGripLines
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCircle } from '@fortawesome/free-regular-svg-icons';

import './map-editor.scss';

const ShapeBlock = ({ name, onShapeChosen }) => (
  <div className="shapes-block">
    <p>{name}</p>
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu4"
        >
          <FontAwesomeIcon className="dropdown-icon" icon={faShapes} />
          <span>Choose shape</span>
          <FontAwesomeIcon className="dropdown-icon-right" icon={faAngleDown} />
        </button>
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div
            className="dropdown-item shape-item-block"
            onClick={() => onShapeChosen(Rect)}
          >
            <FontAwesomeIcon className="dropdown-icon" icon={faSquare} />
            <p>Rectangle</p>
          </div>
          <div className="dropdown-item shape-item-block">
            <FontAwesomeIcon
              className="dropdown-icon"
              icon={faCircle}
              onClick={() => onShapeChosen(Ellipse)}
            />
            <p>Ellipse</p>
          </div>
          <div className="dropdown-item shape-item-block">
            <FontAwesomeIcon
              className="dropdown-icon"
              icon={faGripLines}
              onClick={() => onShapeChosen(Line)}
            />
            <p>Line</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

class MapEditor extends React.Component {
  onShapeChosen = shape => {
    
  };

  render() {
    return (
      <React.Fragment>
        <h2 className="title is-4">Add element</h2>
        <div className="shapes-wrapper">
          <ShapeBlock name="Block" onShapeChosen={this.onShapeChosen} />
        </div>
      </React.Fragment>
    );
  }
}

export default MapEditor;
