import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Dumbbell, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Classes", href: "/classes" },
    { name: "Trainers", href: "/trainers" },
    { name: "Membership", href: "/membership" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const handleLogout = () => {
    // Mock logout
    window.location.reload();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-primary/10 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-10 h-10 bg-primary/20 border border-primary/50 group-hover:bg-primary/30 transition-colors rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tighter">Fitness<span className="text-primary">Forge</span></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={`font-medium transition-colors duration-200 tracking-wide text-sm ${isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                  }`}>
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card border-primary/10 text-foreground" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-primary">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer">
                      <Link href="/">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer">
                      <Link href="/membership">
                        <span className="mr-2 h-4 w-4">💎</span>
                        <span>Membership</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.email?.includes('admin') && (
                      <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer">
                        <Link href="/admin">
                          <span className="mr-2 h-4 w-4">⚙️</span>
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-destructive/20 focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  Login
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Free Trial
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-l border-primary/20">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={`block px-3 py-2 text-base font-medium transition-colors ${isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          } rounded-md`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <Button
                      className="mt-4 bg-primary text-primary-foreground"
                      onClick={() => {
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login / Sign Up
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
