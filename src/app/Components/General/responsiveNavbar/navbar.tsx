import Link from "next/link";
import React from "react";
import MobileMenu from "./MobileMenu";
import { IPage } from "@/app/types/pages";
import { cookies } from "next/headers";
import { tokenName } from "@/app/utils/tokenName";
import { verifyTokenForPage } from "@/app/utils/verifyToken";
import LogOutPage from "@/app/logout/page";

const pages: IPage[] = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/management", name: "Management" },
];

const accountButtons: IPage[] = [
  { path: "/register", name: "Register" },
  { path: "/login", name: "Login" },
];

// const logOutButton: IPage = { path: "/logout", name: "Logout" };

const Navbar = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore)?.get(tokenName);
  const payload = verifyTokenForPage(token?.value || "");
  // const isLoggedIn = ;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Section */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Brand
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {pages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
              >
                {page.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Account Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {payload ? (
              // <Link
              //   href={logOutButton.path}
              //   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              // >
              //   {logOutButton.name}
              // </Link>
              <>
                <Link href={"/acountInfo"}>
                  <div className="bg-sky-500 p-2 text-amber-50 rounded-lg cursor-pointer">
                    {payload.name}
                  </div>
                </Link>
                <LogOutPage />
              </>
            ) : (
              <>
                {accountButtons.map((btn, index) => (
                  <Link
                    key={btn.path}
                    href={btn.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      index === 0
                        ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-600"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {btn.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile menu - now handled by the separate component */}
          <MobileMenu
            pages={pages}
            accountButtons={accountButtons}
            username={payload?.name}
            // logOutButton={logOutButton}
            isLoggedIn={payload?.id}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
