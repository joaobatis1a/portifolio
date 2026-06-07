import { useEffect, useState } from "react";
import { link } from "react-scroll"

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

        window.addEventListener("srcoll", handleScroll);
        return () => window.removeEventListener("srcoll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const sections = document.querySelectorAll("section");

        const observer = new InserctionObserver


    }
    
}

export default Navbar;