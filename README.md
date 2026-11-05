# XCapture — X Post Screenshot Generator

A modern, polished, **100% frontend-only web application** that converts X (formerly Twitter) post links into crisp, high-resolution PNG screenshot images directly in your browser.

## Features

- ⚡ **100% Client-Side**: Operates entirely in the browser without any backend server, proxy, API key, or database.
- 🎨 **Multiple Themes & Custom Canvas Backgrounds**: Switch between Dark, Dim, and Light tweet card themes with gradient background presets.
- 🛡️ **Verified Badge Types**: Toggle Blue, Gold, Gray, or None verified badges.
- ✏️ **Interactive Content Customizer**: Edit text, author handle, avatar, or timestamp in real-time.
- 📷 **High-Resolution PNG Download**: Export crisp 2x/3x retina-quality screenshots.
- 🔒 **Privacy First**: No post URLs, credentials, or images leave your device.

---

## Technical Architecture & How It Works

### 1. Client-Side X Post Retrieval
- Standard browser `fetch()` requests to Twitter/X endpoints fail due to **CORS (Cross-Origin Resource Sharing)** restrictions.
- Standard cross-origin `<iframe>` embeds (such as Twitter's `widgets.js`) render tweets on screen, but browsers enforce the **Same-Origin Policy**, which taints the HTML5 Canvas and prevents `html2canvas` or `html-to-image` from capturing pixel data inside cross-origin iframes.
- **Solution**: XCapture utilizes X's official **JSONP oEmbed API** (`https://publish.twitter.com/oembed?url=...&callback=...`). Script tags are exempt from CORS, allowing the browser to retrieve official post metadata, text, and author handles safely without any server proxy.

### 2. High-Fidelity DOM Rendering & Canvas Capture
- Once post metadata is received, XCapture renders a pixel-perfect, fully styled DOM component (`<TweetCard />`).
- Screenshot rasterization is executed using [`html-to-image`](https://github.com/bubkoo/html-to-image), which serializes the DOM nodes and stylesheets into an SVG data URI and draws it onto an HTML5 Canvas at high pixel density (`pixelRatio: 2`).
- The user can download the generated image directly as a PNG (e.g. `x-post-jack-20.png`).

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm / pnpm / yarn.

### Installation

```bash
# Clone the repository
git clone https://github.com/yinkaenoch/xcapture.git
cd xcapture

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Running Unit Tests

```bash
npm run test
```

### Type Checking & Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

The output files will be generated in the `dist/` directory, ready for deployment on any static web host.

---

## Deployment

Because XCapture requires zero backend server, it can be deployed to any static host:

- **Vercel**: Import repository and deploy with default Vite preset.
- **Netlify**: Drag & drop the `dist/` directory or connect repository.
- **GitHub Pages**: Deploy the `dist/` build using `gh-pages` or GitHub Actions.
- **Cloudflare Pages**: Connect repo, set build command `npm run build` and directory `dist`.

---

## License

MIT License.
