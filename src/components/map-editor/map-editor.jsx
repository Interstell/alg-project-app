import React from 'react';
import { Rect, Ellipse, Line } from 'react-konva';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShapes,
  faAngleDown,
  faGripLines
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCircle } from '@fortawesome/free-regular-svg-icons';
import API from '../../api';

import './map-editor.scss';
import { ObjectTypes, ObjectColors, ObjectCodes } from '../../constants';

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

function getColorsForPixel(imageData, x, y) {
  return [
    imageData.data[y * (imageData.width * 4) + x * 4],
    imageData.data[y * (imageData.width * 4) + x * 4 + 1],
    imageData.data[y * (imageData.width * 4) + x * 4 + 2]
  ];
}

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPathLoading: false,
      editedCanvasSize: props.canvasWidth
    };
  }

  onObjectChosen = (type, shape) => {
    const { shapes, onShapesChanged, canvasWidth, canvasHeight } = this.props;

    let object;
    const attributes = {};
    switch (type) {
      case ObjectTypes.Block:
        attributes.fill = ObjectColors.Block.hex;
        attributes.stroke = ObjectColors.Block.hex;
        break;
      case ObjectTypes.Sea:
        attributes.fill = ObjectColors.Sea.hex;
        attributes.stroke = ObjectColors.Sea.hex;
        break;
      case ObjectTypes.Swamp:
        attributes.fill = ObjectColors.Swamp.hex;
        attributes.stroke = ObjectColors.Swamp.hex;
        break;
      default:
        break;
    }
    switch (shape) {
      case Rect:
        object = {
          shape,
          attributes: {
            ...attributes,
            x: _.random(50, canvasWidth - 100),
            y: _.random(50, canvasHeight - 100),
            width: 100 + (Math.random() - 0.5) * _.random(100),
            height: 100 + (Math.random() - 0.5) * _.random(100),
            id: 'rect' + _.random(100000)
          }
        };
        break;
      case Ellipse:
        object = {
          shape,
          attributes: {
            ...attributes,
            x: _.random(50, canvasWidth - 100),
            y: _.random(50, canvasHeight - 100),
            radiusX: 75 + (Math.random() - 0.5) * _.random(50),
            radiusY: 75 + (Math.random() - 0.5) * _.random(50),
            id: 'ellipse' + _.random(100000)
          }
        };
        break;
      case Line:
        object = {
          shape,
          attributes: {
            ...attributes,
            points: [
              _.random(50, Math.round(canvasWidth / 2) - 50), // x1
              _.random(50, Math.round(canvasHeight / 2) - 50), // y1
              _.random(Math.round(canvasWidth / 2) + 50, canvasWidth - 50), // x2
              _.random(Math.round(canvasHeight / 2) + 50, canvasHeight - 50) //  y2
            ],
            strokeWidth: 5,
            id: 'line' + _.random(100000)
          }
        };
        break;
      default:
        break;
    }

    onShapesChanged([...shapes, object]);
  };

  buildCodeMatrix = () => {
    const { canvasWidth, canvasHeight, stageRef } = this.props;
    const imageData = stageRef.current
      .toCanvas()
      .getContext('2d')
      .getImageData(0, 0, canvasWidth, canvasHeight);

    const colorMatrix = [];
    for (let x = 0; x < canvasWidth; x++) {
      const row = [];
      for (let y = 0; y < canvasHeight; y++) {
        row.push(getColorsForPixel(imageData, x, y));
      }
      colorMatrix.push(row);
    }

    const colors = Object.entries(ObjectColors);

    return _.chunk(
      _.flatten(colorMatrix).map(([r, g, b]) => {
        if (r === 0 && g === 0 && b === 0) {
          return 1;
        } else {
          const color = colors.find(
            c => c[1].r === r && c[1].g === g && c[1].b === b
          );
          if (color) {
            return ObjectCodes[color[0]];
          } else return 1;
        }
      }),
      canvasWidth
    );
  };

  removePath = cb => {
    const { shapes, onShapesChanged } = this.props;
    onShapesChanged(
      shapes.filter(s => s.type !== ObjectTypes.Path),
      cb
    );
  };

  drawBuiltPath = path => {
    const { shapes, onShapesChanged } = this.props;

    const segments = path.map(segment => ({
      shape: Line,
      type: ObjectTypes.Path,
      attributes: {
        points: _.flatten(segment),
        stroke: '#FF5722',
        strokeWidth: 3,
        id: 'path' + _.random(10000)
      }
    }));

    onShapesChanged([...shapes, ...segments]);
  };

  onBuildPathButtonClicked = async () => {
    const { shapes, onCaptureModeChanged } = this.props;

    onCaptureModeChanged(true, async () => {
      this.setState({ isPathLoading: true });
      this.removePath(async () => {
        const codeMatrix = this.buildCodeMatrix();

        const startShape = shapes.find(s => s.type === ObjectTypes.Start);
        const finishShape = shapes.find(s => s.type === ObjectTypes.Finish);
        const path = await API.getPathForMatrix({
          matrix: codeMatrix,
          start: [startShape.attributes.x, startShape.attributes.y],
          end: [finishShape.attributes.x, finishShape.attributes.y]
        });

        this.drawBuiltPath(path);

        this.setState({ isPathLoading: false });

        onCaptureModeChanged(false);
      });
    });
  };

  render() {
    const { isPathLoading, editedCanvasSize } = this.state;
    const { onCanvasSizeChanged } = this.props;

    return (
      <React.Fragment>
        <h2 className="title is-4">Map size</h2>
        <div className="map-size-wrapper">
          <input
            className="input"
            type="number"
            min="100"
            max="1500"
            placeholder="Width"
            value={editedCanvasSize}
            onChange={e =>
              this.setState({ editedCanvasSize: Number(e.target.value) })
            }
          />
          <button
            className="button is-link"
            onClick={() =>
              onCanvasSizeChanged(editedCanvasSize, editedCanvasSize)
            }
          >
            Save
          </button>
        </div>
        <h2 className="title is-4">Add element</h2>
        <div className="shapes-wrapper">
          <ShapeBlock
            name={ObjectTypes.Block}
            onShapeChosen={shape =>
              this.onObjectChosen(ObjectTypes.Block, shape)
            }
          />
          <ShapeBlock
            name={ObjectTypes.Sea}
            onShapeChosen={shape => this.onObjectChosen(ObjectTypes.Sea, shape)}
          />
          <ShapeBlock
            name={ObjectTypes.Swamp}
            onShapeChosen={shape =>
              this.onObjectChosen(ObjectTypes.Swamp, shape)
            }
          />
        </div>
        <button
          className={
            'button is-medium is-info ' + (isPathLoading ? 'is-loading' : '')
          }
          onClick={this.onBuildPathButtonClicked}
        >
          Build path
        </button>
      </React.Fragment>
    );
  }
}

export default MapEditor;
