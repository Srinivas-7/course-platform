import { useState, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const publicNavigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "About Us", href: "/about" },
];

const privateNavigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "My Courses", href: "/mycourses" },
  { name: "About Us", href: "/about" },
];

const adminNavigation = [
  { name: "Courses", href: "/admin/courses" },
  { name: "Users", href: "/admin/users" },
  { name: "Purchases", href: "/admin/purchases" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.user_metadata?.role === "admin";

  // Logo goes to admin dashboard if admin, user dashboard if logged in, home if public
  const logoHref = isAdmin ? "/admin" : user ? "/dashboard" : "/";

  // Pick the right nav
  const currentNav = isAdmin ? adminNavigation : user ? privateNavigation : publicNavigation;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "?";
    const name = user.user_metadata?.full_name || "";
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return user.email[0].toUpperCase();
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center">
      <div className="w-[95%] max-w-6xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">

        <nav className="flex items-center justify-between p-6 lg:px-8">

          {/* LEFT LOGO */}
          <div className="flex lg:flex-1">
            <Link to={logoHref} className="text-xl font-bold text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                fill="#ffffff" viewBox="0 0 24 24">
                <path d="M5 2h14v2H5zm14.1 3.8c-.38-.5-.97-.8-1.6-.8h-11c-.63 0-1.23.3-1.6.8L2.4 9.13c-.26.34-.4.77-.4 1.2V13c0 .55.45 1 1 1v7c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-7h6v8h2v-8c.55 0 1-.45 1-1v-2.67c0-.43-.14-.86-.4-1.2zM4 10.33 6.5 7h11l2.5 3.33V12H4zM11 20H5v-6h6z" />
              </svg>
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex lg:gap-x-12">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-lg font-semibold tracking-wide text-white hover:text-purple-400 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT - Login or Profile */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="focus:outline-none"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover cursor-pointer hover:border-purple-400 transition"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-400 cursor-pointer hover:bg-purple-500 transition">
                      {getInitials()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    {!isAdmin && (
                      <>
                        <button
                          onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center gap-2"
                        >
                          👤 View Profile
                        </button>
                        <div className="h-px bg-gray-700" />
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <button onClick={() => { setDropdownOpen(false); navigate("/admin"); }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center gap-2">
                          🏠 Admin Dashboard
                        </button>
                        <div className="h-px bg-gray-700" />
                        <button onClick={() => { setDropdownOpen(false); navigate("/admin/upload"); }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition flex items-center gap-2">
                          🎬 Upload Lesson
                        </button>
                        <div className="h-px bg-gray-700" />
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition flex items-center gap-2"
                    >
                      🚪 Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-white">
                Log in →
              </Link>
            )}
          </div>

        </nav>
      </div>

      {/* MOBILE MENU */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">Vijayanagara Edits</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-200" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white font-semibold"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold">
                    Admin Dashboard
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold">
                    View Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="block text-red-400 font-semibold">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-white font-semibold">
                Login
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}