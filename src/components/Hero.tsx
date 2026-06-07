import { TypeAnimation } from "react-type-animation";

function Hero() {
    return (
        <section id="hero">
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <p className=" font-body relative rounded-full px-2 md:px-5 py-2 md:pt-3 text-sm/1 md:text-sm/7 text-green-300 ring-1 ring-cyan-500">
                    SEJA BEM-VINDO(A)!
                </p>
                <h1 className=" text-2xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
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

                <div className="h-[4px] w-24 md:w-220 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400"/>


            </div>
        </section>
    );
}

export default Hero;

