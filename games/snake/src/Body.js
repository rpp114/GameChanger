function Body($el, x, y, size) {
  this.node = $('<div class="body"></div>');
  this.node.css({'width': 50 * size, 'height': 50 * size});
  $el.append(this.node);
  this.x = x;
  this.y = y;
  this.next = null;
  this.render();
}

Body.prototype.render = Head.prototype.render;
