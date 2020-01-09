import React from 'react';
import { Stage, Layer } from 'react-konva';

import MapObject from './map-object';

class CanvasMap extends React.Component {
  // const [rectangles, setRectangles] = React.useState(initialRectangles);
  // const [selectedId, selectShape] = React.useState(null);
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null
    };
  }

  selectShape = id => {
    this.setState({ selectedId: id });
  };

  setShapeAttributes = (index, attributes) => {
    const { shapes, onShapesChanged } = this.props;

    const newShapes = [...shapes];
    newShapes[index] = { ...newShapes[index], attributes };

    onShapesChanged(newShapes);
  };

  render() {
    const { selectedId } = this.state;
    const { shapes } = this.props;

    return (
      <Stage
        width={750}
        height={750}
        onMouseDown={e => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            this.selectShape(null);
          }
        }}
      >
        <Layer>
          {shapes.map(({ shape: Shape, attributes }, i) => {
            return (
              <MapObject
                Shape={Shape}
                key={attributes.id}
                shapeProps={attributes}
                isSelected={attributes.id === selectedId}
                onSelect={() => {
                  this.selectShape(attributes.id);
                }}
                onChange={newAttrs => {
                  this.setShapeAttributes(i, newAttrs);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    );
  }
}

export default CanvasMap;
