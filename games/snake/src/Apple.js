function Apple($el, size) {
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.node.css({
    'height': size,
    'width': size
  });
  this.getRandomCoords = function() {

    this.x = Math.floor(Math.random() * $el.height() / size);
    this.y = Math.floor(Math.random() * $el.height() / size);
    for (var node = head; node; node = node.next) {
      if ((this.x === node.x && this.y === node.y) || (this.x === head.x && this.y === head.y)){
        console.log('works');
        return this.getRandomCoords();
      }

    }
  }
  this.getRandomCoords();
  //gives apple random spawn coordinates

  //spawns apple
  $el.append(this.node);
  this.size = size;
  this.render();
}

function getRandomCoords() {

}

Apple.prototype.render = Head.prototype.render;

Apple.prototype.eat = function() {
  this.node.remove();
};
