// import { LEVEL_HEIGHT, NODE_WIDTH, GAP } from "./layout";

// export function generateGraph(tree, collapsed) {
//   const nodes = [];
//   const edges = [];
//   let xCursor = 0;

//   function traverse(node, depth) {
//     const startX = xCursor;

//     const isCollapsed = collapsed[node.id];

//     if (!isCollapsed && node.children) {
//       node.children.forEach(child => traverse(child, depth + 1));
//     }

//     const endX = xCursor;
//     const x = (startX + endX) / 2 || startX;
//     const y = depth * LEVEL_HEIGHT;

//     nodes.push({
//       id: node.id,
//       type: "custom",
//       position: { x, y },
//       data: {
//         label: node.label,
//         hasChildren: !!node.children,
//         collapsed: isCollapsed,
//         onToggle: node.onToggle,
//       },
//     });

//     if (node.parent) {
//       edges.push({
//         id: `${node.parent}-${node.id}`,
//         source: node.parent,
//         target: node.id,
//       });
//     }

//     if (!node.children || isCollapsed) {
//       xCursor += NODE_WIDTH + GAP;
//     }
//   }

//   traverse(tree, 0);

//   return { nodes, edges };
// }



// 2
// import { LEVEL_HEIGHT, NODE_WIDTH, GAP } from "./layout";

// export function generateGraph(tree, collapsed) {
//   let x = 0;
//   const nodes = [];
//   const edges = [];

//   function walk(node, depth) {
//     const isCollapsed = collapsed[node.id];
//     let childXs = [];

//     if (!isCollapsed && node.children) {
//       node.children.forEach((child) => {
//         const cx = walk(child, depth + 1);
//         childXs.push(cx);

//         edges.push({
//           id: `${node.id}-${child.id}`,
//           source: node.id,
//           target: child.id,
//         });
//       });
//     }

//     let nodeX;
//     if (childXs.length) {
//       nodeX =
//         (Math.min(...childXs) + Math.max(...childXs)) / 2;
//     } else {
//       nodeX = x;
//       x += NODE_WIDTH + GAP;
//     }

//     nodes.push({
//       id: node.id,
//       type: "custom",
//       position: { x: nodeX, y: depth * LEVEL_HEIGHT },
//       data: {
//         label: node.label,
//         hasChildren: !!node.children,
//         collapsed: isCollapsed,
//         onToggle: node.onToggle,
//         onAdd: node.onAdd,
//         onDelete: node.onDelete,
//       },
//     });

//     return nodeX;
//   }

//   walk(tree, 0);
//   return { nodes, edges };
// }


import { LEVEL_HEIGHT, NODE_WIDTH, GAP } from "./layout";

export function generateGraph(tree, collapsed) {
  let x = 0;
  const nodes = [];
  const edges = [];

  function walk(node, depth) {
    const isCollapsed = collapsed[node.id];
    const children = node.children || [];
    let childXs = [];

    // Traverse children first (post-order)
    if (!isCollapsed && children.length > 0) {
      children.forEach((child) => {
        const cx = walk(child, depth + 1);
        childXs.push(cx);

        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
        });
      });
    }

    // Calculate X position
    let nodeX;
    if (childXs.length > 0) {
      nodeX =
        (Math.min(...childXs) + Math.max(...childXs)) / 2;
    } else {
      nodeX = x;
      x += NODE_WIDTH + GAP;
    }

    // Push node with FULL metadata
    nodes.push({
      id: node.id,
      type: "custom",
      position: {
        x: nodeX,
        y: depth * LEVEL_HEIGHT,
      },
      data: {
        label: node.label,
        id: node.id,                 // ✅ metadata
        depth: depth,                // ✅ metadata
        childrenCount: children.length, // ✅ metadata
        hasChildren: children.length > 0,
        collapsed: isCollapsed,
        onToggle: node.onToggle,
        onAdd: node.onAdd,
        onDelete: node.onDelete,
        onSelect: node.onSelect,
        selected: node.selected,
      },
    });

    return nodeX;
  }

  walk(tree, 0);
  return { nodes, edges };
}


