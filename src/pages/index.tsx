import Head from "next/head";
import { useState } from "react";

import Grid from "~/components/Grid";

const grid = [
  [true, true, false, false, true, true, false, true, true, false],
  [true, false, true, true, false, true, true, false, false, true],
  [false, false, true, true, false, false, false, true, false, true],
  [true, true, true, false, true, true, false, true, true, false],
  [false, false, true, false, true, false, false, true, true, false],
  [true, false, true, true, false, true, true, false, false, true],
  [true, true, false, false, true, true, false, true, true, false],
  [true, true, true, false, true, true, false, true, true, false],
];

export default function Home() {
  const [grid, setGrid] = useState(
    Array.from({ length: 10 }, () => Array.from({ length: 20 }, () => false)),
  );
  const flip = (i: number, j: number) => {
    console.log("updating", i, j);
    setGrid((grid) =>
      grid.map((row, i1) =>
        row.map((value, j1) => (i1 == i && j1 == j ? !value : value)),
      ),
    );
  };

  return (
    <>
      <Head>
        <title>CSIL</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Grid
          grid={grid}
          sideLength={10}
          gap={0}
          onColor="#000000"
          offColor="#ffffff"
          flip={flip}
        />
      </main>
    </>
  );
}
