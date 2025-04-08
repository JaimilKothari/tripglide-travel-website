import { FaInstagram, FaTwitter, FaMedium } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#06152B] text-white px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
          {/* About Us */}
          <div className="bg-[#06214a] text-white px-6 py-4 rounded-lg w-full md:w-1/3 text-center md:text-left">
            <h2 className="text-lg font-semibold font-serif">About Us</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Tripglide is a travel website project designed to help<br className="hidden sm:inline" />
              users find the best flights, hotels, and car hire deals.<br className="hidden sm:inline" />
              Our goal is to make travel seamless and affordable.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full md:w-2/3 text-center md:text-left">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy Settings</a>
              <a href="/login" className="hover:underline">Log in</a>

              {/* Social Media Icons */}
              <div className="flex justify-center md:justify-start gap-4 mt-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] transition">
                  <FaInstagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2] transition">
                  <FaTwitter size={20} />
                </a>
                <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                  <FaMedium size={20} />
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Company Details</a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:underline">Explore</a>
              <a href="#" className="hover:underline">Company</a>
              <a href="#" className="hover:underline">Partners</a>
              <a href="#" className="hover:underline">Trips</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-10 border-t border-gray-700 pt-5 text-sm">
          © Tripglide Ltd 2025
        </div>
      </div>
    </footer>
  );
}
