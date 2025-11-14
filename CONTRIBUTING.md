# Contributing to Health Chatbot

Thank you for your interest in contributing to the Health Chatbot project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow best practices
- Help others learn and grow

## Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" button on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/my-health-chatbot.git
cd my-health-chatbot
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Tests

### 3. Make Your Changes

Follow the coding standards and commit guidelines below.

### 4. Submit a Pull Request

Push to your fork and create a pull request with:
- Clear description of changes
- Reference to related issues
- Screenshots if UI changes

## Coding Standards

### JavaScript/React

```javascript
// ✅ GOOD: Clear variable names
const userAuthToken = localStorage.getItem('token');

// ❌ BAD: Unclear abbreviations
const uat = localStorage.getItem('token');

// ✅ GOOD: Proper function formatting
const processUserInput = (input) => {
  if (!input) return null;
  return input.trim();
};

// ✅ GOOD: Proper component structure
const MyComponent = () => {
  const [state, setState] = React.useState('initial');
  
  return (
    <div className="my-component">
      {state}
    </div>
  );
};
```

### CSS/Tailwind

```css
/* ✅ GOOD: Use Tailwind utilities */
<div className="flex items-center justify-center p-4 bg-gray-100">
  Content
</div>

/* ✅ GOOD: Component-specific styles */
/* App.css */
.chat-window {
  display: flex;
  flex-direction: column;
}

/* ❌ BAD: Inline styles */
<div style={{display: 'flex', flexDirection: 'column'}}>
```

### Comments

```javascript
// ✅ GOOD: Meaningful comments
// Check if user has valid authentication token
// and token hasn't expired
const isAuthenticated = token && !isExpired(token);

// ❌ BAD: Obvious comments
// Get the token
const token = localStorage.getItem('token');

// ✅ GOOD: JSDoc for functions
/**
 * Transcribe audio to text using OpenAI Whisper API
 * @param {Blob} audioBlob - Audio file as blob
 * @returns {Promise<string>} Transcribed text
 * @throws {Error} If transcription fails
 */
const transcribeAudio = async (audioBlob) => {
  // Implementation
};
```

## Commit Message Guidelines

```
# ✅ GOOD format: [TYPE] Concise description

[FEAT] Add voice recording to virtual doctor
[FIX] Fix audio playback issue on Safari
[DOCS] Update API documentation
[TEST] Add tests for authentication
[REFACTOR] Improve error handling in chat component

# ❌ BAD format:
Updated stuff
fixed bug
WIP
```

### Commit Message Template

```
[TYPE] Brief description (50 chars or less)

Detailed explanation of changes (if needed).
Explain what was changed and why.

Fixes #123 (if fixing an issue)
Closes #456 (if closing an issue)
```

## Testing

### Frontend Testing

```bash
cd client
npm test
```

Write tests for:
- Component rendering
- User interactions
- API calls
- State management

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});
```

### Backend Testing

```bash
cd server
npm test
```

Test:
- API endpoints
- Database operations
- Authentication
- Error handling

## File Organization

### New Components

```
client/src/components/myfeature/
├── MyFeature.jsx
├── MyFeature.css
└── MyFeature.test.js
```

### New API Routes

```
server/
├── routes/
│   └── myfeatureRoutes.js
├── controllers/
│   └── myfeatureController.js
└── models/
    └── MyFeature.js
```

## Documentation

### README Updates

- Add new features to README
- Update installation instructions if needed
- Add examples for new functionality

### Code Documentation

- Add JSDoc comments to functions
- Document complex logic
- Explain non-obvious code

### API Documentation

- Update API_DOCUMENTATION.md
- Include request/response examples
- Document new endpoints

## Performance Considerations

### Frontend

```javascript
// ✅ GOOD: Use useMemo for expensive computations
const memoizedValue = React.useMemo(() => {
  return expensiveComputation(a, b);
}, [a, b]);

// ✅ GOOD: Use useCallback for stable function references
const memoizedCallback = React.useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// ✅ GOOD: Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Backend

```javascript
// ✅ GOOD: Use async/await and don't block
const processData = async (data) => {
  const result = await database.save(data);
  return result;
};

// ✅ GOOD: Connection pooling for database
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
};
```

## Security Considerations

- Never commit `.env` files
- Don't expose API keys
- Validate all user inputs
- Sanitize data before storage
- Use HTTPS in production
- Keep dependencies updated

## Common Issues

### 1. CORS Errors

**Issue:** Cross-origin request blocked

**Fix:**
- Ensure backend is running
- Check CORS configuration
- Verify API URL in .env

### 2. Database Connection Failed

**Issue:** Cannot connect to MongoDB

**Fix:**
- Verify MongoDB is running
- Check connection string
- Check firewall settings

### 3. Build Errors

**Issue:** npm run build fails

**Fix:**
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

## Code Review Process

1. **Self-review** - Review your own code first
2. **Run tests** - Ensure all tests pass
3. **Check formatting** - Use prettier/eslint
4. **Submit PR** - Create pull request
5. **Await review** - Maintainers will review
6. **Address feedback** - Make requested changes
7. **Merge** - PR merged to main branch

### Review Checklist

- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] Comments are clear and necessary
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Performance optimized
- [ ] Security considered

## Useful Commands

```bash
# Frontend
cd client
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from CRA (⚠️ irreversible)

# Backend
cd server
npm install          # Install dependencies
npm start            # Start server
npm run dev          # Start with nodemon
npm test             # Run tests
```

## Directory Structure for New Features

```
# New feature in dashboard
client/src/components/dashboard/NewFeature/
  ├── NewFeature.jsx
  ├── NewFeature.css
  ├── NewFeature.test.js
  └── index.js

# New API in backend
server/
  ├── routes/newFeature.js
  ├── controllers/newFeatureController.js
  ├── models/NewFeature.js
  └── middleware/newFeatureMiddleware.js
```

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Development Tools

### Recommended IDE Extensions

**VS Code:**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint - JavaScript linter
- Thunder Client - API testing
- MongoDB for VS Code

### Chrome Extensions

- React Developer Tools
- Redux DevTools
- JSONView
- Postman

## Deployment

### Staging Environment

1. Push to `develop` branch
2. Automated tests run
3. Auto-deploy to staging
4. Manual testing on staging

### Production Environment

1. Create PR from `develop` to `main`
2. Code review and approval
3. Merge to `main`
4. Auto-deploy to production
5. Verify deployment

## Support and Questions

- Open an issue for bugs
- Start a discussion for questions
- Check existing issues before posting
- Provide detailed information when reporting bugs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Acknowledged in release notes
- Highlighted in project documentation

Thank you for contributing! 🎉
