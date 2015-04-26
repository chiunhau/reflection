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

Canvas.prototype.crop = function(left, top, width, height) {
	this.ctx.save();
	this.ctx.scale(-1, 1);
	this.ctx.drawImage(video, left, top, width, height, -this.width , 0, width, height);
	this.ctx.restore();
}

function onFrame(event) {
	mainCanvas.draw();
	leftTopCanvas.draw();
	leftMid1Canvas.draw();
	leftMid2Canvas.draw();
	leftBot1Canvas.draw();
	leftBot2Canvas.draw();
	//rightCanvas.crop(400, 0, 200,600);

}

var mainCanvas 		 = new Canvas(document.getElementById('mainCanvas'),800, 600);
var leftTopCanvas  = new Canvas(document.getElementById('leftTopCanvas'),	 200, 150);
var leftMid1Canvas = new Canvas(document.getElementById('leftMid1Canvas'), 100, 75);
var leftMid2Canvas = new Canvas(document.getElementById('leftMid2Canvas'), 100, 75);
var leftBot1Canvas  = new Canvas(document.getElementById('leftBot1Canvas'),	 150, 150);
var leftBot2Canvas  = new Canvas(document.getElementById('leftBot2Canvas'),	 150, 60);

getStream();