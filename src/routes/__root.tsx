import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import logo from "@/assets/logo.png";
import { ConfigProvider, Layout, Menu, MenuProps } from "antd";
import {
  FolderOpenOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "Home",
    label: <Link to="/">Home</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "Workflows",
    label: <Link to="/workflows">Workflows</Link>,
    icon: <FolderOpenOutlined />,
  },
  {
    key: "Admin",
    label: <Link to="/admin">Admin</Link>,
    icon: <SettingOutlined />,
  },
  {
    key: "About",
    label: <Link to="/about">About</Link>,
    icon: <InfoCircleOutlined />,
  },
];

export const Route = createRootRoute({
  component: () => (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: "var(--color-hsbc-red)",
              colorPrimaryHover: "var(--color-hsbc-medium-red)",
              colorPrimaryActive: "var(--color-hsbc-dark-red)",
            },
          },
        }}
      >
        <Layout className="h-dvh">
          <Header className="flex items-center justify-between bg-hsbc-red text-white shadow-sm">
            <div className="flex items-center">
              <img alt="HSBC" src={logo} className="h-12 w-auto" />
              <span className="font-medium ml-2 text-lg">Flowify.API</span>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemColor: "white",
                    itemHoverColor: "white",
                    horizontalItemHoverColor: "white",
                    horizontalItemSelectedColor: "white",
                    itemSelectedColor: "white",
                  },
                },
              }}
            >
              <Menu
                mode="horizontal"
                items={menuItems}
                className="bg-transparent flex-1 ml-20"
              />
            </ConfigProvider>
          </Header>
          <Content className="flex-1 overflow-hidden">
            <div className="h-full">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
