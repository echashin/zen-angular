export function UnFlatKey(arr: number[], width: number): [number, number, number, number][][] {
  return arr.reduce(
    (acc: number[][][], value: number): number[][][] => {
      let y: number = acc.length - 1;
      let x: number = acc[y].length - 1;
      const isPixelEnd: () => boolean = (): boolean => acc[y][x].length === 4;

      if (acc[y].length === width && isPixelEnd()) {
        acc.push([[]]);
        y = acc.length - 1;
        x = acc[y].length - 1;
      }

      if (isPixelEnd()) {
        acc[y].push([]);
        x = acc[y].length - 1;
      }

      acc[y][x].push(value);

      return acc;
    },
    [[[]]],
  ) as [number, number, number, number][][];
}