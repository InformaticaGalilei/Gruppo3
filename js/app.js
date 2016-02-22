/*
 *	Funzioni per l'interfaccia grafica.
 *	Giulio Zausa
 */

var app = 
{
	onElemChange: function()
	{
		this.fx = parseFloat(this.elementFx.value);
		this.fy = parseFloat(this.elementFy.value);
		this.speed = parseFloat(this.elementSpeed.value);
	},
	
	init: function()
	{
		this.canvas = document.getElementById("drawingCanvas"),
		this.ctx = this.canvas.getContext("2d"),
		
		this.elementFx = document.getElementById("Fx"),
		this.elementFy = document.getElementById("Fy"),
		this.elementSpeed = document.getElementById("Speed"),
		
		this.fx = parseFloat(this.elementFx.value),
		this.fy = parseFloat(this.elementFy.value),
		this.speed = parseFloat(this.elementSpeed.value),
		
		this.onElemChange();
		startAnimation();
	}
}
