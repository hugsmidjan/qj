export default function replaceNode<N extends Node>(node: N, newNode: Node): N {
	node.parentNode && node.parentNode.replaceChild(newNode, node);
	return node;
}
