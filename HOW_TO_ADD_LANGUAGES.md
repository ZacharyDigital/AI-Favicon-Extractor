# 如何添加新语言支持

## 📋 当前状态

**已支持语言**: 
- 🇬🇧 English (en) - 默认语言
- 🇨🇳 中文 (zh)

**可扩展语言**: 西班牙语、德语、法语、日语等任意语言

---

## 🚀 添加新语言的步骤

### 步骤 1: 创建翻译文件

在 `public/i18n/` 目录下创建新语言的 JSON 文件。

#### 示例：添加西班牙语 (es)

创建文件 `public/i18n/es.json`:

```json
{
  "meta": {
    "title": "Extractor de Favicon - La herramienta más completa",
    "description": "Extrae todos los favicons de cualquier sitio web con rastreo profundo."
  },
  "header": {
    "title": "Extractor AI Favicon",
    "subtitle": "La herramienta de extracción de favicon más completa"
  },
  "form": {
    "placeholder": "Ingrese la URL del sitio web (ej., https://github.com)",
    "button_extracting": "Extrayendo...",
    "button_extract": "Extraer",
    "try_label": "Prueba:",
    "error_empty": "Por favor ingrese una URL",
    "error_invalid": "Por favor ingrese una URL válida (incluyendo http:// o https://)"
  },
  "warnings": {
    "captcha_title": "Usando API de respaldo",
    "captcha_message": "Este sitio web tiene protección anti-bot. Estamos usando las API de favicon de Google S2 y DuckDuckGo para proporcionar iconos de alta calidad.",
    "no_icons_title": "No se encontraron iconos",
    "no_icons_message": "No pudimos encontrar ningún favicon para este sitio web."
  },
  "results": {
    "found": "Se encontraron {count} icono{plural}",
    "extracted_from": "Extraído de {domain}",
    "downloading": "Preparando ZIP... ({current}/{total})",
    "download_all": "Descargar todo como ZIP",
    "icon_collection": "Colección de iconos"
  },
  "icon_card": {
    "downloading": "Descargando...",
    "download": "Descargar",
    "copy_url": "Copiar URL",
    "open_new_tab": "Abrir en nueva pestaña"
  },
  "analysis": {
    "title": "Análisis inteligente",
    "excellent": "Excelente",
    "good": "Bueno",
    "needs_improvement": "Necesita mejoras",
    "total_icons": "Total de iconos",
    "svg_format": "Formato SVG",
    "web_manifest": "Web Manifest",
    "best_practices": "Mejores prácticas detectadas",
    "improvements": "Sugerencias de mejora",
    "feature_coverage": "Cobertura de características",
    "apple_touch_icon": "Apple Touch Icon",
    "apple_touch_icon_desc": "Para la pantalla de inicio de iOS",
    "high_resolution": "Alta resolución (512x512+)",
    "high_resolution_desc": "Para PWA y pantallas modernas",
    "svg_format_desc": "Gráficos vectoriales escalables",
    "web_manifest_desc": "Configuración PWA",
    "browserconfig": "BrowserConfig",
    "browserconfig_desc": "Imágenes de mosaico de Windows"
  },
  "footer": {
    "powered_by": "Con tecnología de Deep Favicon Fetcher Backend con Puppeteer • Soporta todos los estándares de iconos modernos"
  },
  "static_seo": {
    "title": "Extraer todos los Favicons de cualquier sitio web",
    "description": "Nuestro rastreador profundo extrae todos los formatos de iconos, incluyendo HTML, Web Manifest, BrowserConfig.",
    "deep_extraction_title": "Extracción profunda",
    "deep_extraction_desc": "Encuentra todos los formatos y tamaños de iconos",
    "visual_matrix_title": "Matriz visual",
    "visual_matrix_desc": "Previsualiza todos los iconos antes de descargar",
    "one_click_zip_title": "ZIP con un clic",
    "one_click_zip_desc": "Descarga todo de una vez",
    "smart_analysis_title": "Análisis inteligente",
    "smart_analysis_desc": "Obtén información y recomendaciones"
  }
}
```

---

### 步骤 2: 更新配置文件

修改 `src/config.ts`，添加新语言代码：

```typescript
// 在 locales 数组中添加新语言
const locales = ['en', 'zh', 'es'] as const;  // ✅ 添加 'es'

// ...

export const appConfig = {
  // ...
  i18n: {
    locales,
    defaultLocale,
    labels: {
      "en": "English",
      "zh": "中文",
      "es": "Español"  // ✅ 添加标签
    } as Record<LocaleType, string>
  }
}
```

---

### 步骤 3: 测试新语言

1. **重启开发服务器**:
   ```bash
   npm run dev
   ```

2. **访问新语言 URL**:
   ```
   http://localhost:3000/es
   ```

3. **测试语言切换器**:
   - 点击语言切换下拉菜单
   - 选择 "Español"
   - 验证所有文本是否正确显示

---

### 步骤 4: 构建验证

```bash
npm run build
```

确保构建成功，没有错误。

---

## 📝 翻译提示

