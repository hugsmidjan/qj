function replaceNode(node, newNode) {
    node.parentNode && node.parentNode.replaceChild(newNode, node);
    return node;
}

module.exports = replaceNode;
