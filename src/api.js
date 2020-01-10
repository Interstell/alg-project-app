import axios from 'axios';

async function getPathForMatrix({ matrix, start, end }) {
  const response = await axios.post('http://localhost:5000/matrix', {
    matrix,
    start,
    end
  });
  return response.data.path;
}

export default {
  getPathForMatrix
};
