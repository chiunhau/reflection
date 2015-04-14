(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


	var canvas = document.getElementById('sourceCanvas');
	var video = document.getElementById('video');
	var width = $(window).width();
		var height = $(window).height();	
	var xParts = 300;
	var yParts = 200;
	var xSide = Math.floor(width / xParts);
	var ySide = Math.floor(height / yParts);
	var center = view.center;
	var currentFrame;
	var counter = 0;
	var blocks = [];


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
 						onFrame(); 
 					}, 1000);
		      
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

	var blocksNum = blocks.length;
	for(var i = 0; i < blocksNum; i ++) {
		blocks[i].update();
	}

	if (okGO) {
		var newBlock = new Block();
		blocks.push(newBlock);
	}
	

	
}

function Block() {
	var randomC = Math.floor(Math.random() * xParts);
	var randomR = Math.floor(Math.random() * yParts);

	var blockCenterX = randomC * xSide + Math.floor(xSide / 2);
	var blockCenterY = randomR * ySide + Math.floor(ySide / 2);

	this.pixelPos = (width * 4) * blockCenterY + blockCenterX * 4; //number
	this.radius = 50;
	this.path = new Path.Circle(new Point(blockCenterX, blockCenterY), 20);
}

Block.prototype.update = function() {
	var r = currentFrame.data[this.pixelPos];
	var g = currentFrame.data[this.pixelPos + 1];
	var b = currentFrame.data[this.pixelPos + 2];
	this.path.fillColor = 'rgb('+ r + ',' + g + ',' + b + ')';
	console.log("ha");
}




canvas.width = width;
canvas.height = height;

getStream();