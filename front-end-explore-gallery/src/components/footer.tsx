"use client";

const Footer = () => {
    return (
        <footer className="z-100 w-screen border-t border-gray-200 bg-gray-50 py-4 px-6 text-right text-sm text-gray-600">
            © {new Date().getFullYear()}, <span className="font-medium">Explore Gallery</span> Powered by Xuan Vu
        </footer>
    );
};

export default Footer;