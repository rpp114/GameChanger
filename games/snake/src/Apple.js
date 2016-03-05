function Apple($el) {
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.x = Math.floor(Math.random() * 130);
  this.y = Math.floor(Math.random() * 130);
  $el.append(this.node);
  this.render();
}

Apple.prototype.render = Head.prototype.render;

Apple.prototype.eat = function() {
  this.node.remove();
}
