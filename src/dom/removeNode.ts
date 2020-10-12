function removeNode(node: undefined | null): undefined;
function removeNode<N extends Node>(node: N): N;

function removeNode<N extends Node>(node: N | undefined | null): N | undefined {
	node && node.parentNode && node.parentNode.removeChild(node);
	return node || undefined;
}

export default removeNode;
