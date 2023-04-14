/**
 * shuffle
 * @param list
 * @returns
 */
export function shuffle<T>(list: Array<T>): Array<T> {
  const restIndices = new Array(list.length).fill(1).map((_, index) => index);
  const res: Array<T> = [];

  list.forEach((_, index) => {
    const idx = (Math.random() * restIndices.length) >> 0;
    res[index] = list[restIndices[idx]];
    restIndices.splice(idx, 1);
  });

  return res;
}
