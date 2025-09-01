export default function Footer() {
    return (
        <footer className="w-full mt-auto border-t border-[rgba(255,90,163,0.03)]">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between text-xs text-[rgba(201,182,200,0.9)]">
                <span>© {new Date().getFullYear()} Tech Baddies</span>
                <span>Built with React • Vite • Tailwind</span>
            </div>
        </footer>
    );
}