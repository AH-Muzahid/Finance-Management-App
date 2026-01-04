import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const SimpleThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle hover:bg-gray-200 dark:hover:bg-gray-700">
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        checked={resolvedTheme === 'dark'}
        onChange={handleToggle}
      />

      {/* sun icon */}
      <FaSun className="swap-off fill-current w-5 h-5" />

      {/* moon icon */}
      <FaMoon className="swap-on fill-current w-5 h-5" />
    </label>
  );
};

export default SimpleThemeToggle;