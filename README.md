<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  
  <br />
  <br />

  <h1 align="center">CompIntel</h1>
  <p align="center">
    <strong>Transparent Compensation Intelligence Platform for Indian Tech</strong>
  </p>

  <p align="center">
    <a href="https://comp-intel-gules.vercel.app">View Live Demo</a>
    ·
    <a href="https://github.com/mikeydebug/CompIntel/issues">Report Bug</a>
    ·
    <a href="https://github.com/mikeydebug/CompIntel/issues">Request Feature</a>
  </p>
</div>

---

## 🚀 About The Project

**CompIntel** is a production-grade compensation intelligence system (inspired by Levels.fyi). The central insight of the platform is that **levels matter more than titles**. An "SDE-2 at Google" and an "Associate Engineer at Flipkart" may have the exact same standard level (L4/L5). CompIntel maps internal company titles to standardized levels (L1-L8) so that engineers can easily compare base salary, bonuses, and equity across the industry.

Stop guessing your worth. Compare salaries across top tech companies in India.

### ✨ Features
- **Standardized Level Mapping:** Normalizes complex internal titles across companies to unified levels (L1-L8).
- **Advanced Data Visualizations:** Recharts-powered scatter plots, bar charts, and multi-company line charts to visualize pay scaling vs. Years of Experience (YOE).
- **Secure Salary Submissions:** Google OAuth integration preventing duplicate submissions, with an automated duplicate checking algorithm.
- **Admin Moderation Dashboard:** Hidden portal allowing admins to review, approve, or reject unverified anonymous salaries.
- **Bulk CSV Ingestion:** Drag-and-drop React CSV importer utilizing PapaParse.
- **Dark-First Premium UI:** Built with Tailwind CSS, featuring glassmorphism, dynamic gradients, and smooth micro-animations.
- **Dynamic SEO Metadata:** Server-side generated metadata to ensure individual company pages rank perfectly on Google Search.

## 🛠️ Built With

* **Framework:** [Next.js 14 App Router](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [PostgreSQL (Neon)](https://neon.tech/)
* **ORM:** [Prisma v5](https://www.prisma.io/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Charts:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** [Vercel](https://vercel.com)

---

## 💻 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need Node.js and npm installed on your machine.
```sh
npm install npm@latest -g
```

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/mikeydebug/CompIntel.git
   cd CompIntel
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL="postgresql://your_neon_db_url"
   NEXTAUTH_SECRET="your_strong_random_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_oauth_client_id"
   GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
   ```

4. **Initialize the Database & Seed Data**
   ```sh
   npx prisma db push
   npx prisma generate
   npx prisma db seed
   ```

5. **Start the Development Server**
   ```sh
   npm run dev
   ```
   Open `http://localhost:3000` to view it in your browser.

---

## 🗄️ Database Architecture

The application relies on a strictly typed Prisma relational schema:
- **`Company`**: Tracks companies (`slug`, `name`, `industry`) and holds aggregated metrics.
- **`LevelMap`**: The core mapping engine linking `Company -> Internal Level -> Standard Level (1-8)`.
- **`SalaryEntry`**: Individual compensation points breaking down Base, Bonus, Equity, YOE, and Location.
- **`User`**: Secure Google OAuth user tracking.

---

## 🔒 Admin Access

The system natively supports a moderation queue. Newly submitted salaries default to `verified: false`. 
If you are logged in, navigate to `http://localhost:3000/admin` to review the moderation queue, approve legitimate data, and delete spam.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  Built with ❤️ by Mayank
</div>
