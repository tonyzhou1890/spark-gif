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

/**
 * check if val is empty
 * @param val
 * @returns
 */
export function isEmpty<T>(val: T): boolean {
  return val === '' || val === null || val === undefined;
}

export function download(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url);
  // URL.revokeObjectURL(url);
}
