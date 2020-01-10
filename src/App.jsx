import React from 'react';
import { Ellipse } from 'react-konva';

import './App.scss';
import CanvasMap from './components/canvas-map/canvas-map';
import MapEditor from './components/map-editor/map-editor';
import { ObjectTypes, ObjectColors } from './constants';

const initialShapes = [
  {
    shape: Ellipse,
    type: ObjectTypes.Start,
    attributes: {
      x: 50,
      y: 700,
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
      x: 700,
      y: 50,
      radiusX: 20,
      radiusY: 20,
      fill: ObjectColors.Finish.hex,
      id: 'finish'
    }
  }
];

class App extends React.Component {
  state = {
    shapes: initialShapes,
    stageRef: React.createRef()
  };

  onShapesChanged = newShapes => {
    this.setState({ shapes: newShapes });
  };

  render() {
    const { shapes, stageRef } = this.state;
    return (
      <div className="App">
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered">
                Shortest Path Map Builder
              </h1>
              <div className="columns">
                <div className="column is-one-quarter">
                  <MapEditor
                    shapes={shapes}
                    onShapesChanged={this.onShapesChanged}
                    stageRef={stageRef}
                  />
                </div>
                <div className="column is-three-quarters canvas-block">
                  <CanvasMap
                    shapes={shapes}
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
