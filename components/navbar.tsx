'use client'
import React, { useState, useEffect } from 'react'

const navLinks = [
  { name: 'Baza członków', href: '/members' },
  { name: 'Obecność', href: '/presence' },
  { name: 'Budżet', href: '/budget' },
  { name: 'Baza partnerów', href: '/partners' },
  { name: 'Certyfikaty', href: '/certificates' },
];

function Navbar() {
  const [currentPath, setCurrentPath] = useState('/LL');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <nav className="mt-8 mb-8 border-b-2 border-gray-300 relative">
      <div className="flex space-x-2">
        {navLinks.map((link) => {
          const isActive = currentPath === link.href;

          return (
            <a
              key={link.name}
              href={link.href}
              className={`px-2 relative text-sm
                         after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-black
                         hover:after:w-full
                         ${isActive ? 'after:w-full text-black' : 'after:w-0 text-[#6E6893]'}`}
            >
              {link.name}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar