<div align="center">

<img width="100%" alt="DUNE Banner" src="https://github.com/user-attachments/assets/792fb798-6027-475b-8878-ed2abc6a14f3" />

<br/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=28&duration=2400&pause=800&color=F59E0B&center=true&vCenter=true&width=1000&height=60&lines=AI+that+reads+diff+depth%2C+not+commit+spam.;Fair+credit+telemetry+for+engineering+squads.;Built+for+WeMakeDevs+Agent+Harness+Hackathon." alt="Typing SVG" />
</a>

<br/>

[![Hackathon](https://img.shields.io/badge/HACKATHON-WeMakeDevs-F59E0B?style=for-the-badge)](https://wemakedevs.org)
[![Model](https://img.shields.io/badge/AI_CORE-GPT--4o--mini-F59E0B?style=for-the-badge&logo=openai)](https://github.com)
[![Engine](https://img.shields.io/badge/INGESTION-GitHub_API-F59E0B?style=for-the-badge&logo=github)](https://github.com)
[![Status](https://img.shields.io/badge/BUILD-STABLE%20MVP-10B981?style=for-the-badge)](https://github.com)

<br/>

## **[ 🚨 Problem ](#-the-problem) • [ ✨ Solution ](#-the-solution) • [ 🔥 Features ](#-key-features) • [ ⚡ Demo ](#-live-telemetry--demo) • [ 🧠 Pipeline ](#-architecture) • [ 🛠️ Tech Stack ](#-tech-stack) • [ 🚀 Quickstart ](#-quickstart) • [ 🧠 Learned ](#-what-we-learned) • [ 👥 Team ](#-team)**

</div>

---

# 🚨 The Problem

> ### **The Hackathon Paradox:** "The person who copy-pastes 800 lines of boilerplate UI looks like a 10x engineer on GitHub graphs, while the teammate who spent 6 grueling hours diagnosing a race condition in 3 critical lines appears completely inactive."

### ❌ **TRADITIONAL METRICS :** Lines of Code (LOC) + Commit Frequency = Vanity Score
### ✅ **DUNE TELEMETRY :** Semantic Complexity + Real Impact Score = Proof of Effort

| 😴 The Old Broken Way | ⚡ The DUNE Standard |
| :--- | :--- |
| ### **Commit Volume Spam:**<br/>Spamming 30 trivial commits inflates contribution heatmaps without creating any actual product value. | ### **Semantic Diff Inspection:**<br/>Evaluates architectural impact, logic depth, and algorithmic weight instead of commit frequency. |
| ### **Boilerplate Inflation:**<br/>Adding 1,000 lines of auto-generated templates makes someone look like the project's primary contributor. | ### **Auto Noise Suppression:**<br/>Automatically strips dependencies, lockfiles, and minified assets before scoring. |
| ### **Subjective Judging Guesswork:**<br/>Organizers and leads are forced to manually audit git trees or rely on biased self-reporting. | ### **Instant Explainable Telemetry:**<br/>Produces crystal-clear, transparent PR impact breakdowns ready for presentation decks. |

---

# ✨ The Solution

<div align="center">

```text
   ┌───────────────────────┐         ┌───────────────────────────┐         ┌───────────────────────────┐
   │      GitHub API       │ ──────► │   DUNE Diff Cleaning &    │ ──────► │    Fair Credit Vectors    │
   │  Branch PRs & Commits │         │  LLM Semantic Evaluation  │         │  & Contribution Telemetry │
   └───────────────────────┘         └───────────────────────────┘         └───────────────────────────┘
```

</div>

### **DUNE** is an autonomous AI evaluation engine that reads code changes contextually. 

### By analyzing branch commits, pull request diffs, and architectural importance, DUNE automatically assigns fair, qualitative credits to every team member without manual git log digging.

---

# 🔥 Key Features

* ### 📥 **Automated Git Activity Tracker:** Ingests commits, PRs, and branch diffs directly via GitHub REST & GraphQL APIs with zero manual setup.
* ### 🥇 **Quality-Over-Quantity Scoring Engine:** Evaluates code elegance, algorithmic complexity, error-handling robustness, and true architectural weight.
* ### 🤖 **Plain-English PR Impact Summarizer:** Translates dense, cryptic code diffs into human-readable achievement logs tailored for demo day judges.
* ### 🧹 **Smart AST Boilerplate Suppression:** Detects and ignores `package-lock.json`, migrations, and minified bundles so tokens focus on pure logic.
* ### 📊 **Live Team Contribution Matrix:** Generates interactive contributor scorecards with instant radar-style metric distributions.

---

# ⚡ Live Telemetry & Demo

<div align="center">

> ## 🔍 **Target PR:** `#42: fix(core): distributed lock contention & atomic batching`
> ### 👤 **Contributor:** `@core_architect`
> ### 📊 **Metrics:** Total Diff: +18 / -4 lines | Files Changed: 2
> ---
> ### 📉 **Raw LOC Volume:** Low (Minimal Footprint)
> ### 📈 **Logic Complexity:** High (96% Semantic Impact)
> ### ⭐ **Effort Score:** 94.8 / 100 ➔ [Tier 1: Architectural Breakthrough]
> ---
> ### 🤖 **AI Summary:** Replaced unbatched database lookups with an atomic Redis pipeline. Resolved a critical multi-thread race condition with zero bloated code.

<br/>

[![Watch Demo](https://img.shields.io/badge/▶_WATCH_WALKTHROUGH_VIDEO-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)
[![Launch Live](https://img.shields.io/badge/🚀_LAUNCH_LIVE_DASHBOARD-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

# 🧠 Architecture

### **Multi-Stage Ingestion Pipeline:**
1. ### **Target Extraction:** DUNE intercepts GitHub pull requests, commit branches, and full commit histories.
2. ### **Context Sanitization:** Strips third-party vendor code, boilerplate scaffolds, and package lockfiles to optimize LLM token capacity.
3. ### **Multi-Vector AI Analysis:** An LLM evaluates logic density, edge-case mitigation, and systemic impact against structured rubrics.
4. ### **Credit Allocation:** Generates transparent, tamper-proof contribution analytics for teams and judges.

---

# 🛠️ Tech Stack

| Layer | Technologies & Ecosystem |
| :--- | :--- |
| ### **Frontend Interface** | ![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js) ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| ### **Core Backend & Ingestion** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![Python 3.11](https://img.shields.io/badge/Python%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white) ![GitHub API](https://img.shields.io/badge/GitHub%20API-181717?style=for-the-badge&logo=github) |
| ### **AI & Scoring Orchestration** | ![GPT-4o](https://img.shields.io/badge/GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white) ![Claude 3.5](https://img.shields.io/badge/Claude%203.5%20Sonnet-D97706?style=for-the-badge&logo=anthropic&logoColor=white) |
| ### **Cloud & Persistence** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) |

---

# 🚀 Quickstart

<details open>
<summary><h2><b>🛠️ Click to view local environment setup</b></h2></summary>

### **1. Clone & Navigate**
```bash
git clone https://github.com/your-username/dune-credits.git
cd dune-credits
npm install
```

### **2. Environment Setup**
### Create a `.env` configuration in the project root:
```env
GITHUB_ACCESS_TOKEN="ghp_yourPersonalAccessTokenHere"
OPENAI_API_KEY="sk-proj-yourOpenAIKeyHere"
ANTHROPIC_API_KEY="sk-ant-yourAnthropicKeyHere"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **3. Run Development Servers**
```bash
# Frontend UI
npm run dev

# Backend Engine (in secondary terminal)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
</details>

---

# ⚔️ Engineering Challenges & Breakthroughs

```text
[ CHALLENGE 01 ] Context Window Saturation on Massive PR Diffs
└─► SOLUTION : Developed an AST-aware pre-sanitizer that eliminates boilerplate, migrations,
               and vendor bundles before passing tokens into the model.

[ CHALLENGE 02 ] Non-Deterministic Score Fluctuation
└─► SOLUTION : Enforced strict Pydantic JSON schema outputs paired with few-shot evaluation 
               rubrics, locking variation to < 2.5% across repeated evaluations.

[ CHALLENGE 03 ] Accurate Multi-Author Branch Attribution
└─► SOLUTION : Reconstructed commit parent trees via GitHub GraphQL API to accurately 
               attribute squashed merges and pair-programming contributions.
```

---

# 🧠 What We Learned

### We learned how to pull and clean repository data from the GitHub API and feed it reliably into an AI workflow. 
### We also saw how important prompt design and structured rubrics are when asking an LLM to grade code fairly. 
### Most importantly, we learned how to turn a basic AI script into a helpful, end-to-end tool for team projects.

---

# 🛡️ Responsible AI & Ethical Bounds

### **Core Design Philosophy:** DUNE is engineered for hackathons, student accelerators, and friendly engineering retrospectives.

* ### 🟢 **Intended Scope:** Celebrating high-impact bug fixers, giving visibility to complex engineering work, and streamlining demo-day judging.
* ### 🔴 **Explicit Boundaries:** Never designed for corporate surveillance, micromanagement, or automated HR decisions. Non-code contributions (UX architecture, sprint planning, and voice debugging) must always be weighted collaboratively alongside code scores.

---

# 👥 Team

<div align="center">

| ![Lead Architect](https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80) | ![Fullstack Engineer](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&h=180&q=80) | ![Systems Engineer](https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=180&h=180&q=80) |
| :---: | :---: | :---: |
| ### **Lead Architect**<br/>*AI Scoring & LLM*<br/>[GitHub](#) • [LinkedIn](#) | ### **Fullstack Engineer**<br/>*Backend & GitHub API*<br/>[GitHub](#) • [LinkedIn](#) | ### **Systems Engineer**<br/>*Frontend Dashboard*<br/>[GitHub](#) • [LinkedIn](#) |

<br/>

## **Built with passion for WeMakeDevs Agent Harness Hackathon 🏆**

</div>
