import React from 'react';
import { Rect, Ellipse, Line } from 'react-konva';

import './App.scss';
import CanvasMap from './components/canvas-map/canvas-map';
import MapEditor from './components/map-editor/map-editor';

const initialShapes = [
  {
    shape: Rect,
    attributes: {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: 'red',
      id: 'rect1'
    }
  },
  {
    shape: Ellipse,
    attributes: {
      x: 200,
      y: 200,
      radiusX: 50,
      radiusY: 50,
      fill: 'green',
      id: 'circ1'
    }
  },
  {
    shape: Line,
    attributes: {
      points: [350, 150, 500, 150],
      stroke: 'black',
      strokeWidth: 5,
      id: 'line1'
    }
  }
];

class App extends React.Component {
  state = {
    shapes: initialShapes
  };

  onShapesChanged = newShapes => {
    this.setState({ shapes: newShapes });
  };

  render() {
    const { shapes } = this.state;
    return (
      <div className="App">
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered">Map Editor</h1>
              <div className="columns">
                <div className="column is-one-quarter">
                  <MapEditor
                    shapes={shapes}
                    onShapesChanged={this.onShapesChanged}
                  />
                </div>
                <div className="column is-three-quarters canvas-block">
                  <CanvasMap
                    shapes={shapes}
                    onShapesChanged={this.onShapesChanged}
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
