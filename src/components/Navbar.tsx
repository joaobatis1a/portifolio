import { useEffect, useState } from "react";
import { Link } from "react-scroll"

function Navbar() {
    const [active, setActive] = useState("hero");
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setScrolled(currentScrollY > 50);

            if ( currentScrollY > lastScrollY && currentScrollY > 100 ) {
                setVisible(false)
            } else {
                setVisible(true)
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
        active === id ? "text-cyan-400" : "text-white";

    return (
         <nav
            className={`
                fixed top-0 w-full z-50 backdrop-blur border-b border-white/10 transition-all duration-300
                ${scrolled ? "py-2 bg-zinc-900/90" : "py-4 bg-zinc-900/60"}
                ${visible ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <div className="flex items-center justify-between px-6 text-white">

                {/* Logo */}
                <div className={`font-bold transition-all duration-300 ${scrolled ? "text-base" : "text-xl"}`}>
                    JoãoDev
                </div>

                {/* Desktop */}
                <ul className="hidden md:flex gap-6 text-sm">
                    <li><Link to="hero" smooth offset={-70} duration={500} className={linkClass("hero")}>Home</Link></li>
                    <li><Link to="about" smooth offset={-70} duration={500} className={linkClass("about")}>About</Link></li>
                    <li><Link to="skills" smooth offset={-70} duration={500} className={linkClass("skills")}>Skills</Link></li>
                    <li><Link to="projects" smooth offset={-70} duration={500} className={linkClass("projects")}>Projects</Link></li>
                    <li><Link to="training" smooth offset={-70} duration={500} className={linkClass("training")}>Training</Link></li>
                    <li><Link to="experience" smooth offset={-70} duration={500} className={linkClass("experience")}>Experience</Link></li>
                    <li><Link to="contact" smooth offset={-70} duration={500} className={linkClass("contact")}>Contact</Link></li>
                </ul>

                {/* Mobile button */}
                <button
                    className="md:hidden text-2xl"
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
    );
    
}

export default Navbar;