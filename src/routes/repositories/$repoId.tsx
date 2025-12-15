import { useRepository } from '@/api/hooks/repository';
import { useUpdateRepository } from '@/api/hooks/repository';
import type { RepositoryUpdateRequest, RepositoryVisibility } from '@/api/types';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
    Button,
    Card,
    Descriptions,
    Flex,
    Form,
    Input,
    Select,
    Space,
    Spin,
    Switch,
    Typography,
    message,
} from 'antd';
import { useEffect } from 'react';

export const Route = createFileRoute('/repositories/$repoId')({
    component: RepositoryDetailRoute,
});

type SettingsForm = {
    description?: string;
    visibility: RepositoryVisibility;
    defaultBranch: string;
    archived: boolean;
};

function RepositoryDetailRoute() {
    const { repoId } = Route.useParams();
    const { data: repo, isLoading } = useRepository(repoId);
    const updateRepo = useUpdateRepository();

    const [form] = Form.useForm<SettingsForm>();

    useEffect(() => {
        if (!repo) return;
        form.setFieldsValue({
            description: repo.description,
            visibility: repo.visibility,
            defaultBranch: repo.defaultBranch,
            archived: repo.archived,
        });
    }, [form, repo]);

    return (
        <Flex vertical gap={'large'} className="p-12" style={{ height: '100%' }}>
            <Space size={12} align="center">
                <Link to="/repositories">Repositories</Link>
                <Typography.Text type="secondary">/</Typography.Text>
                <Typography.Title level={4} className="mb-0">
                    {repo?.name ?? repoId}
                </Typography.Title>
            </Space>

            <Spin spinning={isLoading}>
                {repo ? (
                    <Flex vertical gap={'large'}>
                        <Card>
                            <Descriptions title="Overview" column={2} size="small">
                                <Descriptions.Item label="Name">{repo.name}</Descriptions.Item>
                                <Descriptions.Item label="Visibility">
                                    {repo.visibility.toUpperCase()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Default branch">
                                    {repo.defaultBranch}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    {repo.archived ? 'Archived' : 'Active'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Created">
                                    {new Date(repo.createdAt).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Updated">
                                    {new Date(repo.updatedAt).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Description" span={2}>
                                    {repo.description || '—'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Settings">
                            <Form form={form} layout="vertical" requiredMark="optional">
                                <Form.Item name="description" label="Description">
                                    <Input.TextArea rows={3} placeholder="Optional description" />
                                </Form.Item>

                                <Flex gap={16} wrap>
                                    <Form.Item
                                        name="visibility"
                                        label="Visibility"
                                        rules={[{ required: true, message: 'Please choose visibility' }]}
                                        style={{ minWidth: 240 }}
                                    >
                                        <Select
                                            options={[
                                                { value: 'private', label: 'Private' },
                                                { value: 'public', label: 'Public' },
                                            ]}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="defaultBranch"
                                        label="Default branch"
                                        rules={[{ required: true, message: 'Please enter a branch name' }]}
                                        style={{ minWidth: 240 }}
                                    >
                                        <Input placeholder="main" />
                                    </Form.Item>

                                    <Form.Item
                                        name="archived"
                                        label="Archived"
                                        valuePropName="checked"
                                        style={{ minWidth: 160 }}
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Flex>

                                <Space>
                                    <Button
                                        type="primary"
                                        loading={updateRepo.isPending}
                                        onClick={async () => {
                                            const values = await form.validateFields();
                                            const patch: RepositoryUpdateRequest = {
                                                description: values.description,
                                                visibility: values.visibility,
                                                defaultBranch: values.defaultBranch,
                                                archived: values.archived,
                                            };

                                            try {
                                                await updateRepo.mutateAsync({ id: repo.id, data: patch });
                                                message.success('Saved');
                                            } catch {
                                                message.error('Save failed');
                                            }
                                        }}
                                    >
                                        Save changes
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            form.resetFields();
                                            form.setFieldsValue({
                                                description: repo.description,
                                                visibility: repo.visibility,
                                                defaultBranch: repo.defaultBranch,
                                                archived: repo.archived,
                                            });
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Space>
                            </Form>
                        </Card>
                    </Flex>
                ) : (
                    <Typography.Text type="secondary">Repository not found.</Typography.Text>
                )}
            </Spin>
        </Flex>
    );
}
