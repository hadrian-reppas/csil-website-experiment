import Content from "~/components/Content";
import Grid from "~/components/Grid";
import NavBar from "~/components/NavBar";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Grid />
      <NavBar />
      <Content />
    </main>
  );
}
