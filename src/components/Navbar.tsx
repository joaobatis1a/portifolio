import { useEffect, useState } from "react";
import { Link } from "react-scroll"

function Navbar() {
    const [active, setActive] = useState("hero");
    const [visible, setVisible] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {

        setVisible(false);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setVisible(true);
        }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(timeout);
    };
}, []);

    useEffect(() => {
        const sections = document.querySelectorAll("section");


        const observer = new IntersectionObserver( 
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect(); 
    }, []);

    const linkClass = (id: string) =>
    ` relative inline-block cursor-pointer transition-all duration-500

    ${
        active === id
            ? ` text-cyan-300 after:w-full `
            : ` text-white hover:text-cyan-300 after:w-0 hover:after:w-full `
    }

    after:absolute after:left-0 after:-bottom-1 after:h-[2px]

    after:bg-gradient-to-r after:from-emerald-400 after:via-green-400 after:to-cyan-400

    after:transition-all after:duration-500 `;


    return (
         <div
    className={`
        fixed top-4 left-0 w-full z-50 flex justify-center
        transition-all duration-500
        ${visible ? "translate-y-0" : "-translate-y-24"}
    `}
>
    <nav
        className={`
            w-[95%]
            max-w-6xl

            py-4

            rounded-full
            border
            border-white/10

            backdrop-blur-md
            bg-zinc-900/70

            shadow-lg
            shadow-cyan-500/10

            transition-all
            duration-500
        `}
    >
            <div className="flex items-center justify-between px-20 text-white">

                
                <div className={`font-bold transition-all duration-300 text-xl md:text-2xl bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent`}>
                    JOÃO BATISTA
                </div>

                
                <ul className="hidden md:flex gap-6 text-sm ">
                    <li><Link to="hero" smooth offset={-70} duration={500} 
                    className={linkClass("hero")}
                    >Início</Link></li>
                    <li><Link to="about" smooth offset={-70} duration={500} 
                    className={linkClass("about")}
                    >Sobre</Link></li>
                    <li><Link to="skills" smooth offset={-70} duration={500} 
                    className={linkClass("skills")}
                    >Habilidades</Link></li>
                    <li><Link to="projects" smooth offset={-70} duration={500} 
                    className={linkClass("projects")}
                    >Projetos</Link></li>
                    <li><Link to="training" smooth offset={-70} duration={500} 
                    className={linkClass("training")}
                    >Formação</Link></li>
                    <li><Link to="experience" smooth offset={-70} duration={500} 
                    className={linkClass("experience")}
                    >Experiência</Link></li>
                    <li><Link to="contact" smooth offset={-70} duration={500} 
                    className={linkClass("contact")}
                    >Contato</Link></li>
                </ul>

                {/* Mobile button */}
                <button
                    className="md:hidden text-xl"
                    onClick={() => setOpen(!open)}
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-6 pb-4 space-y-4 text-sm bg-zinc-900/90">
                    <Link onClick={() => setOpen(false)} to="hero" smooth offset={-70}>Home</Link>
                    <Link onClick={() => setOpen(false)} to="about" smooth offset={-70}>About</Link>
                    <Link onClick={() => setOpen(false)} to="skills" smooth offset={-70}>Skills</Link>
                    <Link onClick={() => setOpen(false)} to="projects" smooth offset={-70}>Projects</Link>
                    <Link onClick={() => setOpen(false)} to="training" smooth offset={-70}>Training</Link>
                    <Link onClick={() => setOpen(false)} to="Experience" smooth offset={-70}>Experience</Link>
                    <Link onClick={() => setOpen(false)} to="contact" smooth offset={-70}>Contact</Link>
                </div>
            )}
        </nav>
    </div>
    );
    
}

export default Navbar;