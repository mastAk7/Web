import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import '../styles/navbar.css';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const loc = useLocation();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    // No analyze anchor; Home is the analyze page (brand links to "/").

    return (
        <header className="site-nav sticky top-0 z-40 bg-transparent">
            <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-primary font-bold text-lg">Hallucination Detector</Link>
                    <NavLink to="/about" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-white bg-[rgba(255,90,163,0.06)] px-3 py-1 rounded' : 'text-pink-200/90 hover:text-white'}`}>
                        About
                    </NavLink>
                </div>

                                <div className="hidden md:flex items-center gap-3">
                                        {user ? (
                                            <>
                                                <div className="text-sm">{user.name || user.email}</div>
                                                <button onClick={() => logout()} className="px-3 py-2 text-sm bg-transparent border border-pink-600 text-pink-300 rounded">Logout</button>
                                            </>
                                        ) : (
                                            <>
                                                <NavLink to="/login" className="px-3 py-2 text-sm text-pink-200/90 hover:text-white">Login</NavLink>
                                                <NavLink to="/signup" className="px-3 py-2 text-sm bg-transparent border border-pink-600 text-pink-300 rounded">Signup</NavLink>
                                            </>
                                        )}
                                </div>

                <div className="md:hidden">
                    <button onClick={() => setOpen(v => !v)} className={`mobile-toggle ${open ? 'open' : ''}`} aria-label="menu">
                        <span />
                        <span />
                        <span />
                    </button>
                </div>

                                {open && (
                    <div className="absolute right-4 top-14 w-56 bg-[rgba(9,6,8,0.95)] border border-[rgba(255,90,163,0.04)] rounded-lg p-3 shadow-soft-pink md:hidden">
                                                <NavLink to="/about" className="block px-2 py-2">About</NavLink>
                                                {user ? (
                                                    <>
                                                        <div className="px-2 py-2">{user.name || user.email}</div>
                                                        <button onClick={() => logout()} className="block w-full text-left px-2 py-2">Logout</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <NavLink to="/login" className="block px-2 py-2">Login</NavLink>
                                                        <NavLink to="/signup" className="block px-2 py-2">Signup</NavLink>
                                                    </>
                                                )}
                    </div>
                )}
            </div>
        </header>
    );
}
