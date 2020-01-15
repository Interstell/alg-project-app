import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faGripLines,
  faShapes
} from '@fortawesome/free-solid-svg-icons';
import { Ellipse, Line, Rect } from 'react-konva';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import React from 'react';

const AddShapeBlock = ({ name, onShapeChosen }) => (
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
          <div
            className="dropdown-item shape-item-block"
            onClick={() => onShapeChosen(Ellipse)}
          >
            <FontAwesomeIcon className="dropdown-icon" icon={faCircle} />
            <p>Ellipse</p>
          </div>
          <div
            className="dropdown-item shape-item-block"
            onClick={() => onShapeChosen(Line)}
          >
            <FontAwesomeIcon className="dropdown-icon" icon={faGripLines} />
            <p>Line</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AddShapeBlock;
