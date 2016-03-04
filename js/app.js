/*
 *	Funzioni per l'interfaccia grafica e il disegno accelerato.
 *	Giulio Zausa
 */

var app = 
{	
	init: function()
	{
		// Crea riferimenti per elementi DOM
		this.canvas = document.getElementById("drawingCanvas");
		this.elementFx = document.getElementById("Fx");
		this.elementFy = document.getElementById("Fy");
		this.vFx = document.getElementById("fxVal");
		this.vFy = document.getElementById("fyVal");
		this.elementSpeed = document.getElementById("Speed");
		this.elementColor = document.getElementById("colorP");
		
		this.fx = parseFloat(this.elementFx.value);
		this.fy = parseFloat(this.elementFy.value);
		this.vFx.innerHTML = this.fx;
		this.vFy.innerHTML = this.fy;
		this.speed = parseFloat(this.elementSpeed.value);
		this.color = this.elementColor.value;
		
		// Controlla se è attivata l'HWA
		var getVars = parseGetVars();
		if (getVars["hw"] == "true") {
			this.hwAccel = true;
			var label = document.getElementById("hwLabel");
			label.innerHTML = "Disabilita accelerazione hardware";
			label.href = "?hw=false";
			this.initHW();
		} else {
			this.hwAccel = false;
			this.initNoHW();
		}
	},
	
	updateColor: function(val)
	{
		this.color = val;
		if (this.hwAccel) {
			var fColor = hexToRgb(color);
			this.gl.uniform2f(this.locationOfColor, fColor[0], fColor[1], fColor[2]);
		}
		else {
			app.ctx.strokeStyle = "#" + this.color;
		}
	},
	
	initNoHW: function()
	{
		// Init senza HWA
		this.ctx = this.canvas.getContext("2d");
		app.ctx.strokeStyle = "#" + this.color;
		app.ctx.lineWidth = 2;
		startAnimation();
	},
	
	initHW: function()
	{
		// Crea il context e il dt
		this.gl = this.canvas.getContext("experimental-webgl", { antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
		this.timerStart = Date.now();
		
		// Crea index e vertex buffer
		this.vertices = [];
		this.indices = [];
		var i = 0;
		for (var t = 0.0; t < (Math.PI * 2.0); t += 0.005) {
			this.vertices.push(t);
			this.vertices.push(0.0);
			this.vertices.push(0.0);
			this.indices.push(i);
			i++;
		}
		this.vertex_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.Index_Buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		
		// Carica shaders
		var vertCode = srcVert;
		var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(vertShader, vertCode);
		this.gl.compileShader(vertShader);
		var fragCode = srcFrag;
		var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(fragShader, fragCode);
		this.gl.compileShader(fragShader);
		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertShader);
		this.gl.attachShader(this.shaderProgram, fragShader);
		this.gl.linkProgram(this.shaderProgram);
		this.gl.useProgram(this.shaderProgram);
		
		// Associa shaders ai buffer e carica variabili
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);
		var coord = this.gl.getAttribLocation(this.shaderProgram, "coordinates");
		this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coord);
		this.locationOfTime = this.gl.getUniformLocation(this.shaderProgram, "time");
		this.locationOfColor = this.gl.getUniformLocation(this.shaderProgram, "color");
		this.locationOfSize = this.gl.getUniformLocation(this.shaderProgram, "size");
		this.locationOfFreq = this.gl.getUniformLocation(this.shaderProgram, "freq");
		this.gl.uniform1f(this.locationOfTime, 0);
		this.gl.uniform2f(this.locationOfSize, this.canvas.width, this.canvas.height);
		this.gl.uniform2f(this.locationOfFreq, this.fx, this.fy);
		var fColor = hexToRgb(color);
		this.gl.uniform2f(this.locationOfColor, fColor[0], fColor[1], fColor[2]);
		
		this.gl.clearColor(0.188, 0.22, 0.25, 0.0);
		//this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		
		this.drawLoop = window.setInterval(HWDrawLoop, 0);//(1.0 / 40.0) * 1000.0);
	}
}

function HWDrawLoop()
{
	// Disegna
	app.gl.clear(app.gl.COLOR_BUFFER_BIT | app.gl.DEPTH_BUFFER_BIT);
	app.gl.uniform1f(app.locationOfTime, (Date.now() - app.timerStart) / 5000.0 * app.speed);
	app.gl.uniform2f(app.locationOfFreq, app.fx, app.fy);
	app.gl.drawElements(app.gl.LINE_LOOP, app.indices.length, app.gl.UNSIGNED_SHORT,0);
}

function parseGetVars()
{
	var args = new Array();
	var query = window.location.search.substring(1);
	if (query) {
		var strList = query.split('&');
		for(var str in strList) {
			var parts = strList[str].split('=');
			args[unescape(parts[0])] = unescape(parts[1]);
		}
	}
	
	return args;
}

function hexToRgb(hex)
{
    var bigint = parseInt(hex, 16);
    var r = ((bigint >> 16) & 255) / 255.0;
    var g = ((bigint >> 8) & 255) / 255.0;
    var b = (bigint & 255) / 255.0;

    return [r, g, b];
}
