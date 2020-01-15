import axios from 'axios';

import { Algorithms, Metrics } from './constants';

async function getPathForMatrix({
  matrix,
  start,
  end,
  algorithm = Algorithms.AStar,
  metric = Metrics.Euclidean
}) {
  const response = await axios.post(
    `http://localhost:5000/matrix?alg=${algorithm}&metric=${metric}`,
    {
      matrix,
      start,
      end
    }
  );
  return {
    path: response.data.paths,
    length: response.data.length,
    time: response.data.time
  };
}

export default {
  getPathForMatrix
};
