import React, { useCallback, useEffect, useId } from "react";
import { Form, Input, Modal, Select } from "antd";
import { RepositoryRequest, RepositoryResponse } from "@/api/types";

type RepositoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: RepositoryRequest) => void;
  mode: "create" | "edit";
  repository?: RepositoryResponse | null;
};

export const RepositoryDialog: React.FC<RepositoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  repository,
}) => {
  const formId = useId();
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  // Reset form
  const resetForm = useCallback(() => {
    if (isEdit && repository) {
      form.setFieldsValue({
        name: repository.name,
        description: repository.description,
        visibility: repository.visibility,
        language: repository.language,
      });
    } else {
      form.resetFields();
    }
  }, [form, isEdit, repository]);

  useEffect(() => {
    if (repository) {
      resetForm();
    }
  }, [repository, resetForm]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      title={isEdit ? "Edit Repository" : "New Repository"}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEdit ? "Update" : "Create"}
      cancelText="Cancel"
      destroyOnClose={false}
      afterClose={resetForm}
    >
      <Form
        form={form}
        layout="vertical"
        name={formId}
        preserve={false}
        initialValues={
          isEdit && repository
            ? {
                name: repository.name,
                description: repository.description,
                visibility: repository.visibility,
                language: repository.language,
              }
            : {
                visibility: "public",
              }
        }
      >
        <Form.Item
          name="name"
          label="Repository Name"
          rules={[
            { required: true, message: "Please input the Repository Name!" },
          ]}
        >
          <Input placeholder="my-awesome-project" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="A brief description of your repository" />
        </Form.Item>
        <Form.Item
          name="visibility"
          label="Visibility"
          rules={[{ required: true, message: "Please select visibility!" }]}
        >
          <Select
            options={[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ]}
          />
        </Form.Item>
        <Form.Item name="language" label="Primary Language">
          <Select
            placeholder="Select a language"
            options={[
              { value: "TypeScript", label: "TypeScript" },
              { value: "JavaScript", label: "JavaScript" },
              { value: "Python", label: "Python" },
              { value: "Java", label: "Java" },
              { value: "Go", label: "Go" },
              { value: "Rust", label: "Rust" },
              { value: "C++", label: "C++" },
              { value: "C#", label: "C#" },
              { value: "Ruby", label: "Ruby" },
              { value: "PHP", label: "PHP" },
            ]}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
