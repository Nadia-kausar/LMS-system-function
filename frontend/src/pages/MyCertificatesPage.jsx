import React from "react";

const MyCertificatesPage = () => {
  // Dummy course data
  const courses = [
    { id: 1, title: "React ", received_at: "2025-08-24" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px 30px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1 style={{ color: "#4CAF50", fontSize: "2.5rem", marginBottom: "15px" }}>
          🎉 Success!
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "30px" }}>
          You have successfully received the following course:
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {courses.map((course) => (
            <li
              key={course.id}
              style={{
                background: "#e0f7fa",
                margin: "10px 0",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "1rem",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              🎓 <strong>{course.title}</strong>
              <br />
              <span style={{ color: "#555", fontSize: "0.9rem" }}>
                Received on: {new Date(course.received_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyCertificatesPage;
