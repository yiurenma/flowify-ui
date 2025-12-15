import {
    RepositoryCreateRequest,
    RepositoryResponse,
    RepositoryUpdateRequest,
    WorkflowResponse,
} from '../src/api/types';
import { defineMock } from 'vite-plugin-mock-dev-server';
import { Plugin } from '../src/utils/constant';
import { Node, Edge } from '@xyflow/react';

/**
 * Creates a default start node for new workflows
 * @returns A Node object representing the start point of a workflow
 */
const createDefaultStartNode = (): Node => ({
    id: "start-node",
    type: Plugin.START,
    position: { x: 250, y: 100 },
    data: {
        label: "Start",
    }
});

// Sample nodes and edges for mock workflows
const mockNodes: Record<string, Node[]> = {
    "1": [
        createDefaultStartNode(),
        {
            id: "function-1",
            type: Plugin.FUNCTION,
            position: { x: 450, y: 100 },
            data: {
                label: "Send SMS",
                functionType: "sms",
                name: "Customer Notification",
                description: "Send SMS notification to customer"
            }
        }
    ],
    "2": [
        createDefaultStartNode(),
        {
            id: "function-2",
            type: Plugin.FUNCTION,
            position: { x: 450, y: 100 },
            data: {
                label: "Send Email",
                functionType: "email",
                name: "Marketing Email",
                description: "Send marketing email to customer"
            }
        }
    ],
    "3": [
        createDefaultStartNode(),
        {
            id: "function-3",
            type: Plugin.FUNCTION,
            position: { x: 450, y: 100 },
            data: {
                label: "Sync Data",
                functionType: "data",
                name: "Data Synchronization",
                description: "Synchronize data between systems"
            }
        }
    ]
};

const mockEdges: Record<string, Edge[]> = {
    "1": [
        {
            id: "edge-1",
            source: "start-node",
            target: "function-1",
            sourceHandle: "source-handle",
            targetHandle: "target-handle"
        }
    ],
    "2": [
        {
            id: "edge-2",
            source: "start-node",
            target: "function-2",
            sourceHandle: "source-handle",
            targetHandle: "target-handle"
        }
    ],
    "3": [
        {
            id: "edge-3",
            source: "start-node",
            target: "function-3",
            sourceHandle: "source-handle",
            targetHandle: "target-handle"
        }
    ]
};

// Mock workflow data with proper typing
const mockWorkflows: WorkflowResponse[] = [
    {
        id: "1",
        name: "Customer Notification SMS",
        description: "Send important account and transaction notifications to customers",
        createdAt: "2024-03-15T08:00:00Z",
        updatedAt: "2024-03-15T10:30:00Z",
        nodes: mockNodes["1"],
        edges: mockEdges["1"],
        status: "published"
    },
    {
        id: "2",
        name: "Marketing Campaign Email",
        description: "Send latest product offers and marketing campaign information",
        createdAt: "2024-03-14T15:00:00Z",
        updatedAt: "2024-03-14T16:45:00Z",
        nodes: mockNodes["2"],
        edges: mockEdges["2"],
        status: "published"
    },
    {
        id: "3",
        name: "Data Sync Process",
        description: "Synchronize customer data and transaction records between different systems",
        createdAt: "2024-03-13T09:00:00Z",
        updatedAt: "2024-03-13T14:20:00Z",
        nodes: mockNodes["3"],
        edges: mockEdges["3"],
        status: "published"
    },
];

// Mock repository data (for management UI)
const mockRepositories: RepositoryResponse[] = [
    {
        id: 'repo-1',
        name: 'flowify-api',
        description: 'Backend services for Flowify',
        visibility: 'public',
        defaultBranch: 'main',
        archived: false,
        createdAt: '2024-03-01T08:00:00Z',
        updatedAt: '2024-03-15T10:30:00Z',
    },
    {
        id: 'repo-2',
        name: 'flowify-ui',
        description: 'Management UI for Flowify',
        visibility: 'public',
        defaultBranch: 'main',
        archived: false,
        createdAt: '2024-03-05T09:00:00Z',
        updatedAt: '2024-03-14T16:45:00Z',
    },
    {
        id: 'repo-3',
        name: 'infra',
        description: 'Infrastructure and deployment configs',
        visibility: 'private',
        defaultBranch: 'main',
        archived: false,
        createdAt: '2024-03-10T12:00:00Z',
        updatedAt: '2024-03-13T14:20:00Z',
    },
];

