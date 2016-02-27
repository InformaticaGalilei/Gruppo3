/*
 *	Fragment e Vertex shader GLSL.
 *	Giulio Zausa
 */

var srcFrag = 
	"void main() { gl_FragColor = vec4(0.749, 0.69, 0.60, 1.0); }";
	
var srcVert =
	"#ifdef GL_ES\n" +
		"precision mediump float;\n" +
	"#endif\n" +
	"attribute vec3 coordinates; uniform float time; uniform vec2 freq, size;\n" +
	"void main() { gl_Position = vec4((2.0 / 3.0) * cos(freq.x * coordinates.x + time), (2.0 / 3.0) * sin(freq.y * coordinates.x), 0.0, 1.0); }";
