(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
var video = document.getElementById('video');

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

function Canvas(element, width, height) {
	this.width = width;
	this.height = height;
	this.ctx = element.getContext('2d');
}

Canvas.prototype.draw = function() {
	this.ctx.save();
	this.ctx.scale(-1, 1);
	this.ctx.drawImage(video, -this.width, 0, this.width, this.height);
	this.ctx.restore();
};

function onFrame(event) {
	mainCanvas.draw();
	leftTopCanvas.draw();
	leftMid1Canvas.draw();
	leftMid2Canvas.draw();
	leftBotCanvas.draw();

}

var mainCanvas 		= new Canvas(document.getElementById('mainCanvas'), 		 800, 600);
var leftTopCanvas = new Canvas(document.getElementById('leftTopCanvas'),	 200, 150);
var leftMid1Canvas = new Canvas(document.getElementById('leftMid1Canvas'), 100, 75);
var leftMid2Canvas = new Canvas(document.getElementById('leftMid2Canvas'), 100, 75);
var leftBotCanvas = new Canvas(document.getElementById('leftBotCanvas'),	 150, 150);

getStream();