export default function removeNode(node: null): null;
export default function removeNode<N extends Node>(node: N): N;

export default function removeNode<N extends Node>(node: N | null): N | null {
	node && node.parentNode && node.parentNode.removeChild(node);
	return node;
}
