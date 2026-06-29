const checklist = [
  "1.1 Create Next.js Project",
  "1.2 Configure TypeScript",
  "1.3 Configure TailwindCSS",
  "1.4 Configure ESLint",
  "1.5 Configure Prettier",
  "1.6 Setup Environment Variables",
  "1.8 Setup CI/CD Pipeline",
  "1.9 Design Database Schema",
  "1.10 Configure ORM / Prisma",
  "1.11 Setup Database Connection",
  "1.12 Setup API Folder Structure",
  "1.13 Setup File Upload Service",
  "1.14 Setup Storage System",
  "1.15 Setup Authentication Framework",
];

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          borderRadius: 24,
          background: "#ffffff",
          border: "1px solid #dbe3ee",
          padding: 32,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#2563eb",
            fontWeight: 700,
          }}
        >
          Backend Phase 1
        </p>
        <h1 style={{ margin: "16px 0 12px", fontSize: 40 }}>
          LMS backend foundation is ready to extend
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: "#475569" }}>
          This app now includes the initial scaffolding for authentication,
          MongoDB with Mongoose, upload and storage abstractions, and starter API
          endpoints.
        </p>
        <ul style={{ margin: "32px 0 0", paddingLeft: 20, lineHeight: 1.9 }}>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
