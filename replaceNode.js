//@flow
export default function /*::<N:Node>*/replaceNode(node/*:N*/, newNode/*:Node*/)/*:N*/ {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}

const p = document.querySelector('p');
if (p) {
  const p2 = replaceNode(p, document.createTextNode('foobar'));
  p2.focus();
}
