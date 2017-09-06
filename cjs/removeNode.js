'use strict';

function removeNode(node/*:Node */) {
  node && node.parentNode && node.parentNode.removeChild( node );
  return node;
}

module.exports = removeNode;
