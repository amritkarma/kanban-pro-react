import { useState } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  lightdark: boolean;
  lightdarkmode: () => void;
}

const Header = ({ lightdark, lightdarkmode }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-700 dark:from-zinc-800 dark:to-zinc-900 text-white p-6 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/images/Kanbanlogo.png" alt="" className="w-10 h-10 rounded-xl" />
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-zinc-100">
            Kanban <span className="text-blue-200 dark:text-blue-400">Pro</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <a
            href="#"
            className="text-white dark:text-zinc-300 hover:text-blue-200 dark:hover:text-blue-400 transition mx-2"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white dark:text-zinc-300 hover:text-blue-200 dark:hover:text-blue-400 transition mx-2"
          >
            More
          </a>
          <button
            onClick={lightdarkmode}
            aria-label="Toggle Dark Mode"
            className="ml-4 p-2 rounded-full text-white focus:outline-none cursor-pointer"
          >
            {lightdark ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
          </button>
        </nav>

        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={lightdarkmode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-full text-white focus:outline-none cursor-pointer"
          >
            {lightdark ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-white dark:text-zinc-300 hover:text-blue-200 dark:hover:text-blue-400 transition"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white dark:text-zinc-300 hover:text-blue-200 dark:hover:text-blue-400 transition"
            >
              More
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
