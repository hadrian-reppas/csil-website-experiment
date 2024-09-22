import Head from "next/head";

import Grid from "~/components/Grid";

export default function Home() {
  return (
    <>
      <Head>
        <title>CSIL</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <Grid />
      </main>
    </>
  );
}
