import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { useEffect, useCallback } from 'react';
import { Plugin, PluginMetadataMap } from '@/types/plugins';
import type { WorkFlow } from '@/api/types';
import { workFlowToNodesAndEdges } from '@/api/mappers/workFlowMapper';
import { message } from 'antd';

const createDefaultStartNode = (): Node => ({
  id: 'start-node',
  type: Plugin.START,
  position: { x: 250, y: 100 },
  data: {
    label: 'Start',
    icon: PluginMetadataMap[Plugin.START].icon,
  },
});

type UseWorkflowStateProps = {
  workFlow?: WorkFlow | null;
  applicationName?: string;
  onWorkflowChange?: (nodes: Node[], edges: Edge[]) => void;
};

type UseWorkflowStateReturn = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
};

export const useWorkflowState = ({
  workFlow,
  applicationName,
  onWorkflowChange,
}: UseWorkflowStateProps): UseWorkflowStateReturn => {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filteredChanges = changes.filter((change) => {
        if (
          change.type === 'remove' &&
          nodes.some(
            (node) => node.id === change.id && node.type === Plugin.START
          )
        ) {
          message.warning('Start node cannot be deleted');
          return false;
        }
        return true;
      });

      setNodes((nds: Node[]) => applyNodeChanges(filteredChanges, nds) as Node[]);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds) as Edge[]);
    },
    [setEdges]
  );

  useEffect(() => {
    if (workFlow != null) {
      const mapped = workFlowToNodesAndEdges(workFlow);
      setNodes(mapped.nodes);
      setEdges(mapped.edges);
    } else if (applicationName) {
      setNodes([createDefaultStartNode()]);
      setEdges([]);
    } else {
      setNodes([createDefaultStartNode()]);
      setEdges([]);
    }
  }, [applicationName, workFlow, setNodes, setEdges]);

  useEffect(() => {
    if (onWorkflowChange && (nodes.length > 0 || edges.length > 0)) {
      onWorkflowChange(nodes, edges);
    }
  }, [nodes, edges, onWorkflowChange]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  };
};
