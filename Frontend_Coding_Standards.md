# B4USpend Frontend Coding Standards

**Tech Stack:** React + Vite + Ant Design + RTK Query + Tailwind CSS  
**Version:** 1.0  
**Last Updated:** February 2026

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Core Principles](#core-principles)
4. [Design Patterns](#design-patterns)
5. [File and Function Size Guidelines](#file-and-function-size-guidelines)
6. [Code Organization Standards](#code-organization-standards)
7. [Component Development](#component-development)
8. [State Management](#state-management)
9. [Styling Guidelines](#styling-guidelines)
10. [Performance Standards](#performance-standards)
11. [Error Handling](#error-handling)
12. [Testing Requirements](#testing-requirements)
13. [Naming Conventions](#naming-conventions)
14. [Code Review Checklist](#code-review-checklist)

---

## Technology Stack

### Core Technologies

- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **UI Component Library:** Ant Design (antd)
- **State Management & API:** Redux Toolkit Query (RTK Query)
- **Styling:** Tailwind CSS
- **Language:** JavaScript/TypeScript

### Why This Stack?

- **React:** Component-based architecture, large ecosystem, excellent performance
- **Vite:** Lightning-fast HMR, optimized build process, modern tooling
- **Ant Design:** Enterprise-grade UI components, accessibility, consistent design
- **RTK Query:** Built-in caching, automatic refetching, simplified data fetching
- **Tailwind CSS:** Utility-first, rapid development, consistent design system

---

## Project Architecture

### 1. Feature-Based Architecture

Organize code by business features/modules rather than technical layers.

#### Directory Structure

```
src/
├── features/           # Feature modules
│   ├── auth/
│   ├── expense-tracker/
│   ├── financial-health/
│   ├── goals/
│   ├── spending-nudge/
│   ├── budget-planner/
│   └── education/
├── shared/            # Shared/common code
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── types/
├── store/            # Redux store configuration
├── routes/           # Route definitions
├── assets/           # Static assets
└── styles/           # Global styles
```

#### Feature Module Structure

Each feature should contain:

- **components/** - Feature-specific React components
- **hooks/** - Custom hooks for the feature
- **services/** - API endpoints (RTK Query)
- **utils/** - Helper functions and business logic
- **types/** - TypeScript types/interfaces
- **constants/** - Feature-specific constants
- **index.js** - Public API exports

### 2. Benefits

- **Scalability:** Easy to add new features independently
- **Maintainability:** Related code is co-located
- **Reusability:** Clear separation of shared vs feature-specific code
- **Team Collaboration:** Teams can work on features without conflicts
- **Code Splitting:** Natural boundaries for lazy loading

---

## Core Principles

### 1. DRY (Don't Repeat Yourself)

- Extract repeated logic into utility functions
- Create reusable components for common UI patterns
- Use custom hooks for shared stateful logic
- Avoid copy-pasting code across files
- Centralize configuration and constants

### 2. SOLID Principles

#### Single Responsibility Principle (SRP)

- Each component should have one clear purpose
- Separate data fetching, business logic, and presentation
- Break large components into smaller, focused ones
- Each file should address one concern

#### Open/Closed Principle (OCP)

- Components should be open for extension but closed for modification
- Use composition over inheritance
- Design components to accept props for customization
- Create extensible component APIs

#### Liskov Substitution Principle (LSP)

- Derived components should be substitutable for base components
- Maintain consistent prop interfaces
- Don't break expected component behavior in variants

#### Interface Segregation Principle (ISP)

- Don't force components to accept props they don't use
- Keep prop interfaces minimal and focused
- Split large prop interfaces into smaller ones

#### Dependency Inversion Principle (DIP)

- Depend on abstractions, not concrete implementations
- Use dependency injection through props/context
- Abstract external dependencies (localStorage, APIs)
- Create interfaces for third-party integrations

### 3. Business Logic in Pure Functions

- All business logic must be written as pure functions
- Pure functions should be testable without mocking
- Keep side effects out of business logic
- Business logic should be framework-agnostic
- Store pure functions in `utils/` directories

#### Pure Function Characteristics

- Given the same input, always return the same output
- No side effects (no API calls, no DOM manipulation, no state mutation)
- No dependency on external state
- Deterministic and predictable
- Easy to test and reason about

---

## Design Patterns

### 1. Separation of Concerns

Clearly separate different aspects of the application:

#### Three-Layer Architecture

**Presentation Layer (Components)**
- Handle UI rendering and user interactions
- Consume data from hooks/services
- Delegate business logic to utility functions
- Focus on user experience

**Business Logic Layer (Utils)**
- Pure functions for calculations and transformations
- Validation and formatting logic
- No React dependencies
- Framework-agnostic

**Data Layer (Services/Hooks)**
- API calls using RTK Query
- Data fetching and caching
- State management
- Custom hooks for data operations

### 2. Factory Functions

Use factory functions for creating:

- Complex configuration objects
- Chart configurations
- Form field definitions
- API request builders
- Test data generators
- Component prop builders

#### When to Use Factory Functions

- When object creation logic is complex
- When you need multiple variants of similar objects
- When configuration needs to be dynamic
- When you want to encapsulate creation logic

### 3. Error Isolation

Implement error boundaries and graceful degradation:

#### Error Boundary Strategy

- Use React Error Boundaries at feature level
- Catch and log errors without breaking entire app
- Provide fallback UI for error states
- Isolate errors to component subtrees

#### Error Handling Layers

- **Component Level:** Try-catch in event handlers
- **Feature Level:** Error boundaries for feature modules
- **App Level:** Global error boundary as last resort
- **API Level:** RTK Query error handling

#### Error Recovery

- Provide retry mechanisms for failed operations
- Show user-friendly error messages
- Log errors for debugging
- Prevent error propagation to parent components

### 4. Performance Optimization

Implement performance best practices throughout:

#### Component Optimization

- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Avoid unnecessary re-renders
- Use useCallback and useMemo appropriately

#### Code Splitting

- Lazy load routes and heavy features
- Split vendor bundles intelligently
- Use dynamic imports for large dependencies
- Implement progressive loading

#### Data Optimization

- Leverage RTK Query caching
- Implement pagination for large lists
- Use virtual scrolling for long lists
- Debounce search and filter operations

#### Asset Optimization

- Optimize images (WebP, lazy loading)
- Minimize bundle size
- Tree-shake unused code
- Use CDN for static assets

---

## File and Function Size Guidelines

### File Size Limits

**Maximum File Length: 250-300 lines**

#### Guidelines

- If a file exceeds 300 lines, it should be refactored
- Split large files into smaller, focused modules
- Extract helper functions to separate utility files
- Break large components into smaller sub-components

#### Exceptions

Files may exceed 300 lines only when:
- It's a comprehensive configuration file
- Breaking it would reduce code clarity
- It contains extensive TypeScript type definitions

### Function Size Limits

**Maximum Function Length: 60 lines**

#### Guidelines

- Functions exceeding 60 lines should be decomposed
- Extract complex logic into helper functions
- Use composition to build complex behaviors
- Each function should do one thing well

#### Best Practices

- Functions should be readable without scrolling
- If function has more than 3 levels of nesting, refactor
- Extract conditional logic into named functions
- Use early returns to reduce nesting

### Benefits of Size Limits

- Improved readability and maintainability
- Easier code reviews
- Better testability
- Reduced cognitive load
- Encourages modular design

---

## Code Organization Standards

### Component Structure

Every React component file should follow this order:

1. Import statements (grouped logically)
2. Type definitions/PropTypes
3. Constants (component-specific)
4. Helper functions (if any)
5. Main component definition
6. Styled components or class names
7. Export statement

### Import Organization

Group imports in this order:

1. External dependencies (React, antd, etc.)
2. Internal absolute imports (features, shared)
3. Relative imports from parent directories
4. Relative imports from same directory
5. Style imports
6. Type imports (if using TypeScript)

### Export Guidelines

- Use named exports for components, functions, constants
- Use default exports only for pages/routes
- Export all public APIs through feature's index.js
- Don't export internal implementation details

---

## Component Development

### Component Types

**Presentational Components**
- Focus on how things look
- Receive data via props
- No business logic
- Stateless when possible
- Highly reusable

**Container Components**
- Focus on how things work
- Handle data fetching
- Manage state
- Pass data to presentational components
- Connect to Redux/RTK Query

**Page Components**
- Represent routes
- Compose other components
- Handle page-level logic
- Use default export

### Component Best Practices

- Keep components small and focused
- Use composition over inheritance
- Accept configuration through props
- Avoid prop drilling (use context when needed)
- Make components testable
- Document complex component logic
- Use meaningful component names

### Component Composition

- Build complex UIs from simple components
- Use children prop for flexibility
- Implement render props when appropriate
- Create Higher-Order Components sparingly
- Prefer hooks over HOCs

---

## State Management

### State Management Strategy

**Local State (useState)**
- Component-specific UI state
- Form inputs
- Toggle states
- Temporary data

**Server State (RTK Query)**
- API data
- Cached responses
- Asynchronous operations
- Server-synchronized data

**Global State (Redux)**
- User authentication
- App-wide settings
- Theme preferences
- Complex cross-feature state

### RTK Query Guidelines

- Define all API endpoints in feature's services directory
- Use automatic refetching for real-time data
- Implement optimistic updates for better UX
- Tag entities for cache invalidation
- Use polling for live data when appropriate

### State Normalization

- Normalize nested/relational data
- Avoid data duplication
- Keep state shape flat
- Use IDs for relationships
- Update single source of truth

---

## Styling Guidelines

### Tailwind CSS Standards

**Utility-First Approach**
- Use Tailwind utilities as primary styling method
- Create custom components for repeated patterns
- Use @apply directive sparingly
- Maintain consistent spacing scale

**Responsive Design**
- Mobile-first approach
- Use Tailwind breakpoints consistently
- Test on multiple screen sizes
- Ensure touch-friendly interfaces

**Custom Configuration**
- Extend Tailwind theme for brand colors
- Define custom spacing/sizing scales
- Add project-specific utilities
- Document custom configurations

### Ant Design Integration

- Use Ant Design components as base
- Customize theme through ConfigProvider
- Override styles using Tailwind when needed
- Maintain consistent component patterns
- Don't fight the framework

### CSS Organization

- Keep global styles minimal
- Use CSS modules for component-specific styles
- Avoid inline styles except for dynamic values
- Use CSS variables for theme values
- Maintain consistent naming conventions

---

## Performance Standards

### Optimization Checklist

**Component Level**
- [ ] Memoize expensive calculations
- [ ] Use React.memo for pure components
- [ ] Implement proper dependency arrays
- [ ] Avoid anonymous functions in props
- [ ] Use useCallback for event handlers

**Data Fetching**
- [ ] Leverage RTK Query caching
- [ ] Implement pagination
- [ ] Use optimistic updates
- [ ] Prefetch predictable data
- [ ] Cancel obsolete requests

**Rendering**
- [ ] Virtualize long lists
- [ ] Lazy load routes
- [ ] Code split heavy features
- [ ] Debounce expensive operations
- [ ] Throttle scroll/resize handlers

**Assets**
- [ ] Optimize images
- [ ] Use appropriate image formats
- [ ] Implement lazy loading
- [ ] Minimize bundle size
- [ ] Use compression

### Performance Monitoring

- Use React DevTools Profiler
- Monitor bundle size
- Track Core Web Vitals
- Analyze render performance
- Measure API response times

---

## Error Handling

### Error Handling Strategy

**Prevention**
- Validate user input
- Type check with TypeScript/PropTypes
- Handle edge cases
- Defensive programming

**Detection**
- Use Error Boundaries
- Try-catch blocks for async operations
- RTK Query error handling
- Console error monitoring

**Recovery**
- Provide retry mechanisms
- Fallback UI components
- Graceful degradation
- User-friendly error messages

**Logging**
- Log errors to monitoring service
- Include error context
- Track error frequency
- Debug information for development

### Error Types

- **User Errors:** Validation, form errors → Show inline messages
- **Network Errors:** API failures → Show retry option
- **Application Errors:** Bugs, crashes → Show error boundary
- **System Errors:** Browser issues → Show system message

---

## Testing Requirements

### Testing Strategy

**Unit Tests**
- Test pure functions thoroughly
- Test component logic
- Test custom hooks
- Test utility functions
- Aim for 80%+ coverage

**Integration Tests**
- Test feature workflows
- Test component interactions
- Test API integration
- Test state management

**E2E Tests**
- Test critical user paths
- Test complete features
- Test cross-browser compatibility

### What to Test

- Business logic (pure functions)
- Component rendering
- User interactions
- API calls and responses
- Edge cases and error scenarios
- Accessibility features

### Testing Best Practices

- Write tests alongside code
- Test behavior, not implementation
- Use meaningful test descriptions
- Keep tests simple and focused
- Mock external dependencies
- Test accessibility

---

## Naming Conventions

### General Rules

- Use meaningful, descriptive names
- Avoid abbreviations unless universally known
- Be consistent across the codebase
- Use domain terminology

### Specific Conventions

**Files**
- Components: PascalCase (UserProfile.jsx)
- Utilities: camelCase (formatCurrency.js)
- Constants: UPPER_SNAKE_CASE file (API_ENDPOINTS.js)
- Hooks: camelCase with 'use' prefix (useAuth.js)

**Variables & Functions**
- camelCase for variables and functions
- PascalCase for components and classes
- UPPER_SNAKE_CASE for constants
- Descriptive names over short names

**Components**
- PascalCase for all React components
- Prefix custom hooks with 'use'
- Suffix context files with 'Context'
- Suffix provider components with 'Provider'

**APIs & Services**
- Suffix with 'Api' or 'Service'
- Use resource names in endpoints
- Use HTTP verbs in mutation names
- Group related endpoints

---

## Code Review Checklist

### Before Submitting PR

**Code Quality**
- [ ] Follows feature-based architecture
- [ ] Adheres to DRY principle
- [ ] Implements SOLID principles
- [ ] No file exceeds 300 lines
- [ ] No function exceeds 60 lines
- [ ] Business logic in pure functions
- [ ] Proper error handling implemented

**Design Patterns**
- [ ] Separation of concerns maintained
- [ ] Factory functions used appropriately
- [ ] Error isolation implemented
- [ ] Performance optimizations applied

**Best Practices**
- [ ] Components are small and focused
- [ ] Props are properly typed
- [ ] No prop drilling
- [ ] Proper state management
- [ ] Follows naming conventions

**Testing**
- [ ] Unit tests written for pure functions
- [ ] Component tests added
- [ ] Integration tests for features
- [ ] All tests passing

**Performance**
- [ ] No unnecessary re-renders
- [ ] Proper memoization
- [ ] Images optimized
- [ ] Bundle size acceptable

**Documentation**
- [ ] Complex logic documented
- [ ] README updated if needed
- [ ] JSDoc for public functions
- [ ] Comments for non-obvious code

---

## General Guidelines

### Do's

✅ Write self-documenting code  
✅ Keep functions pure when possible  
✅ Use TypeScript for type safety  
✅ Write tests for critical logic  
✅ Optimize for readability  
✅ Follow established patterns  
✅ Ask for help when stuck  
✅ Review your own code first  
✅ Keep dependencies updated  
✅ Document breaking changes  

### Don'ts

❌ Don't copy-paste code  
❌ Don't ignore console warnings  
❌ Don't skip code reviews  
❌ Don't commit commented code  
❌ Don't mix concerns  
❌ Don't over-engineer  
❌ Don't ignore accessibility  
❌ Don't skip testing  
❌ Don't hardcode values  
❌ Don't ignore performance  

---

## Continuous Improvement

### Code Quality Tools

- **Linting:** ESLint with React and accessibility plugins
- **Formatting:** Prettier for consistent code style
- **Type Checking:** TypeScript or PropTypes
- **Testing:** Jest and React Testing Library
- **Performance:** Lighthouse, React DevTools

### Learning Resources

- Stay updated with React best practices
- Follow React RFC discussions
- Read RTK Query documentation
- Study Tailwind CSS patterns
- Review Ant Design guidelines

### Feedback Loop

- Regular code reviews
- Team knowledge sharing
- Retrospectives on code quality
- Refactoring sessions
- Performance audits

---

## Conclusion

These coding standards are living documents that should evolve with the project and team. The goal is to maintain high code quality, ensure scalability, and create a maintainable codebase that enables rapid feature development.

**Remember:**
- Standards exist to help, not hinder
- Apply principles with context
- Prioritize readability and maintainability
- Focus on value delivery
- Continuously improve

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Team:** B4USpend Frontend Development
