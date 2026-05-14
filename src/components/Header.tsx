import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Home } from "lucide-react";
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
      className="sticky top-0 z-50 border-b border-black bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full items-center justify-end px-4">
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
          className="md:hidden flex items-center gap-2 border border-black p-2 text-black transition hover:text-[#b21f2d]"
          aria-label="Open menu"
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen((v) => !v);
          }}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="flex justify-end border-t border-black bg-white">
            <nav className="px-4 py-3 text-right">
              <div className="mt-2">
                <div className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#b21f2d]">
                  {MENU_LABEL}
                </div>
                <ul className="space-y-1">
                  {MENU_ITEMS.length === 0 && (
                    <li className="px-3 py-2 text-sm text-neutral-500">
                      No links yet — add some!
                    </li>
                  )}
                    {items.map((item) => (
                      <li key={item.label}>
                        {item.onClick ? (
                          <button
                            type="button"
                            className="block w-full border border-transparent px-3 py-2 text-right font-semibold text-black transition hover:border-black hover:text-[#b21f2d]"
                            onClick={item.onClick}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            to={item.href!}
                            className="block border border-transparent px-3 py-2 font-semibold text-black transition hover:border-black hover:text-[#b21f2d]"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
