// Fragment shader program
const fragmentShader01 = `

precision mediump float; 
// 片断着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）

uniform vec4 u_color;

varying vec2 v_texCoord;


void main() {
    // gl_FragColor是一个片断着色器主要设置的变量

    gl_FragColor = u_color;

    // gl_FragColor = vec4(1, 0, 0.5, 1); 
    // 返回“瑞迪施紫色”
}`;


