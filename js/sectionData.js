var cacheData;

// Create socket object for section-2 canvas
var sectionDataSocket = io.connect('http://localhost:8888/data/sectiondata');

// Call respective section draw functions on successful socket sonnection
sectionDataSocket.on('connect', function(){
				
	sectionDataSocket.on('initialData', function(data){
		cacheData = data;
		mapInitalDataToCanvas(data);
	});
	
	sectionDataSocket.on('selectiveData', function(data){		
		mapSelectiveDataToCanvas(data);
	});
	
});


function mapInitalDataToCanvas(data){	
	for(var i = 0; i < data.length; i++){	
		var cnv = document.getElementById(data[i].sectionid);		
		drawSection(cnv, data[i]);
	}
}

function mapSelectiveDataToCanvas(data){
	for(var i = 0; i < data.length; i++){	
		var cnv = document.getElementById(data[i].sectionid);		
		drawSection(cnv, data[i]);
		
		if(i < (data.length - 1)){
			if(data[i].sectiondata > cacheData[i].sectiondata){
				highlightCanvas(cnv, true);	
			}
			if(data[i].sectiondata < cacheData[i].sectiondata){
				highlightCanvas(cnv, false);	
			}
		}
		
	}
	cacheData = data;
}


function drawSection(canvas, mappedData){
	var context = canvas.getContext('2d');	
	context.clearRect(0 , 0, canvas.width, canvas.height); // Clear the canvas each time for re-drawing
	
	var centerX = Math.floor(canvas.width / 2);
	var centerY = Math.floor(canvas.height / 2);	
	
	// Set the section header text for each sections
	context.beginPath();								
	context.font = "10pt Arial";
	context.fillStyle = "#000000";
	context.fillText(mappedData.sectionText, Math.floor(canvas.width * 0.25) - 30, Math.floor(canvas.height * 0.25));
	context.closePath();
	
	// Set the section header text for each sections
	context.beginPath();								
	context.font = "10pt Arial";
	context.fillStyle = "#666666";
	context.fillText(mappedData.sectiondata, Math.floor(canvas.width * 0.75) + 30, Math.floor(canvas.height * 0.25));
	context.closePath();
	
	// Draw the blue circles
	context.beginPath();
	context.fillStyle = "#93C4DE";			
	var limit = mappedData.sectiondata;
	var endX = 14;
	var endY = centerY;
	var i;
	
	// Draw upto canvas width ( leaving a certain gap ) and then exit this loop when endX value exceeds canvas width
	for(i = 0; i < limit; i++){						
		if(endX < (canvas.width - 28)){
			endX = 14 + (14 * i);
			context.arc(endX, endY, 5, 0, 2*Math.PI, false);
		}else{
			endX = 14;
			break;
		}
	}
	
	// Start from initial X-axis value but a lower Y-axis value
	for(j = 0; j < (limit-i); j++){
		endX = 14 + (14 * j);
		context.arc(endX, endY+14, 5, 0, 2*Math.PI, false);
	}
	
	context.fill();	
	context.closePath();
}

function highlightCanvas(canvas, incFlag){
	// Animate the canvas background
	var animateColor = !incFlag ? '#ff8888' : '#88ff88';
	
	jQuery(canvas).animate({'background-color':animateColor}, 
	600, 
	function(){
		$(this).animate({'background-color':'#ffffff'}, 600);
	});
}