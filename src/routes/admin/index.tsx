import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout, Menu, MenuProps } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "@tanstack/react-router";

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "/admin",
    label: <Link to="/admin">Dashboard</Link>,
    icon: <DashboardOutlined />,
  },
  {
    key: "/admin/users",
    label: <Link to="/admin/users">Users</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "/admin/settings",
    label: <Link to="/admin/settings">Settings</Link>,
    icon: <SettingOutlined />,
  },
];

export const Route = createFileRoute("/admin/")({
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const selectedKey = location.pathname;

  return (
    <Layout className="h-full">
      <Sider width={200} className="bg-white border-r">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="h-full"
        />
      </Sider>
      <Content className="overflow-auto">
        <Outlet />
      </Content>
    </Layout>
  );
}
