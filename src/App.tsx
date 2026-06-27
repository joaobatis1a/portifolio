import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Training from "./components/Training";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import StarBackground from "./components/StarBackground";

function App() {
    return (
        <main className="bg-black text-white overflow-hidden">
            {/* Estrelas visíveis a partir do About */}
            <StarBackground />

            {/* Hero fica acima das estrelas com bg sólido */}
            <div className="relative z-10">
                <Navbar />
                <div className="bg-black">
                    <Hero />
                </div>
                <About />
                <Skills />
                <Projects />
                <Training />
                <Experience />
                <Contact />
            </div>
        </main>
    );
}

export default App;
