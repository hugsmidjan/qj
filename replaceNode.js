export default function replaceNode(node, newNode) {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}
