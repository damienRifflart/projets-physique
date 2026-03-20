import { useState, useEffect, useRef, useCallback } from "react";
import type { SimParams, Props } from "../../types/visualization";
import { NumberInput } from "../components/particleDynamics/NumberInput";
import { Info, Settings2, ChartArea, Calculator, RefreshCcw, Globe, FileDown, Code2, ArrowBigLeft } from "lucide-react";
import { GlassCard } from "../components/particleDynamics/GlassCard";
import { useLang } from "../hooks/useLang";

const getPlotly = (): any | undefined => (window as any).Plotly;
let plotlyPromise: Promise<void> | null = null;
const getMathJax = (): any | undefined => (window as any).MathJax;
let mathJaxPromise: Promise<void> | null = null;

function computeTrajectory(p: SimParams) {
    const { vx0, vy0, vz0, omega, x0, y0, z0 } = p;
    const w = Math.abs(omega) < 1e-8 ? 1e-8 : omega;
    const xs: number[] = [];
    const ys: number[] = [];
    const zs: number[] = [];
    for (let i = 0; i < 500; i++) {
        const t = i * 0.02;
        xs.push((vx0 / w) * Math.sin(w * t) - (vz0 / w) * (1 - Math.cos(w * t)) + x0);
        ys.push(vy0 * t + y0);
        zs.push((vz0 / w) * Math.sin(w * t) + (vx0 / w) * (1 - Math.cos(w * t)) + z0);
    }
    return { xs, ys, zs };
};
function loadPlotly(): Promise<void> {
    if (plotlyPromise) return plotlyPromise;
    if (getPlotly()) {
        plotlyPromise = Promise.resolve();
        return plotlyPromise;
    }
    plotlyPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdn.plot.ly/plotly-2.35.2.min.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
    });
    return plotlyPromise;
};
const TrajectoryPlot = ({ params, loadingText }: Props & { loadingText: string }) => {    const plotRef = useRef<HTMLDivElement>(null);
    const [plotlyReady, setPlotlyReady] = useState(!!getPlotly());

    useEffect(() => {
        if (plotlyReady) return;
        loadPlotly().then(() => setPlotlyReady(true));
    }, [plotlyReady]);

    const render = useCallback(() => {
        const plotly = getPlotly();
        if (!plotRef.current || !plotly) return;
        const { xs, ys, zs } = computeTrajectory(params);
        const trace = {
        x: xs, y: ys, z: zs,
        mode: "lines",
        line: { width: 6, color: "#cbcfff" },
        type: "scatter3d",
        };
        const layout = {
        scene: {
            xaxis: { title: "X", gridcolor: "#949eff", color: "#949eff" },
            yaxis: { title: "Y", gridcolor: "#949eff", color: "#949eff" },
            zaxis: { title: "Z", gridcolor: "#949eff", color: "#949eff" },
            bgcolor: "rgba(0,0,0,0.4)",
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } },
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: "white" },
        margin: { t: 0, b: 0, l: 0, r: 0 },
        };
        plotly.react(plotRef.current, [trace], layout, { responsive: true });
    }, [params, plotlyReady]);

    useEffect(() => { render(); }, [render]);

    useEffect(() => {
        const handler = () => {
        const plotly = getPlotly();
        if (plotRef.current && plotly) plotly.Plots.resize(plotRef.current);
        };
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, [plotlyReady]);

    return (
        <div ref={plotRef} className="w-full rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)]" style={{ height: 500 }}>
        {!plotlyReady && (
            <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
            {loadingText}
            </div>
        )}
        </div>
    );
};
function loadMathJax(): Promise<void> {
    if (mathJaxPromise) return mathJaxPromise;
    if (getMathJax()) {
        mathJaxPromise = Promise.resolve();
        return mathJaxPromise;
    }
    mathJaxPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
    });
    return mathJaxPromise;
};
const LatexBlock = ({ latex }: { latex: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.innerHTML = latex;

        loadMathJax().then(() => {
        const mj = getMathJax();
        if (mj?.typesetPromise && ref.current) {
            mj.typesetPromise([ref.current]).catch(() => {});
        }
        });
    }, [latex]);

    return <div ref={ref} className="text-white overflow-x-auto" />;
};
const FormulaWithValues = ({ params }: Props) => {
  const { vx0, vy0, vz0, omega, y0 } = params;
  const latex = `\\[
    \\vec{q}(t) = \\begin{pmatrix}
      \\frac{${vx0}}{${omega}} \\sin(${omega}\\,t) - \\frac{${vz0}}{${omega}} (1 - \\cos(${omega}\\,t)) \\\\
      ${vy0}\\,t + ${y0} \\\\
      \\frac{${vz0}}{${omega}} \\sin(${omega}\\,t) + \\frac{${vx0}}{${omega}} (1 - \\cos(${omega}\\,t))
    \\end{pmatrix}
  \\]`;
  return <LatexBlock latex={latex} />;
};
const GENERAL_FORMULA = `\\[
  \\vec{q}(t) = \\begin{pmatrix}
    \\frac{v_{x,0}}{\\omega} \\sin \\omega t - \\frac{v_{z,0}}{\\omega} ( 1 - \\cos \\omega t ) \\\\
    v_{y,0}\\, t + y_0 \\\\
    \\frac{v_{z,0}}{\\omega} \\sin \\omega t + \\frac{v_{x,0}}{\\omega} ( 1 - \\cos \\omega t )
  \\end{pmatrix}
\\]`;

