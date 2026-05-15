import { useEffect, useRef, useState } from "react";
import { ChevronDown, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { isSignedIn, clearAuth, getAuth } from "../utils/auth";


type NavItem = { label: string; href?: string; onClick?: () => void };

const HOME_HREF = "/";
const MENU_LABEL = "Explore";
const DEFAULT_MENU: NavItem[] = [{ label: "Sign In", href: "/sign-in" }, { label: "About Me", href: "/about-me" }, { label: "Resume", href: "/resume" }, { label: "Darts", href: "/darts" }];
const ADMIN_MENU: NavItem[] = [{label: "Song Recs", href:"/song-recs"}]
const OWNER_MENU: NavItem[] = [{label: "Owner Controls", href:"/owner-controls"}]


export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(isSignedIn());
  const [role, setRole] = useState<string | null>(getAuth()?.role ?? null);

  useEffect(() => {
      const sync = () => {
        setSignedIn(isSignedIn());
        setRole(getAuth()?.role ?? null);
      };
      window.addEventListener("storage", sync);
      return () => window.removeEventListener("storage", sync);
  }, []);

  const handleSignOut = () => {
      clearAuth();
      setSignedIn(false);
      setOpen(false);
      setMobileOpen(false);
      navigate("/sign-in");
  };

  const roleItems =
    role === "owner" ? [...ADMIN_MENU, ...OWNER_MENU] :
    role === "admin" ? ADMIN_MENU :
    [];

  const MENU_ITEMS = [...DEFAULT_MENU, ...roleItems];

  const items: NavItem[] = signedIn
      ? MENU_ITEMS.map(i =>
          i.label === "Sign In" ? { label: "Sign Out", onClick: handleSignOut } : i
        )
      : MENU_ITEMS;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      ref={containerRef}
      className="site-header"
    >
      <div className="site-header-safe-fill" aria-hidden="true" />
      <div className="relative z-[51] mx-auto flex h-16 w-full items-center justify-end px-4">
        {/* Desktop nav - pinned right */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to={HOME_HREF}
            className="text-sm font-bold uppercase tracking-wide text-black transition-colors hover:text-[#b21f2d]"
          >
            Home
          </Link>

          <div className="relative">
            <button
              className="flex items-center gap-1 border border-transparent px-2 py-1 text-sm font-bold uppercase tracking-wide text-black transition hover:border-black hover:text-[#b21f2d]"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
            >
              {MENU_LABEL}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden border border-black bg-white shadow-[8px_8px_0_#111]"
              >
                {MENU_ITEMS.length === 0 && (
                  <div className="px-4 py-3 text-sm text-neutral-500">
                    No links yet — add some!
                  </div>
                )}
                <ul className="py-1">
                  {items.map((item) => (
                    <li key={item.label}>
                      {item.onClick ? (
                        <button
                          type="button"
                          className="block w-full border-b border-neutral-200 px-4 py-3 text-left text-sm font-semibold text-black transition last:border-b-0 hover:bg-neutral-100 hover:text-[#b21f2d]"
                          onClick={item.onClick}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.href!}
                          className="block border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-black transition last:border-b-0 hover:bg-neutral-100 hover:text-[#b21f2d]"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>

        <Link
            to={HOME_HREF}
            aria-label="Home"
            className="md:hidden p-2 text-black transition hover:text-[#b21f2d]"
        >
            <Home className="h-5 w-5" />
        </Link>

        {/* Mobile toggle */}
        <button
          className="hamburger-button md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen((v) => !v);
          }}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span
            className={`hamburger-line ${
              mobileOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`hamburger-line ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`hamburger-line ${
              mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="absolute right-4 top-full z-[51] mt-2 w-56 overflow-hidden border border-black bg-white shadow-[8px_8px_0_#111] md:hidden">
          <nav className="text-right">
            {MENU_ITEMS.length === 0 && (
              <div className="px-4 py-3 text-sm text-neutral-500">
                No links yet — add some!
              </div>
            )}
            <ul className="py-1">
              {items.map((item) => (
                <li key={item.label}>
                  {item.onClick ? (
                    <button
                      type="button"
                      className="block w-full border-b border-neutral-200 px-4 py-3 text-right text-sm font-semibold text-black transition last:border-b-0 hover:bg-neutral-100 hover:text-[#b21f2d]"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.href!}
                      className="block border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-black transition last:border-b-0 hover:bg-neutral-100 hover:text-[#b21f2d]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
