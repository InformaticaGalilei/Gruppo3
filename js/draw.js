/*
 *	Funzioni per il disegno della curva e animazione.
 *	Nicola Marigo
 */

var p = 0.0;

function startAnimation()
{
	app.ctx.lineWidth = 2;
	app.ctx.strokeStyle = "#30F241";
	setInterval(frame, 10);
}

function frame()
{
	app.ctx.clearRect(0, 0, 512, 512);
	app.ctx.beginPath();
	var coord0 = lissajous(0, p);
	app.ctx.moveTo(coord0.x, coord0.y);
	for (t = 0; t < 2.0 * Math.PI; t += 0.01) {
		var coord = lissajous(t, p);
		app.ctx.lineTo(coord.x, coord.y);
	}
	app.ctx.lineTo(coord0.x, coord0.y);
	app.ctx.stroke();
	p += 0.002 * app.speed;
}
