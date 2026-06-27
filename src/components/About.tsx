function About() {
    return (
        <section
            id="about"
            className="relative min-h-screen flex items-center justify-center px-6 py-24"
        >
            {/* subtle nebula glow behind content */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
            </div>

            <div
                className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
            >
                {/* ── Foto ── */}
                <div className="flex justify-center md:justify-end">
                    <div className="relative group">
                        {/* borda animada */}
                        <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-green-400 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src="/foto_perfil.jpg"
                            alt="João Batista"
                            className="relative w-64 h-80 md:w-72 md:h-96 object-cover object-top rounded-2xl"
                        />
                    </div>
                </div>

                {/* ── Texto ── */}
                <div className="flex flex-col gap-6">
                    {/* eyebrow */}
                    <span className="text-xs tracking-[0.3em] text-cyan-400 uppercase font-semibold">
                        Sobre mim
                    </span>

                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                        Olá, eu sou o{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                            João Batista
                        </span>
                    </h2>

                    <p className="text-zinc-300 text-base leading-relaxed">
                        Tenho 19 anos, sou de{" "}
                        <span className="text-cyan-300 font-medium">Paulista — PE</span>,
                        e estou cursando{" "}
                        <span className="text-cyan-300 font-medium">
                            Análise e Desenvolvimento de Sistemas
                        </span>
                        . Minha paixão é construir interfaces que unem estética e
                        funcionalidade — acredito que um bom front-end não é só bonito,
                        é intuitivo e acessível.
                    </p>

                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Estou no início da carreira e aprendendo todos os dias, mas já
                        tenho foco bem definido: criar experiências web modernas com
                        React, TypeScript e uma atenção cuidadosa a cada detalhe visual.
                    </p>

                    {/* Pills de info */}
                    <div className="flex flex-wrap gap-3 mt-2">
                        {[
                            { icon: "📍", label: "Paulista, PE" },
                            { icon: "🎓", label: "ADS — em andamento" },
                            { icon: "💻", label: "Foco em Front-End" },
                            { icon: "🚀", label: "Disponível para oportunidades" },
                        ].map(({ icon, label }) => (
                            <span
                                key={label}
                                className="flex items-center gap-2 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm"
                            >
                                {icon} {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
