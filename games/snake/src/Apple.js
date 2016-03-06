function Apple($el, size) {
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.node.css({
    'height': size,
    'width': size
  })
  this.x = Math.floor(Math.random() * $el.height() / size);
  this.y = Math.floor(Math.random() * $el.height() / size);

  $el.append(this.node);
  this.size = size;
  this.render();
}

Apple.prototype.render = Head.prototype.render;

Apple.prototype.eat = function() {
  this.node.remove();
}
