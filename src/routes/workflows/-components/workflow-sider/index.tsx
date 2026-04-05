import React from "react";
import { Layout, Button, Tooltip, Flex, Divider } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Plugin, pluginMenuList } from "@/types/plugins";

const { Sider } = Layout;

type WorkflowSiderProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export const WorkflowSider: React.FC<WorkflowSiderProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: Plugin
  ) => {
    event.dataTransfer.setData("application/@xyflow/react", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null}
      collapsedWidth={48}
      theme={"light"}
      onCollapse={(value: boolean) => setCollapsed(value)}
      className="overflow-y-auto"
    >
      <Flex vertical gap={10} className="px-2">
        <Flex className="justify-end">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Flex>

        {pluginMenuList.map((plugin) => {
          return (
            <React.Fragment key={plugin.key}>
              {!collapsed && (
                <Divider orientation="left" className="text-sm font-bold m-0">
                  {plugin.label}
                </Divider>
              )}

              {plugin.children.map((child) => (
                <Tooltip title={child.label} key={child.key} placement="right">
                  <div
                    key={child.key}
                    draggable
                    onDragStart={(event) => onDragStart(event, child.key)}
                    className="p-2 rounded-md cursor-move hover:bg-gray-100 transition-colors"
                  >
                    <Flex align="center" gap={15}>
                      {child.icon}
                      {!collapsed && <span>{child.label}</span>}
                    </Flex>
                  </div>
                </Tooltip>
              ))}
            </React.Fragment>
          );
        })}
      </Flex>
    </Sider>
  );
};
