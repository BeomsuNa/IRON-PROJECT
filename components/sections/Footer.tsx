import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#1a1008] border-t border-[#d4a017]/30 py-12 md:py-16 font-serif">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-[#d4a017] mb-4">
              STEAMPUNK <span className="text-[#8b4513]">WORKS</span>
            </h3>
            <p className="text-sm text-[#a68a56]">
              Mechanical Intelligence. Engineering the steam-powered future of autonomous systems.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4a017] mb-4">Machinery</h4>
            <ul className="space-y-2 text-sm text-[#a68a56]">
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">The Sentinel</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Steam Recon</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Brass Nexus</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4a017] mb-4">Manuals</h4>
            <ul className="space-y-2 text-sm text-[#a68a56]">
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Blueprints</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Operator SDK</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Gazette</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#d4a017] mb-4">Charter</h4>
            <ul className="space-y-2 text-sm text-[#a68a56]">
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Privacy Charter</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Terms of Operation</a></li>
              <li><a href="#" className="hover:text-[#d4a017] transition-colors">Mechanisms</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#d4a017]/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright */}
          <p className="text-sm text-[#a68a56]">
            © {currentYear} Steampunk Works Ltd. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#d4a017]/5 border border-[#d4a017]/20 flex items-center justify-center text-[#d4a017] hover:border-[#d4a017] hover:bg-[#d4a017]/10 transition-all duration-300 shadow-[0_0_10px_rgba(212,160,23,0.1)]"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#d4a017]/5 border border-[#d4a017]/20 flex items-center justify-center text-[#d4a017] hover:border-[#d4a017] hover:bg-[#d4a017]/10 transition-all duration-300 shadow-[0_0_10px_rgba(212,160,23,0.1)]"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1.25 9-5.5s-3.3-5.73-9-5.73z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#d4a017]/5 border border-[#d4a017]/20 flex items-center justify-center text-[#d4a017] hover:border-[#d4a017] hover:bg-[#d4a017]/10 transition-all duration-300 shadow-[0_0_10px_rgba(212,160,23,0.1)]"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