### 完整翻译 vs 部分翻译

#### 选项 A: 完整翻译（推荐）
复制 `en.json` 的完整结构，翻译所有文本。

**优点**: 
- 完全独立
- 不依赖回退机制
- 更好的用户体验

#### 选项 B: 部分翻译
只翻译核心内容，其他内容自动回退到英文。

**示例** (`public/i18n/es.json`):
```json
{
  "form": {
    "button_extract": "Extraer",
    "placeholder": "Ingrese la URL del sitio web"
  }
  // 其他未翻译的键会自动使用英文
}
```

**优点**:
- 快速上线
- 逐步完善翻译

**注意**: 使用 `deepmerge` 自动合并，缺失部分使用英文。

---

## 🌍 支持的语言代码参考

| 语言 | 代码 | 标签示例 |
|------|------|---------|
| 英语 | en | English |
| 中文 | zh | 中文 |
| 西班牙语 | es | Español |
| 德语 | de | Deutsch |
| 法语 | fr | Français |
| 日语 | ja | 日本語 |
| 韩语 | ko | 한국어 |
| 葡萄牙语 | pt | Português |
| 俄语 | ru | Русский |
| 意大利语 | it | Italiano |
| 荷兰语 | nl | Nederlands |
| 波兰语 | pl | Polski |
| 瑞典语 | sv | Svenska |
| 土耳其语 | tr | Türkçe |

---

## 🔧 变量占位符说明

翻译时需要保留的变量占位符：

### 单变量
```json
"extracted_from": "Extraído de {domain}"
```

### 多变量
```json
"downloading": "Preparando ZIP... ({current}/{total})"
```

### 复数处理

**英文** (需要复数标记):
```json
"found": "Found {count} icon{plural}"
```

**西班牙语** (需要复数):
```json
"found": "Se encontraron {count} icono{plural}"
```

**中文** (不需要复数):
```json
"found": "找到 {count} 个图标"
```

---

## 🎯 翻译质量检查清单

- [ ] 所有翻译键与 `en.json` 结构一致
- [ ] 变量占位符 `{variableName}` 保持不变
- [ ] 专业术语翻译准确（如 "favicon", "manifest"）
- [ ] 文化适应（如日期格式、标点符号）
- [ ] 字符编码正确（UTF-8）
- [ ] JSON 格式正确（无语法错误）
- [ ] 测试所有页面和组件
- [ ] 语言切换功能正常

---

## 🚀 快速添加示例

### 添加德语 (de)

1. 创建 `public/i18n/de.json`（复制 `en.json` 并翻译）
2. 更新 `src/config.ts`:
   ```typescript
   const locales = ['en', 'zh', 'de'] as const;
   
   labels: {
     "en": "English",
     "zh": "中文",
     "de": "Deutsch"
   }
   ```
3. 重启服务器并测试 `http://localhost:3000/de`

---

## 🤖 AI 辅助翻译

### 使用 ChatGPT/Claude

**Prompt 示例**:
```
请将以下 JSON 文件从英文翻译成西班牙语。
保持 JSON 结构不变，保留所有变量占位符（如 {domain}, {count}）。

[粘贴 en.json 内容]
```

### 使用 Google Translate API

可以编写脚本批量翻译（注意人工审核质量）。

---

## 📦 批量添加多语言

如果需要同时添加多种语言：

```bash
# 创建翻译文件
touch public/i18n/es.json
touch public/i18n/de.json
touch public/i18n/fr.json
touch public/i18n/ja.json
```

然后更新配置：

```typescript
const locales = ['en', 'zh', 'es', 'de', 'fr', 'ja'] as const;

labels: {
  "en": "English",
  "zh": "中文",
  "es": "Español",
  "de": "Deutsch",
  "fr": "Français",
  "ja": "日本語"
}
```

---

## 🐛 常见问题

### Q1: 添加新语言后出现 404
**A**: 检查 `src/config.ts` 中是否正确添加了语言代码。

### Q2: 翻译文件不生效
**A**: 确保 JSON 格式正确，重启开发服务器。

### Q3: 某些文本仍显示英文
**A**: 检查翻译键路径是否与 `en.json` 完全一致。

### Q4: MODULE_NOT_FOUND 错误
**A**: 确保翻译文件存在于 `public/i18n/{locale}.json`。

---

## 📚 相关文档

- [I18N_IMPLEMENTATION_SUMMARY.md](./I18N_IMPLEMENTATION_SUMMARY.md) - 完整实施指南
- [COMPONENT_I18N_CHANGES.md](./COMPONENT_I18N_CHANGES.md) - 组件改造详解
- [next-intl 官方文档](https://next-intl-docs.vercel.app/)

---

## ✅ 提交新语言

添加新语言后，按以下格式提交：

```bash
git add public/i18n/es.json src/config.ts
git commit -m "feat: Add Spanish (es) language support

- Add Spanish translation file (es.json)
- Update config to include 'es' locale
- Tested language switching and all components"

git push origin feature/add-i18n
```

---

**最后更新**: 2025-11-06  
**文档版本**: 1.0

