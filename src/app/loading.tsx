// app/loading.js
import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div style={{ fontSize: "2rem", color: "#333" }}>Loading...</div>
    </div>
  );
};

export default Loading;
