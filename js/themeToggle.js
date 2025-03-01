// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // 检查用户偏好设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
    } else {
        // 检查系统偏好
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.body.className = 'dark-theme';
        }
    }
    
    // 主题切换事件
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('light-theme')) {
            document.body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
        }
    });
} 