function Apple($el, size) {
  this.size = size;
  this.node = $('<img id="apple"></img>');
  this.node.attr('src', "data:image/jpeg;base64,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");
  this.node.css({
    'height': this.size,
    'width': this.size,
    'position': 'absolute'
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
  // console.log('apple render', this.node.position())
  // console.log(this.size)
};
Apple.prototype.eat = function() {
  this.node.remove();
};
