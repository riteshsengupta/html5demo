// Create socket object for section-1 canvas
var gaugeDataSocket = io.connect('http://localhost:8888/data/gaugedata');


// Call respective draw functions on successful socket sonnection
gaugeDataSocket.on('connect', function(){				
	gaugeDataSocket.on('gaugedata', function(data){		
		drawGaugeArc(data);
		drawRectangleChart(data);
	});
});


function drawGaugeArc(data){
			
	var canvas = document.getElementById('testCanvas');
	var context = canvas.getContext('2d');
	
	var centerX = Math.floor(canvas.width / 2);
	var centerY = Math.floor(canvas.height * 0.75);
	
	var radius	= 46;				
	var lineWidth = 58;
	
	var startAngle = 1 * Math.PI;
	var endAngle = 2 * Math.PI;
	
	var clockArc = 1 + data.clock/100 ;
	var counterClockArc = 1 + data.counterclock / 100;
	
	context.clearRect(0 , 0, canvas.width, canvas.height); // Clear the canvas each time for re-drawing
					
	// Draw the blue arc
	context.beginPath();				
	context.lineWidth = lineWidth;				
	context.arc(centerX, centerY, radius, startAngle, clockArc*Math.PI, false);				
	context.strokeStyle = "#93C4DE"; 
	context.stroke();
	context.closePath();
	
	// Draw the grey arc
	context.beginPath();				
	context.lineWidth = lineWidth;									
	context.arc(centerX, centerY, radius, clockArc*Math.PI, endAngle, false);				
	context.strokeStyle = "#E0E0E0"; 
	context.stroke();
	context.closePath();
	
	
	// Place the "0" marker at the far left corner
	context.beginPath();
	context.font = "10pt Helvetica";
	context.fillStyle = "#666666";
	context.fillText("30-Day Min", (centerX-radius)-(lineWidth-5), centerY+40);	
	context.closePath();
	
	context.beginPath();
	context.font = "bold 10pt Helvetica";
	context.fillStyle = "#000000";
	context.fillText("0", (centerX-radius)-(lineWidth-5), centerY+60);	
	context.closePath();
	
	// Place the "100" marker at the far right corner
	context.beginPath();
	context.font = "10pt Helvetica";
	context.fillStyle = "#666666";	
	context.fillText("30-Day Max", (centerX+radius)-15, centerY+40);	// 231 = centerX+lineWidth+Math.floor(radius / 2)
	context.closePath();
	
	context.beginPath();
	context.font = "bold 10pt Helvetica";
	context.fillStyle = "#000000";
	context.fillText((data.clock + data.counterclock), (centerX+radius)-15, centerY+60);	
	context.closePath();
	
	
	// Set the clock value obtained from the data to the marker co-ordinates obtained above
	context.beginPath();								
	context.font = "40pt Arial bold";
	context.fillStyle = "#000000";
	context.fillText(data.clock, 18, 55);
	context.closePath();
	
	// Draw the pointer hand image
	var rotationAngle = clockArc*Math.PI - (0.5*Math.PI);
									
	context.save();
	var img = new Image();
	img.src = "images/pointer-flip.PNG";				
	context.translate(centerX , centerY);
	context.rotate(rotationAngle);				
	context.drawImage(img, -5, -1);
	context.restore();
	
}

function drawRectangleChart(data){
	var canvas = document.getElementById('rectangleChart');
	var context = canvas.getContext('2d');
	
	context.clearRect(0 , 0, canvas.width, canvas.height); // Clear the canvas each time for re-drawing
	
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;
	
	// Considering there will be 40 rectangles to plot
	var newVisitData = Math.floor((data.clock / (data.clock + data.counterclock)) * 40 );
	var returningVisitData = 40 - newVisitData;
	var rectWidth = 3;
	var rectHeight = 12;
	var newRectColor = "#00008B";
	var recturnRectColor = "#ADD8E6";
	var endX = 0;
	
	// Draw the new visit rectangles
	context.beginPath();								
	context.fillStyle = newRectColor;
	for(var i = 0; i <= newVisitData; i++){										
		endX = 5+(5*i);
		context.rect(endX  , centerY, rectWidth, rectHeight);					
	}				
	context.fill();	
	context.closePath();
	
	// Draw the retunring visits rectangles 
	context.beginPath();
	context.fillStyle = recturnRectColor;
	for(var i = 0; i <= returningVisitData; i++){					
		context.rect(endX +(5+(5*i)), centerY, rectWidth, rectHeight)
	}
	context.fill();
	context.closePath();
	
	// Add the marker text and values to the left and right
	context.beginPath();
	context.font = "10pt Helvetica";
	context.fillStyle = "#666666";
	context.fillText("New", centerX - 100, centerY+30);	
	context.closePath();
	
	context.beginPath();
	context.font = "bold 10pt Helvetica";
	context.fillStyle = "#000000";
	context.fillText(data.clock, centerX-100, centerY+50);	
	context.closePath();
	
	context.beginPath();
	context.font = "10pt Helvetica";
	context.fillStyle = "#666666";
	context.fillText("Returning", centerX + 40, centerY+30);	
	context.closePath();
	
	context.beginPath();
	context.font = "bold 10pt Helvetica";
	context.fillStyle = "#000000";
	context.fillText(data.counterclock, centerX + 40, centerY+50);	
	context.closePath();
	
}
