function nextPass(sat, homelongitude, homelatitude, callback)
{
var items;
	$.get("/inc/all.php", function(data) {
	  items = data.split('\n');
	  for(var i=0;i<items.length;i++)
	  {
		var line = items[i];
		if(line[0]=="1")
		  {
			var satid = parseInt(line.substr(2,5));
			if(satid==sat)
			{
				var line1 = items[i];
				var line2 = items[i+1];
				var satrec = satellite.twoline2satrec(line1, line2);
				var nnow = new Date();
				var msec = nnow.getTime();
				var el = 0;
				var maxFound = false;
				var startPass;
				var endPass;
				for (t=msec; t<msec+1000*24*3600;t=t+10000)
				{
					var now = new Date(t);
					var positionAndVelocity = satellite.propagate(
						satrec,
						now.getUTCFullYear(),
						now.getUTCMonth() + 1, 
						now.getUTCDate(),
						now.getUTCHours(),
						now.getUTCMinutes(),
						now.getUTCSeconds()
					);

					var positionEci = positionAndVelocity.position,
					velocityEci = positionAndVelocity.velocity;

					var gmst = satellite.gstimeFromDate(
					now.getUTCFullYear(),
					now.getUTCMonth() + 1, 
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds()
					);

					var deg2rad = Math.PI/180;
					var observerGd = {
					longitude: homelongitude * deg2rad,
					latitude: homelatitude * deg2rad,
					height: 0
					};

					try	{ var positionEcf   = satellite.eciToEcf(positionEci, gmst); }
					catch (err){}
					
					var lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf);
					var dopplerFactor = 0;
					var azimuth   = lookAngles.azimuth,
					elevation = lookAngles.elevation,
					rangeSat  = lookAngles.rangeSat;

					azimuth1 =  azimuth*180/Math.PI;
					elevation1 =  elevation*180/Math.PI;

					if (t==msec)
					{
						el = elevation1;
					}
					if((elevation1>5) || (maxFound))
					{
						if(!maxFound) 
						{
							startPass = now;
							maxFound = true;
						}
						else if(elevation1<=5) 
						{
							endPass = now;
							//console.log(startPass + ' ' + endPass);
							callback ({startPass:startPass, endPass:endPass});
							break;
						}


	
					}
				}
				break;
			}
		  }
	  }
	});
}

function go()
{
nextPass(issid, lng, lat, function(r) {
	startPass = r.startPass;
	endPass = r.endPass;
	//$("#d").html(startPass.getHours()+':'+startPass.getMinutes()+' '+endPass.getHours()+':'+endPass.getMinutes());


// set the date we're counting down to
var startPassMsec = startPass.getTime();
var endPassMsec = endPass.getTime(); 
// variables for time units
var hours, minutes, seconds;
 
// get tag element
var countdown = document.getElementById("countdown");
 
// update the tag with id "countdown" every 1 second
timer = setInterval(function () {
 
    // find the amount of "seconds" between now and target
    var nowMsec = new Date().getTime();
    var seconds_left = (startPassMsec - nowMsec) / 1000;
 
    // do some time calculations
    seconds_left = seconds_left % 86400;
     
    hours = parseInt(seconds_left / 3600);
    seconds_left = seconds_left % 3600;
     
    minutes = parseInt(seconds_left / 60);
    seconds = parseInt(seconds_left % 60);
     
    // format countdown string + set tag value
	if(seconds_left>=0)
	{
		countdown.innerHTML = "<a href='/passes/?s=25544'>ISS will cross your sky</a><br/> in " + hours + "h " + minutes + "m " + seconds + "s";  
	}
	else if (nowMsec<endPassMsec)
	{
		countdown.innerHTML = "<b><span style='color:red'>ISS above horizon now!</span></b>";
	}
	else
	{
		clearInterval(timer);
		go();
	}
 
}, 1000);
});
}