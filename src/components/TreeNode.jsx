import { Handle, Position } from "reactflow";
import "./TreeNode.css";

export default function TreeNode({ data }) {
  return (
    <div className={`tree-node ${data.selected ? "selected" : ""}`}>
      {/* Top connection */}
      <Handle type="target" position={Position.Top} />

      <div className="node-content" onClick={data.onSelect}>
        <div className="label">{data.label}</div>

        <div className="actions">
          <button onClick={data.onToggle}>
            {data.collapsed ? "+" : "-"}
          </button>

          <button onClick={data.onAdd}>➕</button>

          {data.label !== "Root" && (
            <button onClick={data.onDelete}>🗑</button>
          )}
        </div>
      </div>

      {data.selected && (
        <div className="meta">
          <div><strong>ID:</strong> {data.id}</div>
          <div><strong>Depth:</strong> {data.depth}</div>
          <div><strong>Children:</strong> {data.childrenCount}</div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}


