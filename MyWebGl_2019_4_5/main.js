_include('./vertexShader.vsh');
_include('./fragmentShader.fsh');

function setRectangle(/** @type {WebGLRenderingContext} */gl, x, y, width, height) {

    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    // gl.bufferData() 将会影响到当前绑定点`ARRAY_BUFFER`的绑定缓冲
    // 目前只有一个缓冲，如果我们有多个缓冲则需先将所需缓冲绑定到`ARRAY_BUFFER`
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([
            x1, y1,
            x1, y2,
            x2, y2,
            x2, y1,
        ])
        , gl.STATIC_DRAW);
}


function main() {
    console.log('main function');

    const gl = wannaGl('#gl-main');     //声明一个固定的webGL对象
    glTest(gl);                         //对webGL支持进行检测

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader01);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader01);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    //找到shader中属性值‘a_position’的具体位置, 这样才可以传参
    //寻找属性值位置（和全局属性位置）应该在初始化的时候完成，而不是在渲染循环中。
    let positionBuffer = gl.createBuffer();           //属性值从缓冲中取得数据，创建位置缓冲
    //因为webGL可以通过绑定点操控全局数据，被绑定的数据可以通过绑定点访问
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);  //ARRAY_BUFFER是一个绑定点

    //gl.createBuffer创建一个缓冲;
    //gl.bindBuffer是设置缓冲为当前使用缓冲;
    //gl.bufferData将数据拷贝到缓冲，这个操作一般在初始化完成。
    
    //接下来是往绑定了的缓冲区(Buffer)中写入数据的过程

    let positions = [
        0, 0,
        0, 20,
        20, 0,
        20, 20,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    //因为WebGl需要强类型数据，所以创建了一个new Float32Array对象来承载positions的值;
    //gl.bufferData()将数据带到ARRAY_BUFFER中，再由它将数据带到pisitionBuffer
    //最后一个是行为参数，表示不经常改变这些数据，程序会自动对其进行优化。

    //接下来是渲染到屏幕的过程
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);       //设置裁剪空间

    gl.clearColor(0, 0, 0, 0);      //用于清空画布的颜色
    gl.clear(gl.COLOR_BUFFER_BIT);  //指定要清除的缓冲区，其值可能有：gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT

    gl.useProgram(program);         //传递之前编写好的着色程序(在本例中是一个着色器对)

    //下面是解释绑定与传参的具体内容
    gl.enableVertexAttribArray(positionAttributeLocation); //启用之前定义好的属性给vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);        //将缓冲点绑定到绑定点

    let size = 2;           //每次迭代运行提取两个单位数据(一共有3组6个)
    let type = gl.FLOAT;    //每个单位的数据是32位浮点
    let normalize = false;  //不归一化数据
    let stride = 0;         //每次迭代的内存步长; 0 = 单位移动量 * 每个单位占用的内存(sizeof(type))
    let offset = 0;         //从缓冲起始位置开始读取数据
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    //前面已经启用定义好的属性positionAttributeLocation, 
    //此时gl.vertexAttribPointer是将属性绑定到当前的ARRAY_BUFFER
    //也就是说最终属性绑定到了positionBuffer上面。
    //绑定完成之后ARRAY_BUFFER回归自由
    //也就是说已经通过ARRAY_BUFFER完成了positionBuffer对应a_position的绑定。

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height); //全局变量分辨率
    for (let index = 0; index < 50; ++index) {
        // 创建一个随机矩形
        // 并将写入位置缓冲
        // 因为位置缓冲是我们绑定在
        // `ARRAY_BUFFER`绑定点上的最后一个缓冲
        setRectangle(
            gl, randomInt(200), randomInt(200), randomInt(200), randomInt(200)
        );

        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 0.8);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); //这些都要放在vertexAttribPointer之后
        //先执行vertexshader再运行fragmentshader
    }
    //“光栅化”其实就是“用像素画出来” 的花哨叫法。

    // let primitiveType = gl.TRIANGLE_STRIP;         //图元类型(三角形填充)
    // let count = 4;                                  //着色器运行次数
    // gl.drawArrays(primitiveType, offset, count);    //绘制数据的图形

    return console.log('function main exited');
}

