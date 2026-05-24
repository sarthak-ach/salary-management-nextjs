export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Salary Management</h1>
      <p>HR employee and salary insights platform</p>
      <p style={{ color: "#666", fontSize: "0.875rem" }}>
        API: {apiUrl}
      </p>
    </main>
  );
}
