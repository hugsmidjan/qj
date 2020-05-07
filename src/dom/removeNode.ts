export default function removeNode(node: undefined | null): null;
export default function removeNode<N extends Node>(node: N): N;

export default function removeNode<N extends Node>(
	node: N | undefined | null
	node && node.parentNode && node.parentNode.removeChild(node);
	return node;
}
