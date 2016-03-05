function Apple($el, size) {
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.node.css({'width': 50 * size, 'height': 50 * size});
  this.x = Math.floor(Math.random() * 10);
  this.y = Math.floor(Math.random() * 10);
  $el.append(this.node);
  this.render();
}

Apple.prototype.render = Head.prototype.render;

Apple.prototype.eat = function() {
  this.node.remove();
};
