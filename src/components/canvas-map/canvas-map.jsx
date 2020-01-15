import React from 'react';
import { Stage, Layer } from 'react-konva';

import MapObject from './map-object';

import { ObjectTypes } from '../../constants';

class CanvasMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null
    };
  }

  selectShape = id => {
    this.setState({ selectedId: id });
  };

  deleteShape = id => {
    const { shapes, onShapesChanged } = this.props;
    onShapesChanged(shapes.filter(s => s.attributes.id !== id));
  };

  setShapeAttributes = (index, attributes) => {
    const { shapes, onShapesChanged } = this.props;

    const newShapes = [...shapes];
    newShapes[index] = { ...newShapes[index], attributes };

    onShapesChanged(newShapes);
  };

  putToForefront = index => {
    const { shapes, onShapesChanged } = this.props;

    const newShapes = [
      ...shapes.slice(0, index),
      ...shapes.slice(index + 1),
      shapes[index]
    ];

    onShapesChanged(newShapes);
  };

  setStageHandlers = () => {
    const { stageRef } = this.props;
    const stage = stageRef.current;
    if (stage) {
      stage.on('contentContextmenu', e => {
        e.evt.preventDefault();
      });
    }
  };

  onObjectMoved = () => {
    const { shapes, onShapesChanged } = this.props;
    onShapesChanged(shapes.filter(s => s.type !== ObjectTypes.Path));
  };

  render() {
    const { selectedId } = this.state;
    const {
      shapes,
      isCaptureMode,
      canvasWidth,
      canvasHeight,
      stageRef
    } = this.props;
    this.setStageHandlers();

    return (
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        ref={stageRef}
        onMouseDown={e => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            this.selectShape(null);
          }
        }}
      >
        <Layer>
          {shapes.map(({ shape: Shape, type, attributes }, i) => {
            return (
              <MapObject
                Shape={Shape}
                key={attributes.id}
                shapeProps={attributes}
                isSelected={attributes.id === selectedId}
                isWithShadow={true}
                isCaptureMode={isCaptureMode}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                onSelect={e => {
                  if (
                    e.evt.button === 2 &&
                    type !== ObjectTypes.Start &&
                    type !== ObjectTypes.Finish
                  ) {
                    this.deleteShape(attributes.id);
                  } else {
                    this.selectShape(attributes.id);
                  }
                }}
                onToForefront={() => {
                  this.putToForefront(i);
                }}
                onChange={newAttrs => {
                  this.setShapeAttributes(i, newAttrs);
                }}
                onObjectMoved={this.onObjectMoved}
              />
            );
          })}
        </Layer>
      </Stage>
    );
  }
}

export default CanvasMap;
