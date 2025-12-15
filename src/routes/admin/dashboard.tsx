import { createFileRoute } from "@tanstack/react-router";
import { useDashboardStats } from "@/api/hooks/admin";
import { Card, Col, Row, Statistic, Table, Tag, Spin, Typography } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";

const { Title } = Typography;

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const activityColumns = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) =>
        formatDistanceToNow(new Date(timestamp), { addSuffix: true }),
    },
  ];

  return (
    <div className="p-8">
      <Title level={2}>Admin Dashboard</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats?.activeUsers || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Workflows"
              value={stats?.totalWorkflows || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Published Workflows"
              value={stats?.publishedWorkflows || 0}
              prefix={<RocketOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="System Health">
            <Tag color={getHealthColor(stats?.systemHealth || "healthy")}>
              {stats?.systemHealth?.toUpperCase() || "HEALTHY"}
            </Tag>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <Table
              dataSource={stats?.recentActivity || []}
              columns={activityColumns}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
