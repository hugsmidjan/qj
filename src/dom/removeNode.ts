export default function removeNode(node: undefined | null): undefined;
export default function removeNode<N extends Node>(node: N): N;

export default function removeNode<N extends Node>(
	node: N | undefined | null
): N | undefined {
	node && node.parentNode && node.parentNode.removeChild(node);
	return node || undefined;
}
