function Apple($el, size) {
  this.size = size;
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', 'games/snake/src/assets/apple.jpg');
  this.node.css({
    'height': this.size,
    'width': this.size
  });
  this.getRandomCoords = function() {

    this.x = Math.floor(Math.random() * $el.height() / this.size);
    this.y = Math.floor(Math.random() * $el.height() / this.size);
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
  this.render();
}

function getRandomCoords() {

}

Apple.prototype.render = function() {
  this.node.offset({
    top: (head.size * this.y) + head.elPosY,
    left: (head.size * this.x) + head.elPosX
  });
  console.log('apple render', this.node.position())
  console.log(this.size)
};
Apple.prototype.eat = function() {
  this.node.remove();
};
