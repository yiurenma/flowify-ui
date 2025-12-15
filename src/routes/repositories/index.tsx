import { useRepositories, useCreateRepository, useDeleteRepository } from "@/api/hooks/repository";
import { Repository } from "@/api/types/repository";
import { PlusOutlined, GithubOutlined, LockOutlined, GlobalOutlined, TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Table, Tag, Typography, Modal, Form, Input, Select, Space, message } from "antd";
import { useState } from "react";

export const Route = createFileRoute("/repositories/")({
  component: RepositoryList,
});

const { Option } = Select;

function RepositoryList() {
  const { data, isLoading } = useRepositories();
  const { mutateAsync: createRepo } = useCreateRepository();
  const { mutateAsync: deleteRepo } = useDeleteRepository();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async (values: any) => {
    try {
      await createRepo(values);
      message.success("Repository created successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create repository");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRepo(id);
      message.success("Repository deleted successfully");
    } catch (error) {
      message.error("Failed to delete repository");
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Repository) => (
        <Space>
          <GithubOutlined />
          <a href={record.url} target="_blank" rel="noopener noreferrer" className="font-medium">
            {text}
          </a>
        </Space>
      ),
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility: string) => {
        let icon = <GlobalOutlined />;
        let color = 'green';
        if (visibility === 'private') {
          icon = <LockOutlined />;
          color = 'gold';
        } else if (visibility === 'internal') {
          icon = <TeamOutlined />;
          color = 'blue';
        }
        return (
          <Tag icon={icon} color={color} className="capitalize">
            {visibility}
          </Tag>
        );
      },
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Repository) => (
        <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => {
                Modal.confirm({
                    title: 'Delete Repository',
                    content: `Are you sure you want to delete ${record.name}?`,
                    onOk: () => handleDelete(record.id)
                });
            }}
        />
      ),
    },
  ];

  return (
    <div className="p-12 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography.Title level={3} className="m-0">Repositories</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          New Repository
        </Button>
      </div>

      <Table
        dataSource={data?.repositories}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
      />

      <Modal
        title="Create New Repository"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="Repository Name"
            rules={[{ required: true, message: 'Please enter repository name' }]}
          >
            <Input placeholder="e.g. flowify-ui" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Short description of the repository" />
          </Form.Item>

          <Form.Item
            name="visibility"
            label="Visibility"
            initialValue="public"
          >
            <Select>
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
              <Option value="internal">Internal</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Create Repository
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
