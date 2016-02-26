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
		this.elementSpeed = document.getElementById("Speed");
		
		this.fx = parseFloat(this.elementFx.value);
		this.fy = parseFloat(this.elementFy.value);
		this.speed = parseFloat(this.elementSpeed.value);
		
		// Controlla se è attivata l'HWA
		var getVars = parseGetVars(), gl;
		try { gl = this.canvas.getContext("webgl"); }
		catch (x) { gl = null; }
		if (getVars["hw"] == "false" || gl == null) {
			this.hwAccel = false;
			this.initNoHW();
		} else {
			this.hwAccel = true;
			var label = document.getElementById("hwLabel");
			label.innerHTML = "Disabilita accelerazione hardware";
			label.href = "?hw=false";
			this.initHW();
		}
	},
	
	initNoHW: function()
	{
		// Init senza HWA
		this.ctx = this.canvas.getContext("2d");
		startAnimation();
	},
	
	initHW: function()
	{
		// Crea il context e il dt
		this.gl = this.canvas.getContext("webgl", { antialias: true});
		this.timerStart = Date.now();
		
		// Crea index e vertex buffer
		this.vertices = [-1,1,0.0, -1,-1,0.0, 1,-1,0.0, 1,1,0.0];
		this.indices = [3,2,1,3,1,0];
		this.vertex_buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.Index_Buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		
		// Carica shaders
		var vertCode =document.getElementById("vert").textContent;
		var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.gl.shaderSource(vertShader, vertCode);
		this.gl.compileShader(vertShader);
		var fragCode = document.getElementById("frag").textContent;
        var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.gl.shaderSource(fragShader, fragCode);
		this.gl.compileShader(fragShader);
		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertShader);
		this.gl.attachShader(this.shaderProgram, fragShader);
		this.gl.linkProgram(this.shaderProgram);
		this.locationOfTime = this.gl.getUniformLocation(this.shaderProgram, "time");
		this.locationOfSize = this.gl.getUniformLocation(this.shaderProgram, "size");
		this.locationOfFreq = this.gl.getUniformLocation(this.shaderProgram, "freq");
		this.gl.useProgram(this.shaderProgram);
		this.gl.uniform1f(this.locationOfTime, 0);
		this.gl.uniform2f(this.locationOfSize, this.canvas.width, this.canvas.height);
		this.gl.uniform2f(this.locationOfFreq, this.fx, this.fy);
		console.log(this.gl.getShaderInfoLog(fragShader));
		
		// Associa shaders ai buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);
		var coord = this.gl.getAttribLocation(this.shaderProgram, "coordinates");
		this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(coord);
		
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		
		this.drawLoop = window.setInterval(HWDrawLoop, (1.0 / 40.0) * 1000.0);
	}
}

function HWDrawLoop()
{
	// Disegna
	app.gl.uniform1f(app.locationOfTime, (Date.now() - app.timerStart) / 5000.0 * app.speed);
	app.gl.uniform2f(app.locationOfFreq, app.fx, app.fy);
	app.gl.drawElements(app.gl.TRIANGLES, app.indices.length, app.gl.UNSIGNED_SHORT,0);
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
