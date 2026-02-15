import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { Menu, X, ShoppingCart, Phone, User, LogOut } from 'lucide-react';
import logo from '../assets/logo-br.jpg';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Gifting', path: '/gifting' },
    { name: 'Contract Manufacturing', path: '/contract-manufacturing' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-soft">
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
            <span className="font-display font-bold text-xl text-foreground">SEQUEIRA FOODS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Phone */}
            <a
              href="tel:+919930709557"
              className="hidden sm:flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">+91 99307 09557</span>
            </a>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
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
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-xs md:text-sm">{user.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  asChild
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-4">
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
                          className="w-full"
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
                          className="w-full"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-white"
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
