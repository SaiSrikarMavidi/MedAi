# Git & GitHub Setup Guide for MediAI

## ✅ Step 1: Local Git Repository (COMPLETED)

Your local Git repository has been initialized and the initial commit is created!

```bash
✓ Git initialized
✓ All files added
✓ Initial commit created
```

---

## 🚀 Step 2: Publish to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop** (if not installed):
   - Visit: https://desktop.github.com/
   - Install and sign in with your GitHub account

2. **Add Repository**:
   - Open GitHub Desktop
   - File → Add Local Repository
   - Choose folder: `G:\MedAi`
   - Click "Add Repository"

3. **Publish to GitHub**:
   - Click "Publish repository" button
   - Repository name: `MediAI` or `medai-healthcare-platform`
   - Description: "AI-Powered Intelligent Healthcare Platform with Swiss Design"
   - Choose: Public or Private
   - Click "Publish Repository"

✅ **Done!** Your repository is now on GitHub.

---

### Option B: Using Command Line

1. **Create GitHub Repository**:
   - Go to: https://github.com/new
   - Repository name: `MediAI` or `medai-healthcare-platform`
   - Description: "AI-Powered Intelligent Healthcare Platform"
   - Choose: Public or Private
   - **DO NOT** initialize with README (we already have one)
   - Click "Create repository"

2. **Connect Local to GitHub**:
   ```bash
   cd G:\MedAi
   git remote add origin https://github.com/YOUR_USERNAME/MediAI.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

3. **Enter Credentials**:
   - You'll be prompted for GitHub credentials
   - Use Personal Access Token (not password)
   - To create token: GitHub → Settings → Developer settings → Personal access tokens

---

## 📋 Step 3: Working with Git (Daily Workflow)

### Making Changes

```bash
# 1. Check what changed
git status

# 2. Add specific files
git add frontend/src/pages/NewPage.jsx

# Or add all changes
git add .

# 3. Commit with message
git commit -m "Add new feature: XYZ"

# 4. Push to GitHub
git push
```

### Common Commands

```bash
# See commit history
git log --oneline

# See what changed in files
git diff

# Undo changes (before commit)
git checkout -- filename.jsx

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Pull latest changes
git pull
```

---

## 🌿 Step 4: Branching Strategy (Recommended)

### Main Branches
- `main` - Production-ready code
- `develop` - Development branch

### Feature Branches
- `feature/backend-api` - Backend development
- `feature/ai-integration` - AI/LLM integration
- `feature/video-consultation` - Video calls
- `fix/bug-name` - Bug fixes

### Workflow
```bash
# Create feature branch
git checkout -b feature/backend-api

# Work on feature, commit changes
git add .
git commit -m "Add authentication API"

# Push feature branch
git push -u origin feature/backend-api

# Create Pull Request on GitHub
# After review, merge to main
```

---

## 👥 Step 5: Collaboration

### Invite Collaborators
1. Go to your GitHub repository
2. Settings → Collaborators
3. Add people by username/email

### Working in Parallel

**Person 1 (Frontend)**:
```bash
git checkout -b feature/ui-improvements
# Make changes
git commit -m "Improve UI animations"
git push
```

**Person 2 (Backend)**:
```bash
git checkout -b feature/backend-api
# Make changes
git commit -m "Add FastAPI endpoints"
git push
```

**Merging Work**:
```bash
# Switch to main
git checkout main

# Pull latest
git pull

# Merge feature
git merge feature/backend-api

# Push
git push
```

---

## 🔄 Step 6: Syncing Changes

### Pull Latest Changes
```bash
# Before starting work
git pull origin main

# If conflicts occur
# 1. Git will mark conflicts in files
# 2. Open files and resolve conflicts
# 3. git add resolved-file.jsx
# 4. git commit -m "Resolve merge conflicts"
# 5. git push
```

---

## 📦 Step 7: .gitignore (Already Created)

Your `.gitignore` file prevents these from being committed:
- `node_modules/` - Dependencies (large)
- `.env` - Secrets and API keys
- `dist/` - Build files
- `.vscode/` - Editor settings

---

## 🎯 Quick Reference

### First Time Setup
```bash
git init                                    # ✅ Done
git add .                                   # ✅ Done
git commit -m "Initial commit"              # ✅ Done
git remote add origin <github-url>          # ⏳ Do this
git push -u origin main                     # ⏳ Do this
```

### Daily Workflow
```bash
git pull                    # Get latest changes
# ... make changes ...
git add .                   # Stage changes
git commit -m "message"     # Commit changes
git push                    # Push to GitHub
```

### Branching
```bash
git checkout -b feature/name    # Create & switch to branch
git checkout main               # Switch to main
git merge feature/name          # Merge branch
git branch -d feature/name      # Delete branch
```

---

## 🛡️ Best Practices

### Commit Messages
✅ Good:
- "Add doctor consultation page"
- "Fix: Medicine reminder notification bug"
- "Update: Improve chatbot UI animations"

❌ Bad:
- "update"
- "fix stuff"
- "changes"

### Commit Frequency
- Commit often (every logical change)
- Don't commit broken code to `main`
- Test before pushing

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/update-readme` - Documentation

---

## 🚨 Important Notes

1. **Never commit**:
   - API keys or secrets (use `.env`)
   - `node_modules/` folder
   - Large binary files
   - Personal credentials

2. **Always**:
   - Pull before starting work
   - Test before committing
   - Write clear commit messages
   - Push regularly

3. **Environment Variables**:
   Create `.env.example` with dummy values:
   ```
   VITE_API_URL=http://localhost:8000
   VITE_OPENAI_API_KEY=your_key_here
   ```
   
   Never commit actual `.env` file!

---

## 📞 Next Steps

1. **Publish to GitHub** (choose Option A or B above)
2. **Share repository URL** with collaborators
3. **Set up branch protection** (optional):
   - Settings → Branches → Add rule
   - Require pull request reviews
   - Require status checks

4. **Enable GitHub Actions** (optional):
   - Automated testing
   - Deployment workflows

---

## 🎓 Learn More

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf

---

**Your repository is ready to be published! Choose your preferred method above and let's get it on GitHub! 🚀**
