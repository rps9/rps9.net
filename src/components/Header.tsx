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
      className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/70 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-full items-center justify-end px-4">
        {/* Desktop nav - pinned right */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to={HOME_HREF}
            className="text-gray-300 transition-colors hover:text-blue-400"
          >
            Home
          </Link>

          <div className="relative">
            <button
              className="flex items-center gap-1 rounded-md px-2 py-1 text-gray-300 outline-none ring-blue-500 transition hover:text-blue-400 focus-visible:ring-2"
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
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-800 bg-gray-800/95 shadow-xl"
              >
                {MENU_ITEMS.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    No links yet — add some!
                  </div>
                )}
                <ul className="py-1">
                  {items.map((item) => (
                    <li key={item.label}>
                      {item.onClick ? (
                        <button
                          type="button"
                          className="w-full text-left block px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white"
                          onClick={item.onClick}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.href!}
                          className="block px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-white"
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
            className="md:hidden rounded-md p-2 text-gray-300 transition hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
            <Home className="h-5 w-5" />
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center gap-2 rounded-md p-2 text-gray-300 outline-none ring-blue-500 transition hover:text-blue-400 focus-visible:ring-2"
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
          <div className="border-t border-gray-800 bg-gray-800/60 flex justify-end">
            <nav className="px-4 py-3 text-right">
              <div className="mt-2">
                <div className="px-3 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  {MENU_LABEL}
                </div>
                <ul className="space-y-1">
                  {MENU_ITEMS.length === 0 && (
                    <li className="rounded-md px-3 py-2 text-sm text-gray-500">
                      No links yet — add some!
                    </li>
                  )}
                    {items.map((item) => (
                      <li key={item.label}>
                        {item.onClick ? (
                          <button
                            type="button"
                            className="w-full text-right block rounded-md px-3 py-2 text-gray-300 transition hover:bg-gray-800 hover:text-white"
                            onClick={item.onClick}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            to={item.href!}
                            className="block rounded-md px-3 py-2 text-gray-300 transition hover:bg-gray-800 hover:text-white"
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
