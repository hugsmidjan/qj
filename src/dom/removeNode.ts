export default function removeNode<N extends Node>(node: N): N {
    node.parentNode && node.parentNode.removeChild( node );
    return node;
}
