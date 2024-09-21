import left from "../../public/left.svg";
import right from "../../public/right.svg";

interface GridProps {
  grid: boolean[][];
  sideLength: number;
  gap: number;
  color: string;
}

interface ArrowProps {
  color: string;
}

function Left({ color }: ArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 86.603 100"
    >
      <path fill={color} d="M86.603 0 0 50l86.603 50z" />
    </svg>
  );
}

function Right({ color }: ArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 86.603 100"
    >
      <path fill={color} d="m0 0 86.603 50L0 100z" />
    </svg>
  );
}

export default function Grid({ grid, sideLength, gap, color }: GridProps) {
  const [rows, cols] = [grid.length, grid[0]!.length];
  const triangleWidth = (Math.sqrt(3) * sideLength) / 2;
  const verticalGap = (2 * gap) / Math.sqrt(3);

  return (
    <div
      style={{
        width: `${cols * triangleWidth + (cols - 1) * gap}px`,
        height: `${((rows + 1) * sideLength) / 2 + (rows - 1) * verticalGap}px`,
      }}
      className="relative"
    >
      {grid.map((row, i) =>
        row.map((value, j) => (
          <div
            style={{
              marginTop: `${(sideLength / 2 + verticalGap) * i}px`,
              marginLeft: `${(triangleWidth + gap) * j}px`,
              width: `${triangleWidth}px`,
              height: `${sideLength}`,
              color: value ? color : "#ffffff",
            }}
            className="absolute"
          >
            {(i + j) % 2 == 0 ? (
              <Right color={value ? "#ff0000" : "#ffffff"} />
            ) : (
              <Left color={value ? "#ff0000" : "#ffffff"} />
            )}
          </div>
        )),
      )}
    </div>
  );
}
