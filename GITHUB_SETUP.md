# GitHub Repository Setup Instructions

## Manual Repository Creation

Since GitHub CLI is not available, please follow these steps to create the repository:

### Step 1: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the following details:
   - **Repository name**: `michael-evans-portfolio`
   - **Description**: "Personal portfolio site built with React, Vite, and TypeScript"
   - **Visibility**: Choose Public or Private based on your preference
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Copy the Repository URL

After creating the repository, GitHub will show you a quick setup page.
Copy the repository URL, which will look like:
- HTTPS: `https://github.com/YOUR_USERNAME/michael-evans-portfolio.git`
- SSH: `git@github.com:YOUR_USERNAME/michael-evans-portfolio.git`

### Step 3: Add Remote and Push

Once you have the repository URL, run these commands in your terminal:

```bash
# Add the remote repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/michael-evans-portfolio.git

# Verify the remote was added
git remote -v

# Push the code to GitHub
git push -u origin main
```

### Alternative: Using GitHub Desktop

If you prefer a GUI approach:
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Browse to `/Users/michaelevans/michael-evans-port-main`
5. Click "Publish repository" to create and push to GitHub

## After Setup

Once the repository is on GitHub, you can:

1. **Enable GitHub Pages** (if you want to deploy directly from GitHub):
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)
   - Save

2. **Set up GitHub Actions** for CI/CD (optional):
   - The repository includes a workflow template
   - Customize as needed for your deployment

3. **Configure Branch Protection** (recommended):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Enable: Require pull request reviews before merging

## Repository Structure

Your repository is ready with:
- ✅ Complete portfolio site code
- ✅ Architecture documentation
- ✅ Memory bank system
- ✅ Sanity CMS implementation plan
- ✅ All components and pages
- ✅ Git history initialized

## Next Steps

After pushing to GitHub:
1. Set up deployment (Vercel, Netlify, or GitHub Pages)
2. Configure environment variables for production
3. Consider adding GitHub Actions for automated testing
4. Update README with live site URL once deployed

---

*Note: The repository is currently only in your local machine. Follow the steps above to push it to GitHub.*