# 🚀 The Complete Beginner-Friendly Guide to Launching jussword

This step-by-step guide will walk you through pushing your code to GitHub, optimizing your repository for search engines (SEO/GEO), and deploying it for free on **Vercel** (`jussword.vercel.app`).

---

## 📋 Step 1: Commit and Push Your Code to GitHub

Open your Mac terminal (or run these commands in your project folder `/Users/jakib/Desktop/jussword-app`):

```bash
# 1. Stage all new files and enhancements
git add .

# 2. Create a clean release commit
git commit -m "feat: complete jussword v1.0.0 release with PWA, haptics, and sayable pseudo-words"

# 3. Rename branch to main (recommended GitHub standard)
git branch -M main

# 4. Push to your GitHub repository
git push -u origin main
```

*(If prompted by GitHub for authentication, enter your GitHub username and Personal Access Token or sign in via the browser popup).*

---

## 🌐 Step 2: Make Your GitHub Repository SEO & GEO Friendly

GitHub repositories rank exceptionally well on Google and Bing when properly configured. Here are the exact settings to fill out on your GitHub repo page:

### 1. Repository "About" Section (Top Right of GitHub page)
Click the ⚙️ **Gear icon** next to **About** on your GitHub repo:
- **Description:**  
  `Just a simple, secure, and pronounceable password generator for the masses. 100% offline & client-side PWA.`
- **Website:**  
  `https://jussword.vercel.app` (or `https://jussword.app`)
- **Include in home page:** Check both `Releases` and `Packages`.

### 2. Topics / Tags (Crucial for GitHub & Google search indexing)
Add these exact comma-separated topics under the About section:
```text
password-generator, password-security, diceware, passphrase-generator, pseudo-words, pwa, client-side, cryptography, offline-first, react, typescript, tailwindcss, vite, privacy, security-tools
```

### 3. Custom Social Preview Image (OpenGraph for GitHub)
1. Go to your repo **Settings** tab.
2. Scroll down to the **Social preview** section.
3. Click **Edit** → **Upload an image**.
4. Select `public/jussword-opengraph-preview.png` (or `public/og-preview.svg`) from your project folder.
5. Now, whenever someone pastes your GitHub link on Twitter, LinkedIn, Discord, or Reddit, it displays a gorgeous branded preview card!

---

## ⚡ Step 3: 1-Click Free Deployment on Vercel

Vercel provides automated continuous deployment on a global CDN:

1. **Sign in to Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **Sign Up** / **Log In** with your **GitHub** account.

2. **Import Your Repository:**
   - Click the **"Add New..."** button (top right) → select **"Project"**.
   - You will see `jakibits/jussword-app` listed. Click **"Import"**.

3. **Configure Project:**
   - **Project Name:** Type `jussword` (this will automatically grant you `jussword.vercel.app`).
   - **Framework Preset:** Vite (Vercel automatically detects this).
   - **Root Directory:** `./` (default).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).

4. **Click "Deploy":**
   - In ~20 seconds, your site will be live across worldwide edge servers at:  
     👉 **`https://jussword.vercel.app`**

5. **Continuous Deployment (Automatic Updates):**
   - Any time in the future you run `git push origin main`, Vercel will automatically rebuild and deploy your changes in seconds with zero manual work!

---

## 🏷️ Step 4: Adding `jussword.app` Custom Domain (Whenever You Purchase It)

When you are ready to use `jussword.app`:
1. In your **Vercel Project Dashboard**, go to **Settings** → **Domains**.
2. Type `jussword.app` and click **Add**.
3. Vercel will display 2 simple DNS records (an `A` record and a `CNAME`).
4. Paste those records into your domain registrar (e.g. Cloudflare, Namecheap, or Porkbun).
5. Vercel will automatically verify it and issue a free SSL certificate within 2 minutes.

---

## ☕ Step 5: Community Sponsorships (Free)

In your GitHub repository, the `.github/FUNDING.yml` file is already created and points to your `bio.link/jakib`.
- To activate the **Sponsor** button on GitHub:
  1. Go to your repo **Settings** → scroll to **Features**.
  2. Ensure the **Sponsorships** checkbox is ticked.
  3. A pink **"Sponsor"** heart button will now appear on your GitHub repository!
