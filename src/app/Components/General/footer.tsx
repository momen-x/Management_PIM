import Link from "next/link";
// import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; // You can use any icons library
import XIcon from "@mui/icons-material/X";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/Logo Section */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Brand
            </Link>
            <p className="text-gray-600 text-sm">
              Your product description or company mission statement.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/m_momen_?s=21"
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/momen-x"
                className="text-gray-500 hover:text-gray-700"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQGoph58m3uxewAAAZh0vdJwioNk9cUTu_DYRR13GaLljqfBkuEPrLYmJ0IjBneSF67urzR8eo6v_bBJwDvE7gmrZCO6io9zoeB8Xdm8ikBGNNyDlMjjZKzR8lEIDZgXHxyTPFI=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmo%25E2%2580%2599men-alswafiri-8b6491346%3Futm_source%3Dshare%26utm_campaign%3Dshare_via%26utm_content%3Dprofile%26utm_medium%3Dios_app"
                className="text-gray-500 hover:text-gray-700"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/management"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-blue-600 text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600 text-sm">mazemmoabdo@gmail.com</li>
              <li className="text-gray-600 text-sm">+970598817322</li>
              <li className="text-gray-600 text-sm">Gaza, Palestine</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          &copy; {currentYear} Brand. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
