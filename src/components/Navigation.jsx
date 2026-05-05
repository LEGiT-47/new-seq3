import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../lib/api';
import { getDisplayProductName } from '../lib/productUtils';
import { Menu, ShoppingCart, Phone, User, LogOut } from 'lucide-react';
import logo from '../assets/logo-br.jpg';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const loadSearchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const list = response?.data?.data || [];
        const options = list
          .filter((p) => !p.isHidden)
          .map((p) => {
            const name = getDisplayProductName(p);
            const flavour = p.flavour ? ` | ${p.flavour}` : '';
            const type = p.productType === 'deliverable' ? 'Deliverable' : 'Enquiry';
            return {
              value: p._id || p.id,
              label: `${name}${flavour}`,
              type,
              product: p,
            };
          });
        setSearchOptions(options);
      } catch (error) {
        setSearchOptions([]);
      }
    };

    loadSearchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Gifting', path: '/gifting' },
    { name: 'Manufacturing', path: '/contract-manufacturing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const searchBar = useMemo(
    () => (
      <div className="hidden xl:block w-[260px] 2xl:w-[320px]">
        <Select
          isClearable
          options={searchOptions}
          placeholder="Search products..."
          inputValue={searchInput}
          onInputChange={(value, meta) => {
            if (meta.action === 'input-change') {
              setSearchInput(value);
            }
            if (meta.action === 'set-value') {
              setSearchInput('');
            }
            return value;
          }}
          onChange={(selected) => {
            if (selected?.value) {
              setSearchInput(selected.label || '');
              navigate(`/product/${selected.value}`);
              return;
            }
            setSearchInput('');
          }}
          filterOption={(candidate, input) => {
            const text = `${candidate.label} ${candidate.data?.product?.category || ''} ${candidate.data?.product?.productType || ''}`.toLowerCase();
            return text.includes(input.toLowerCase());
          }}
          formatOptionLabel={(option) => (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#C9A84C]">{option.label}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                {option.type}
              </span>
            </div>
          )}
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: 38,
              borderRadius: 999,
              borderColor: state.isFocused ? '#C9A84C' : '#ffffff22',
              backgroundColor: '#ffffff10',
              boxShadow: state.isFocused ? '0 0 0 1px #C9A84C' : 'none',
              '&:hover': { borderColor: '#C9A84C' },
            }),
            singleValue: (base) => ({ ...base, color: '#C9A84C' }),
            input: (base) => ({ ...base, color: '#C9A84C' }),
            placeholder: (base) => ({ ...base, color: '#D7BD68' }),
            menu: (base) => ({ ...base, borderRadius: 12, overflow: 'hidden', zIndex: 60 }),
            indicatorSeparator: () => ({ display: 'none' }),
          }}
        />
      </div>
    ),
    [navigate, searchInput, searchOptions]
  );

  return (
    <nav className="sticky top-9 z-40 border-b border-[#26486E] bg-[#0B1D35]/95 backdrop-blur-sm shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
              <img
                src={logo}
                alt="Sequeira Foods logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback letter (hidden by default; shown if image fails to load) */}
              <span
                className="hidden text-primary-foreground font-display font-bold text-lg"
                style={{ display: 'none' }}
              >
                S
              </span>
            </div>
              <span className="hidden whitespace-nowrap font-display text-lg font-normal tracking-wide text-[#F8F4EC] lg:block">SEQUEIRA FOODS</span>
          </Link>

          {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex items-center space-x-5 xl:space-x-6 xl:ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                  className={`whitespace-nowrap text-sm transition-colors ${
                  isActive(item.path)
                    ? 'font-semibold text-[#C9A84C]'
                    : 'text-[#B8C8D8] hover:text-[#F8F4EC]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 lg:ml-6 xl:ml-8">
            {searchBar}

            <Button
              variant="ghost"
              size="sm"
              className="text-[#F8F4EC] hover:bg-white/10 hover:text-white xl:hidden"
              onClick={() => navigate('/search')}
            >
              Search
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-[#F8F4EC] hover:bg-white/10 hover:text-white"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-[#F8F4EC]" />
              {getTotalItems() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden gap-2 border-white/20 bg-white/10 text-[#F8F4EC] hover:bg-white/20 hover:text-white xl:flex">
                    <User className="h-4 w-4 text-[#F8F4EC]" />
                    <span className="text-xs md:text-sm">{user.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#0B1F3B] p-2 text-[#F8F4EC] shadow-2xl">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-[#F8F4EC]">{user.name}</p>
                    <p className="text-xs text-[#C9A84C]">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="cursor-pointer text-[#F8F4EC] hover:bg-white/10 hover:text-white">
                    <Link to="/profile">View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer text-[#F8F4EC] hover:bg-white/10 hover:text-white">
                    <Link to="/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#E8762A] hover:bg-white/10 hover:text-[#F8F4EC]">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden xl:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#F8F4EC] hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-[#C9A84C] px-4 py-1.5 text-sm font-semibold text-[#0B1D35] transition-colors hover:bg-[#DAC06E]"
                  asChild
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#F8F4EC] hover:bg-white/10 hover:text-white lg:hidden">
                  <Menu className="h-5 w-5 text-[#F8F4EC]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/search"
                      className="text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Search
                    </Link>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          isActive(item.path)
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth */}
                  <div className="pt-6 border-t border-border space-y-3">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-3 py-2 bg-muted rounded-lg">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          View Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Order History
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full border-white/20 bg-white/10 text-[#F8F4EC] hover:bg-white/20 hover:text-white"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 bg-white/10 text-[#F8F4EC] hover:bg-white/20 hover:text-white"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button
                          className="w-full bg-[#C9A84C] text-[#0B1D35] hover:bg-[#DAC06E]"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/signup">Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Contact */}
                  <div className="pt-6 border-t border-border">
                    <a
                      href="tel:+919930709557"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Call Us</div>
                        <div className="text-sm opacity-70">+91 99307 09557</div>
                      </div>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
