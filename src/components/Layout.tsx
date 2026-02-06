import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { 
  Home, 
  MapPin, 
  Wallet, 
  ShoppingCart, 
  User,
  Menu,
  X,
  Bell,
  Clock,
  Gift,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import QRScannerButton from "@/components/QRScannerButton";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const readCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = Array.isArray(cart)
          ? cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    readCount();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') readCount();
    };
    const onCustom = () => readCount();

    window.addEventListener('storage', onStorage);
    window.addEventListener('cart-updated', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart-updated', onCustom as EventListener);
    };
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'map', label: 'Map', icon: MapPin, path: '/map' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const dummyNotifications = [
    {
      id: 1,
      title: "Eco Achievement!",
      message: "You've earned 50 credits for recycling plastic bottles",
      time: "2 minutes ago",
      icon: Award,
      type: "success"
    },
    {
      id: 2,
      title: "New Products Available",
      message: "Check out our latest upcycled fashion collection",
      time: "1 hour ago",
      icon: Gift,
      type: "info"
    },
    {
      id: 3,
      title: "Reminder",
      message: "Don't forget to drop off your recyclables today",
      time: "3 hours ago",
      icon: Clock,
      type: "reminder"
    }
  ];

  // Mock wallet credits - in real app this would come from state/API
  const walletCredits = 1250;

  const isActive = (path: string) => location.pathname === path;

  const handleNotificationClick = (notification: any) => {
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border/20 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center space-x-3">
         <img
            src="./favicon.png"
            alt="Eco Logo"
            className="w-10 h-10"
          />

          <div>
            <h1 className="text-xl font-bold text-foreground">EcoSnap</h1>
            <p className="text-xs text-muted-foreground">
              Sustainable Shopping
            </p>
          </div>
        </Link>

        {/* Center - Navigation */}
        <nav className="flex items-center space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right - Notifications & Wallet */}
        <div className="flex items-center gap-4">
          <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "relative p-2 rounded-full transition-colors",
                isNotificationsOpen ? "text-primary" : "text-foreground"
              )}>
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {dummyNotifications.length}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={8}>
              <DropdownMenuLabel className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Notifications</span>
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
                    {dummyNotifications.length} new
                  </span>
                </div>
              </DropdownMenuLabel>
              <div className="max-h-80 overflow-y-auto">
                {dummyNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-4 cursor-pointer hover:bg-accent/50 border-b last:border-b-0"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className={cn(
                          "p-2 rounded-lg",
                          notification.type === "success" && "bg-green-100 text-green-600",
                          notification.type === "info" && "bg-blue-100 text-blue-600",
                          notification.type === "reminder" && "bg-orange-100 text-orange-600"
                        )}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/wallet"
            className="inline-flex items-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground">
              <Wallet className="w-4 h-4" />
              <span className="font-semibold">₹{walletCredits}</span>
            </span>
          </Link>
        </div>
      </header>

<header className="hidden md:hidden"></header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40">
          <nav className="flex flex-col p-4 space-y-2 pt-20">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl font-medium transition-all duration-300",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* QR Scanner (mobile & tablet only) */}
      <QRScannerButton />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border z-30">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 min-w-0 flex-1",
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive(item.path) && "scale-110"
                  )} />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;