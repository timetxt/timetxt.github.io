// 语言切换功能
function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const languageText = languageToggle.querySelector('.lang-text');
    
    // 检查用户偏好设置
    const savedLanguage = localStorage.getItem('language') || 'zh';
    setLanguage(savedLanguage);
    
    // 语言切换事件
    languageToggle.addEventListener('click', function() {
        const currentLang = getCurrentLanguage();
        const newLang = currentLang === 'zh' ? 'en' : 'zh';
        
        // 切换语言
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        
        // 重新加载侧边栏
        if (typeof loadExamples === 'function') {
            loadExamples();
        }
        
        // 更新欢迎屏幕信息
        updateWelcomeScreen();
        
        // 如果有活动项，重新显示它
        const activeItem = document.querySelector('.sidebar-item.active');
        if (activeItem) {
            activeItem.click();
        }
    });
}

// 设置语言
function setLanguage(lang) {
    const languageToggle = document.getElementById('language-toggle');
    const languageText = languageToggle.querySelector('.lang-text');
    
    document.documentElement.setAttribute('lang', lang);
    // 切换按钮显示另一种语言选项
    languageText.textContent = lang === 'zh' ? 'EN' : '中文';
    
    // 更新所有带有 data-en 和 data-zh 属性的元素
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    // 更新界面中其他需要根据语言变化的元素
    updateInterfaceLanguage(lang);
}

// 更新界面语言
function updateInterfaceLanguage(lang) {
    // 更新页面标题
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        pageTitle.textContent = lang === 'zh' ? '网页设计术语展示' : 'Web Design Terms Demo';
    }
    
    // 更新导航区域
    const navTitle = document.querySelector('.logo-text');
    if (navTitle) {
        navTitle.textContent = lang === 'zh' ? '网页设计术语展示' : 'Web Design Terms';
    }
    
    // 更新欢迎屏幕
    updateWelcomeScreen();
    
    // 其他界面元素更新
    const elementsToUpdate = {
        '.sidebar-title': { zh: '设计术语', en: 'Design Terms' },
        '.code-section-title': { zh: '代码示例', en: 'Code Example' },
        '.preview-section-title': { zh: '预览效果', en: 'Preview' },
        '.theme-toggle-label': { zh: '主题', en: 'Theme' }
    };
    
    // 更新各个元素
    for (const [selector, texts] of Object.entries(elementsToUpdate)) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = texts[lang];
        }
    }
}

// 更新欢迎屏幕
function updateWelcomeScreen() {
    const previewContainer = document.getElementById('preview-container');
    const codeContainer = document.getElementById('code-container');
    
    // 如果当前显示的是欢迎屏幕，更新其内容
    if (previewContainer && previewContainer.querySelector('.welcome-screen')) {
        const lang = getCurrentLanguage();
        const welcomeContent = `
            <div class="welcome-screen">
                <h3>${lang === 'zh' ? '欢迎使用网页设计效果展示' : 'Welcome to Web Design Patterns'}</h3>
                <p>${lang === 'zh' ? '请从左侧菜单选择一个设计模式查看效果' : 'Please select a design pattern from the sidebar to view'}</p>
                <div class="welcome-icon">
                    <i class="fas fa-paint-brush"></i>
                </div>
            </div>
        `;
        
        previewContainer.innerHTML = welcomeContent;
        if (codeContainer) {
            codeContainer.innerHTML = welcomeContent;
        }
        
        const exampleTitle = document.getElementById('example-title');
        if (exampleTitle) {
            exampleTitle.textContent = lang === 'zh' ? '网页设计效果展示' : 'Web Design Patterns';
        }
    }
}

// 获取当前语言
function getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'zh';
} 