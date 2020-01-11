import axios from 'axios';

async function getPathForMatrix({ matrix, start, end }) {
  const response = await axios.post(
    'http://localhost:5000/matrix?alg=astar&metric=euclid',
    {
      matrix,
      start,
      end
    }
  );
  return response.data.paths;
}

export default {
  getPathForMatrix
};
