import {
  defaultHeaders,
  handleApiError,
  joinApiUrl,
  OPERATION_API_BASE,
} from '../config';
import type {
  SpringPage,
  WorkFlow,
  WorkflowEntitySettingRow,
} from '../types';

const json = (path: string, init?: RequestInit) =>
  fetch(joinApiUrl(OPERATION_API_BASE, path), {
    ...init,
    headers: { ...defaultHeaders, ...init?.headers },
  });

export const operationApi = {
  listEntitySettings: async (params: {
    page?: number;
    size?: number;
    applicationName?: string;
    sort?: string;
  }): Promise<SpringPage<WorkflowEntitySettingRow>> => {
    const sp = new URLSearchParams();
    if (params.page != null) sp.set('page', String(params.page));
    if (params.size != null) sp.set('size', String(params.size));
    if (params.sort) sp.set('sort', params.sort);
    if (params.applicationName) sp.set('applicationName', params.applicationName);
    const q = sp.toString();
    const path = `/workflow/entity-setting${q ? `?${q}` : ''}`;
    const response = await json(path);
    if (!response.ok) return handleApiError(response);
    return response.json();
  },

  getWorkflow: async (applicationName: string): Promise<WorkFlow> => {
    const response = await json(
      `/workflow?${new URLSearchParams({ applicationName }).toString()}`
    );
    if (!response.ok) return handleApiError(response);
    return response.json();
  },

  saveWorkflow: async (
    applicationName: string,
    body: WorkFlow
  ): Promise<WorkFlow> => {
    const response = await json(
      `/workflow?${new URLSearchParams({ applicationName }).toString()}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) return handleApiError(response);
    return response.json();
  },

  deleteWorkflow: async (applicationName: string): Promise<void> => {
    const response = await json(
      `/workflow?${new URLSearchParams({ applicationName }).toString()}`,
      { method: 'DELETE' }
    );
    if (!response.ok && response.status !== 204) {
      return handleApiError(response);
    }
  },

  createEmptyApplication: async (applicationName: string): Promise<WorkFlow> => {
    const empty: WorkFlow = { pluginList: [], uiMapList: [] };
    return operationApi.saveWorkflow(applicationName, empty);
  },
};
