import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface NavbarProps {
  isDark?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawers and dropdowns on route change without cascading renders
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsShopDropdownOpen(false);
  }

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Nav link style generator
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base = 'text-xs tracking-[0.16em] uppercase font-sans transition-all duration-300 py-2 relative';
    if (isActive) {
      return `${base} text-gold-400 font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-gold-500`;
    }
    if (isDark) {
      return `${base} text-noir-200 hover:text-gold-400`;
    }
    return `${base} text-noir-800 hover:text-gold-600`;
  };

  const iconHoverClass = isDark ? 'hover:text-gold-400 text-noir-300' : 'hover:text-gold-600 text-noir-700';

  const navbarBg = isScrolled
    ? isDark
      ? 'bg-noir-950/95 backdrop-blur-md border-b border-noir-800/80 shadow-luxury-dark'
      : 'bg-page-shop/95 backdrop-blur-md border-b border-stone-200/80 shadow-luxury-sm'
    : 'bg-transparent';

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${navbarBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${iconHoverClass} focus:outline-none`}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo theme={isDark ? 'dark' : 'light'} size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              <NavLink to="/" className={getNavLinkClass}>
                Home
              </NavLink>

              {/* Shop All with Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <NavLink to="/shop" className={`${getNavLinkClass({ isActive: location.pathname === '/shop' })} flex items-center gap-1`}>
                  <span>Shop All</span>
                  <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-300" />
                </NavLink>

                {isShopDropdownOpen && (
                  <div className="absolute top-full -left-4 w-60 py-3 bg-noir-950/95 border border-gold-500/30 rounded-xl shadow-luxury-dark backdrop-blur-lg animate-fadeIn">
                    <Link
                      to="/shop"
                      className="block px-4 py-2 text-xs uppercase tracking-wider text-gold-400 hover:bg-noir-900"
                    >
                      All Creations
                    </Link>
                    <div className="h-px bg-noir-800 my-1"></div>
                    <Link
                      to="/collections/men"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Men's Fragrances
                    </Link>
                    <Link
                      to="/collections/women"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Women's Fragrances
                    </Link>
                    <Link
                      to="/collections/unisex"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Unisex Fragrances
                    </Link>
                    <Link
                      to="/collections/oud"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Oud & Oriental
                    </Link>
                    <Link
                      to="/collections/luxury"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Haute Parfumerie
                    </Link>
                    <Link
                      to="/collections/gift-sets"
                      className="block px-4 py-2 text-xs tracking-wider text-noir-200 hover:text-gold-400 hover:bg-noir-900"
                    >
                      Luxury Gift Sets
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/collections/men" className={getNavLinkClass}>
                Men
              </NavLink>
              <NavLink to="/collections/women" className={getNavLinkClass}>
                Women
              </NavLink>
              <NavLink to="/collections/unisex" className={getNavLinkClass}>
                Unisex
              </NavLink>
              <NavLink to="/collections/oud" className={getNavLinkClass}>
                Oud
              </NavLink>
              <NavLink to="/collections/gift-sets" className={getNavLinkClass}>
                Gift Sets
              </NavLink>
              <NavLink to="/about" className={getNavLinkClass}>
                About
              </NavLink>
              <NavLink to="/contact" className={getNavLinkClass}>
                Contact
              </NavLink>
            </nav>

            {/* Icons: Search, Wishlist, Shopping Bag */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-colors duration-300 ${iconHoverClass}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className={`p-2 transition-colors duration-300 relative ${iconHoverClass}`}
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 rounded-full bg-gold-500 text-noir-950 text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className={`p-2 transition-colors duration-300 relative ${iconHoverClass}`}
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 rounded-full bg-gold-500 text-noir-950 text-[10px] font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Expandable Bar */}
        {isSearchOpen && (
          <div className="border-t border-b border-noir-800 bg-noir-950/98 px-4 py-4 animate-fadeIn shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 text-gold-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search perfumes by name, olfactory note (e.g. Saffron, Vetiver), or family..."
                  className="w-full pl-12 pr-12 py-3 bg-noir-900 border border-noir-700 rounded-full text-page-home placeholder-noir-400 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 text-noir-400 hover:text-page-home p-1"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-noir-400 px-2">
                <span className="text-gold-400 uppercase tracking-widest font-medium">Popular:</span>
                {['Nocturne Santal', 'Rose Velours', 'Oud Royal', 'Extrait', 'Amber', 'Discovery Coffret'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-full bg-noir-900 border border-noir-800 text-noir-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-noir-950 border-r border-gold-500/20 p-6 flex flex-col justify-between overflow-y-auto animate-slideInLeft text-page-home">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-noir-800">
                <Logo theme="dark" size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-noir-400 hover:text-page-home"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="mt-6 space-y-4">
                <Link
                  to="/"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="block text-sm uppercase tracking-widest text-gold-400 font-medium py-2 border-b border-noir-900"
                >
                  Shop All Creations
                </Link>
                <Link
                  to="/collections/men"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Men's Fragrances
                </Link>
                <Link
                  to="/collections/women"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Women's Fragrances
                </Link>
                <Link
                  to="/collections/unisex"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Unisex Fragrances
                </Link>
                <Link
                  to="/collections/oud"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Oud & Oriental
                </Link>
                <Link
                  to="/collections/luxury"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Haute Parfumerie
                </Link>
                <Link
                  to="/collections/gift-sets"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Luxury Gift Sets
                </Link>
                <Link
                  to="/order-tracking"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Track Order
                </Link>
                <Link
                  to="/about"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  About NOIRÉLLE
                </Link>
                <Link
                  to="/contact"
                  className="block text-sm uppercase tracking-widest text-noir-200 hover:text-gold-400 py-2 border-b border-noir-900"
                >
                  Contact Concierge
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-noir-800 space-y-4">
              <div className="flex justify-around text-xs text-noir-400">
                <Link to="/wishlist" className="flex items-center gap-1.5 hover:text-gold-400">
                  <Heart size={16} /> Wishlist ({wishlistCount})
                </Link>
                <Link to="/cart" className="flex items-center gap-1.5 hover:text-gold-400">
                  <ShoppingBag size={16} /> Bag ({itemCount})
                </Link>
              </div>
              <p className="text-[10px] text-center text-noir-500 uppercase tracking-widest">
                A World Beyond Fragrance
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
