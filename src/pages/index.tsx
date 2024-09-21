import Head from "next/head";

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
  return (
    <>
      <Head>
        <title>CSIL</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Grid grid={grid} sideLength={10} gap={0} color={"#000000"} />
      </main>
    </>
  );
}
