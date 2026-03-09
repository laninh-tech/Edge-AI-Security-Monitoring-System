# 🤝 Contributing to Edge-AI Security Dashboard

Thank you for your interest in contributing to the Edge-AI Security Dashboard! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

---

## 📜 Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/edge-ai-security-dashboard.git
   cd edge-ai-security-dashboard
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/edge-ai-security-dashboard.git
   ```

---

## 💡 How to Contribute

### 🐛 Reporting Bugs

If you find a bug, please create an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Python version, Node version)

### ✨ Suggesting Features

We love new ideas! Please create an issue with:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach

### 📝 Code Contributions

1. Check existing issues or create a new one
2. Comment on the issue to let others know you're working on it
3. Follow the development setup and pull request process below

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+
- Git

### Installation

1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run the development servers**:
   ```bash
   # Method 1: Automatic (Windows)
   run_all.bat

   # Method 2: Manual
   # Terminal 1
   python python_server.py

   # Terminal 2
   npm run dev
   ```

---

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards below
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Test both servers
python python_server.py
npm run dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add vehicle counting feature"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Create a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill in the PR template with:
  - Description of changes
  - Related issue number
  - Screenshots (if UI changes)
  - Testing performed

### 7. Address Review Feedback

- Respond to comments
- Make requested changes
- Push updates to your branch (PR will update automatically)

---

## 📏 Coding Standards

### Python Code

- Follow [PEP 8](https://pep8.org/) style guide
- Use meaningful variable names
- Add docstrings for functions and classes
- Keep functions focused and concise

Example:
```python
def detect_objects(frame, confidence_threshold=0.5):
    """
    Detect objects in the given frame using YOLOv8.
    
    Args:
        frame: Input image frame (numpy array)
        confidence_threshold: Minimum confidence for detections (0.0-1.0)
    
    Returns:
        List of detection dictionaries
    """
    # Implementation
    pass
```

### TypeScript/React Code

- Use TypeScript types for all variables and functions
- Follow React best practices and hooks guidelines
- Use functional components
- Keep components small and focused
- Use meaningful component and variable names

Example:
```typescript
interface DetectionLog {
  id: number;
  type: string;
  confidence: number;
  timestamp: string;
  alert: boolean;
}

const LogItem: React.FC<{ log: DetectionLog }> = ({ log }) => {
  return (
    <div className="log-item">
      {/* Component implementation */}
    </div>
  );
};
```

### CSS/Styling

- Use TailwindCSS utility classes
- Keep custom CSS minimal
- Use semantic class names
- Maintain consistent spacing and sizing

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Video feed displays correctly
- [ ] Object detection works
- [ ] Real-time updates (SSE) work
- [ ] Charts update correctly
- [ ] No console errors
- [ ] Responsive design works on mobile
- [ ] All features in the affected areas work

### Future: Automated Testing

We're working on adding automated tests. Contributions in this area are highly welcome!

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [OpenCV Documentation](https://docs.opencv.org/)

---

## ❓ Questions?

If you have questions about contributing:
- Open an issue with the `question` label
- Check existing discussions
- Reach out to maintainers

---

## 🎉 Recognition

All contributors will be recognized in our README and release notes!

Thank you for contributing to Edge-AI Security Dashboard! 🚀

---

<div align="center">

Made with ❤️ by the community

</div>
