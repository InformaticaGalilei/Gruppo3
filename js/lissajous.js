/*
 *	Funzioni per il calcolo di una curva di Lissajous dati i parametri.
 *	Giulia Scocco
 */
 
function lissajous(t, p)
{
  var x = 200 * Math.cos(app.fx * t + p) + 256;
  var y = 256 - (200 * Math.sin(app.fy * t));
  return { x, y };
}
