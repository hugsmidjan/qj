'use strict';

//@flow
function /*::<N:Node>*/replaceNode(node/*:N*/, newNode/*:Node*/)/*:N*/ {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}

module.exports = replaceNode;
