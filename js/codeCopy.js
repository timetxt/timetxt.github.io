// 代码复制功能
function initCodeCopy() {
    // 使用事件委托，因为复制按钮是动态创建的
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-button')) {
            const copyButton = e.target.closest('.copy-button');
            const code = copyButton.getAttribute('data-code');
            
            // 复制到剪贴板
            navigator.clipboard.writeText(code)
                .then(() => {
                    // 显示成功图标
                    const originalHTML = copyButton.innerHTML;
                    copyButton.innerHTML = `<i class="fas fa-check copy-success"></i>`;
                    
                    // 3秒后恢复原来的图标
                    setTimeout(() => {
                        copyButton.innerHTML = originalHTML;
                    }, 3000);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
        }
    });
} 