import Head from "next/head";

import Grid from "~/components/Grid";
import NavBar from "~/components/NavBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>CSIL</title>
      </Head>
      <main className="flex min-h-screen flex-col">
        <Grid />
        <NavBar />
      </main>
    </>
  );
}
