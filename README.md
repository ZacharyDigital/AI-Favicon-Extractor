# AI Favicon Extractor

**The Most Comprehensive Favicon Extraction Tool** built with Next.js 16, TypeScript, and Tailwind CSS.

## 🌟 Features

### Deep Extraction

- Extracts **all** favicon formats from any website
- Supports HTML `<link>` tags, Web Manifest, and BrowserConfig
- Finds icons from multiple sources: HTML, manifest.json, browserconfig.xml
- Handles all modern icon standards (apple-touch-icon, SVG, PNG, ICO, etc.)

### Visual Matrix Display

- **Beautiful card-based layout** for each icon
- Live preview of all extracted icons
- Size, format, and source information for each icon
- Individual download buttons for each icon

### One-Click ZIP Download

- Download all icons as a single ZIP file
- Automatically named and organized
- Includes README with metadata
- Progress indicator during download

### Intelligent Analysis

- **Smart scoring system** (0-100 points)
- Best practice recommendations
- Missing icon warnings
- Feature coverage checklist

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend API running (see `../backend/README.md`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.local.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3001` (or next available port).

### Production Build

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, update to your deployed backend URL.

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **ZIP Creation:** JSZip

## 🎯 Usage

1. **Enter a URL** - Type any website URL (must include `http://` or `https://`)
2. **Click Extract** - The deep crawler will fetch all favicons
3. **View Results** - See all icons in a beautiful visual matrix
4. **Get Analysis** - Review intelligent insights and recommendations
5. **Download** - Download individual icons or all as ZIP

### Example URLs to Try

- `https://github.com`
- `https://twitter.com`
- `https://stackoverflow.com`

## 📝 License

MIT

---

**Built with ❤️ using Next.js and the Deep Favicon Fetcher Backend**
