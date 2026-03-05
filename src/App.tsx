import { ProjectCard } from "./components/ProjectCard";
import type { Project } from "../types/project";
import { Routes, Route } from "react-router-dom";
import Article from "./pages/Article";
import { Analytics } from "@vercel/analytics/react";


export default function App() {
    const projects: Project[] = [
        {
            id: 1,
            title: 'Dynamique de particules',
            description: 'Etude du mouvement de particules chargées dans un champ magnétique uniforme, en mécanique classique & quantique.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-orbit"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/></svg>,
            gradient: 'from-cyan-500 to-blue-600',
            tag: { label: 'Olympiade', color: 'bg-blue-500' },
            href: '/particle-dynamics/article',
            isPage: true
        },
        {
            id: 2,
            title: 'Lancer Vertical',
            description: 'Hauteur maximale atteinte lors d\'un lancer vertical, en considérant la gravité et les frottements de l\'air.',
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
            gradient: 'from-yellow-500 to-orange-600',
            tag: { label: 'Newton', color: 'bg-orange-600' },
            href: '/LancerVertical.pdf',
            isPage: false
        },
        {
            id: 3,
            title: 'Oscillateur Harmonique',
            description: 'Résolution de l\'équation différentielle de l\'oscillateur harmonique à l\'aide du lagrangien.',
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>,
            gradient: 'from-green-500 to-teal-600',
            tag: { label: 'Newton', color: 'bg-teal-600' },
            href: '/OscillateurHarmonique.pdf',
            isPage: false
        },
        {
            id: 4,
            title: 'Pendule simple',
            description: 'Etude d\'un pendule simple et dérivation des équations du mouvement.',
            icon: (
                <svg width="65" height="65" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
                <line x1="35" y1="35" x2="60" y2="95" stroke="#fff" strokeWidth="4" />
                <circle cx="61" cy="100" r="10" fill="#fff" strokeWidth="3"/>
                </svg>
            ),
            gradient: 'from-red-400 to-red-700',
            tag: { label: 'Lagrangien', color: 'bg-red-600' },
            href: '/PenduleSimple.pdf',
            isPage: false
        }
    ];

    const getTagColorClass = (id: number): { color: string; hover: string } => {
        const colorMap: Record<number, { color: string; hover: string }> = {
            1: { color: 'text-blue-500', hover: 'hover:text-blue-800' },
            2: { color: 'text-orange-600', hover: 'hover:text-orange-800' },
            3: { color: 'text-teal-600', hover: 'hover:text-teal-900' },
            4: { color: 'text-red-600', hover: 'hover:text-red-800' }
        };
        return colorMap[id] || { text: 'text-gray-600', hover: 'hover:text-gray-800' };
    };

    return (
        <Routes>
            <Route path="/" element={
                <div className="min-h-screen bg-[#e5e7eb]">
                    <main className="px-10 py-16">
                        <h1 className="text-5xl text-center font-semi underline bold mb-10">
                        Projets de physique
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {projects.map((project) => {
                            const colorClass = getTagColorClass(project.id);
                            return (
                                <ProjectCard key={project.id} project={project} colorClass={colorClass} />
                            );
                        })}
                        </div>

                    </main>
                </div>
            } />

            <Route path="/particle-dynamics/article" element={<Article />}/>
            <Analytics />
        </Routes>
    );
};