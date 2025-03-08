// 主JavaScript入口文件
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化语言切换
    initLanguageToggle();
    
    // 初始化代码复制功能
    initCodeCopy();
    
    // 添加预览容器样式控制
    addPreviewContainerStyles();
    
    // 添加代码容器样式控制
    addCodeContainerStyles();
    
    // 添加内容区域宽度限制
    addContentWidthLimit();
    
    // 添加对预览区域变化的监听
    observePreviewSectionChanges();
    
    // 加载设计模式列表（而不是加载所有示例内容）
    loadSidebarItems();
    
    // 添加加载状态相关的样式
    addLoadingStyles();
    
    // 初始不自动加载任何示例，只显示欢迎信息
    showWelcomeScreen();
});

// 加载侧边栏项目
async function loadSidebarItems() {
    let designTerms;
    try {
        // 只加载设计模式的基本信息
        designTerms = await getDesignTerms();
        if (!designTerms || designTerms.length === 0) {
            console.error('加载设计模式列表失败，使用默认列表');
            designTerms = getDefaultTerms();
        }
    } catch (error) {
        console.error('加载设计模式列表失败:', error);
        designTerms = getDefaultTerms();
    }
    
    // 清空现有内容
    const sidebar = document.getElementById('sidebar-menu');
    sidebar.innerHTML = '';
    
    // 添加设计模式列表到侧边栏
    designTerms.forEach(term => {
        const item = document.createElement('div');
        item.className = 'sidebar-item';
        // 根据当前语言设置显示文本
        const currentLang = getCurrentLanguage();
        item.textContent = currentLang === 'zh' ? (term.nameZh || term.name) : (term.nameEn || term.name);
        item.setAttribute('data-id', term.id);
        
        // 显示加载中状态的内容
        const loadingContent = `
            <div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>${getCurrentLanguage() === 'zh' ? '加载中...' : 'Loading...'}</p>
            </div>
        `;
        
        item.addEventListener('click', async function() {
            // 移除所有活动项的活动状态
            document.querySelectorAll('.sidebar-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // 添加活动状态到当前项
            this.classList.add('active');
            
            // 显示"加载中"状态
            const previewContainer = document.getElementById('preview-container');
            const codeContainer = document.getElementById('code-container');
            previewContainer.innerHTML = loadingContent;
            codeContainer.innerHTML = loadingContent;
            
            const exampleTitle = document.getElementById('example-title');
            exampleTitle.textContent = getCurrentLanguage() === 'zh' ? (term.nameZh || term.name) : (term.nameEn || term.name);
            
            try {
                // 动态加载该设计模式的完整示例
                const example = await loadExampleById(term.id);
                
                // 显示加载的示例
                displayExample(example);
            } catch (error) {
                console.error(`加载示例 ${term.id} 失败:`, error);
                previewContainer.innerHTML = `<div class="preview-error">${getCurrentLanguage() === 'zh' ? '加载失败' : 'Failed to load'}</div>`;
                codeContainer.innerHTML = `<div class="preview-error">${getCurrentLanguage() === 'zh' ? '加载失败' : 'Failed to load'}</div>`;
            }
        });
        
        sidebar.appendChild(item);
    });
}

// 实现loadExamples函数，用于语言切换后刷新侧边栏
function loadExamples() {
    loadSidebarItems();
}

// 显示欢迎屏幕
function showWelcomeScreen() {
    const previewContainer = document.getElementById('preview-container');
    const codeContainer = document.getElementById('code-container');
    const exampleTitle = document.getElementById('example-title');
    
    exampleTitle.textContent = getCurrentLanguage() === 'zh' ? '网页设计效果展示' : 'Web Design Patterns';
    
    const welcomeContent = `
        <div class="welcome-screen">
            <h3>${getCurrentLanguage() === 'zh' ? '欢迎使用网页设计效果展示' : 'Welcome to Web Design Patterns'}</h3>
            <p>${getCurrentLanguage() === 'zh' ? '请从左侧菜单选择一个设计模式查看效果' : 'Please select a design pattern from the sidebar to view'}</p>
            <div class="welcome-icon">
                <i class="fas fa-paint-brush"></i>
            </div>
        </div>
    `;
    
    previewContainer.innerHTML = welcomeContent;
    codeContainer.innerHTML = welcomeContent;
}

// 添加加载样式
function addLoadingStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .loading-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #888;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top-color: var(--accent-color);
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 15px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .welcome-screen {
            text-align: center;
            padding: 50px 20px;
            color: var(--text-secondary);
        }
        
        .welcome-screen h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--text-primary);
        }
        
        .welcome-icon {
            font-size: 3rem;
            margin: 20px 0;
            color: var(--accent-color);
        }
    `;
    document.head.appendChild(styleElement);
}

// 添加全局变量跟踪点击次数和缓存设计模式数据
let clickCounter = 0;
let cachedTermsData = null;

// 修改根据ID加载特定设计模式的完整示例函数
async function loadExampleById(id) {
    try {
        // 动态加载设计模式的HTML代码
        const response = await fetch(`data/examples/${id}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const htmlCode = await response.text();
        
        // 增加计数器
        clickCounter++;
        
        // 标题信息获取策略
        let term;
        
        // 如果是第一次加载或者已经达到10次点击，重新请求terms数据
        if (cachedTermsData === null || clickCounter >= 10) {
            console.log(clickCounter >= 10 ? "已达到10次点击，重新请求设计模式列表" : "初次加载，请求设计模式列表");
            
            // 重置计数器
            if (clickCounter >= 10) {
                clickCounter = 0;
            }
            
            // 请求最新数据
            const termsResponse = await fetch('data/design-terms.json');
            if (!termsResponse.ok) {
                throw new Error(`Terms HTTP error: ${termsResponse.status}`);
            }
            
            // 更新缓存
            cachedTermsData = await termsResponse.json();
            term = cachedTermsData.terms.find(t => t.id === id);
        } else {
            // 使用缓存数据
            console.log(`使用缓存的设计模式列表数据，当前点击计数: ${clickCounter}/10`);
            term = cachedTermsData.terms.find(t => t.id === id);
        }
        
        if (!term) {
            throw new Error(`Term with id ${id} not found`);
        }
        
        // 构造并返回完整的示例对象
        return {
            id: id,
            titleEn: term.nameEn || term.name,
            titleZh: term.nameZh || term.name,
            code: htmlCode
        };
    } catch (error) {
        console.error(`加载设计模式 ${id} 失败:`, error);
        throw error;
    }
}

