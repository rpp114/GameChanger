function Body($el, x, y, size) {
  this.node = $('<div class="body"></div>');
  this.node.css({
    'height': size,
    'width': size,
    'position': 'absolute',
    'background-color': 'blue'
  });
  $el.append(this.node);
  this.x = x;
  this.y = y;
  this.next = null;
  this.size = size;
  this.render();
}

Body.prototype.render = function() {
  this.node.offset({
    top: (head.size * this.y) + head.elPosY,
    left: (head.size * this.x) + head.elPosX
  });
  console.log('head.size', head.size, 'this.x', this.x, 'this.y', this.y, 'this.node', this.node.position());
  console.log('head.x', head.x, 'head.y', head.y);
};
