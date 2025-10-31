# Michael Evans Portfolio

A modern, responsive portfolio website showcasing AI/ML expertise, creative technology solutions, and professional case studies.

🚀 **Live Site**: [https://michael-evans-port.vercel.app](https://michael-evans-port.vercel.app)

## 🎯 Overview

This portfolio site is built with modern web technologies and features a clean, minimalist design that highlights professional work in AI, software development, and creative technology. The site includes comprehensive case studies, an AI showcase section, and detailed project documentation.

## ✨ Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Dynamic Content**: Case studies and project showcases with detailed metrics
- **Performance Optimized**: Built with Vite for lightning-fast load times
- **Modern UI**: Clean, professional design using shadcn/ui components
- **Type Safe**: Full TypeScript implementation for robust code
- **Documentation**: Comprehensive architecture and memory bank system
- **SEO Ready**: Structured for search engine optimization
- **CMS Ready**: Prepared for Sanity CMS integration

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Routing**: React Router DOM 6.30
- **State Management**: TanStack Query 5.83
- **Icons**: Lucide React

### Development Tools
- **Linting**: ESLint 9.32
- **Package Manager**: npm/bun
- **Version Control**: Git & GitHub
- **Deployment**: Vercel

## 📁 Project Structure

```
michael-evans-port/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── pages/            # Route pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── assets/           # Images and static assets
├── memory-bank/          # Development documentation
│   ├── CURRENT.md        # Active work tracking
│   ├── PROGRESS.md       # Development log
│   └── ...               # Additional docs
├── ARCHITECTURE.md       # Technical architecture
├── SANITY_IMPLEMENTATION_PLAN.md  # CMS integration plan
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or bun)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mevans2120/michael-evans-port.git
cd michael-evans-port
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📋 Pages

- **Home** (`/`) - Dynamic hero with introduction
- **About** (`/about`) - Professional background and experience
- **Capabilities** (`/capabilities`) - Skills and services offered
- **AI Showcase** (`/ai-showcase`) - AI/ML project demonstrations
- **AI Research** (`/ai-research`) - Research work and publications
- **Case Studies**:
  - Casa Bonita (`/case-studies/casa-bonita`)
  - Before Launcher (`/case-studies/before-launcher`)
  - Virgin America (`/case-studies/virgin-america`)
  - Peddle (`/case-studies/peddle`)

## 🏗️ Architecture

The project follows a component-based architecture with:
- **Atomic Design Pattern** for component organization
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Memory Bank System** for development continuity

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📝 Memory Bank

This project uses a Memory Bank system for maintaining development continuity and documentation. The memory bank includes:

- Current work tracking
- Progress logs
- Technical decisions
- Session guides
- Change logs

Learn more in [memory-bank/README.md](./memory-bank/README.md).

## 🎨 Design System

- **Typography**: Inter font family
- **Colors**: Professional palette with gradient accents
- **Spacing**: 4px base unit system
- **Components**: 30+ reusable UI components
- **Responsive**: Mobile-first design approach

## 🚢 Deployment

The site is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mevans2120/michael-evans-port)

Or deploy manually:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Import your forked repository
4. Deploy with default settings

## 🔄 Future Enhancements

- [ ] Sanity CMS integration for dynamic content
- [ ] Blog functionality
- [ ] Interactive AI/ML demos
- [ ] Newsletter integration
- [ ] Analytics dashboard
- [ ] Dark mode support
- [ ] Multi-language support

See [SANITY_IMPLEMENTATION_PLAN.md](./SANITY_IMPLEMENTATION_PLAN.md) for CMS integration details.

## 📊 Performance

- Lighthouse Score: 90+ (target)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: < 200KB initial load

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📧 Contact

**Michael Evans**
- GitHub: [@mevans2120](https://github.com/mevans2120)
- Email: mevans212@gmail.com
- Website: [https://michael-evans-port.vercel.app](https://michael-evans-port.vercel.app)

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com)
- Icons by [Lucide](https://lucide.dev)

---

*Last Updated: September 2025*
