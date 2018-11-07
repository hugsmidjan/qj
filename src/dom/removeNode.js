//@flow
export default function removeNode/*::<N:Node>*/(node/*:N*/)/*:N*/ {
    node && node.parentNode && node.parentNode.removeChild( node );
    return node;
}
