import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, CreditCard, Coins, ShoppingBag, Check, Recycle, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import productsImage from "@/assets/eco-products.jpg";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [creditSliders, setCreditSliders] = useState(
    (cartItems as any[]).reduce((acc: any, item: any) => ({
      ...acc,
      [item.id]: [0]
    }), {})
  );

  const availableCredits = 892;
  
  // Keep credit sliders in sync with cart items (only when needed to avoid loops)
  useEffect(() => {
    setCreditSliders(prev => {
      let changed = false;
      const next = { ...prev } as any;
      (cartItems as any[]).forEach((it: any) => {
        if (!(it.id in next)) {
          next[it.id] = [0];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [cartItems]);
  
  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => {
      const next = items
        .map(item => item.id === id ? { ...item, quantity: Math.max(0, (item.quantity || 1) + change) } : item)
        .filter(item => (item.quantity || 0) > 0);
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
      return next;
    });
  };

  const removeItem = (id: number) => {
    setCartItems(items => {
      const next = items.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
      return next;
    });
    setCreditSliders(sliders => {
      const newSliders = { ...sliders } as any;
      delete (newSliders as any)[id];
      return newSliders;
    });
  };

  const updateCreditSlider = (itemId: number, value: number[]) => {
    setCreditSliders(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalCreditsUsed = Object.entries(creditSliders).reduce((sum, [itemId, credits]) => {
    const item = cartItems.find(i => i.id === parseInt(itemId));
    return sum + (credits[0] * (item?.quantity || 0));
  }, 0);
  const finalPrice = subtotal - totalCreditsUsed;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center space-y-6 py-16">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground">Start shopping for eco-friendly products!</p>
          </div>
          <Link to="/">
            <Button className="eco-button-primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart 🛒</h1>
          <p className="text-muted-foreground">{cartItems.length} items • Use credits to save money</p>
        </div>
        <Badge className="rounded-full px-3 py-1 bg-primary text-primary-foreground shadow-sm">
          <Coins className="w-4 h-4 mr-1 text-primary-foreground" />
          {availableCredits} credits available
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="eco-card">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs mt-1">
                          Made from {item.wasteType || 'recycled materials'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium text-foreground w-8 text-center">
                          {(item.quantity || 1)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          or {(item.credits || 0) * (item.quantity || 1)} credits
                        </div>
                      </div>
                    </div>

                    {/* Credit Slider */}
                    <div className="space-y-2 bg-accent/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Use Credits</span>
                        <span className="text-sm text-primary font-semibold">
                          -{creditSliders[item.id]?.[0] * item.quantity || 0} credits
                        </span>
                      </div>
                      <Slider
                        value={creditSliders[item.id] || [0]}
                        onValueChange={(value) => {
                          const prev = creditSliders[item.id] || [0];
                          if (prev[0] !== value[0]) updateCreditSlider(item.id, value);
                        }}
                        max={Math.min(item.credits || 0, Math.floor(availableCredits / (item.quantity || 1)))}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0 saved</span>
                        <span>
                          ${Math.min(item.credits || 0, Math.floor(availableCredits / (item.quantity || 1))) * (item.quantity || 1)} max
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="eco-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-primary">
                  <span>Credits Applied</span>
                  <span>-${totalCreditsUsed.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Credits Used</span>
                  <span>{totalCreditsUsed} credits</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
                
                <div className="text-xs text-center text-muted-foreground">
                  You'll save ${totalCreditsUsed.toFixed(2)} with credits!
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card className="eco-card">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full eco-button-primary">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${finalPrice.toFixed(2)} with Card
              </Button>
              
              <Button variant="outline" className="w-full eco-button-secondary">
                <Coins className="w-4 h-4 mr-2" />
                Pay Full Amount with Credits
              </Button>
              
              <div className="text-xs text-center text-muted-foreground">
                Secure checkout • Free shipping on orders over $50
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="eco-card bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Your Impact</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-3">
                  <Recycle className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-primary">2.1kg</div>
                    <div className="text-muted-foreground">Waste Diverted</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Cloud className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold text-primary">1.2kg</div>
                    <div className="text-muted-foreground">CO₂ Reduced</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;