import { useCreateRepository, useDeleteRepository, useRepositories, useUpdateRepository } from '@/api/hooks/repository';
import type { RepositoryResponse, RepositoryVisibility } from '@/api/types';
import { PlusOutlined } from '@ant-design/icons';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
    Button,
    Flex,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/repositories/')({
    component: RepositoriesRoute,
});

type RepoFormValues = {
    name: string;
    description?: string;
    visibility: RepositoryVisibility;
};

function RepositoriesRoute() {
    const { data, isLoading } = useRepositories();
    const createRepo = useCreateRepository();
    const updateRepo = useUpdateRepository();
    const deleteRepo = useDeleteRepository();

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState<RepositoryResponse | null>(null);

    const [createForm] = Form.useForm<RepoFormValues>();
    const [editForm] = Form.useForm<RepoFormValues>();

    const columns: ColumnsType<RepositoryResponse> = useMemo(() => {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (_, repo) => (
                    <Flex vertical gap={2}>
                        <Link to="/repositories/$repoId" params={{ repoId: repo.id }}>
                            {repo.name}
                        </Link>
                        <Typography.Text type="secondary" className="text-xs">
                            {repo.description || '—'}
                        </Typography.Text>
                    </Flex>
                ),
            },
            {
                title: 'Visibility',
                dataIndex: 'visibility',
                key: 'visibility',
                width: 120,
                render: (visibility: RepositoryVisibility) => (
                    <Tag color={visibility === 'public' ? 'green' : 'gold'}>
                        {visibility.toUpperCase()}
                    </Tag>
                ),
            },
            {
                title: 'Default branch',
                dataIndex: 'defaultBranch',
                key: 'defaultBranch',
                width: 140,
                render: (branch: string) => <Tag>{branch}</Tag>,
            },
            {
                title: 'Status',
                dataIndex: 'archived',
                key: 'archived',
                width: 120,
                render: (archived: boolean) => (
                    <Tag color={archived ? 'default' : 'blue'}>
                        {archived ? 'Archived' : 'Active'}
                    </Tag>
                ),
            },
            {
                title: 'Updated',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                width: 180,
                render: (v: string) => new Date(v).toLocaleString(),
            },
            {
                title: 'Actions',
                key: 'actions',
                width: 220,
                render: (_, repo) => (
                    <Space>
                        <Button
                            onClick={() => {
                                setEditing(repo);
                                editForm.setFieldsValue({
                                    name: repo.name,
                                    description: repo.description,
                                    visibility: repo.visibility,
                                });
                                setEditOpen(true);
                            }}
                        >
                            Edit
                        </Button>
                        <Popconfirm
                            title="Delete repository"
                            description={`Delete “${repo.name}”? This cannot be undone (mock).`}
                            okText="Delete"
                            okButtonProps={{ danger: true }}
                            onConfirm={async () => {
                                try {
                                    await deleteRepo.mutateAsync(repo.id);
                                    message.success('Deleted');
                                } catch {
                                    message.error('Delete failed');
                                }
                            }}
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
    }, [deleteRepo, editForm]);

    const repositories = data?.repositories ?? [];

    return (
        <Flex vertical gap={'large'} className="p-12" style={{ height: '100%' }}>
            <Flex justify="space-between" align="center">
                <Typography.Title level={3} className="mb-0">
                    Repositories
                </Typography.Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        createForm.resetFields();
                        createForm.setFieldsValue({ visibility: 'private' });
                        setCreateOpen(true);
                    }}
                >
                    New Repository
                </Button>
            </Flex>

            <Spin spinning={isLoading}>
                <Table
                    rowKey={(r) => r.id}
                    columns={columns}
                    dataSource={repositories}
                    pagination={{ pageSize: 10 }}
                />
            </Spin>

            <Modal
                title="New repository"
                open={createOpen}
                okText={createRepo.isPending ? 'Creating…' : 'Create'}
                okButtonProps={{ loading: createRepo.isPending }}
                onCancel={() => setCreateOpen(false)}
                onOk={async () => {
                    const values = await createForm.validateFields();
                    try {
                        await createRepo.mutateAsync(values);
                        message.success('Created');
                        setCreateOpen(false);
                    } catch {
                        message.error('Create failed');
                    }
                }}
            >
                <Form form={createForm} layout="vertical" requiredMark="optional">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter a repository name' }]}
                    >
                        <Input placeholder="e.g. my-service" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="What is this repository for?" />
                    </Form.Item>
                    <Form.Item
                        name="visibility"
                        label="Visibility"
                        rules={[{ required: true, message: 'Please choose visibility' }]}
                    >
                        <Select
                            options={[
                                { value: 'private', label: 'Private' },
                                { value: 'public', label: 'Public' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editing ? `Edit: ${editing.name}` : 'Edit repository'}
                open={editOpen}
                okText={updateRepo.isPending ? 'Saving…' : 'Save'}
                okButtonProps={{ loading: updateRepo.isPending }}
                onCancel={() => {
                    setEditOpen(false);
                    setEditing(null);
                }}
                onOk={async () => {
                    if (!editing) return;
                    const values = await editForm.validateFields();
                    try {
                        await updateRepo.mutateAsync({ id: editing.id, data: values });
                        message.success('Saved');
                        setEditOpen(false);
                        setEditing(null);
                    } catch {
                        message.error('Save failed');
                    }
                }}
            >
                <Form form={editForm} layout="vertical" requiredMark="optional">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter a repository name' }]}
                    >
                        <Input placeholder="e.g. my-service" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="What is this repository for?" />
                    </Form.Item>
                    <Form.Item
                        name="visibility"
                        label="Visibility"
                        rules={[{ required: true, message: 'Please choose visibility' }]}
                    >
                        <Select
                            options={[
                                { value: 'private', label: 'Private' },
                                { value: 'public', label: 'Public' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
}
