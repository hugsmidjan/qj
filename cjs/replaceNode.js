'use strict';

function replaceNode(node, newNode) {
  node && node.parentNode && node.parentNode.replaceChild(newNode, node);
  return node;
}

module.exports = replaceNode;
