function Body($el, x, y, size) {
  this.node = $('<div class="body"></div>');
  this.node.css({'height': size, 'width': size});
  $el.append(this.node);
  this.x = x;
  this.y = y;
  this.next = null;
  this.size = size;
  this.render();
}

Body.prototype.render = Head.prototype.render;
