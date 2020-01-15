import React from 'react';
import classNames from 'classnames';

import { AlgorithmColors, Algorithms } from '../../../constants';

const AlgorithmTabs = ({ algorithm, onAlgorithmChanged }) => {
  const activeStyle = {
    backgroundColor: AlgorithmColors[algorithm].hex,
    borderColor: AlgorithmColors[algorithm].hex
  };

  return (
    <div className="tabs is-toggle is-fullwidth">
      <ul>
        <li
          className={classNames({
            'is-active': algorithm === Algorithms.AStar
          })}
        >
          <a
            href="/"
            style={algorithm === Algorithms.AStar ? activeStyle : {}}
            onClick={e => {
              e.preventDefault();
              onAlgorithmChanged(Algorithms.AStar);
            }}
          >
            <span>A*</span>
          </a>
        </li>
        <li
          className={classNames({
            'is-active': algorithm === Algorithms.Dijkstra
          })}
        >
          <a
            href="/"
            style={
              algorithm === Algorithms.Dijkstra
                ? Object.assign({}, activeStyle, { color: 'rgb(74, 74, 74)' })
                : {}
            }
            onClick={e => {
              e.preventDefault();
              onAlgorithmChanged(Algorithms.Dijkstra);
            }}
          >
            <span>Dijkstra</span>
          </a>
        </li>
        <li
          className={classNames({
            'is-active': algorithm === Algorithms.BestFirst
          })}
        >
          <a
            href="/"
            style={algorithm === Algorithms.BestFirst ? activeStyle : {}}
            onClick={e => {
              e.preventDefault();
              onAlgorithmChanged(Algorithms.BestFirst);
            }}
          >
            <span>BestFirst</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AlgorithmTabs;
