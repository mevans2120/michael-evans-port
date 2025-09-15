# Session Management Guide

This guide provides checklists and workflows for managing development sessions effectively with the Memory Bank system.

## 📝 Session Start Checklist

### 1. Environment Setup
```bash
# Check git status
git status
git pull origin main

# Review recent commits
git log --oneline -10

# Check for dependency updates
npm outdated
```

### 2. Memory Bank Review
```bash
# Review current status
cat memory-bank/CURRENT.md

# Check recent progress
tail -30 memory-bank/PROGRESS.md

# Review any blockers or notes
grep -n "TODO\|FIXME\|NOTE" memory-bank/*.md
```

### 3. AI Assistant Context (If Using)
```markdown
"Please review the memory bank files in the memory-bank/ directory, particularly:
- CURRENT.md for active work
- PROGRESS.md for recent changes
- TECHNICAL_DECISIONS.md for architectural context"
```

### 4. Set Session Goals
- [ ] Review carried-over tasks from CURRENT.md
- [ ] Identify 3-5 specific goals for this session
- [ ] Check dependencies and blockers
- [ ] Update CURRENT.md with session start time

## 🔄 During Session Workflow

### Code Changes
1. **Before Making Changes**
   - Review existing code patterns
   - Check ARCHITECTURE.md for standards
   - Consider impact on other components

2. **While Coding**
   - Follow established coding standards
   - Write meaningful commit messages
   - Update tests for new features
   - Document complex logic inline

3. **Track Progress**
   - Note completed tasks
   - Document any decisions made
   - Record blockers encountered
   - Keep rough notes for session end

### Decision Making
When making technical decisions:
1. Document the context
2. List alternatives considered
3. Explain the chosen approach
4. Note any trade-offs
5. Update TECHNICAL_DECISIONS.md if significant

## 📋 Session End Checklist

### 1. Code Cleanup
```bash
# Run linting
npm run lint

# Run tests (when available)
npm test

# Check for TypeScript errors
npx tsc --noEmit

# Format code (if formatter configured)
npm run format
```

### 2. Update Memory Bank

#### Update PROGRESS.md
Add new entry following this template:
```markdown
## [YYYY-MM-DD HH:MM] - Session Title

### Summary
Brief overview of what was accomplished

### Completed
- ✅ Specific task with details
- ✅ Another completed item

### In Progress
- 🔄 Ongoing work (% complete)

### Blocked
- ❌ Any blockers and why

### Technical Decisions
- Decision made and rationale

### Next Session
- Priority items for next time

### Notes
- Important observations
- Links to relevant commits/PRs
```

#### Update CURRENT.md
- Move completed items to "Recent Accomplishments"
- Update "In Progress" items with current status
- Add new items to "Next Steps"
- Update "Last Updated" timestamp
- Add any new blockers or considerations

#### Update Other Files (If Applicable)
- **CHANGELOG.md**: For feature completions or releases
- **TECHNICAL_DECISIONS.md**: For architectural decisions
- **CONTEXT.md**: For requirement changes

### 3. Git Commit
```bash
# Stage memory bank updates
git add memory-bank/

# Commit with descriptive message
git commit -m "docs: Update memory bank - [session summary]"

# Stage and commit code changes separately
git add .
git commit -m "feat/fix/refactor: [specific change description]"

# Push changes
git push origin main
```

### 4. Final Checks
- [ ] All changes committed
- [ ] Memory bank updated
- [ ] No sensitive data exposed
- [ ] Build still works
- [ ] Tests passing (when available)

## 🛠️ Useful Commands

### Memory Bank Management
```bash
# Quick status check
alias mb-status='ls -la memory-bank/*.md | grep -E "md$"'

# View current status
alias mb-current='cat memory-bank/CURRENT.md'

# View recent progress
alias mb-progress='tail -50 memory-bank/PROGRESS.md'

# Search memory bank
alias mb-search='grep -r "$1" memory-bank/'

# Open all memory bank files in editor
alias mb-edit='code memory-bank/*.md'
```

### Development Helpers
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check bundle size
npm run build && ls -lh dist/assets/*.js
```

## 📚 Templates

### Feature Development Template
```markdown
## Feature: [Feature Name]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Implementation Plan
1. Step 1
2. Step 2

### Testing Plan
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

### Documentation
- [ ] Code comments
- [ ] README update
- [ ] Memory bank update
```

### Bug Fix Template
```markdown
## Bug: [Bug Description]

### Reproduction Steps
1. Step to reproduce
2. Expected behavior
3. Actual behavior

### Root Cause
Description of why it happens

### Solution
How it was fixed

### Testing
How to verify the fix
```

### Refactoring Template
```markdown
## Refactor: [Area/Component]

### Motivation
Why refactoring is needed

### Changes Made
- Change 1
- Change 2

### Impact
- What's affected
- What's improved

### Verification
- [ ] No functionality broken
- [ ] Tests updated
- [ ] Performance checked
```

## 🎯 Best Practices

### DO's
✅ Update memory bank immediately after session
✅ Be specific about what was changed
✅ Include file paths and function names
✅ Document the "why" behind decisions
✅ Link to relevant commits or PRs
✅ Keep entries concise but complete

### DON'Ts
❌ Leave memory bank updates for "later"
❌ Write vague descriptions like "fixed stuff"
❌ Forget to update CURRENT.md status
❌ Include sensitive information
❌ Skip session due to "small changes"
❌ Let memory bank become stale

## 🔍 Troubleshooting

### Common Issues

#### "I forgot what I did in the session"
- Check `git diff` for uncommitted changes
- Review `git log` for recent commits
- Look at browser history for researched topics
- Check terminal history for commands run

#### "Memory bank is out of sync"
1. Review recent git commits
2. Update PROGRESS.md with missed sessions
3. Reconcile CURRENT.md with actual state
4. Archive old content if needed

#### "Not sure what to work on"
1. Check CURRENT.md "Next Steps"
2. Review GitHub issues (if using)
3. Look for TODO comments in code
4. Check TECHNICAL_DECISIONS.md for pending items

## 📅 Weekly Maintenance

Every week, consider:
- [ ] Archive old entries from CURRENT.md
- [ ] Review and close completed items
- [ ] Update project priorities
- [ ] Clean up any temporary notes
- [ ] Backup important decisions

## 🎉 Session Success Indicators

You know you had a good session when:
- ✅ All planned tasks were addressed
- ✅ Memory bank is fully updated
- ✅ Code is committed and pushed
- ✅ No broken functionality
- ✅ Clear next steps identified
- ✅ You can easily resume next time

---

*Remember: The memory bank is your friend. Keep it updated, and it will serve you well!*

*Pro Tip: Set a calendar reminder for end-of-session updates.*