const phantom = require('phantom');




module.exports = function buildPng(imgObj, socketNameSpace) {
  var nsp = socketNameSpace;
  var sitePage = null;
  var phantomInstance = null;

  phantom.create()
    .then((instance) => {
      phantomInstance = instance;
      return instance.createPage();
    })
    .then((page) => {
      sitePage = page;
      var svg = buildImg(imgObj);

      page.viewportSize = {
        width: imgObj.w + 10,
        height: imgObj.h + 10
      };
      return page.open(svg)
    })
    .then((status) => {
      return sitePage.renderBase64('PNG');
      // console.log('PNG Image: ', base64);

    })
    .then((png) => {
       nsp.emit('image', 'data:image/png;base64,' + png);
      sitePage.close();
      phantomInstance.exit();
    })
}





var buildImg = function(imgObj) {
  var xml = '<foreignObject x="0" y="0" width="100%" height="100%">' + imgObj.html + '</foreignObject>';
  var foreignObject = '<svg xmlns="http://www.w3.org/2000/svg" width="' + imgObj.w + '" height="' + imgObj.h + '">' + xml + '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + foreignObject;
}
