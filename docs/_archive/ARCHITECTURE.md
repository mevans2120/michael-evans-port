# Portfolio Site Architecture Plan

## 📊 Current State Analysis

### Technology Stack
- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.30
- **State Management**: React Query (TanStack Query 5.83)
- **Styling**: Tailwind CSS 3.4 with shadcn/ui components
- **UI Components**: Radix UI primitives with custom wrappers
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Tailwind CSS animations
- **Development**: ESLint 9.32, TypeScript

### Current File Structure
```
michael-evans-port-main/
├── src/
│   ├── App.tsx                    # Main app router configuration
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   ├── components/                # Reusable components
│   │   ├── Navigation.tsx         # Site navigation
│   │   ├── Hero.tsx               # Hero sections
│   │   ├── DynamicHero.tsx        # Dynamic hero component
│   │   ├── Contact.tsx            # Contact section
│   │   └── ui/                    # shadcn/ui components
│   ├── pages/                     # Route pages
│   │   ├── Index.tsx              # Home page
│   │   ├── About.tsx              # About page
│   │   ├── Capabilities.tsx       # Skills/services
│   │   ├── AIShowcase.tsx         # AI projects
│   │   ├── AIResearch.tsx         # Research work
│   │   └── [CaseStudies].tsx      # Individual case studies
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions
│   └── assets/                    # Static assets
├── public/                        # Public assets
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🏗️ Proposed Architecture Enhancements

### 1. Core Architecture Patterns

#### Component Architecture
```typescript
// Atomic Design Pattern
components/
├── atoms/           # Basic UI elements (buttons, inputs)
├── molecules/       # Simple component groups
├── organisms/       # Complex UI sections
├── templates/       # Page templates
└── ui/             # shadcn/ui components (existing)
```

#### Data Layer Architecture
```typescript
// Service-oriented architecture
services/
├── api/            # API client and endpoints
├── hooks/          # Custom hooks for data fetching
├── stores/         # Global state management (if needed)
└── types/          # TypeScript type definitions
```

### 2. Routing Strategy
```typescript
// Enhanced routing with lazy loading
const routes = {
  public: [
    { path: '/', component: lazy(() => import('./pages/Index')) },
    { path: '/about', component: lazy(() => import('./pages/About')) },
    { path: '/capabilities', component: lazy(() => import('./pages/Capabilities')) },
  ],
  portfolio: [
    { path: '/portfolio/:slug', component: lazy(() => import('./pages/Portfolio')) },
    { path: '/case-studies/:slug', component: lazy(() => import('./pages/CaseStudy')) },
  ],
  ai: [
    { path: '/ai-showcase', component: lazy(() => import('./pages/AIShowcase')) },
    { path: '/ai-research', component: lazy(() => import('./pages/AIResearch')) },
  ]
}
```

### 3. State Management Strategy
- **Local State**: useState for component-specific state
- **Server State**: TanStack Query for API data
- **Global State**: Context API for theme, user preferences
- **Form State**: React Hook Form with Zod validation

### 4. Performance Optimization
- **Code Splitting**: Route-based with React.lazy()
- **Image Optimization**: Next-gen formats (WebP, AVIF)
- **Bundle Optimization**: Vite's automatic chunking
- **Caching Strategy**: Service Worker for offline support
- **SEO**: Meta tags management with react-helmet

## 📝 Coding Standards

### TypeScript Standards
```typescript
// 1. Always use explicit types for function parameters and returns
function calculateSum(a: number, b: number): number {
  return a + b;
}

// 2. Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// 3. Use enums for constants
enum Status {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// 4. Prefer const assertions for literals
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;
```

### React Component Standards
```typescript
// 1. Functional components with TypeScript
interface ComponentProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  isActive = false,
  onClick
}) => {
  return (
    <div className="component">
      {/* Component content */}
    </div>
  );
};

// 2. Custom hooks naming convention
const useCustomHook = (param: string) => {
  // Hook logic
  return { data, loading, error };
};

// 3. Event handler naming
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Types**: PascalCase with suffix (e.g., `UserType.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### CSS/Tailwind Standards
```tsx
// 1. Use Tailwind classes for styling
<div className="flex items-center justify-between px-4 py-2">

// 2. Extract complex class combinations
const buttonStyles = cn(
  "px-4 py-2 rounded-lg transition-colors",
  "bg-primary text-primary-foreground",
  "hover:bg-primary/90"
);

// 3. Use CSS variables for theming
// In index.css
:root {
  --primary: 220 90% 56%;
  --background: 0 0% 100%;
}
```

### Code Organization Standards
```typescript
// 1. Import order
import React from 'react';                    // React imports
import { Link } from 'react-router-dom';      // Third-party libraries
import { Button } from '@/components/ui';     // Internal components
import { formatDate } from '@/lib/utils';     // Utilities
import type { User } from '@/types';          // Types
import './styles.css';                        // Styles

// 2. Component structure
const Component = () => {
  // 1. State declarations
  const [state, setState] = useState();

  // 2. Refs
  const ref = useRef();

  // 3. Custom hooks
  const { data } = useCustomHook();

  // 4. Effects
  useEffect(() => {}, []);

  // 5. Event handlers
  const handleClick = () => {};

  // 6. Render helpers
  const renderItem = () => {};

  // 7. Main render
  return <div />;
};
```

### Git Commit Standards
```bash
# Format: <type>(<scope>): <subject>
feat(navigation): add mobile menu toggle
fix(hero): correct responsive layout issues
docs(readme): update installation instructions
style(global): format code with prettier
refactor(api): simplify data fetching logic
test(auth): add unit tests for login
chore(deps): update dependencies
```

### Testing Standards
```typescript
// 1. Test file naming: Component.test.tsx
// 2. Test structure
describe('Component', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});

// 3. Coverage targets
// - Statements: 80%
// - Branches: 75%
// - Functions: 80%
// - Lines: 80%
```

## 🔒 Security Standards
- Environment variables for sensitive data
- Input validation with Zod
- XSS prevention with React's built-in escaping
- HTTPS enforcement
- Content Security Policy headers
- Regular dependency updates

## 📊 Performance Standards
- Lighthouse score targets: 90+ for all metrics
- Bundle size: < 200KB initial load
- Time to Interactive: < 3 seconds
- Core Web Vitals compliance
- Image lazy loading
- Resource preloading for critical assets

## 🎨 Design System Standards
- Consistent spacing scale (4px base)
- Typography scale (1.25 ratio)
- Color palette with semantic naming
- Component variants (primary, secondary, ghost)
- Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Dark mode support via CSS variables

## 📚 Documentation Standards
- README.md for project setup
- Component documentation with props
- API documentation with examples
- Inline code comments for complex logic
- JSDoc for utility functions
- Architecture decision records (ADRs)

## 🚀 Deployment Strategy
- Build optimization with Vite
- Environment-specific configurations
- CI/CD pipeline integration
- Preview deployments for PRs
- Production deployment checklist
- Rollback procedures

## 📈 Monitoring & Analytics
- Error tracking (e.g., Sentry)
- Performance monitoring
- User analytics (privacy-compliant)
- A/B testing framework
- Logging strategy

## 🔄 Development Workflow
1. Feature branch from main
2. Local development with hot reload
3. Unit testing
4. Integration testing
5. Code review
6. Merge to main
7. Automated deployment

## 📋 Next Steps
1. Implement memory bank system
2. Set up automated testing
3. Configure CI/CD pipeline
4. Implement performance monitoring
5. Create component library documentation
6. Set up error tracking
7. Implement analytics

---

*Last Updated: 2025-09-15*
*Version: 1.0.0*