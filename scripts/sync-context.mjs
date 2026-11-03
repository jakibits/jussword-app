#!/usr/bin/env node

/**
 * sync-context.mjs
 * Auto-updates PROJECT_CONTEXT.md metadata header before builds and deployments.
 * Runs via npm prebuild or npm run update-context.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const contextFilePath = resolve(rootDir, 'PROJECT_CONTEXT.md');
const packageJsonPath = resolve(rootDir, 'package.json');

function getGitInfo() {
  try {
    const branch =
      process.env.VERCEL_GIT_COMMIT_REF ||
      process.env.GIT_BRANCH ||
      execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf-8' }).trim();

    const commit =
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf-8' }).trim();

    const lastCommitDate = execSync('git log -1 --format=%cd --date=iso', {
      cwd: rootDir,
      encoding: 'utf-8',
    }).trim();

    return { branch, commit, lastCommitDate };
  } catch {
    return {
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'master',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'latest',
      lastCommitDate: new Date().toISOString(),
    };
  }
}

function getPackageVersion() {
  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return pkg.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function syncContext() {
  if (!existsSync(contextFilePath)) {
    console.warn('[sync-context] PROJECT_CONTEXT.md does not exist yet. Skipping sync.');
    return;
  }

  const { branch, commit, lastCommitDate } = getGitInfo();
  const version = getPackageVersion();
  const buildTimestamp = new Date().toISOString();

  let content = readFileSync(contextFilePath, 'utf-8');

  const metadataBlock = `<!-- AUTO-CONTEXT-METADATA-START -->
| Attribute | Value |
| :--- | :--- |
| **App Name** | \`jussword\` |
| **Live Production URL** | https://jussword.vercel.app |
| **GitHub Repository** | https://github.com/jakibits/jussword-app |
| **Package Version** | \`v${version}\` |
| **Active Branch** | \`${branch}\` |
| **Last Commit** | \`${commit}\` (${lastCommitDate}) |
| **Context Synced At** | \`${buildTimestamp}\` (Automated build hook) |
<!-- AUTO-CONTEXT-METADATA-END -->`;

  const regex = /<!-- AUTO-CONTEXT-METADATA-START -->[\s\S]*?<!-- AUTO-CONTEXT-METADATA-END -->/;

  if (regex.test(content)) {
    content = content.replace(regex, metadataBlock);
  } else {
    // If markers are missing, prepend after the top title
    const titleMatch = content.match(/^# [^\n]+\n+/);
    if (titleMatch) {
      const title = titleMatch[0];
      const rest = content.slice(title.length);
      content = `${title}\n${metadataBlock}\n\n${rest}`;
    } else {
      content = `${metadataBlock}\n\n${content}`;
    }
  }

  writeFileSync(contextFilePath, content, 'utf-8');
  console.log(`[sync-context] Successfully updated PROJECT_CONTEXT.md (v${version} @ ${commit} [${branch}])`);
}

syncContext();
