import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Training from "./components/Training";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

function App() {
    return(
        <main className="bg-slate-950 tet-white">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Training />
            <Experience />
            <Contact />
        </main>
    );
}

export default App;