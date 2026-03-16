import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/" },
  { name: "My Courses", href: "/mycourses" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center">
      <div className="w-[95%] max-w-6xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">

        <nav className="flex items-center justify-between p-6 lg:px-8">

          {/* LEFT LOGO */}
          <div className="flex lg:flex-1">
            <Link to="/" className="text-xl font-bold text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="#552386"
                viewBox="0 0 24 24"
              >
                <path d="M5 2h14v2H5zm14.1 3.8c-.38-.5-.97-.8-1.6-.8h-11c-.63 0-1.23.3-1.6.8L2.4 9.13c-.26.34-.4.77-.4 1.2V13c0 .55.45 1 1 1v7c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-7h6v8h2v-8c.55 0 1-.45 1-1v-2.67c0-.43-.14-.86-.4-1.2zM4 10.33 6.5 7h11l2.5 3.33V12H4zM11 20H5v-6h6z"></path>
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
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-lg font-semibold tracking-wide text-white hover:text-purple-400 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* LOGIN */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm font-semibold text-white">
              Log in →
            </Link>
          </div>

        </nav>

      </div>

      {/* MOBILE MENU */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm">

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">
              Vijayanagara Edits
            </span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-200" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white font-semibold"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white font-semibold"
            >
              Login
            </Link>
          </div>

        </DialogPanel>
      </Dialog>
    </header>
  );
}