export default defineMock([
    {
        url: '/api/workflows',
        method: 'GET',
        body: {
            workflows: mockWorkflows,
            total: mockWorkflows.length,
        },
    },
    {
        url: '/api/workflows/:id',
        method: 'GET',
        body: (req) => {
            const id = req.params.id;
            const workflow = mockWorkflows.find(w => w.id === id);

            if (!workflow) {
                return new Response(JSON.stringify({
                    message: "Workflow not found"
                }), {
                    status: 404
                });
            }

            return workflow;
        },
    },
    {
        url: '/api/workflows',
        method: 'POST',
        body: (req) => {
            const workflow = req.body as WorkflowResponse;
            workflow.id = (mockWorkflows.length + 1).toString();
            workflow.createdAt = new Date().toISOString();
            workflow.updatedAt = new Date().toISOString();

            // Ensure new workflow has at least a start node
            if (!workflow.nodes || workflow.nodes.length === 0) {
                workflow.nodes = [createDefaultStartNode()];
                workflow.edges = [];
            }

            mockWorkflows.push(workflow);
            return workflow;
        },
        status: 201,
    },
    {
        url: '/api/workflows/:id',
        method: 'PATCH',
        body: (req) => {
            const id = req.params.id;
            const updatedWorkflow = req.body as WorkflowResponse;
            const index = mockWorkflows.findIndex(w => w.id === id);

            if (index === -1) {
                return new Response(JSON.stringify({
                    message: "Workflow not found"
                }), {
                    status: 404
                });
            }

            // Update only the fields that are provided
            const workflow = mockWorkflows[index];
            workflow.name = updatedWorkflow.name || workflow.name;
            workflow.description = updatedWorkflow.description || workflow.description;
            workflow.nodes = updatedWorkflow.nodes || workflow.nodes;
            workflow.edges = updatedWorkflow.edges || workflow.edges;
            workflow.updatedAt = new Date().toISOString();

            return workflow;
        },
        status: 200,
    },
    {
        url: '/api/workflows/:id',
        method: 'DELETE',
        body: (req) => {
            const id = req.params.id;
            const index = mockWorkflows.findIndex(w => w.id === id);
            mockWorkflows.splice(index, 1);
            return {
                message: "Workflow deleted successfully"
            };
        },
        status: 200,
    },
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
                return new Response(JSON.stringify({ message: 'Repository not found' }), {
                    status: 404,
                });
            }

            return repo;
        },
    },
    {
        url: '/api/repositories',
        method: 'POST',
        body: (req) => {
            const repo = req.body as RepositoryCreateRequest;
            const created: RepositoryResponse = {
                id: `repo-${mockRepositories.length + 1}`,
                name: repo.name,
                description: repo.description,
                visibility: repo.visibility,
                defaultBranch: 'main',
                archived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            mockRepositories.unshift(created);
            return created;
        },
        status: 201,
    },
    {
        url: '/api/repositories/:id',
        method: 'PATCH',
        body: (req) => {
            const id = req.params.id;
            const patch = req.body as RepositoryUpdateRequest;
            const index = mockRepositories.findIndex(r => r.id === id);

            if (index === -1) {
                return new Response(JSON.stringify({ message: 'Repository not found' }), {
                    status: 404,
                });
            }

            const repo = mockRepositories[index];
            mockRepositories[index] = {
                ...repo,
                ...patch,
                updatedAt: new Date().toISOString(),
            };

            return mockRepositories[index];
        },
        status: 200,
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
            return { message: 'Repository deleted successfully' };
        },
        status: 200,
    },
]);

