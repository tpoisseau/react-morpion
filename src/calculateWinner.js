import {range, pipe, zip} from './itools';
const {map, reduce} = pipe;

export default function calculateMorpionWinner(matrix, x, y, winLength) {
  const player = matrix.get(x, y);

  const check = length => length >= winLength;
  const lineLengthReducer = (length, p) => p === player ? length + 1 : (check(length) ? length : 0);
  
  // compute paths
  // horizontal XXX
  const horizontal = pipe(
    range({start: x-winLength, stop: x+winLength}),
    map(x => matrix.get(x, y)),
    reduce(lineLengthReducer),
    check
  );
  if (horizontal) return player;

  // vertical
  // X
  // X
  // X
  const vertical = pipe(
    range({start: y-winLength, stop: y+winLength}),
    map(y => matrix.get(x, y)),
    reduce(lineLengthReducer),
    check
  );
  if (vertical) return player;

  // diagonal up left
  // X
  //  X
  //   X
  const diagonalUL = pipe(
    zip(
      range({start: x-winLength, stop: x+winLength}),
      range({start: y-winLength, stop: y+winLength}),
    ),
    map(([x, y]) => matrix.get(x, y)),
    reduce(lineLengthReducer),
    check
  );
  if (diagonalUL) return player;


  // diagonal down left
  //   X
  //  X
  // X
  const diagonalDL = pipe(
    zip(
      range({start: x-winLength, stop: x+winLength}),
      range({start: y+winLength, stop: y-winLength, step: -1}),
    ),
    map(([x, y]) => matrix.get(x, y)),
    reduce(lineLengthReducer),
    check
  );
  if (diagonalDL) return player;

  return null;
}