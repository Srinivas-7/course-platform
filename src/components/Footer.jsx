import { FaFacebookF, FaInstagram, FaGithub, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 border-t border-white/20 ">

            <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

                {/* LEFT */}
                <p className="text-gray-300 text-sm">
                    © 2026 Vijayanagara Edits, Inc. All rights reserved.
                </p>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-6 text-gray-300 text-lg">
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="cursor-pointer hover:text-white transition" />
                    </a>
                    <a href="https://www.instagram.com/vijayanagara_edits?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="cursor-pointer hover:text-white transition" />
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <FaXTwitter className="cursor-pointer hover:text-white transition" />
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="cursor-pointer hover:text-white transition" />
                    </a>
                </div>

            </div>

        </footer>
    );
}