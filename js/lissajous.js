/*
 *	Funzioni per il calcolo di una curva di Lissajous dati i parametri.
 *	Giulia Scocco
 */
 
function lissajous(t, p)
{
  var x = 250 * Math.cos(app.fx*t + p) + 250;
  var y = 250 - 250 * Math.sin(app.fy*t);
  return { x, y };
}
