# 🔒 Security Policy

## Supported Versions

This project is actively maintained. We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.4.x   | ✅ Yes            |
| < 2.4   | ❌ No             |

---

## 🛡️ Security Considerations

### Camera Privacy
This application accesses your webcam to perform object detection. Please be aware:
- Video feed is processed **locally** on your machine
- No video data is sent to external servers by default
- Ensure you trust any modifications to the code before running

### Network Security
- The application runs on `localhost` by default
- Backend server (Flask) runs on port `5000`
- Frontend server (Vite) runs on port `5173`
- CORS is enabled for local development
- For production deployment, configure proper CORS policies

### Dependencies
- Regularly update dependencies for security patches
- Review `requirements.txt` (Python) and `package.json` (Node.js)
- Use tools like `npm audit` and `pip-audit` to check for vulnerabilities

### API Keys
- Never commit API keys to version control
- Use `.env.local` for sensitive configuration
- The `.gitignore` is configured to exclude `.env*` files (except `.env.example`)

---

## 🐛 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue
Please do not report security vulnerabilities through public GitHub issues.

### 2. Report Privately
Send a report to: **[your-email@example.com]**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time
- We will acknowledge your report within **48 hours**
- We will provide a detailed response within **7 days**
- We will work on a fix and keep you updated on progress

### 4. Disclosure Policy
- We request that you give us **90 days** to fix the issue before public disclosure
- We will credit you in the fix announcement (unless you prefer to remain anonymous)

---

## 🔐 Security Best Practices

### For Developers

#### Code Security
```python
# ❌ Don't do this - hardcoded credentials
api_key = "my-secret-key"

# ✅ Do this - use environment variables
import os
api_key = os.getenv('GEMINI_API_KEY')
```

#### Input Validation
```python
# Always validate user inputs
@app.route('/api/trigger', methods=['POST'])
def trigger_detection():
    data = request.get_json() or {}
    # Validate and sanitize inputs
    detection_type = str(data.get('type', 'Unknown'))[:50]  # Limit length
```

#### Error Handling
```python
# Don't expose sensitive information in errors
try:
    # Operations
    pass
except Exception as e:
    logger.error(f"Internal error: {e}")
    return jsonify({"error": "Internal server error"}), 500
    # Don't return: {"error": str(e)}  # This might expose sensitive info
```

### For Deployment

#### Environment Variables
```bash
# Use strong, unique values for production
export FLASK_SECRET_KEY=$(openssl rand -hex 32)
export GEMINI_API_KEY="your-secure-api-key"
```

#### HTTPS
```python
# Always use HTTPS in production
if app.config['ENV'] == 'production':
    # Enforce HTTPS
    pass
```

#### Firewall
```bash
# Only expose necessary ports
# Allow ports 5000 and 5173 only from trusted sources
```

---

## 📋 Security Checklist

Before deploying to production:

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] CORS is configured for specific origins (not `*`)
- [ ] HTTPS is enabled
- [ ] Dependencies are up to date
- [ ] Unnecessary ports are closed
- [ ] Error messages don't expose sensitive information
- [ ] Logging is configured (but doesn't log sensitive data)
- [ ] Rate limiting is implemented for API endpoints
- [ ] Input validation is in place
- [ ] Authentication is implemented (if needed)

---

## 🔍 Known Security Considerations

### 1. Camera Access
- Application requires camera permissions
- Users should be aware of when the camera is active
- Consider adding visual indicators (e.g., recording light)

### 2. Local Network Exposure
- By default, backend runs on `0.0.0.0` (all interfaces)
- For development only, change to `127.0.0.1` for localhost-only

### 3. Data Storage
- Detection logs are kept in memory (not persistent)
- If implementing database storage, ensure proper encryption

### 4. Third-party Dependencies
- OpenCV: Keep updated for security patches
- Flask: Monitor for security advisories
- React: Follow React security best practices

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Flask Security](https://flask.palletsprojects.com/en/latest/security/)
- [React Security](https://react.dev/learn/security)
- [Python Security](https://python.readthedocs.io/en/latest/library/security_warnings.html)

---

## 📜 License

This security policy is part of the Edge-AI Security Dashboard project and is licensed under the MIT License.

---

<div align="center">

**Security is everyone's responsibility. Stay safe!** 🛡️

</div>
