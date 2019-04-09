// "use strict"; //开启严格模式
// /** @type {Document} */ 类型声明

/** @type {HTMLElement} */
function wanna(Element) {
    /** @type {HTMLElement} */
    let mywanna = document.querySelector(Element);
    return mywanna; //返回一个以css选择器为表示的元素
}

/** @type {File} */
function _include(scriptsrc = 'undefined') {
    let appendScript = document.createElement('script'); //创建script元素
    wanna('html').appendChild(appendScript); //新建的script元素在html内
    try { //try catch 错误处理
        appendScript.src = scriptsrc; //新script元素的src是输入的scriptsrc
        if (scriptsrc == undefined) throw 'Illegal include src!'; //抛出指定情况的错误提示
        return console.log('Include' + ': ' + scriptsrc); //打印正常导入后的信息
    } catch (err) {
        console.log(err); //catch不大会用
    }
}

function wannaGl(/** @type {HTMLCanvasElement} */ canvas) {
    /** @type {WebGLRenderingContext} */
    let mygl = wanna(canvas).getContext('webgl');
    return mygl; //返回一个以css选择器为表示的元素(webgl渲染上下文)
}

function glTest(/** @type {HTMLCanvasElement} */glElement) {
    if (!glElement) {
        alert("Unable to initialize WebGL.");
        return;
    } else {
        console.log('WebGL support!');
    }
}

// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
//WebGLRenderingContext webGL渲染上下文（渲染内容）
function createShader(/** @type {WebGLRenderingContext} */gl, /** @type {Number} */type, source) {
    let shader = gl.createShader(type); // 创建指定类型的着色器对象
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        console.log('createShader!');
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return console.log('createShader error!');
}

function createProgram(/** @type {WebGLRenderingContext} */gl, /** @type {WebGLShader} */vertexShader, /** @type {WebGLShader} */fragmentShader) {
    let program = gl.createProgram(); //创建一个名为program的着色程序
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program); //将追加的两个shader link到一个program（着色程序）

    let success = gl.getProgramParameter(program, gl.LINK_STATUS); //获取link的状态
    if (success) {
        console.log('createProgram!');
        return program; //正常link之后提前退出函数
    }

    console.log(gl.getProgramInfoLog(program)); //打印错误
    gl.deleteProgram(program); //删除着色器程序
    return console.log('createProgram error!'); //自己加的返回log（没啥卵用）
}

/** @type {Number} */
function randomInt(/** @type {Number} */range) {
    return Math.floor(Math.random() * range);
}



_include('./main.js'); //避免在HTML中声明main.js