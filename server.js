var http = require('http'), io = require('socket.io');

var server = http.createServer(function(req, res){ 	
	res.writeHead(200,{ 'Content-Type': 'text/html' }); 
	res.end('<h1>Hello Socket Lover!</h1>');
});
server.listen(8888);  

var serverSocket = io.listen(server);

// Emit data for the gauge and rectangle chart - section 1
var gaugedata = serverSocket
		.of('/data/gaugedata')
		.on('connection', function(socket){
		
			var sendData = setInterval(function () {            
				var clockData = Math.floor(Math.random()*101);            
				var counterClock = 100 - clockData;			
			
				socket.emit('gaugedata', {
					'clock':clockData,
					'counterclock': counterClock
				});
			}, 1000);					
			
		});

// Emit sectional data - section 2		
var sectiondata = serverSocket
			.of('/data/sectiondata')
			.on('connection', function(socket){
				
				socket.emit('initialData', generateSectionData());
				
				var sendData = setInterval(function () {
				socket.emit('selectiveData', generateSectionData());
			}, 5000);	
			
		});


// Generate random section data			
function generateSectionData(){
	var retObj = new Array();
	var total = 0;
	
	for(var i = 0 ; i < 7; i++){	
		var obj = new Object();
		
		obj.sectionid = "section-"+(i+1);
		obj.sectionText = "Section - "+(i+1);
		obj.sectiondata = Math.floor(Math.random() * 6); // Limit to any random number between 1 and 5 
				
		total += obj.sectiondata;
		retObj.push(obj);
	}
	
	var totalObj = new Object();
	totalObj.sectionid = "overall";
	totalObj.sectionText = "OverAll";
	totalObj.sectiondata = total;
	retObj.push(totalObj);
	
	return retObj;	
}