<div align="center">

<img width="1825" height="862" alt="ChatGPT Image Aug 27, 2026, 07_37_25 PM" src="https://github.com/user-attachments/assets/792fb798-6027-475b-8878-ed2abc6a14f3" />



*[SUGGESTED TAGLINE — drafted from your own Solution text below, edit freely]*
*AI-powered fair credit scoring for hackathon teams.*

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=B89B63&background=0B0D0F&center=true&vCenter=true&width=600&height=50&lines=Fair+Credit+for+Real+Effort.;AI+That+Reads+Code%2C+Not+Just+Commits.;Built+for+Dune+Hackathon." alt="Typing SVG" />

<br/><br/>

![LLM](https://img.shields.io/badge/AI%20MODEL-GPT--4o--mini%20%2F%20Claude-0B0D0F?style=for-the-badge&labelColor=B89B63)
![GitHub API](https://img.shields.io/badge/DATA%20SOURCE-GitHub%20API-0B0D0F?style=for-the-badge&labelColor=E8DCC8)
![Status](https://img.shields.io/badge/STATUS-Hackathon%20MVP-B89B63?style=for-the-badge&labelColor=0B0D0F)
![License](https://img.shields.io/badge/LICENSE-MIT-E8DCC8?style=for-the-badge&labelColor=0B0D0F)
![Built At](https://img.shields.io/badge/BUILT%20AT-Dune%20Hackathon-B89B63?style=for-the-badge&labelColor=0B0D0F)
![Team](https://img.shields.io/badge/TEAM-DUNE-E8DCC8?style=for-the-badge&labelColor=0B0D0F)

<br/>

![Stars](https://img.shields.io/github/stars/PLACEHOLDER_USERNAME/PLACEHOLDER_REPO?style=for-the-badge&color=B89B63&labelColor=0B0D0F)
![Forks](https://img.shields.io/github/forks/PLACEHOLDER_USERNAME/PLACEHOLDER_REPO?style=for-the-badge&color=E8DCC8&labelColor=0B0D0F)
![Issues](https://img.shields.io/github/issues/PLACEHOLDER_USERNAME/PLACEHOLDER_REPO?style=for-the-badge&color=B89B63&labelColor=0B0D0F)

*(Live badges above will populate automatically once you swap in your real GitHub username/repo — no editing needed after that.)*

<br/>

🔗 **[Demo](#-demo)** &nbsp;◆&nbsp; **[Getting Started](#-getting-started)** &nbsp;◆&nbsp; **[Team](#-team)**

</div>

<br/>

---

# ▸ The Problem

- **Who it affects:** Team leads, hackathon organizers, and students 🎓 working on group coding projects.
- **Why it's unsolved:** Current tools only count vanity metrics like lines of code or commit counts, which doesn't reflect who actually did the hard work.
- **Proof it matters:** Someone copy-pasting 500 lines of boilerplate looks more active on GitHub than a teammate who spent hours fixing a critical 2-line bug.

---

# ▸ The Solution

<div align="center">
<img src="PLACEHOLDER_HERO_SCREENSHOT_URL" width="600" alt="DUNE product screenshot" />
</div>

**DUNE** ♛ is an AI assistant that reviews team GitHub repos to give fair credit scores based on code quality and real effort instead of raw commit numbers.

Instead of manually digging through git logs and branches, DUNE pulls pull requests and commit diffs directly from GitHub. It uses an AI model to read the changes, judge code cleanliness and usefulness, and assign a fair credit score to each person. This gives teams an honest breakdown of who built what without any guesswork.

🌟 **What makes it different:** It actually reads and evaluates the context and quality of code changes using AI, rather than just tallying up line numbers or commit charts.

---

# ▸ Demo

<div align="center">

<img src="PLACEHOLDER_DEMO_GIF_URL" width="700" alt="DUNE demo GIF" />

</div>

- **Full walkthrough video:** [Link to YouTube/Drive]
- **Live deployment:** [Link, if hosted]
- **Known limitations of the live demo:** [e.g., cold start delay, sample data only]

---

# ▸ Features

- **Automated Git Activity Tracker** 📥 — Pulls commits, branches, and PRs automatically so nobody has to manually track who did what.
- **Quality-Based Credit Scoring** 🥇 — Gives points based on how clean, readable, and meaningful the code is rather than how long it is.
- **PR Impact Summarizer** 🤖 — Turns messy git diffs into plain-English summaries of what each teammate actually contributed.
- **Team Contribution Dashboard** 📈 — Displays a simple breakdown of everyone's credits and tasks in one place.

---

# ▸ How It Works

<div align="center">

<img src="PLACEHOLDER_ARCHITECTURE_DIAGRAM_URL" width="720" alt="DUNE architecture / data flow diagram" />

</div>

**Flow, step by step:**

1. **User action / input:** A user submits a GitHub repository link or triggers an analysis on a recent pull request.
2. **System processes / routes it** 🌐: The backend fetches the latest commit histories and PR code diffs using the GitHub API.
3. **AI/ML component involved** 🤖: An LLM (like GPT-4o-mini or Claude) reads the cleaned code diffs and evaluates their complexity, clarity, and contribution value.
4. **Output returned to user:** A simple summary card showing the contributor's score, what they worked on, and brief feedback on the code.

---

# ▸ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [ ] |
| **Backend** | [ ] |
| **Database** | [ ] |
| **AI / ML** | LLM — GPT-4o-mini or Claude (keep only the one you actually used) |
| **Deployment** | [ ] |
| **Notable Libraries / APIs** | GitHub API |

*(List only what's actually used — padding this list is an easy tell for judges.)*

---

# ▸ 🚀 Getting Started

<details>
<summary><strong>Click to expand setup instructions</strong></summary>

<br/>

**Prerequisites**
- [Runtime + version, e.g. Node.js 20+ / Python 3.11+]
- [Any required API keys — GitHub token, OpenAI/Anthropic key]

**Installation**

```bash
git clone [repo-url]
cd [project-folder]
[install command, e.g. npm install / pip install -r requirements.txt]
```

**Environment Variables**

Create a `.env` file in the root directory:

```env
GITHUB_TOKEN=your_token_here
LLM_API_KEY=your_key_here
```

**Run Locally**

```bash
[run command, e.g. npm run dev]
```

App will be available at ▸ `http://localhost:[PORT]`

</details>

---

# ▸ Challenges We Ran Into

1. **Handling large code diffs** ◆ Long PRs quickly filled up LLM prompt limits, so we filtered out boilerplate files like package locks and auto-generated configs.
2. **Inconsistent scoring from the AI** ◆ The model initially gave random scores, so we had to build structured prompts with clear, strict scoring rubrics.
3. **Messy GitHub API data** ◆ Raw git diffs were cluttered with unnecessary formatting, requiring custom helper functions to clean up the code before sending it to the model.

---

# ▸ What We Learned

We learned how to pull and clean repository data from the GitHub API and feed it reliably into an AI workflow. We also saw how important prompt design and structured rubrics are when asking an LLM to grade code fairly. Most importantly, we learned how to turn a basic AI script into a helpful, end-to-end tool for team projects.

---

# ▸ What's Next

- [ ] [Planned feature one]
- [ ] [Planned feature two]
- [ ] [Planned feature three]

---

# ▸ Ethical Considerations & Intended Use

- 🟢 **Intended use case:** Designed for friendly hackathon teams, student groups, and transparent peer reviews — not for micromanaging workers or making hiring/firing 💼 decisions.
- 🔴 **Known limitations / bias in logic:** The system cannot track non-coding contributions — such as UI/UX designing, brainstorming, debugging with teammates over voice calls, or project planning.

---

# ▸ Team — DUNE

<table>
<tr>
<td align="center">
<img src="PLACEHOLDER_AVATAR_URL" width="70" style="border-radius:50%"/><br/>
<strong>[Name]</strong><br/>
<sub>[Specific role, e.g. "LLM prompt design / scoring logic"]</sub><br/>
🔗 <a href="#">GitHub</a> · <a href="#">LinkedIn</a>
</td>
<td align="center">
<img src="PLACEHOLDER_AVATAR_URL" width="70" style="border-radius:50%"/><br/>
<strong>[Name]</strong><br/>
<sub>[Specific role]</sub><br/>
🔗 <a href="#">GitHub</a> · <a href="#">LinkedIn</a>
</td>
<td align="center">
<img src="PLACEHOLDER_AVATAR_URL" width="70" style="border-radius:50%"/><br/>
<strong>[Name]</strong><br/>
<sub>[Specific role]</sub><br/>
🔗 <a href="#">GitHub</a> · <a href="#">LinkedIn</a>
</td>
</tr>
</table>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B0D0F,50:B89B63,100:0B0D0F&height=200&section=header&text=DUNE&fontSize=70&fontColor=E8DCC8&animation=fadeIn&fontAlignY=35" width="100%" alt="DUNE banner"/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B0D0F,50:B89B63,100:0B0D0F&height=120&section=footer" width="100%" alt="footer wave"/>

🏆 **Built at Dune Hackathon · 2026**

📣 *If this project is useful, consider starring the repo.*

</div>
