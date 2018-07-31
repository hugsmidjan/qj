//@flow
export default function /*::<N:Node>*/removeNode(node/*:N*/)/*:N*/ {
    node && node.parentNode && node.parentNode.removeChild( node );
    return node;
}
