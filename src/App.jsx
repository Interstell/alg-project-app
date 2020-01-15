import React from 'react';
import { Ellipse } from 'react-konva';

import './App.scss';
import CanvasMap from './components/canvas-map/canvas-map';
import MapEditor from './components/map-editor/map-editor';
import { ObjectTypes, ObjectColors } from './constants';

const CANVAS_INITIAL_WIDTH = 650;
const CANVAS_INITIAL_HEIGHT = 650;

const getInitialShapes = (canvasWidth, canvasHeight) => {
  return [
    {
      shape: Ellipse,
      type: ObjectTypes.Start,
      attributes: {
        x: 50,
        y: canvasHeight - 50,
        radiusX: 20,
        radiusY: 20,
        fill: ObjectColors.Start.hex,
        id: 'start'
      }
    },
    {
      shape: Ellipse,
      type: ObjectTypes.Finish,
      attributes: {
        x: canvasWidth - 50,
        y: 50,
        radiusX: 20,
        radiusY: 20,
        fill: ObjectColors.Finish.hex,
        id: 'finish'
      }
    }
  ];
};

class App extends React.Component {
  state = {
    shapes: getInitialShapes(CANVAS_INITIAL_WIDTH, CANVAS_INITIAL_HEIGHT),
    stageRef: React.createRef(),
    isCaptureMode: false,
    canvasWidth: CANVAS_INITIAL_WIDTH,
    canvasHeight: CANVAS_INITIAL_HEIGHT
  };

  onShapesChanged = async newShapes => {
    return new Promise(resolve => {
      this.setState({ shapes: newShapes }, resolve);
    });
  };

  onCaptureModeChanged = captureMode => {
    return new Promise(resolve => {
      this.setState({ isCaptureMode: captureMode }, resolve);
    });
  };

  onCanvasSizeChanged = (width, height) => {
    const { canvasWidth, canvasHeight } = this.state;
    if (canvasWidth !== width || canvasHeight !== height) {
      this.setState({
        canvasWidth: width,
        canvasHeight: height,
        shapes: getInitialShapes(width, height)
      });
    }
  };

  render() {
    const {
      shapes,
      stageRef,
      isCaptureMode,
      canvasWidth,
      canvasHeight
    } = this.state;
    return (
      <div className="App">
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered">
                Shortest Path Map Builder
              </h1>
              <div className="columns">
                <div className="column is-one-third">
                  <MapEditor
                    shapes={shapes}
                    isCaptureMode={isCaptureMode}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    onShapesChanged={this.onShapesChanged}
                    onCaptureModeChanged={this.onCaptureModeChanged}
                    onCanvasSizeChanged={this.onCanvasSizeChanged}
                    stageRef={stageRef}
                  />
                </div>
                <div className="column is-two-thirds canvas-block">
                  <CanvasMap
                    shapes={shapes}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    isCaptureMode={isCaptureMode}
                    onShapesChanged={this.onShapesChanged}
                    stageRef={stageRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
