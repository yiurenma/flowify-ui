import React from "react";
import { RepositoryResponse } from "@/api/types";
import { Card, MenuProps, Modal, message, Tag, Avatar } from "antd";
import OperateDropdown from "@/components/operate-dropdown";
import { useRepositoryDialog } from "../repository-dialog/RepositoryDialogProvider";
import { useDeleteRepository } from "@/api/hooks/repository";
import {
  StarOutlined,
  ForkOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

export const RepositoryCard: React.FC<{ repository: RepositoryResponse }> = ({
  repository,
}) => {
  const { openEditDialog } = useRepositoryDialog();
  const deleteRepository = useDeleteRepository();

  const handleCardClick = () => {
    // Navigate to repository detail page or open in new window
    window.open(repository.url, "_blank");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 ring-green-600/20";
      case "archived":
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
      case "maintenance":
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Edit",
      key: "edit",
    },
    {
      label: "Remove",
      key: "remove",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.domEvent.stopPropagation();
    if (e.key === "edit") {
      openEditDialog(repository);
    } else if (e.key === "remove") {
      Modal.confirm({
        title: "Delete Repository",
        content: `Are you sure you want to delete '${repository.name}'? This action cannot be undone.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await deleteRepository.mutateAsync(repository.id);
            message.success(`Repository '${repository.name}' has been deleted`);
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error occurred";
            message.error(`Failed to delete repository: ${errorMessage}`);
          }
        },
      });
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Avatar
              src={repository.owner.avatar}
              size="small"
              className="flex-shrink-0"
            >
              {repository.owner.name[0].toUpperCase()}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {repository.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {repository.owner.name}
              </p>
            </div>
          </div>
          <OperateDropdown items={items} onClick={handleMenuClick} />
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] leading-[1.25rem]">
            {repository.description || "No description provided"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {repository.visibility === "private" ? (
              <LockOutlined className="text-gray-400 text-xs" />
            ) : (
              <GlobalOutlined className="text-gray-400 text-xs" />
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <StarOutlined className="text-yellow-500" />
              <span>{repository.stars}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <ForkOutlined className="text-blue-500" />
              <span>{repository.forks}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {repository.language && (
              <Tag color="blue" className="text-xs">
                {repository.language}
              </Tag>
            )}
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                repository.status
              )}`}
            >
              {repository.status}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Updated {repository.updatedAt}
        </div>
      </div>
    </Card>
  );
};
