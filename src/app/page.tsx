import Content from "../components/Content";
import CsilTriangles from "../components/CsilTriangles";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <CsilTriangles />
      <NavBar />
      <Hero />
      <Content />
      <Footer />
    </main>
  );
}
