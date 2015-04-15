(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById('sourceCanvas');
var video = document.getElementById('video');
var width = 800;
var height = 600;	
var xParts = 200;
var yParts = 150;
var xSide = Math.floor(width / xParts);
var ySide = Math.floor(height / yParts);
var center = view.center;
var currentFrame;
var bnwCanvas = document.getElementById('bnwCanvas');
var contextB = bnwCanvas.getContext('2d');
var blocks = [];
var okGo = false;
var sizeCounter = 15;
var counter = 0;

function getStream() {
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
 				video.src = window.URL.createObjectURL(localMediaStream);
 				video.onloadedmetadata = function(e) {
 					setTimeout(function(){ 
 						okGo = true;
 						onFrame(); 
 					}, 2000); 
		    }
			},
	   	function(e){
	   		console.log(e);
	   	}
		);
	}
}

function onFrame(event) {
	var c = canvas.getContext('2d');
	c.save();
	c.scale(-1, 1);
  c.drawImage(video, -width, 0, width, height);
  c.restore();
  currentFrame = c.getImageData(0, 0, width, height);
  
  
  bnwCanvas = contextB.getImageData(0, 0, width, height);
  bnwCanvas.data = currentFrame.data;
  var n = bnwCanvas.data.length;
  for (var i = 0; i < n; i ++) {
  	var grayscale = bnwCanvas.data[i] * 0.3 + bnwCanvas.data[i+1] * 0.59 + bnwCanvas.data[i+2] * 0.11;
    bnwCanvas.data[i  ] = grayscale;        // red
    bnwCanvas.data[i+1] = grayscale;        // green
    bnwCanvas.data[i+2] = grayscale;        // blue
  }

  contextB.putImageData(bnwCanvas, 0, 0);

 	var blocksNum = blocks.length;
	for(var i = 0; i < blocksNum; i ++) {
		blocks[i].update();
	}

	if (blocksNum >= 10000) {
		okGo = false;
		console.log('20000');
	};

	if (okGo) {
		sizeCounter *= 0.9995;
		for (var i = 0; i < 1; i++) {

			var newBlock = new Block();
			blocks.push(newBlock);
		};
		
		/*
		counter += 1;
		if (counter === 5) {
			sizeCounter *= 0.995;
			var newBlock = new Block();
			blocks.push(newBlock);
			counter = 0;
		}
		*/


	}
}

function Block() {
	var randomC = Math.floor(Math.random() * xParts);
	var randomR = Math.floor(Math.random() * yParts);

	var blockCenterX = randomC * xSide + Math.floor(xSide / 2);
	var blockCenterY = randomR * ySide + Math.floor(ySide / 2);

	this.pixelPos = (width * 4) * blockCenterY + blockCenterX * 4; //number
	this.radius = sizeCounter; 
	var topLeft = new Point(blockCenterX - this.radius, blockCenterY - this.radius);
	var rectSize = new Size(this.radius * 2, this.radius * 2);
	var rectangle = new Rectangle(topLeft, rectSize);
	this.path = new Path.Rectangle(rectangle);
}

Block.prototype.update = function() {
	var r = currentFrame.data[this.pixelPos];
	var g = currentFrame.data[this.pixelPos + 1];
	var b = currentFrame.data[this.pixelPos + 2];
	this.path.fillColor = 'rgb('+ r + ',' + g + ',' + b + ')';
}




canvas.width = width;
canvas.height = height;

getStream();