import React, { createContext, useContext, useState, ReactNode } from "react";
import { RepositoryDialog } from "./index";
import { RepositoryRequest, RepositoryResponse } from "@/api/types";
import { useCreateRepository, useUpdateRepository } from "@/api/hooks/repository";

type DialogMode = "create" | "edit";

interface RepositoryDialogContextType {
  openCreateDialog: () => void;
  openEditDialog: (repository: RepositoryResponse) => void;
  closeDialog: () => void;
}

const RepositoryDialogContext = createContext<
  RepositoryDialogContextType | undefined
>(undefined);

export const useRepositoryDialog = () => {
  const context = useContext(RepositoryDialogContext);
  if (!context) {
    throw new Error(
      "useRepositoryDialog must be used within a RepositoryDialogProvider"
    );
  }
  return context;
};

interface RepositoryDialogProviderProps {
  children: ReactNode;
}

export const RepositoryDialogProvider: React.FC<RepositoryDialogProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DialogMode>("create");
  const [selectedRepository, setSelectedRepository] =
    useState<RepositoryResponse | null>(null);

  const createRepository = useCreateRepository();
  const updateRepository = useUpdateRepository();

  const openCreateDialog = () => {
    setMode("create");
    setSelectedRepository(null);
    setIsOpen(true);
  };

  const openEditDialog = (repository: RepositoryResponse) => {
    setMode("edit");
    setSelectedRepository(repository);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (data: RepositoryRequest) => {
    try {
      if (mode === "create") {
        await createRepository.mutateAsync(data);
      } else if (selectedRepository) {
        const updateData: RepositoryRequest = {
          ...data,
        };

        await updateRepository.mutateAsync({
          id: selectedRepository.id,
          data: updateData,
        });
      }
      closeDialog();
    } catch (error) {
      console.error("failed to submit repository:", error);
    }
  };

  return (
    <RepositoryDialogContext.Provider
      value={{
        openCreateDialog,
        openEditDialog,
        closeDialog,
      }}
    >
      {children}
      <RepositoryDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        mode={mode}
        repository={selectedRepository}
      />
    </RepositoryDialogContext.Provider>
  );
};
