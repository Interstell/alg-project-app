import React from 'react';
import { Rect, Ellipse, Line } from 'react-konva';
import _ from 'lodash';
import classNames from 'classnames';

import './map-editor.scss';
import {
  ObjectTypes,
  ObjectColors,
  ObjectCodes,
  ObjectTextures,
  Algorithms
} from '../../constants';
import AddShapeBlock from './components/add-shape-block';
import BuildPathBlock from './components/build-path-block';
import AlgorithmTabs from './components/algorithm-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

function getColorsForPixel(imageData, x, y) {
  return [
    imageData.data[y * (imageData.width * 4) + x * 4],
    imageData.data[y * (imageData.width * 4) + x * 4 + 1],
    imageData.data[y * (imageData.width * 4) + x * 4 + 2]
  ];
}

function createImage(src) {
  return new Promise(resolve => {
    const image = document.createElement('img');
    image.src = src;
    image.onload = function() {
      resolve(image);
    };
  });
}

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedCanvasSize: props.canvasWidth,
      algorithm: Algorithms.AStar,
      textures: {}
    };
  }

  async loadTextures() {
    const textures = await Promise.all(
      Object.entries(ObjectTextures).map(async ([type, texturePath]) => ({
        [type]: await createImage(texturePath)
      }))
    );
    return _.merge({}, ...textures);
  }

  componentDidMount() {
    this.loadTextures()
      .then(textures => {
        this.setState({ textures });
      })
      .catch(console.error);
  }

  onObjectChosen = (type, shape) => {
    const { shapes, onShapesChanged, canvasWidth, canvasHeight } = this.props;
    const { textures } = this.state;

    if (type !== ObjectTypes.Portal) {
      let object;
      const attributes = {
        fillPatternImage: textures[type],
        fill: ObjectColors[type].hex,
        stroke: ObjectColors[type].hex
      };

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
    } else {
      const portalA = {
        shape,
        type: ObjectTypes.PortalA,
        attributes: {
          fillPatternImage: textures[ObjectTypes.PortalA],
          fillPatternScale: {
            x: 0.2,
            y: 0.2
          },
          x: _.random(50, canvasWidth - 100),
          y: _.random(50, canvasHeight - 100),
          width: 64,
          height: 96,
          id: 'portalATexture' + _.random(100000)
        }
      };
      const portalB = {
        ...portalA,
        type: ObjectTypes.PortalB,
        attributes: {
          ...portalA.attributes,
          fillPatternImage: textures[ObjectTypes.PortalB],
          id: 'portalBTexture' + _.random(100000)
        }
      };
      const [x, y] = [
        canvasWidth - portalA.attributes.x,
        canvasHeight - portalB.attributes.y
      ];
      Object.assign(portalB.attributes, { x, y });

      portalA.targetId = portalB.attributes.id;
      portalB.targetId = portalA.attributes.id;

      onShapesChanged([...shapes, portalA, portalB]);
    }
  };

  buildCodeMatrix = async ({ scaleFactor = 1 } = {}) => {
    const { canvasWidth, canvasHeight, stageRef } = this.props;

    let imageData;

    const scaledWidth = canvasWidth * scaleFactor;
    const scaledHeight = canvasHeight * scaleFactor;

    if (scaleFactor === 1) {
      imageData = stageRef.current
        .toCanvas()
        .getContext('2d')
        .getImageData(0, 0, canvasWidth, canvasHeight);
    } else {
      const image = await createImage(
        stageRef.current.toDataURL({
          pixelRatio: scaleFactor
        })
      );

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
    }

    const colorMatrix = [];
    for (let x = 0; x < scaledWidth; x++) {
      const row = [];
      for (let y = 0; y < scaledHeight; y++) {
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
      scaledWidth
    );
  };

  onAlgorithmChanged = algorithm => {
    this.setState({ algorithm });
  };

  render() {
    const { editedCanvasSize, algorithm } = this.state;
    const {
      shapes,
      canvasWidth,
      onCanvasSizeChanged,
      onCaptureModeChanged,
      onShapesChanged
    } = this.props;

    return (
      <React.Fragment>
        <div className="box">
          <div className="map-size-wrapper">
            <p>Map size</p>
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
        </div>

        <div className="box">
          <div className="shapes-wrapper">
            <AddShapeBlock
              name="Block"
              onShapeChosen={shape =>
                this.onObjectChosen(ObjectTypes.Block, shape)
              }
            />
            <AddShapeBlock
              name="Swamp (2x slower)"
              onShapeChosen={shape =>
                this.onObjectChosen(ObjectTypes.Swamp, shape)
              }
            />
            <AddShapeBlock
              name="Sea (4x slower)"
              onShapeChosen={shape =>
                this.onObjectChosen(ObjectTypes.Sea, shape)
              }
            />
            <div className="shapes-block">
              <p>Portal</p>
              <button
                className="button"
                onClick={() => this.onObjectChosen(ObjectTypes.Portal, Rect)}
              >
                <FontAwesomeIcon className="dropdown-icon" icon={faCircle} />
                <span className="add-portal-btn-txt">Add portal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="box">
          <div className="algorithm-choice-block">
            <AlgorithmTabs
              algorithm={algorithm}
              onAlgorithmChanged={this.onAlgorithmChanged}
            />
            <div
              className={classNames({
                'is-hidden': algorithm !== Algorithms.AStar
              })}
            >
              <BuildPathBlock
                algorithm={Algorithms.AStar}
                shapes={shapes}
                canvasSize={canvasWidth}
                onShapesChanged={onShapesChanged}
                onCaptureModeChanged={onCaptureModeChanged}
                onBuildCodeMatrix={this.buildCodeMatrix}
              />
            </div>
            <div
              className={classNames({
                'is-hidden': algorithm !== Algorithms.Dijkstra
              })}
            >
              <BuildPathBlock
                algorithm={Algorithms.Dijkstra}
                shapes={shapes}
                canvasSize={canvasWidth}
                onShapesChanged={onShapesChanged}
                onCaptureModeChanged={onCaptureModeChanged}
                onBuildCodeMatrix={this.buildCodeMatrix}
              />
            </div>
            <div
              className={classNames({
                'is-hidden': algorithm !== Algorithms.BestFirst
              })}
            >
              <BuildPathBlock
                algorithm={Algorithms.BestFirst}
                shapes={shapes}
                canvasSize={canvasWidth}
                onShapesChanged={onShapesChanged}
                onCaptureModeChanged={onCaptureModeChanged}
                onBuildCodeMatrix={this.buildCodeMatrix}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MapEditor;
