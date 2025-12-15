import { useRepositories } from "@/api/hooks/repository";
import { RepositoryResponse } from "@/api/types";
import { RepositoryCard } from "@/routes/repositories/-components/repository-card";
import {
  useRepositoryDialog,
  RepositoryDialogProvider,
} from "@/routes/repositories/-components/repository-dialog/RepositoryDialogProvider";
import { PlusOutlined } from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Col, Flex, Row, Spin, Typography } from "antd";

export const Route = createFileRoute("/repositories/")({
  component: RouteComponent,
});

const RepositoryList = () => {
  const { data: repositoryList, isLoading } = useRepositories();
  const { openCreateDialog } = useRepositoryDialog();
  return (
    <Flex vertical gap={"large"} flex={1} className="p-12">
      <Flex justify={"space-between"}>
        <Typography.Title level={3}>My Repositories</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateDialog}
        >
          New Repository
        </Button>
      </Flex>
      <Spin spinning={isLoading}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <RepositoryDialogProvider>
            {repositoryList?.repositories.map((repository: RepositoryResponse) => (
              <Col key={repository.id} className="gutter-row" span={6}>
                <div className="py-2">
                  <RepositoryCard repository={repository} />
                </div>
              </Col>
            ))}
          </RepositoryDialogProvider>
        </Row>
      </Spin>
    </Flex>
  );
};

function RouteComponent() {
  return (
    <RepositoryDialogProvider>
      <RepositoryList />
    </RepositoryDialogProvider>
  );
}
