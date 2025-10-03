import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <>
      <header className="site-header">
        <div className="shell">
          <Link to="/" className="brand">Fairy Tail Quiz</Link>
          <nav className="main-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/lessons">Bài</NavLink>
            <NavLink to="/characters">Nhân vật</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/result">Kết quả</NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <div className="shell">{children}</div>
      </main>

      <footer className="site-footer">
        <div className="shell">© Fairy Tail Quiz</div>
      </footer>
    </>
  );
}
