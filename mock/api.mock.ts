import { WorkflowResponse } from '../src/api/types';
import { defineMock } from 'vite-plugin-mock-dev-server';
import { Node, Edge } from '@xyflow/react';
import type { User, UserRequest, DashboardStats, SystemSettings, ActivityLog } from '../src/api/types/admin';

// Plugin enum values (avoid importing React components)
enum Plugin {
  START = "Start",
  CONSUMER = "Consumer",
  MESSAGE = "Message",
  IF_ELSE = "If-Else",
  FUNCTION = "Function_V2",
}

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

// Mock admin data
const mockUsers: User[] = [
    {
        id: "1",
        username: "admin",
        email: "admin@flowify.com",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-03-15T10:00:00Z",
        lastLoginAt: "2024-03-15T08:30:00Z",
    },
    {
        id: "2",
        username: "john.doe",
        email: "john.doe@flowify.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-03-14T15:00:00Z",
        lastLoginAt: "2024-03-14T14:20:00Z",
    },
    {
        id: "3",
        username: "jane.smith",
        email: "jane.smith@flowify.com",
        role: "user",
        status: "active",
        createdAt: "2024-02-01T00:00:00Z",
        updatedAt: "2024-03-13T09:00:00Z",
        lastLoginAt: "2024-03-13T08:45:00Z",
    },
    {
        id: "4",
        username: "viewer1",
        email: "viewer1@flowify.com",
        role: "viewer",
        status: "active",
        createdAt: "2024-02-15T00:00:00Z",
        updatedAt: "2024-03-12T12:00:00Z",
        lastLoginAt: "2024-03-12T11:30:00Z",
    },
];

const mockActivityLogs: ActivityLog[] = [
    {
        id: "1",
        userId: "2",
        username: "john.doe",
        action: "created",
        resource: "workflow",
        timestamp: "2024-03-15T10:30:00Z",
    },
    {
        id: "2",
        userId: "1",
        username: "admin",
        action: "updated",
        resource: "user",
        timestamp: "2024-03-15T09:15:00Z",
    },
    {
        id: "3",
        userId: "3",
        username: "jane.smith",
        action: "published",
        resource: "workflow",
        timestamp: "2024-03-14T16:45:00Z",
    },
    {
        id: "4",
        userId: "2",
        username: "john.doe",
        action: "deleted",
        resource: "workflow",
        timestamp: "2024-03-14T14:20:00Z",
    },
    {
        id: "5",
        userId: "1",
        username: "admin",
        action: "created",
        resource: "user",
        timestamp: "2024-03-13T10:00:00Z",
    },
];

const mockSettings: SystemSettings = {
    siteName: "Flowify.API",
    siteDescription: "Workflow automation platform",
    maintenanceMode: false,
    maxUsers: 100,
    allowRegistration: true,
    sessionTimeout: 30,
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
    // Admin API mocks
    {
        url: '/api/admin/users',
        method: 'GET',
        body: {
            users: mockUsers,
            total: mockUsers.length,
        },
    },
    {
        url: '/api/admin/users/:id',
        method: 'GET',
        body: (req) => {
            const id = req.params.id;
            const user = mockUsers.find(u => u.id === id);
            if (!user) {
                return new Response(JSON.stringify({
                    message: "User not found"
                }), {
                    status: 404
                });
            }
            return user;
        },
    },
    {
        url: '/api/admin/users',
        method: 'POST',
        body: (req) => {
            const userData = req.body as UserRequest;
            const newUser: User = {
                id: (mockUsers.length + 1).toString(),
                username: userData.username,
                email: userData.email,
                role: userData.role,
                status: userData.status || 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            mockUsers.push(newUser);
            return newUser;
        },
        status: 201,
    },
    {
        url: '/api/admin/users/:id',
        method: 'PATCH',
        body: (req) => {
            const id = req.params.id;
            const updatedData = req.body as Partial<UserRequest>;
            const index = mockUsers.findIndex(u => u.id === id);
            if (index === -1) {
                return new Response(JSON.stringify({
                    message: "User not found"
                }), {
                    status: 404
                });
            }
            const user = mockUsers[index];
            if (updatedData.username) user.username = updatedData.username;
            if (updatedData.email) user.email = updatedData.email;
            if (updatedData.role) user.role = updatedData.role;
            if (updatedData.status) user.status = updatedData.status;
            user.updatedAt = new Date().toISOString();
            return user;
        },
        status: 200,
    },
    {
        url: '/api/admin/users/:id',
        method: 'DELETE',
        body: (req) => {
            const id = req.params.id;
            const index = mockUsers.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUsers.splice(index, 1);
            }
            return {
                message: "User deleted successfully"
            };
        },
        status: 200,
    },
    {
        url: '/api/admin/dashboard/stats',
        method: 'GET',
        body: (): DashboardStats => {
            const activeUsers = mockUsers.filter(u => u.status === 'active').length;
            const publishedWorkflows = mockWorkflows.filter(w => w.status === 'published').length;
            return {
                totalUsers: mockUsers.length,
                activeUsers,
                totalWorkflows: mockWorkflows.length,
                publishedWorkflows,
                systemHealth: 'healthy',
                recentActivity: mockActivityLogs.slice(0, 10),
            };
        },
    },
    {
        url: '/api/admin/settings',
        method: 'GET',
        body: mockSettings,
    },
    {
        url: '/api/admin/settings',
        method: 'PATCH',
        body: (req) => {
            const updatedData = req.body as Partial<SystemSettings>;
            Object.assign(mockSettings, updatedData);
            return mockSettings;
        },
        status: 200,
    },
]);

