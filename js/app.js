/*
 *	Funzioni per l'interfaccia grafica.
 *	Giulio Zausa
 */

var app = 
{
	init: function()
	{
		this.canvas = document.getElementById("drawingCanvas"),
		this.ctx = this.canvas.getContext("2d"),
		
		this.fx = 1,
		this.fy = 1,
		this.speed = 5,
		
		startAnimation();
	}
}
