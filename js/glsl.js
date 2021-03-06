/*
 *	Fragment e Vertex shader GLSL.
 *	Giulio Zausa
 */

var srcFrag =
	"#ifdef GL_ES\n" +
		"precision mediump float;\n" +
	"#endif\n" +
	"uniform vec3 color;\nvoid main() { gl_FragColor = vec4(color, 1.0); }";
	
var srcVert =
	"#ifdef GL_ES\n" +
		"precision mediump float;\n" +
	"#endif\n" +
	"attribute vec3 coordinates; uniform float time; uniform vec2 freq, size;\n" +
	"void main() { gl_Position = vec4((7.0 / 10.0) * cos(freq.x * coordinates.x + time), (7.0 / 10.0) * sin(freq.y * coordinates.x), 0.0, 1.0); }";