// 修改获取设计模式列表函数，添加缓存支持
async function getDesignTerms() {
    try {
        // 如果有缓存且不是初始加载，使用缓存
        if (cachedTermsData !== null) {
            console.log("使用缓存的设计模式列表初始化侧边栏");
            return cachedTermsData.terms.filter(term => term.isActive);
        }
        
        // 否则请求新数据
        console.log("初始化时加载设计模式列表");
        const response = await fetch('data/design-terms.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        // 保存到缓存
        cachedTermsData = await response.json();
        return cachedTermsData.terms.filter(term => term.isActive);
    } catch (error) {
        console.error('获取设计模式列表失败:', error);
        return [];
    }
}

// 默认设计模式列表（在加载失败时使用）
function getDefaultTerms() {
    return [
        { id: "glass-morphism", nameEn: "Glass Morphism", nameZh: "玻璃拟态背景", isActive: true },
        { id: "neumorphism", nameEn: "Neumorphism", nameZh: "新拟物化", isActive: true },
        { id: "dark-mode", nameEn: "Dark Mode", nameZh: "深色模式", isActive: true }
    ];
}

// 修改预览容器样式控制函数
function addPreviewContainerStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* CodePen风格的预览区域控制 */
        .preview-section {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            box-sizing: border-box;
            background-color: var(--card-background);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: 20px;
            overflow: hidden;
        }
        
        .preview-container {
            width: 100%;
            position: relative;
            background-color: #f7f7f7;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border: 1px solid #e1e1e1;
        }
        
        /* 预览浏览器顶栏 - CodePen风格 */
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: linear-gradient(to bottom, #f9f9f9, #ececec);
            border-bottom: 1px solid #e1e1e1;
        }
        
        .preview-header .browser-dots {
            display: flex;
            gap: 5px;
        }
        
        .preview-header .browser-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .preview-header .browser-dot.red { background-color: #ff5f57; }
        .preview-header .browser-dot.yellow { background-color: #ffbd2e; }
        .preview-header .browser-dot.green { background-color: #28c941; }
        
        .preview-header .browser-address {
            flex-grow: 1;
            margin: 0 10px;
            background-color: white;
            border-radius: 4px;
            padding: 4px 10px;
            font-size: 12px;
            color: #999;
            text-align: center;
            border: 1px solid #ddd;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .preview-header .browser-actions {
            display: flex;
            gap: 8px;
        }
        
        .preview-header .action-button {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 14px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        
        .preview-header .action-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        /* iframe相关样式 */
        #preview-iframe {
            width: 100%;
            height: 500px;
            border: none;
            display: block;
            background-color: white;
            transition: height 0.3s ease, transform 0.3s ease;
        }
        
        /* 视口控制 - CodePen风格 */
        .preview-viewport-controls {
            display: flex;
            justify-content: center;
            padding: 10px;
            background-color: #f1f1f1;
            border-top: 1px solid #e1e1e1;
        }
        
        .preview-viewport-controls button {
            border: none;
            background: #e1e1e1;
            color: #666;
            padding: 5px 10px;
            margin: 0 5px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .preview-viewport-controls button:hover {
            background-color: #d1d1d1;
        }
        
        .preview-viewport-controls button.active {
            background-color: #444;
            color: white;
        }
        
        /* 错误提示样式 */
        .preview-error {
            padding: 20px;
            color: #d32f2f;
            background-color: #fbe9e7;
            border-radius: 4px;
            text-align: center;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .preview-section {
                padding: 10px;
            }
            
            #preview-iframe {
                height: 400px;
            }
            
            .preview-header .browser-address {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// 修改显示示例函数，使用CodePen风格的iframe预览
function displayExample(example) {
    const codeContainer = document.getElementById('code-container');
    const previewContainer = document.getElementById('preview-container');
    const exampleTitle = document.getElementById('example-title');
    
    // 设置标题 - 确保使用当前语言
    const currentLang = getCurrentLanguage();
    exampleTitle.textContent = currentLang === 'zh' ? example.titleZh : example.titleEn;
    
    // 设置代码
    codeContainer.innerHTML = '';
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-html';
    code.textContent = example.code;
    pre.appendChild(code);
    codeContainer.appendChild(pre);
    
    // 添加复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = `<i class="fas fa-copy"></i>`;
    copyButton.setAttribute('data-code', example.code);
    codeContainer.appendChild(copyButton);
    
    // 设置代码容器的宽度限制
    const codeContainerWidth = codeContainer.offsetWidth;
    if (codeContainerWidth > 0) {
        pre.style.maxWidth = `${codeContainerWidth}px`;
    }
    
    // 清空预览容器
    previewContainer.innerHTML = '';
    
    // 创建CodePen风格的预览容器结构
    // 1. 添加浏览器标题栏
    const previewHeader = document.createElement('div');
    previewHeader.className = 'preview-header';
    previewHeader.innerHTML = `
        <div class="browser-dots">
            <div class="browser-dot red"></div>
            <div class="browser-dot yellow"></div>
            <div class="browser-dot green"></div>
        </div>
        <div class="browser-address">
            ${currentLang === 'zh' ? '预览：' : 'Preview: '}
            ${currentLang === 'zh' ? example.titleZh : example.titleEn}
        </div>
        <div class="browser-actions">
            <button class="action-button refresh-button" title="${currentLang === 'zh' ? '刷新预览' : 'Refresh Preview'}">
                <i class="fas fa-sync-alt"></i>
            </button>
            <button class="action-button open-button" title="${currentLang === 'zh' ? '在新窗口打开' : 'Open in New Window'}">
                <i class="fas fa-external-link-alt"></i>
            </button>
        </div>
    `;
    previewContainer.appendChild(previewHeader);
    
    // 2. 创建iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    previewContainer.appendChild(iframe);
    
    // 3. 添加视口控制按钮
    const viewportControls = document.createElement('div');
    viewportControls.className = 'preview-viewport-controls';
    viewportControls.innerHTML = `
        <button class="viewport-button active" data-width="100%">
            <i class="fas fa-desktop"></i> ${currentLang === 'zh' ? '桌面' : 'Desktop'}
        </button>
        <button class="viewport-button" data-width="768px">
            <i class="fas fa-tablet-alt"></i> ${currentLang === 'zh' ? '平板' : 'Tablet'}
        </button>
        <button class="viewport-button" data-width="375px">
            <i class="fas fa-mobile-alt"></i> ${currentLang === 'zh' ? '手机' : 'Mobile'}
        </button>
    `;
    previewContainer.appendChild(viewportControls);
    
    // 添加视口控制功能
    const viewportButtons = viewportControls.querySelectorAll('.viewport-button');
    viewportButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewportButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const width = this.getAttribute('data-width');
            iframe.style.width = width;
            
            if (width !== '100%') {
                iframe.style.margin = '0 auto';
                iframe.style.display = 'block';
                iframe.style.transform = 'scale(1)';
            }
        });
    });
    
    // 添加刷新按钮功能
    const refreshButton = previewHeader.querySelector('.refresh-button');
    refreshButton.addEventListener('click', function() {
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => {
            loadIframeContent(iframe, example.code);
        }, 50);
    });
    
    // 添加在新窗口打开按钮功能
    const openButton = previewHeader.querySelector('.open-button');
    openButton.addEventListener('click', function() {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${getCurrentLanguage() === 'zh' ? example.titleZh : example.titleEn}</title>
                    <style>
                        body { 
                            margin: 0;
                            padding: 20px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                            line-height: 1.5;
                        }
                        * {
                            max-width: 100%;
                            box-sizing: border-box;
                        }
                        img, video, iframe, table {
                            max-width: 100%;
                            height: auto;
                        }
                    </style>
                </head>
                <body>
                    ${example.code}
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    });
    
    // 加载iframe内容
    loadIframeContent(iframe, example.code);
    
    // 高亮代码
    if (window.Prism) {
        Prism.highlightAll();
    }
}

// 辅助函数：加载iframe内容
function loadIframeContent(iframe, code) {
    // 等待iframe加载完成后写入内容
    iframe.onload = function() {
        try {
            // 访问iframe的文档对象
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // 设置iframe内容，添加基本样式和重置
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        /* CodePen样式的基础重置 */
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                            line-height: 1.5;
                            color: #333;
                        }
                        
                        /* 确保内容不超出iframe */
                        * {
                            max-width: 100%;
                            box-sizing: border-box;
                        }
                        
                        /* 响应式图片、视频等 */
                        img, video, iframe, table {
                            max-width: 100%;
                            height: auto;
                        }
                    </style>
                    <script>
                    // Wrap language handling in an IIFE to avoid variable conflicts
                    (function() {
                        // Language handling
                        function updateElementsLanguage(lang) {
                            document.querySelectorAll('[data-zh][data-en]').forEach(el => {
                                el.textContent = el.getAttribute('data-' + lang);
                            });
                        }

                        // Check the language when loaded
                        document.addEventListener('DOMContentLoaded', function() {
                            const lang = document.documentElement.getAttribute('lang') || 'zh';
                            updateElementsLanguage(lang);
                        });

                        // Listen for language changes
                        const langObserver = new MutationObserver(function(mutations) {
                            mutations.forEach(function(mutation) {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                                    const lang = document.documentElement.getAttribute('lang') || 'zh';
                                    updateElementsLanguage(lang);
                                }
                            });
                        });

                        langObserver.observe(document.documentElement, { attributes: true });
                    })();
                    </script>
                </head>
                <body>
                    ${code}
                </body>
                </html>
            `);
            iframeDoc.close();
            
            // 添加iframe内部文档的事件处理
            iframeDoc.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止事件冒泡到父页面
            });
            
        } catch (error) {
            console.error('无法设置iframe内容:', error);
            iframe.parentElement.innerHTML = '<div class="preview-error">无法加载预览</div>';
        }
    };
    
    // 触发onload
    if (iframe.contentDocument) {
        iframe.onload();
    }
}

// 初始化时添加代码容器的样式控制
function addCodeContainerStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .code-container {
            max-width: 100% !important;
            overflow: hidden;
        }
        
        .code-container pre {
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
        }
    `;
    document.head.appendChild(styleElement);
}

// 添加内容区域宽度限制的函数
function addContentWidthLimit() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 30px;
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
        }
        
        @media (max-width: 1200px) {
            .content {
                max-width: 100%;
            }
        }
        
        /* 移除对preview-section的样式设置，避免冲突 */
        .code-section {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }
        
        .example-title {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(styleElement);
    
    // 获取当前内容区域并设置最大宽度
    const contentSection = document.querySelector('.content');
    if (contentSection) {
        contentSection.style.maxWidth = '1000px';
    }
    
    // 直接为预览区域设置内联样式，确保其宽度受限
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) {
        previewSection.style.cssText = `
            width: 100%;
            max-width: 900px !important;
            margin: 0 auto !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        `;
    }
}

