export const ObjectTypes = {
  Start: 'Start',
  Finish: 'Finish',
  Block: 'Block',
  Sea: 'Sea',
  Swamp: 'Swamp',
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
  }
};

export const ObjectCodes = {
  [ObjectTypes.Start]: 1,
  [ObjectTypes.Finish]: 1,
  [ObjectTypes.Path]: 1,
  [ObjectTypes.Block]: -1,
  [ObjectTypes.Swamp]: 2,
  [ObjectTypes.Sea]: 4
};

export const CANVAS_WIDTH = 750;
export const CANVAS_HEIGHT = 750;
