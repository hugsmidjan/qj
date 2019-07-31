function removeNode(node) {
    node.parentNode && node.parentNode.removeChild(node);
    return node;
}

module.exports = removeNode;
