import { defineMock } from 'vite-plugin-mock-dev-server';
import { Repository } from '../src/api/types/repository';

const mockRepositories: Repository[] = [
    {
        id: "1",
        name: "flowify-ui",
        description: "Frontend for Flowify workflow engine",
        url: "https://github.com/cursor/flowify-ui",
        visibility: "private",
        language: "TypeScript",
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-03-15T14:30:00Z"
    },
    {
        id: "2",
        name: "flowify-backend",
        description: "Backend services for Flowify",
        url: "https://github.com/cursor/flowify-backend",
        visibility: "private",
        language: "Go",
        createdAt: "2024-02-15T09:00:00Z",
        updatedAt: "2024-03-14T11:20:00Z"
    },
    {
        id: "3",
        name: "workflow-engine",
        description: "Core workflow execution engine",
        url: "https://github.com/cursor/workflow-engine",
        visibility: "public",
        language: "Rust",
        createdAt: "2024-01-20T15:45:00Z",
        updatedAt: "2024-03-10T08:15:00Z"
    }
];

export default defineMock([
    {
        url: '/api/repositories',
        method: 'GET',
        body: {
            repositories: mockRepositories,
            total: mockRepositories.length,
        },
    },
    {
        url: '/api/repositories/:id',
        method: 'GET',
        body: (req) => {
            const id = req.params.id;
            const repo = mockRepositories.find(r => r.id === id);
            
            if (!repo) {
                return new Response(JSON.stringify({
                    message: "Repository not found"
                }), {
                    status: 404
                });
            }
            return repo;
        },
    },
    {
        url: '/api/repositories',
        method: 'POST',
        body: (req) => {
            const data = req.body;
            const newRepo: Repository = {
                id: (mockRepositories.length + 1).toString(),
                name: data.name,
                description: data.description || "",
                url: `https://github.com/cursor/${data.name}`,
                visibility: data.visibility || "private",
                language: "TypeScript", // Default for mock
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            mockRepositories.push(newRepo);
            return newRepo;
        },
        status: 201,
    },
    {
        url: '/api/repositories/:id',
        method: 'DELETE',
        body: (req) => {
            const id = req.params.id;
            const index = mockRepositories.findIndex(r => r.id === id);
            
            if (index !== -1) {
                mockRepositories.splice(index, 1);
            }
            
            return {
                message: "Repository deleted successfully"
            };
        },
    }
]);
