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
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        
        // 重新加载侧边栏
        loadExamples();
        
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
    languageText.textContent = lang === 'zh' ? 'EN' : '中文';
    
    // 更新所有带有 data-en 和 data-zh 属性的元素
    document.querySelectorAll('[data-en][data-zh]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

// 获取当前语言
function getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'zh';
} 