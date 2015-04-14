(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function SourceCanvas() {
	this.canvas = document.getElementById('sourceCanvas');
	this.video = document.getElementById('video');
	this.xParts = 300;
	this.yParts = 200;
	this.xSide = Math.floor($(window).width() / this.xParts);
	this.ySide = Math.floor($(window).height() / this.yParts);
	this.center = view.center;
	this.currentFrame;
	this.counter = 0;
	this.blocks = [];
};

SourceCanvas.prototype.getStream = function() {

	this.canvas.width = $(window).width();
	this.canvas.height = $(window).height();

	navigator.getMedia = navigator.getUserMedia || 
		navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (navigator.getMedia) {
 		navigator.getMedia(
   		{
   			video: true
   		},
 			function(localMediaStream){
 				this.video.src = window.URL.createObjectURL(localMediaStream);
 				this.video.onloadedmetadata = function(e) {
		      render();
		    }
			},
	   	function(e){
	   		console.log(e);
	   	}
		);
	}
}

SourceCanvas.prototype.drawCanvas = function() {
	var c = this.canvas.getContext('2d');
	c.save();
	c.scale(-1, 1);
  c.drawImage(this.video, -this.canvas.width, 0, this.canvas.width, this.canvas.height);
  c.restore();
  this.currentFrame = c.getImageData(0, 0, this.canvas.width, this.canvas.height);	 
}

function Block() {
	var randomC = Math.floor(Math.random() * sourceCanvas.xParts);
	var randomR = Math.floor(Math.random() * sourceCanvas.yParts);

	var blockCenterX = randomC * sourceCanvas.xSide + Math.floor(sourceCanvas.xSide / 2);
	var blockCenterY = randomR * sourceCanvas.ySide + Math.floor(sourceCanvas.ySide / 2);

	this.pixelPos = (sourceCanvas.canvas.width * 4) * blockCenterY + blockCenterX * 4; //number
	this.radius = 50;
	this.path = new Path.Circle(new Point(blockCenterX, blockCenterY), 20);
}

Block.prototype.update = function() {
	var r = sourceCanvas.currentFrame.data[this.pixelPos];
	var g = sourceCanvas.currentFrame.data[this.pixelPos + 1];
	var b = sourceCanvas.currentFrame.data[this.pixelPos + 2];
	this.path.fillColor = 'rgb('+ r + ',' + g + ',' + b + ')';
	console.log("ha");
}

function render() {
	sourceCanvas.drawCanvas();

	var blocksNum = sourceCanvas.blocks.length;
	for(var i = 0; i < blocksNum; i ++) {
		sourceCanvas.blocks[i].update();
	}


	var newBlock = new Block();
	sourceCanvas.blocks.push(newBlock);

	requestAnimationFrame(render);
}

var sourceCanvas = new SourceCanvas();

sourceCanvas.getStream();