//@flow
function replaceNode/*::<N:Node>*/(node/*:N*/, newNode/*:Node*/)/*:N*/ {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}

module.exports = replaceNode;
