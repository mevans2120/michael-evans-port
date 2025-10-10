#!/usr/bin/env node

/**
 * Memory Bank Session Start Script
 * Automates the session start checklist from SESSION_GUIDE.md
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    if (!options.silent) {
      log.error(`Command failed: ${command}`);
    }
    return null;
  }
}

function separator() {
  console.log(`${colors.blue}${'─'.repeat(60)}${colors.reset}`);
}

// Main session start process
async function sessionStart() {
  console.log(`
${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════╗
║        Memory Bank Session Start                       ║
╚════════════════════════════════════════════════════════╝${colors.reset}
  `);

  // 1. Environment Setup
  log.header('📦 Environment Setup');
  separator();

  // Check git status
  log.info('Checking git status...');
  const gitStatus = exec('git status --short');
  if (gitStatus && gitStatus.trim()) {
    log.warning('You have uncommitted changes:');
    console.log(gitStatus);
  } else {
    log.success('Working directory is clean');
  }

  // Check current branch
  const currentBranch = exec('git branch --show-current');
  if (currentBranch) {
    log.info(`Current branch: ${currentBranch.trim()}`);
  }

  // Recent commits
  log.info('Recent commits:');
  const recentCommits = exec('git log --oneline -5');
  if (recentCommits) {
    console.log(recentCommits);
  }

  // Check for dependency updates
  log.info('Checking for outdated dependencies...');
  const outdated = exec('npm outdated', { silent: true });
  if (outdated && outdated.trim()) {
    log.warning('Some dependencies are outdated (run "npm outdated" for details)');
  } else {
    log.success('Dependencies are up to date');
  }

  // 2. Memory Bank Review
  log.header('\n📚 Memory Bank Review');
  separator();

  const memoryBankPath = path.join(process.cwd(), 'memory-bank');

  // Check if memory bank exists
  if (!fs.existsSync(memoryBankPath)) {
    log.error('Memory bank directory not found!');
    process.exit(1);
  }

  // Read CURRENT.md
  const currentPath = path.join(memoryBankPath, 'CURRENT.md');
  if (fs.existsSync(currentPath)) {
    log.success('CURRENT.md found');
    const currentContent = fs.readFileSync(currentPath, 'utf8');

    // Extract key sections
    const inProgressMatch = currentContent.match(/## In Progress[\s\S]*?(?=\n## |$)/);
    const nextStepsMatch = currentContent.match(/## Next Steps[\s\S]*?(?=\n## |$)/);
    const blockersMatch = currentContent.match(/## Blockers\/Considerations[\s\S]*?(?=\n## |$)/);

    if (inProgressMatch) {
      console.log('\n' + colors.bright + 'In Progress:' + colors.reset);
      console.log(inProgressMatch[0].replace(/^## In Progress\n/, '').trim() || 'None');
    }

    if (nextStepsMatch) {
      console.log('\n' + colors.bright + 'Next Steps:' + colors.reset);
      console.log(nextStepsMatch[0].replace(/^## Next Steps\n/, '').trim() || 'None');
    }

    if (blockersMatch) {
      console.log('\n' + colors.bright + 'Blockers/Considerations:' + colors.reset);
      const blockers = blockersMatch[0].replace(/^## Blockers\/Considerations\n/, '').trim();
      if (blockers && blockers !== 'None currently identified.') {
        log.warning(blockers);
      } else {
        log.success('No blockers');
      }
    }
  } else {
    log.warning('CURRENT.md not found');
  }

  // Check recent progress
  const progressPath = path.join(memoryBankPath, 'PROGRESS.md');
  if (fs.existsSync(progressPath)) {
    log.success('PROGRESS.md found');
    const progressContent = fs.readFileSync(progressPath, 'utf8');
    const lines = progressContent.split('\n');
    const recentLines = lines.slice(-30);

    // Find the most recent session
    const sessionHeaders = recentLines.filter(line => line.match(/^## \[/));
    if (sessionHeaders.length > 0) {
      console.log('\n' + colors.bright + 'Most Recent Session:' + colors.reset);
      console.log(sessionHeaders[sessionHeaders.length - 1].replace('## ', ''));
    }
  }

  // Check for TODOs and FIXMEs
  log.info('\nSearching for TODOs, FIXMEs, and NOTEs in memory bank...');
  const todos = exec('grep -n "TODO\\|FIXME\\|NOTE" memory-bank/*.md', { silent: true });
  if (todos && todos.trim()) {
    console.log(todos);
  } else {
    log.success('No TODOs, FIXMEs, or NOTEs found');
  }

  // 3. Session Goals
  log.header('\n🎯 Session Goals');
  separator();
  console.log(`
${colors.bright}Suggested Actions:${colors.reset}
  1. Review carried-over tasks from CURRENT.md
  2. Identify 3-5 specific goals for this session
  3. Check dependencies and blockers
  4. Begin work on highest priority items

${colors.bright}Quick Commands:${colors.reset}
  ${colors.blue}npm run dev${colors.reset}       - Start development server
  ${colors.blue}npm run lint${colors.reset}      - Run linter
  ${colors.blue}npm run build${colors.reset}     - Build for production

${colors.bright}Memory Bank Files:${colors.reset}
  ${colors.blue}CURRENT.md${colors.reset}        - Active work and next steps
  ${colors.blue}PROGRESS.md${colors.reset}       - Session history
  ${colors.blue}TECHNICAL_DECISIONS.md${colors.reset} - Architecture decisions
  ${colors.blue}SESSION_GUIDE.md${colors.reset}  - Complete session management guide
  `);

  log.header('✨ Session Start Complete!');
  console.log(`${colors.green}Ready to code!${colors.reset}\n`);
}

// Run the script
sessionStart().catch(error => {
  log.error(`Session start failed: ${error.message}`);
  process.exit(1);
});
