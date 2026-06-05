<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white" alt="Recharts" />
  
  <br />
  <br />

  <h1 align="center">CompIntel: The Standard in Compensation Transparency</h1>
  <p align="center">
    <strong>A highly scalable, production-grade compensation intelligence platform engineered to normalize tech salaries across India.</strong>
  </p>

  <p align="center">
    <a href="https://comp-intel-gules.vercel.app"><b>🚀 View Live Demo</b></a>
    ·
    <a href="https://github.com/mikeydebug/CompIntel/issues">Report Bug</a>
    ·
    <a href="https://github.com/mikeydebug/CompIntel/issues">Request Feature</a>
  </p>
</div>

---

## 📖 The Vision

The tech industry is plagued by an illusion of titles. An **"SDE-2"** at Google and an **"Associate Engineer"** at Flipkart might earn vastly different amounts, yet their responsibilities and expectations are mathematically identical. 

**CompIntel** (inspired by Levels.fyi) exists to solve this problem. Our proprietary normalization engine maps complex, company-specific internal titles to a standardized, universally understood **L1 to L8 scale**. We empower engineers to stop guessing their worth and start making data-driven career decisions based on verified, aggregated, and normalized compensation data.

---

## 🌟 Elite Features

### 1. The Normalization Engine (L1 - L8)
CompIntel doesn't just list salaries; it normalizes them. The backend actively cross-references submitted job titles against our dynamic `LevelMap` database, placing every submission into a standardized bucket ranging from Junior (L1) to Principal/Fellow (L8). This allows apples-to-apples comparisons across vastly different corporate structures.

### 2. Interactive Data Visualizations
Raw data is useless without context. CompIntel utilizes `Recharts` to render complex datasets instantly on the client side:
- **Company Scatter Plots:** Visualize exactly how base salary, bonuses, and equity scale with Years of Experience (YOE) for any given company.
- **Level Distribution Bar Charts:** See the exact 25th, 50th (Median), and 75th percentiles of Total Compensation (TC) across the L1-L8 ladder.
- **Market Overviews:** A unified macro-view of the entire Indian tech ecosystem on the homepage.

### 3. Secure, Authenticated Submissions
To maintain data integrity, salary submissions are secured via **Google OAuth 2.0** (powered by NextAuth). The system mathematically validates inputs (e.g., ensuring Base + Bonus + Equity exactly equals Total Comp) and flags duplicates or extreme outliers automatically.

### 4. Admin Moderation Portal
CompIntel features a hidden moderation dashboard. All new salary submissions enter a holding queue (`verified: false`). Authenticated admins can review the role, level, location, and compensation breakdown, and choose to **Approve** (pushing the data live instantly) or **Reject** (purging it from the database) with a single click.

### 5. Bulk CSV Ingestion
For rapid bootstrapping, CompIntel includes a drag-and-drop React CSV importer. Utilizing `PapaParse`, it allows admins to upload thousands of historical salary records, previewing the parsed data locally before batch-inserting it into the PostgreSQL database.

### 6. Dynamic SEO & Server-Side Rendering
Built on the Next.js App Router, CompIntel generates dynamic metadata on the server. When someone searches for "Google India Salaries", the page `compintel.com/companies/google` is explicitly optimized to rank high on search engines with perfectly tailored Open Graph tags.

---

## 🏗️ Architecture & Tech Stack

CompIntel is built to handle massive traffic spikes with zero downtime, utilizing a serverless edge architecture.

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Utilizes React Server Components (RSC) for zero-JS initial page loads, massively improving SEO and perceived performance. |
| **Language** | **TypeScript** | Strict end-to-end type safety from the database schema up to the React UI props. |
| **Styling & UI** | **Tailwind CSS + Lucide** | A dark-first, premium glassmorphism aesthetic with zero-runtime CSS generation. |
| **Database** | **PostgreSQL (Neon)** | Serverless Postgres scaling automatically based on traffic, supporting connection pooling for edge functions. |
| **ORM** | **Prisma v5** | Fully typed SQL generation, schema migrations, and database seeding. |
| **Authentication** | **NextAuth.js** | Secure session management utilizing JWTs and Google OAuth. |
| **Deployment** | **Vercel** | Edge caching, continuous integration, and seamless deployment pipeline. |

### Database Entity-Relationship Diagram

```mermaid
erDiagram
    Company ||--o{ SalaryEntry : "has many"
    Company ||--o{ LevelMap : "defines"
    User ||--o{ SalaryEntry : "submits"
    
    Company {
        String id PK
        String name "Google"
        String slug "google"
        String industry
    }
    
    LevelMap {
        String id PK
        String companyId FK
        String internalLevel "SDE-2"
        Int standardLevel "4"
    }
    
    SalaryEntry {
        String id PK
        String companyId FK
        String userId FK
        String role
        Int standardLevel
        Float baseSalary
        Float totalComp
        Int yoe
        Boolean verified
    }
    
    User {
        String id PK
        String email
        DateTime emailVerified
    }
```

---

## 💻 Local Development Setup

To run CompIntel locally, follow this guide carefully.

### Prerequisites
- Node.js 18+ and npm installed.
- A free [Neon.tech](https://neon.tech) PostgreSQL database.
- Google Cloud Console API credentials (OAuth).

### 1. Clone & Install
```sh
git clone https://github.com/mikeydebug/CompIntel.git
cd CompIntel
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. This file is strictly ignored by Git.
```env
# Database (Neon requires pgbouncer for pooling)
DATABASE_URL="postgresql://user:password@hostname.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_secure_string"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Initialize Database
Push the Prisma schema to your cloud database and run the seeder to populate dummy companies (Google, Amazon, etc.) and historical salaries.
```sh
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run the Dev Server
```sh
npm run dev
```
Navigate to `http://localhost:3000`. You are now running the full CompIntel stack locally!

---

## 🚀 Deployment

CompIntel is optimized for Vercel. 

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In the Vercel **Environment Variables** settings, paste your entire `.env` file. 
   *(Crucial: Update `NEXTAUTH_URL` to your live Vercel domain, e.g., `https://comp-intel-gules.vercel.app`)*
4. Ensure your `package.json` includes `"postinstall": "prisma generate"`. (This is already configured).
5. Click **Deploy**.

---

## 🤝 Contributing

We believe in open-source collaboration. If you have an idea to improve the normalization algorithm, add new visualizations, or optimize queries, we want your code.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/Optimization`)
3. Commit your Changes (`git commit -m 'feat: optimize scatter plot rendering'`)
4. Push to the Branch (`git push origin feature/Optimization`)
5. Open a Pull Request

---

<div align="center">
  <b>Built with ❤️ by Mayank for the Indian Tech Community</b><br>
  <i>Empowering engineers through radical transparency.</i>
</div>
