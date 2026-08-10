export default function Header() {
  return (
    <nav>
      <div className="nav-inner">
        <div className="logo">
          <span className="digit">holy</span>calculator
        </div>
        <div className="nav-search">🔍 Jump to a calculator…</div>
        <div className="nav-links">
          <a href="#">Finance</a>
          <a href="#">Health</a>
          <a href="#">Spiritual</a>
          <a href="#" className="cta">
            All calculators →
          </a>
        </div>
      </div>
    </nav>
  );
}
