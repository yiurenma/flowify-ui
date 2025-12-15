import { createFileRoute } from "@tanstack/react-router";
import { useSettings, useUpdateSettings } from "@/api/hooks/admin";
import type { SystemSettings } from "@/api/types/admin";
import {
  Card,
  Form,
  Input,
  Switch,
  InputNumber,
  Button,
  message,
  Spin,
  Typography,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form] = Form.useForm();

  const handleSubmit = async (values: Partial<SystemSettings>) => {
    try {
      await updateSettings.mutateAsync(values);
      message.success("Settings updated successfully");
    } catch (error) {
      message.error("Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>System Settings</Title>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={updateSettings.isPending}
        >
          Save Changes
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onFinish={handleSubmit}
      >
        <Card title="General Settings" className="mb-4">
          <Form.Item name="siteName" label="Site Name">
            <Input />
          </Form.Item>
          <Form.Item name="siteDescription" label="Site Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Card>

        <Card title="System Configuration" className="mb-4">
          <Form.Item
            name="maintenanceMode"
            label="Maintenance Mode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowRegistration"
            label="Allow User Registration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="maxUsers" label="Maximum Users">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="sessionTimeout" label="Session Timeout (minutes)">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
}
