import React from 'react';
import Konva from 'konva';
import { Transformer } from 'react-konva';
import { Line, Ellipse } from 'react-konva';

const MapObject = ({ Shape, ...rest }) => {
  if (Shape === Line) {
    return MapLine(rest);
  } else {
    return MapShape({ Shape, ...rest });
  }
};

const MapShape = ({
  Shape,
  shapeProps,
  isSelected,
  isWithShadow,
  isCaptureMode,
  canvasWidth,
  canvasHeight,
  onSelect,
  onChange,
  onToForefront,
  onObjectMoved
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected && !isCaptureMode && Shape !== Line) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [Shape, isSelected, isCaptureMode]);

  const handleDragStart = e => {
    onObjectMoved();
    e.target.setAttrs({
      shadowOffset: {
        x: 7,
        y: 7
      },
      scaleX: 1.05,
      scaleY: 1.05
    });
  };
  const handleDragEnd = e => {
    e.target.to({
      duration: 1,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 0,
      shadowOffsetY: 0
    });
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const shadowProps = isWithShadow
    ? { shadowBlur: 10, shadowOpacity: 0.4 }
    : {};

  return (
    <React.Fragment>
      <Shape
        onClick={onSelect}
        ref={shapeRef}
        {...shadowProps}
        {...shapeProps}
        draggable
        onDblClick={onToForefront}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(30, node.width() * scaleX),
            height: Math.max(30, node.height() * scaleY)
          });
        }}
        dragBoundFunc={({ x, y }) => {
          if (shapeProps.radiusX) {
            return {
              x: Math.min(Math.max(20, x), canvasWidth - 20),
              y: Math.min(Math.max(20, y), canvasHeight - 20)
            };
          } else if (shapeProps.width) {
            return {
              x: Math.min(
                Math.max(-shapeProps.width / 2, x),
                canvasWidth - shapeProps.width / 2
              ),
              y: Math.min(
                Math.max(-shapeProps.height / 2, y),
                canvasHeight - shapeProps.height / 2
              )
            };
          } else {
            return { x, y };
          }
        }}
      />
      {isSelected && !isCaptureMode && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const MapLine = ({
  shapeProps,
  isSelected,
  isCaptureMode,
  canvasWidth,
  canvasHeight,
  onSelect,
  onChange,
  onToForefront,
  onObjectMoved
}) => {
  const shapeRef = React.useRef();

  const anchor1Ref = React.createRef();
  const anchor2Ref = React.createRef();

  const updateLine = () => {
    const points = [
      anchor1Ref.current.x(),
      anchor1Ref.current.y(),
      anchor2Ref.current.x(),
      anchor2Ref.current.y()
    ];
    shapeRef.current.points(points);
  };

  const onDragEnd = () => {
    onChange({
      ...shapeProps,
      points: [
        anchor1Ref.current.x(),
        anchor1Ref.current.y(),
        anchor2Ref.current.x(),
        anchor2Ref.current.y()
      ]
    });
  };

  const dragBoundFunc = ({ x, y }) => {
    return {
      x: Math.min(Math.max(3, x), canvasWidth - 3),
      y: Math.min(Math.max(3, y), canvasHeight - 3)
    };
  };

  return (
    <React.Fragment>
      <Line
        ref={shapeRef}
        {...shapeProps}
        onClick={onSelect}
        onDblClick={onToForefront}
      />
      {shapeRef.current && isSelected && !isCaptureMode && (
        <React.Fragment>
          <Ellipse
            ref={anchor1Ref}
            x={shapeRef.current.points()[0]}
            y={shapeRef.current.points()[1]}
            radiusX={7}
            radiusY={7}
            fill="#00a1ff"
            draggable
            dragBoundFunc={dragBoundFunc}
            onDragStart={onObjectMoved}
            onDragMove={updateLine}
            onDragEnd={onDragEnd}
          />
          <Ellipse
            ref={anchor2Ref}
            x={shapeRef.current.points()[2]}
            y={shapeRef.current.points()[3]}
            radiusX={7}
            radiusY={7}
            fill="#00a1ff"
            draggable
            dragBoundFunc={dragBoundFunc}
            onDragStart={onObjectMoved}
            onDragMove={updateLine}
            onDragEnd={onDragEnd}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default MapObject;
