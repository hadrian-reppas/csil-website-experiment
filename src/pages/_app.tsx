import { type AppType } from "next/app";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>CSIL</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
