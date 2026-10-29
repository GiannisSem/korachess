export const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "240px",
    fontFamily: "system-ui, sans-serif",
};

export const triggerButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "1px solid #374151",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "0.95rem",
};

export const dropdownListStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    maxHeight: "220px",
    overflowY: "auto",
    backgroundColor: "#111827",
    border: "1px solid #374151",
    borderRadius: "8px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    zIndex: 50,
};

export const itemStyle: React.CSSProperties = {
    padding: "10px 14px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "0.9rem",
    borderBottom: "1px solid #1f2937",
    transition: "background-color 0.15s ease",
};

export const subLabelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    opacity: 0.7,
    marginLeft: "8px",
};