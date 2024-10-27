import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onToggleVisibility: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onToggleVisibility, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl ${
      !project.isVisible ? 'ring-2 ring-gray-200' : ''
    }`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            !project.isVisible ? 'opacity-50' : ''
          }`}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={() => onToggleVisibility(project.id)}
              className="rounded-full bg-white/90 p-2 text-gray-800 transition-colors hover:bg-white"
              title={project.isVisible ? 'Hide project' : 'Show project'}
            >
              {project.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              onClick={() => onEdit(project.id)}
              className="rounded-full bg-white/90 p-2 text-gray-800 transition-colors hover:bg-white"
              title="Edit project"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="rounded-full bg-white/90 p-2 text-red-600 transition-colors hover:bg-white"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
          {!project.isVisible && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              Hidden
            </span>
          )}
        </div>
        <p className="mt-2 text-gray-600">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.clientUrl && (
          <a
            href={project.clientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Visit Project <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}