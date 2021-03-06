import React from 'react';
import { Line } from 'react-konva';
import _ from 'lodash';
import classNames from 'classnames';
import {
  ObjectTypes,
  AlgorithmColors,
  Algorithms,
  Metrics
} from '../../../constants';
import API from '../../../api';

const BuildPathBlock = ({
  algorithm,
  shapes,
  canvasSize,
  onShapesChanged,
  onCaptureModeChanged,
  onBuildCodeMatrix
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [chosenMetric, setChosenMetric] = React.useState(Metrics.Euclidean);
  const [pathLength, setPathLength] = React.useState(null);
  const [executionTime, setExecutionTime] = React.useState(null);

  const removePath = async () => {
    const newShapes = shapes.filter(s => s.algorithm !== algorithm);
    await onShapesChanged(newShapes);
    return newShapes;
  };

  const drawBuiltPath = (path, { scaleFactor = 1 } = {}) => {
    const segments = path.map(segment => ({
      shape: Line,
      type: ObjectTypes.Path,
      algorithm,
      attributes: {
        points: _.flatten(segment).map(x => Math.round(x / scaleFactor)),
        stroke: AlgorithmColors[algorithm].hex,
        strokeWidth: 3,
        id: 'path' + _.random(10000)
      }
    }));

    onShapesChanged([...shapes, ...segments]);
  };

  const onBuildPathButtonClicked = async () => {
    await onCaptureModeChanged(true);
    setIsLoading(true);
    shapes = await removePath();
    const scaleFactor = algorithm === Algorithms.Dijkstra ? 0.5 : 1;
    const codeMatrix = await onBuildCodeMatrix({ scaleFactor });
    onCaptureModeChanged(false);
    const portalsA = shapes.filter(s => s.type === ObjectTypes.PortalA);
    portalsA.forEach(portalA => {
      const portalB = shapes.find(s => s.attributes.id === portalA.targetId);
      if (!portalB) {
        return;
      }
      const portalBCoords = {
        x: Math.round(
          Math.min(
            Math.max(portalB.attributes.x + portalB.attributes.width / 2, 0),
            canvasSize - 1
          ) * scaleFactor
        ),
        y: Math.round(
          Math.min(
            Math.max(portalB.attributes.y + portalB.attributes.height / 2, 0),
            canvasSize - 1
          ) * scaleFactor
        )
      };

      for (
        let y = Math.round(Math.max(portalA.attributes.y, 0) * scaleFactor);
        y <
        Math.min(portalA.attributes.y + portalA.attributes.height, canvasSize) *
          scaleFactor;
        y++
      ) {
        for (
          let x = Math.round(Math.max(portalA.attributes.x, 0) * scaleFactor);
          x <
          Math.min(
            portalA.attributes.x + portalA.attributes.width,
            canvasSize
          ) *
            scaleFactor;
          x++
        ) {
          codeMatrix[y][x] = [portalBCoords.y, portalBCoords.x];
        }
      }
    });

    const startShape = shapes.find(s => s.type === ObjectTypes.Start);
    const finishShape = shapes.find(s => s.type === ObjectTypes.Finish);
    const { path, length, time } = await API.getPathForMatrix({
      matrix: codeMatrix,
      start: [
        Math.round(startShape.attributes.y * scaleFactor),
        Math.round(startShape.attributes.x * scaleFactor)
      ],
      end: [
        Math.round(finishShape.attributes.y * scaleFactor),
        Math.round(finishShape.attributes.x * scaleFactor)
      ],
      algorithm,
      metric: chosenMetric
    });

    drawBuiltPath(path, { scaleFactor });
    setExecutionTime(time);
    setPathLength(length);
    setIsLoading(false);
  };

  const length =
    algorithm === Algorithms.Dijkstra ? pathLength * 2 : pathLength;

  return (
    <React.Fragment>
      <div className="path-characteristics">
        <div className="metric-control-block">
          <p>Metric: </p>
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                value={Metrics.Euclidean}
                checked={chosenMetric === Metrics.Euclidean}
                onChange={() => setChosenMetric(Metrics.Euclidean)}
              />
              Euclidean
            </label>
            <label className="radio">
              <input
                type="radio"
                value={Metrics.Manhattan}
                checked={chosenMetric === Metrics.Manhattan}
                onChange={() => setChosenMetric(Metrics.Manhattan)}
              />
              Manhattan
            </label>
          </div>
        </div>
        <p>Path length: {(pathLength && length.toFixed(2) + ' px') || ''}</p>
        <p>
          Execution time:{' '}
          {(executionTime && (executionTime / 1000).toFixed(2) + ' sec') || ''}
        </p>
      </div>
      <button
        className={classNames(
          'button is-fullwidth',
          AlgorithmColors[algorithm].buttonClass,
          { 'is-loading': isLoading }
        )}
        onClick={onBuildPathButtonClicked}
      >
        Build path
      </button>
    </React.Fragment>
  );
};

export default BuildPathBlock;
