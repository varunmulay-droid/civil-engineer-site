import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import { ThemeProvider } from "./theme.jsx";

class Boundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return <pre style={{ padding: 24, color: "#F1F0EA", font: "13px/1.5 monospace", whiteSpace: "pre-wrap" }}>Something went wrong loading the site.{"\n\n"}{String(this.state.err?.message || this.state.err)}</pre>;
  }
}
createRoot(document.getElementById("root")).render(<Boundary><ThemeProvider><App /></ThemeProvider></Boundary>);
