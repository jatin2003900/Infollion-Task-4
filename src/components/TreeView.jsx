

import { useState, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import TreeNode from "./TreeNode";
import { generateGraph } from "../utils/transform";

const nodeTypes = { custom: TreeNode };

const initialTree = {
  id: "root",
  label: "Root",
  children: [
    {
      id: "child1",
      label: "Child 1",
      children: [
        { id: "c1_1", label: "New Node" },
        { id: "c1_2", label: "New Node" },
        { id: "c1_3", label: "New Node" },
      ],
    },
    {
      id: "child2",
      label: "Child 2",
      children: [
        { id: "c2_1", label: "New Node" },
        { id: "c2_2", label: "New Node" },
      ],
    },
  ],
};

export default function TreeView() {
  const [tree, setTree] = useState(initialTree);
  const [collapsed, setCollapsed] = useState({});
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const toggleNode = (id) =>
    setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  const addNode = (parentId) => {
    const newId = "node_" + Date.now();

    const addRec = (node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [
            ...(node.children || []),
            { id: newId, label: "New Node" },
          ],
        };
      }
      return {
        ...node,
        children: node.children?.map(addRec),
      };
    };

    setTree((t) => addRec(t));
  };

  const deleteNode = (id) => {
    const delRec = (node) => ({
      ...node,
      children: node.children
        ?.filter((c) => c.id !== id)
        .map(delRec),
    });
    setTree((t) => delRec(t));
  };

  const attachHandlers = (node, parent = null, depth = 0) => ({
    ...node,
    parent,
    depth,
    onToggle: () => toggleNode(node.id),
    onAdd: () => addNode(node.id),
    onDelete: () => deleteNode(node.id),
    onSelect: () => setSelected(node.id),
    selected:
      selected === node.id ||
      (search && node.label.toLowerCase().includes(search)),
    children: node.children?.map((c) =>
      attachHandlers(c, node.id, depth + 1)
    ),
  });

  const preparedTree = attachHandlers(tree);

  const { nodes, edges } = useMemo(
    () => generateGraph(preparedTree, collapsed),
    [preparedTree, collapsed]
  );

  return (
    <ReactFlowProvider>
      <input
        placeholder="Search node..."
        onChange={(e) =>
          setSearch(e.target.value.toLowerCase())
        }
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          padding: 6,
          borderRadius: 4,
        }}
      />

      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
        //   style={{ background: "transparent" }}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
