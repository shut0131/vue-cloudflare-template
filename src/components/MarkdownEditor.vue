<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { getUserId, getSessionInfo } from '../utils/userSession'
import { useTheme } from '../composables/useTheme'

// Configure marked
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true
})

const markdown = ref(`# マークダウンエディタ

## 機能

- **リアルタイムプレビュー**: 左側で編集すると右側でプレビューが更新されます
- **シンタックスハイライト**: コードブロックが自動的にハイライトされます
- **安全なHTML**: DOMPurifyでサニタイズされています

## マークダウンサンプル

### リスト

- 項目1
- 項目2
  - サブ項目
  - サブ項目

### 番号付きリスト

1. 最初の項目
2. 次の項目
3. 最後の項目

### コードブロック

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### テーブル

| ヘッダー1 | ヘッダー2 |
|----------|----------|
| セル1     | セル2     |
| セル3     | セル4     |

### リンクと画像

[GitHubリンク](https://github.com)

> これは引用ブロックです。
> 複数行にわたる引用も可能です。

**太字**のテキストと*イタリック*のテキスト`)

const isSaving = ref(false)
const saveStatus = ref('')
const userId = ref('')
const sessionInfo = ref(null)

// テーマ管理
const { themeMode, toggleTheme, ThemeMode } = useTheme()

// テーマアイコンの取得
const getThemeIcon = computed(() => {
  if (themeMode.value === ThemeMode.LIGHT) {
    return '☀️' // 太陽
  } else if (themeMode.value === ThemeMode.DARK) {
    return '🌙' // 月
  } else {
    return '🖥️' // システム
  }
})

const getThemeLabel = computed(() => {
  if (themeMode.value === ThemeMode.LIGHT) {
    return 'ライト'
  } else if (themeMode.value === ThemeMode.DARK) {
    return 'ダーク'
  } else {
    return 'システム'
  }
})

// Computed property for rendered HTML
const renderedHTML = computed(() => {
  const rawHTML = marked(markdown.value)
  return DOMPurify.sanitize(rawHTML)
})

// Save to Cloudflare Workers
const saveDocument = async () => {
  isSaving.value = true
  saveStatus.value = '保存中...'
  
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.value
      },
      body: JSON.stringify({
        content: markdown.value,
        timestamp: new Date().toISOString(),
        userId: userId.value
      })
    })
    
    if (response.ok) {
      saveStatus.value = '保存しました！'
      setTimeout(() => {
        saveStatus.value = ''
      }, 3000)
    } else {
      saveStatus.value = '保存エラー'
    }
  } catch (error) {
    console.error('Save error:', error)
    saveStatus.value = '保存エラー'
  } finally {
    isSaving.value = false
  }
}

// Auto-save functionality
let saveTimeout
watch(markdown, () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveDocument()
  }, 2000) // Auto-save after 2 seconds of inactivity
})

// Load saved content on mount
onMounted(async () => {
  // ユーザー情報の取得
  sessionInfo.value = getSessionInfo()
  userId.value = sessionInfo.value.userId
  
  try {
    const response = await fetch('/api/load', {
      headers: {
        'X-User-Id': userId.value
      }
    })
    if (response.ok) {
      const data = await response.json()
      if (data.content) {
        markdown.value = data.content
      }
    }
  } catch (error) {
    console.error('Load error:', error)
  }
})
</script>

<template>
  <div class="editor-container">
    <div class="editor-header">
      <h1>マークダウンエディタ</h1>
      <div class="header-controls">
        <button @click="toggleTheme" class="theme-button" :title="`テーマ: ${getThemeLabel}`">
          {{ getThemeIcon }}
        </button>
        <div class="save-status">
          <span v-if="saveStatus" :class="{ error: saveStatus === '保存エラー' }">
            {{ saveStatus }}
          </span>
          <button @click="saveDocument" :disabled="isSaving" class="save-button">
            {{ isSaving ? '保存中...' : '手動保存' }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="editor-main">
      <div class="editor-pane">
        <h2>エディタ</h2>
        <textarea 
          v-model="markdown" 
          class="markdown-input"
          placeholder="マークダウンを入力してください..."
        ></textarea>
      </div>
      
      <div class="preview-pane">
        <h2>プレビュー</h2>
        <div class="markdown-preview" v-html="renderedHTML"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
}

.editor-header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.editor-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.theme-button {
  background: transparent;
  border: 1px solid var(--header-text);
  color: var(--header-text);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.save-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.save-status span {
  color: var(--success-color);
  font-size: 0.9rem;
}

.save-status span.error {
  color: var(--error-color);
}

.save-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.save-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-pane,
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
}

.editor-pane h2,
.preview-pane h2 {
  margin: 0;
  padding: 1rem;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-size: 1.2rem;
  color: var(--text-primary);
}

.markdown-input {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.markdown-preview {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  line-height: 1.6;
}

/* Markdown preview styles */
.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.markdown-preview h1 {
  font-size: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.markdown-preview h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
}

.markdown-preview pre {
  background-color: var(--bg-code);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}

.markdown-preview code {
  background-color: var(--bg-code);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-preview pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-preview blockquote {
  border-left: 4px solid var(--accent-color);
  padding-left: 1rem;
  margin-left: 0;
  color: var(--text-secondary);
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.markdown-preview th,
.markdown-preview td {
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  text-align: left;
}

.markdown-preview th {
  background-color: var(--bg-tertiary);
  font-weight: bold;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
}

.markdown-preview a {
  color: var(--link-color);
  text-decoration: none;
}

.markdown-preview a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .editor-main {
    flex-direction: column;
  }
  
  .editor-pane,
  .preview-pane {
    margin: 0.5rem;
  }
}
</style>