export function ParticleDynamicsArticle() {
    const [params, setParams] = useState<SimParams>({ vx0: 1, vy0: 1, vz0: 1, omega: 2, x0: 0.5, y0: 0.5, z0: 0.5 });
    const { lang, t, toggle } = useLang();
    const set = (key: keyof SimParams) => (v: number) => setParams((prev) => ({ ...prev, [key]: v }));

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-800 to-indigo-700 py-5 px-5 relative">
            <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                <GlassCard className="rounded-3xl pt-12 pb-5 text-center text-white relative">
                    <a
                        href={"https://projets-physique.vercel.app/"}
                        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/20"
                    >
                        <ArrowBigLeft size={20} />
                    </a>

                    <button
                        onClick={toggle}
                        className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/20"
                        aria-label="Switch language"
                    >
                        <Globe size={15} />
                        {lang === "fr" ? "EN" : "FR"}
                    </button>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">{t("title")}</h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                    <p className="text-lg md:text-xl text-white/80 mx-auto mt-5">
                        {t("authors")}
                    </p>
                </GlassCard>

                <GlassCard className="rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><Info />{t("infoTitle")}</h3>
                    <p className="text-justify">{t("infoBody1")}</p>
                    <p className="mt-5 mb-5 text-justify">{t("infoBody2")}</p>
                    <GlassCard className="rounded-xl p-4 flex flex-row gap-3 items-center">
                        <h3 className="text-white font-semibold flex-1">{t("articleVersion")}</h3>
                        <a href="/DynamicsChargedParticleMagneticField.pdf" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-300 hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {t("open")}
                        </a>
                    </GlassCard>
                </GlassCard>

                <GlassCard className="rounded-2xl p-6">
                    <h2 className="text-2xl text-white font-semibold mb-6 flex items-center gap-2">
                        <Settings2 />{t("simParams")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
                        <GlassCard className="rounded-xl p-4">
                        <h3 className="font-semibold mb-3 text-center">{t("initVelocities")}</h3>
                        <div className="space-y-3">
                            <NumberInput id="vx0" label="\( v_{x0} \)" value={params.vx0} onChange={set("vx0")} />
                            <NumberInput id="vy0" label="\( v_{y0} \)" value={params.vy0} onChange={set("vy0")} />
                            <NumberInput id="vz0" label="\( v_{z0} \)" value={params.vz0} onChange={set("vz0")} />
                        </div>
                        </GlassCard>
                        <GlassCard className="rounded-xl p-4">
                        <h3 className="font-semibold mb-3 text-center">{t("cyclotron")}</h3>
                        <NumberInput id="omega" label="\( \omega \)" value={params.omega} onChange={set("omega")} />
                        </GlassCard>
                        <GlassCard className="rounded-xl p-4 sm:col-span-2">
                        <h3 className="font-semibold mb-3 text-center">{t("initPositions")}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <NumberInput id="x0" label="\( x_0 \)" value={params.x0} onChange={set("x0")} />
                            <NumberInput id="y0" label="\( y_0 \)" value={params.y0} onChange={set("y0")} />
                            <NumberInput id="z0" label="\( z_0 \)" value={params.z0} onChange={set("z0")} />
                        </div>
                        </GlassCard>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <GlassCard className="rounded-2xl p-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center text-white gap-2">
                            <ChartArea />{t("viz3d")}
                        </h2>
                        <TrajectoryPlot params={params} loadingText={t("loading")} />
                        </GlassCard>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Calculator />{t("generalFormula")}
                            </h3>
                            <LatexBlock latex={GENERAL_FORMULA} />
                        </div>
                        <div className="rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <RefreshCcw />{t("withInitCond")}
                            </h3>
                            <FormulaWithValues params={params} />
                        </div>
                    </div>
                </div>

                <GlassCard className="rounded-xl p-4 text-white flex flex-col gap-3">
                    <h2 className="text-2xl text-white font-semibold flex items-center gap-2">
                        <Code2 />{t("downloadTitle")}
                    </h2>

                    <p className="text-sm text-white">
                        {t("downloadDesc")}
                    </p>

                    <div className="flex flex-col gap-3">
                        <a href={"https://projets-physique.vercel.app/particle-dynamics/fig1-code.py"} download="fig1-code.py" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-300 hover:scale-102">
                            <FileDown size={17} />
                            {t("downloadFig1")}
                        </a>
                        <a href={"https://projets-physique.vercel.app/particle-dynamics/fig2-code.py"} download="fig2-code.py" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-300 hover:scale-102">
                            <FileDown size={17} />
                            {t("downloadFig2")}
                        </a>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
