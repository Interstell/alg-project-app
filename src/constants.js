import blockTexture from './assets/textures/block.jpg';
import swampTexture from './assets/textures/swamp.jpg';
import seaTexture from './assets/textures/sea.jpg';
import portalATexture from './assets/textures/portalA.png';
import portalBTexture from './assets/textures/portalB.png';

export const ObjectTypes = {
  Start: 'Start',
  Finish: 'Finish',
  Block: 'Block',
  Sea: 'Sea',
  Swamp: 'Swamp',
  Portal: 'Portal',
  PortalA: 'PortalA',
  PortalB: 'PortalB',
  Path: 'Path'
};

export const ObjectColors = {
  [ObjectTypes.Start]: {
    r: 76,
    g: 175,
    b: 80,
    hex: '#4caf50'
  },
  [ObjectTypes.Finish]: {
    r: 244,
    g: 67,
    b: 54,
    hex: '#f44336'
  },
  [ObjectTypes.Block]: {
    r: 1,
    g: 1,
    b: 1,
    hex: '#010101'
  },
  [ObjectTypes.Sea]: {
    r: 3,
    g: 169,
    b: 244,
    hex: '#03a9f4'
  },
  [ObjectTypes.Swamp]: {
    r: 139,
    g: 195,
    b: 74,
    hex: '#8bc34a'
  },
  [ObjectTypes.PortalA]: {
    r: 255,
    g: 154,
    b: 0,
    hex: '#ff9a00'
  },
  [ObjectTypes.PortalB]: {
    r: 39,
    g: 167,
    b: 216,
    hex: '#27a7d8'
  }
};

export const ObjectCodes = {
  [ObjectTypes.Start]: 1,
  [ObjectTypes.Finish]: 1,
  [ObjectTypes.Path]: 1,
  [ObjectTypes.Block]: -1,
  [ObjectTypes.Swamp]: 2,
  [ObjectTypes.Sea]: 4,
  [ObjectTypes.PortalA]: 1,
  [ObjectTypes.PortalB]: 1
};

export const ObjectTextures = {
  [ObjectTypes.Block]: blockTexture,
  [ObjectTypes.Swamp]: swampTexture,
  [ObjectTypes.Sea]: seaTexture,
  [ObjectTypes.PortalA]: portalATexture,
  [ObjectTypes.PortalB]: portalBTexture
};

export const Algorithms = {
  AStar: 'astar',
  BestFirst: 'bf',
  Dijkstra: 'dijkstra'
};

export const AlgorithmColors = {
  [Algorithms.AStar]: {
    buttonClass: 'is-success',
    hex: '#48c774'
  },
  [Algorithms.Dijkstra]: {
    buttonClass: 'is-warning',
    hex: '#ffdd57'
  },
  [Algorithms.BestFirst]: {
    buttonClass: 'is-danger',
    hex: '#ff3860'
  }
};

export const Metrics = {
  Euclidean: 'euclid',
  Manhattan: 'manhattan'
};
