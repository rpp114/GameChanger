function Body($el, x, y) {
  this.node = $('<div class="body"></div>');
  $el.append(this.node);
  this.x = x;
  this.y = y;
  this.next = null;
  this.render();
}

Body.prototype.render = Head.prototype.render;
