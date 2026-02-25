# Vanilla JS Webpack Template

A minimal, modern Webpack setup for vanilla JavaScript projects.

## Features

- ✅ Webpack 5 with dev server
- ✅ Hot module replacement
- ✅ CSS loader and style injection
- ✅ HTML template processing
- ✅ Image asset handling
- ✅ Production optimization
- ✅ GitHub Pages deployment ready

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for recommended version)
- npm or yarn

### Installation

1. Clone this repository or use it as a template
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Production Build

Create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Deploy to GitHub Pages

Deploy your built app to GitHub Pages:

```bash
npm run deploy
```

## Project Structure

```
├── src/
│   ├── index.html       # HTML template
│   ├── script.js        # JavaScript entry point
│   └── style.css        # CSS styles
├── dist/                # Built files (auto-generated)
├── webpack.common.js    # Shared Webpack config
├── webpack.dev.js       # Development config
└── webpack.prod.js      # Production config
```

## Customization

### Adding Images

Place images in `src/` and import them in your JavaScript:

```javascript
import myImage from "./path/to/image.png";
```

### Environment Variables

Create a `.env` file (see `.env.example`) and access variables in your code.

## License

MIT