// 确保在窗口调整大小时也保持内容区域限制
window.addEventListener('resize', function() {
    // 重新计算和应用代码容器宽度
    const codeContainers = document.querySelectorAll('.code-container pre');
    codeContainers.forEach(pre => {
        const container = pre.closest('.code-container');
        if (container) {
            const width = container.offsetWidth;
            pre.style.maxWidth = `${width}px`;
        }
    });
    
    // 预览容器宽度保持固定，不再随窗口变化
    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
        // 确保预览容器自身也保持固定宽度
        previewContainer.style.width = '860px';
        previewContainer.style.maxWidth = '100%';
        
        const contentWrapper = previewContainer.querySelector('.preview-content-wrapper');
        if (contentWrapper) {
            // 使用固定宽度，不再随容器变化
            contentWrapper.style.width = '820px';
            contentWrapper.style.maxWidth = '100%';
        }
    }
});

// 添加DOM变化监听，确保新增的预览区域也应用宽度限制
function observePreviewSectionChanges() {
    // 创建一个MutationObserver实例
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const previewSection = document.querySelector('.preview-section');
                if (previewSection && !previewSection.hasAttribute('data-width-applied')) {
                    previewSection.style.cssText = `
                        width: 100%;
                        max-width: 900px !important;
                        margin: 0 auto !important;
                        overflow: hidden !important;
                        box-sizing: border-box !important;
                    `;
                    previewSection.setAttribute('data-width-applied', 'true');
                }
            }
        });
    });
    
    // 观察整个文档的变化
    observer.observe(document.body, { childList: true, subtree: true });
} 