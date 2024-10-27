import { useState, useMemo } from 'react';
import { Plus, Palette, Eye, EyeOff, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ProjectCard } from './components/ProjectCard';
import { ProjectForm } from './components/ProjectForm';
import { projectsApi } from './services/api';
import type { Project } from './types';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery('projects', projectsApi.getAll);

  const createMutation = useMutation(projectsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
      },
    }
  );

  const deleteMutation = useMutation(projectsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects');
    },
  });

  const handleToggleVisibility = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      updateMutation.mutate({
        id,
        data: { isVisible: !project.isVisible },
      });
    }
  };

  const handleSubmit = async (projectData: Partial<Project>) => {
    if (editingProject) {
      await updateMutation.mutateAsync({
        id: editingProject.id,
        data: projectData,
      });
      setEditingProject(null);
    } else {
      await createMutation.mutateAsync(projectData as Omit<Project, 'id' | 'createdAt'>);
    }
    setIsFormOpen(false);
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setEditingProject(project);
      setIsFormOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredProjects = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();
    
    return projects.filter((project) => {
      // First check visibility
      if (!showHidden && !project.isVisible) {
        return false;
      }

      // If no search term, return based on visibility only
      if (!searchTerm) {
        return true;
      }

      // Search in title
      if (project.title.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in description
      if (project.description.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in tags
      if (project.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        return true;
      }

      return false;
    });
  }, [projects, searchQuery, showHidden]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Digital Artist Portfolio</h1>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-80"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHidden(!showHidden)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  showHidden
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                {showHidden ? 'Show All' : 'Show Hidden'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600">No projects found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or visibility filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onToggleVisibility={handleToggleVisibility}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <ProjectForm
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
          initialData={editingProject || undefined}
        />
      )}
    </div>
  );
}

export default App;