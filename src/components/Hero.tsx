import { TypeAnimation } from "react-type-animation";

function Hero() {
    return (
        <section id="hero">
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="relative rounded-full px-1 md:px-5 py-1 text-sm/4 md:text-sm/7 text-green-300 ring-1 ring-cyan-500">
                    SEJA BEM-VINDO(A)!
                </p>
                <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <TypeAnimation
                        sequence={[
                            "JOÃO BATISTA DA SILVA NETO",
                            2000,
                            "",
                            500,
                            "DESENVOLVEDOR FRONT-END",
                            2000,
                        ]}
                        repeat={Infinity}
                    />
                </h1>


            </div>
        </section>
    );
}

export default Hero;

