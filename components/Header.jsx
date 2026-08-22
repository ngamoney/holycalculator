import Link from "next/link";
import HeaderSearch from "@/components/HeaderSearch";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <span className="digit">holy</span>calculator
        </Link>
        <HeaderSearch />
        <div className="nav-links">
          <Link href="/math">Math</Link>
          <Link href="/finance">Finance</Link>
          <Link href="/health">Health</Link>
          <Link href="/spiritual">Spiritual</Link>
          <Link href="/#categories" className="cta">
            All calculators →
          </Link>
        </div>
      </div>
    </header>
  );
}

