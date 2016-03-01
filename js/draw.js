/*
 *	Funzioni per il disegno della curva e animazione.
 *	Nicola Marigo
 */

// X NICO: Qui hai la funzione da cui partire, questa viene eseguita quando apri la pagina
// Fai in modo che chiami un'altra funzione per disegnare con il ciclo che ti ho spiegato

function startAnimation()
{
	app.ctx.lineWidth = 2;
	app.ctx.strokeStyle = "blue";
	var p = 0.0;
	while (true) {
		frame (p);
		p += app.speed;
	}
}

function frame(p)
{
	app.ctx.clearRect(0, 0, 512, 512);
	app.ctx.beginPath();
	var coord0 = lissajous(0, p);
	app.ctx.moveTo(coord0.x, coord0.y);
	for (t=0; t<2*Math.pi; t += 0.05) {
		var coord = lissajous(t, p);
		app.ctx.lineTo(coord.x, coord.y);
	}
	app.ctx.stroke();
}
