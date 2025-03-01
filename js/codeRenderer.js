// 代码渲染功能

// 模拟从服务器获取代码的函数
function fetchCodeFromServer(designType) {
    return new Promise((resolve) => {
        // 这里是模拟异步获取代码的过程
        setTimeout(() => {
            const examples = getExamples();
            const example = examples.find(ex => ex.id === designType);
            resolve(example ? example.code : '// 没有找到相关代码');
        }, 500);
    });
}

// 模拟流式响应渲染
function streamCodeResponse(code, targetElement, callback) {
    let i = 0;
    const speed = 10; // 控制速度
    targetElement.textContent = '';
    
    function typeNextChar() {
        if (i < code.length) {
            targetElement.textContent += code.charAt(i);
            i++;
            setTimeout(typeNextChar, speed);
        } else {
            if (callback) callback();
        }
    }
    
    typeNextChar();
}

// 渲染代码到预览区
function renderCodeToPreview(code, previewElement) {
    previewElement.innerHTML = code;
} 