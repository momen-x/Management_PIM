'use client';

import { IPage } from "@/app/types/pages";
import Link from "next/link";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  pages: IPage[];
  accountButtons: IPage[];
  logOutButton: IPage;
  isLoggedIn: boolean;
}

const MobileMenu = ({ pages, accountButtons, logOutButton, isLoggedIn }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="md:hidden mobile-menu-container">
      {/* Mobile menu button */}
      <button
        type="button"
        className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
        aria-label="Toggle menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50 px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {page.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-gray-200 mt-4">
            {isLoggedIn ? (
              <Link
                href={logOutButton.path}
                className="bg-red-500 hover:bg-red-600 text-white block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                {logOutButton.name}
              </Link>
            ) : (
              <div className="space-y-2">
                {accountButtons.map((btn, index) => (
                  <Link
                    key={btn.path}
                    href={btn.path}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 text-center ${
                      index === 0
                        ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-600"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {btn.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;