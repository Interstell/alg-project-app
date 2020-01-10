import React from 'react';
import { Stage, Layer } from 'react-konva';

import MapObject from './map-object';

import { CANVAS_WIDTH, CANVAS_HEIGHT, ObjectTypes } from '../../constants';

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

  render() {
    const { selectedId } = this.state;
    const { shapes, isCaptureMode, stageRef } = this.props;
    this.setStageHandlers();

    return (
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
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
              />
            );
          })}
        </Layer>
      </Stage>
    );
  }
}

export default CanvasMap;