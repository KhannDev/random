import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, name }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("User saved successfully!");
      setUserId("");
      setName("");
    } else {
      setMessage(data.error || "Error saving user.");
    }
  };

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "40px", height: "40px", marginRight: "0.5rem" }}
        />
        <h3 style={{ margin: 0 }}>Raffle Draw</h3>
      </header>
      <h4>Enter your Employee ID and Name to participate</h4>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.7rem",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
    </div>
  );
}
