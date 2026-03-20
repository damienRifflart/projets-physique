"use client"

import type { Project } from "../../types/project";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  colorClass: { color: string, hover: string };
}

export function ProjectCard({ project, colorClass}: ProjectCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-8 pb-2 flex flex-col flex-grow">
                <h3 className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                    {project.icon}
                </h3>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                    {project.title}
                </h3>
                <p className="text-gray-600 text-justify flex-grow">
                    {project.description}
                </p>
                </div>

                <div className="p-8 pt-0 mt-auto">
                <div className="flex flex-wrap gap-2 mb-5">
                    <div
                        className={`inline-flex items-center ${project.tag.color} text-white border rounded-md px-2 py-1 text-sm ${
                        project.tag.color === 'bg-blue-500' ? 'border-blue-700' :
                        project.tag.color === 'bg-orange-600' ? 'border-orange-800' :
                        project.tag.color === 'bg-teal-600' ? 'border-teal-800' :
                        project.tag.color === 'bg-indigo-600' ? 'border-indigo-800' :
                        project.tag.color === 'bg-pink-600' ? 'border-pink-800' :
                        'border-red-800'
                        }`}
                    >
                        <span>{project.tag.label}</span>
                    </div>
                </div>


                {project.isPage ? (
                    <Link to={project.href}>
                        <p className={`inline-flex items-center ${colorClass.color} font-semibold ${colorClass.hover} transition-colors`}>
                            Découvrir le projet
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </p>
                    </Link>
                ) : (
                    <a
                        href={project.href}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                        className={`inline-flex items-center ${colorClass.color} font-semibold ${colorClass.hover} transition-colors`}
                    >
                        Découvrir le projet
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                )}
            </div>
        </div>
  )
}