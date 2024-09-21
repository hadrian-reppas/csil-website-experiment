import left from "../../public/left.svg";
import right from "../../public/right.svg";

interface GridProps {
  grid: boolean[][];
  sideLength: number;
  gap: number;
  onColor: string;
  offColor: string;
  flip: (i: number, j: number) => void,
}

export default function Grid({
  grid,
  sideLength,
  gap,
  onColor,
  offColor,
  flip,
}: GridProps) {
  const [rows, cols] = [grid.length, grid[0]!.length];
  const triangleWidth = (Math.sqrt(3) * sideLength) / 2;
  const verticalGap = (2 * gap) / Math.sqrt(3);

  return (
    <svg
      width={`${cols * triangleWidth + (cols - 1) * gap}px`}
      height={`${((rows + 1) * sideLength) / 2 + (rows - 1) * verticalGap}px`}
    >
      {grid.map((row, i) =>
        row.map((value, j) => {
          const top = (sideLength / 2 + verticalGap) * i;
          const middle = top + sideLength / 2;
          const bottom = top + sideLength;
          const left = (triangleWidth + gap) * j;
          const right = left + triangleWidth;
          if ((i + j) % 2 == 0) {
            return (
              <polygon
                key={`${i}-${j}`}
                points={`${left},${top} ${right},${middle} ${left},${bottom}`}
                fill={value ? onColor : offColor}
                stroke="none"
                onMouseEnter={() => flip(i, j)}
              />
            );
          } else {
            return (
              <polygon
                key={`${i}-${j}`}
                points={`${right},${top} ${left},${middle} ${right},${bottom}`}
                fill={value ? onColor : offColor}
                stroke="none"
                onMouseEnter={() => flip(i, j)}
              />
            );
          }
        }),
      )}
    </svg>
  );
}
