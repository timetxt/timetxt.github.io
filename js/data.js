// 示例数据加载器

// 获取示例数据的异步函数
async function getExamples() {
    try {
        // 从JSON文件加载设计术语
        const termsResponse = await fetch('data/design-terms.json');
        const termsData = await termsResponse.json();
        
        // 用于存储结果的数组
        let examples = [];
        
        // 为每个术语加载对应的示例代码
        for (const term of termsData.terms) {
            try {
                // 尝试从examples目录加载对应的HTML文件
                const response = await fetch(`data/examples/${term.id}.html`);
                
                if (response.ok) {
                    const htmlContent = await response.text();
                    examples.push({
                        id: term.id,
                        // 兼容新旧格式的JSON
                        titleEn: term.nameEn || term.name, 
                        titleZh: term.nameZh || term.name,
                        code: htmlContent
                    });
                } else {
                    console.warn(`未找到示例文件: ${term.id}.html`);
                }
            } catch (error) {
                console.error(`加载示例 ${term.id} 时出错:`, error);
            }
        }
        
        return examples;
    } catch (error) {
        console.error('加载设计术语数据时出错:', error);
        return []; // 出错时返回空数组
    }
}

// 为兼容现有代码，也提供一个同步版本，返回硬编码的默认示例
function getDefaultExamples() {
    return [
        {
            id: 'glass-morphism',
            titleEn: 'Glass Morphism Background',
            titleZh: '玻璃拟态背景',
            code: `<div class="glass-container">
  <div class="glass-card">
    <h2>Glass Morphism</h2>
    <p>This is a glass morphism effect with a backdrop-filter.</p>
  </div>
</div>

<style>
.glass-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 80%;
  max-width: 400px;
}

.glass-card h2 {
  margin-top: 0;
  color: #333;
}

.glass-card p {
  color: #333;
}
</style>`,
        },
        {
            id: 'neumorphism',
            titleEn: 'Neumorphism Design',
            titleZh: '新拟物化',
            code: `<div class="neumorph-container">
  <div class="neumorph-card">
    <h2>Neumorphism</h2>
    <p>This design mimics physical objects with soft shadows.</p>
  </div>
</div>

<style>
.neumorph-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background-color: #e0e5ec;
  padding: 20px;
}

.neumorph-card {
  border-radius: 20px;
  padding: 20px;
  width: 80%;
  max-width: 400px;
  background: #e0e5ec;
  box-shadow: 20px 20px 60px #bec5d0, -20px -20px 60px #ffffff;
}

.neumorph-card h2 {
  margin-top: 0;
  color: #333;
}

.neumorph-card p {
  color: #666;
}
</style>`,
        },
        {
            id: 'gradient',
            titleEn: 'Gradient Effects',
            titleZh: '渐变效果',
            code: `<div class="gradient-container">
  <div class="gradient-card linear">
    <h3>Linear Gradient</h3>
  </div>
  <div class="gradient-card radial">
    <h3>Radial Gradient</h3>
  </div>
  <div class="gradient-card conic">
    <h3>Conic Gradient</h3>
  </div>
</div>

<style>
.gradient-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 30px;
  background-color: #f8f9fa;
}

.gradient-card {
  width: 200px;
  height: 150px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
}

.gradient-card h3 {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  margin: 0;
}

.linear {
  background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
}

.radial {
  background: radial-gradient(circle, #4facfe 0%, #00f2fe 100%);
}

.conic {
  background: conic-gradient(from 45deg, #ff9a9e, #fad0c4, #fad0c4, #ff9a9e);
}
</style>`,
        },
        {
            id: 'animation',
            titleEn: 'CSS Animation',
            titleZh: 'CSS动画',
            code: `<div class="animation-container">
  <div class="animated-element pulse">Pulse</div>
  <div class="animated-element bounce">Bounce</div>
  <div class="animated-element spin">Spin</div>
  <div class="animated-element fade">Fade</div>
</div>

<style>
.animation-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 30px;
  background-color: #f8f9fa;
}

.animated-element {
  width: 150px;
  height: 100px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  font-weight: bold;
  color: #333;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.spin {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade {
  animation: fade 2s infinite;
}

@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>`,
        },
        {
            id: 'grid-layout',
            titleEn: 'Grid Layout',
            titleZh: '网格布局',
            code: `<div class="grid-container">
  <div class="grid-item header">Header</div>
  <div class="grid-item sidebar">Sidebar</div>
  <div class="grid-item main">Main Content</div>
  <div class="grid-item right">Right Panel</div>
  <div class="grid-item footer">Footer</div>
</div>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main right"
    "footer footer footer";
  gap: 10px;
  height: 400px;
  background-color: #f8f9fa;
  padding: 10px;
}

.grid-item {
  padding: 20px;
  border-radius: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.header {
  grid-area: header;
  background-color: #4285f4;
}

.sidebar {
  grid-area: sidebar;
  background-color: #34a853;
}

.main {
  grid-area: main;
  background-color: #fbbc05;
  color: #333;
}

.right {
  grid-area: right;
  background-color: #ea4335;
}

.footer {
  grid-area: footer;
  background-color: #673ab7;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "right"
      "footer";
  }
}
</style>`,
        },
        {
            id: 'muted-colors',
            titleEn: 'Muted Colors',
            titleZh: '低饱和度配色',
            code: `<div class="muted-container">
  <div class="color-card dusty-blue">
    <div class="color-name">Dusty Blue</div>
    <div class="color-hex">#8DA9C4</div>
  </div>
  <div class="color-card sage-green">
    <div class="color-name">Sage Green</div>
    <div class="color-hex">#B5C9C3</div>
  </div>
  <div class="color-card soft-peach">
    <div class="color-name">Soft Peach</div>
    <div class="color-hex">#EED2CC</div>
  </div>
  <div class="color-card dusty-rose">
    <div class="color-name">Dusty Rose</div>
    <div class="color-hex">#C9ADA7</div>
  </div>
  <div class="color-card taupe">
    <div class="color-name">Taupe</div>
    <div class="color-hex">#A59E8C</div>
  </div>
</div>

<style>
.muted-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: #F5F5F5;
}

.color-card {
  width: 150px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.color-card:hover {
  transform: translateY(-5px);
}

.color-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.color-hex {
  font-family: monospace;
  font-size: 0.9rem;
}

.dusty-blue {
  background-color: #8DA9C4;
  color: white;
}

.sage-green {
  background-color: #B5C9C3;
  color: #333;
}

.soft-peach {
  background-color: #EED2CC;
  color: #333;
}

.dusty-rose {
  background-color: #C9ADA7;
  color: #333;
}

.taupe {
  background-color: #A59E8C;
  color: white;
}
</style>`,
        },
        {
            id: 'minimal-typography',
            titleEn: 'Minimal Typography',
            titleZh: '极简字体排版',
            code: `<div class="minimal-type-container">
  <h1 class="minimal-title">极简设计</h1>
  <p class="minimal-subtitle">Less is more. 少即是多。</p>
  
  <div class="minimal-text-container">
    <p class="minimal-paragraph">好的排版设计应该是无形的，它不应该吸引读者对设计本身的注意，而是让内容本身脱颖而出。</p>
    <p class="minimal-paragraph">极简主义排版专注于内容的清晰度，摒弃多余的装饰，选择合适的字体、间距和对比度。</p>
    <blockquote class="minimal-quote">
      设计是减法，而不是加法。
    </blockquote>
  </div>
  <div class="minimal-button-container">
    <button class="minimal-button">了解更多</button>
  </div>
</div>

<style>
.minimal-type-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #ffffff;
  color: #2c2c2c;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.minimal-title {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}

.minimal-subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  color: #777;
  margin-bottom: 40px;
}

.minimal-text-container {
  margin-bottom: 40px;
}

.minimal-paragraph {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 20px;
  font-weight: 400;
}

.minimal-quote {
  border-left: 2px solid #ddd;
  padding-left: 20px;
  font-style: italic;
  color: #555;
  margin: 30px 0;
}

.minimal-button-container {
  display: flex;
  justify-content: flex-start;
}

.minimal-button {
  background: none;
  border: 1px solid #2c2c2c;
  padding: 10px 20px;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.minimal-button:hover {
  background-color: #2c2c2c;
  color: white;
}
</style>`,
        },
        {
            id: 'dark-mode',
            titleEn: 'Dark Mode',
            titleZh: '深色模式',
            code: `<div class="theme-container">
  <div class="theme-switch-wrapper">
    <label class="theme-switch" for="checkbox">
      <input type="checkbox" id="checkbox" />
      <div class="slider round"></div>
    </label>
    <span class="theme-label">切换主题</span>
  </div>
  
  <div class="theme-content">
    <h2>深色模式与浅色模式</h2>
    <p>这是一个演示深色模式与浅色模式切换的设计。点击上方开关来切换主题。</p>
    <div class="button-container">
      <button class="theme-button primary">主要按钮</button>
      <button class="theme-button secondary">次要按钮</button>
    </div>
  </div>
</div>

<style>
:root {
  --light-bg: #f8f9fa;
  --light-text: #333333;
  --light-secondary: #666666;
  --light-button-primary: #0066cc;
  --light-button-secondary: #f0f0f0;
  --light-border: #dddddd;
  
  --dark-bg: #222222;
  --dark-text: #ffffff;
  --dark-secondary: #aaaaaa;
  --dark-button-primary: #4da6ff;
  --dark-button-secondary: #444444;
  --dark-border: #555555;
  
  --bg: var(--light-bg);
  --text: var(--light-text);
  --secondary: var(--light-secondary);
  --button-primary: var(--light-button-primary);
  --button-secondary: var(--light-button-secondary);
  --border: var(--light-border);
}

.theme-container {
  background-color: var(--bg);
  color: var(--text);
  padding: 30px;
  border-radius: 10px;
  transition: all 0.3s ease;
  max-width: 600px;
  margin: 0 auto;
}

/* 其余CSS样式省略... */
</style>

<script>
document.getElementById('checkbox').addEventListener('change', function() {
  document.querySelector('.theme-container').classList.toggle('dark-mode');
});
</script>`,
        },
        {
            id: 'micro-interactions',
            titleEn: 'Micro Interactions',
            titleZh: '微交互设计',
            code: `<div class="micro-container">
  <h2>微交互设计</h2>
  <p>微交互能增强用户体验，给予即时反馈。请尝试与下方元素互动。</p>
  
  <div class="micro-elements">
    <button class="micro-button">点击我</button>
    
    <label class="toggle">
      <input type="checkbox">
      <span class="toggle-slider"></span>
    </label>
    
    <div class="heart-container">
      <input type="checkbox" id="heart">
      <label for="heart" class="heart-label">
        <svg viewBox="0 0 24 24" class="heart-svg">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
        </svg>
      </label>
    </div>
    
    <div class="notification-bell">
      <svg viewBox="0 0 24 24" class="bell-svg">
        <path d="M12,22A2,2 0 0,0 14,20H10A2,2 0 0,0 12,22M18,16V11C18,7.93 16.36,5.36 13.5,4.68V4A1.5,1.5 0 0,0 12,2.5A1.5,1.5 0 0,0 10.5,4V4.68C7.63,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16Z"/>
      </svg>
      <span class="notification-badge">3</span>
    </div>
  </div>
</div>

<style>
/* CSS样式代码省略... */
</style>`
        }
    ];
} 