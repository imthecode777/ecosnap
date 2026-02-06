import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";

interface WishlistSheetProps {
  trigger: React.ReactNode;
}

const initialWishlistItems = [
  {
    id: 1,
    name: "Recycled Glass Vase",
    price: "$45.00",
    originalPrice: "$55.00",
    image: "🏺",
    category: "Home Decor",
    inStock: true,
    discount: "18% OFF"
  },
  {
    id: 2,
    name: "Organic Hemp Backpack",
    price: "$78.00",
    originalPrice: null,
    image: "🎒",
    category: "Bags",
    inStock: true,
    discount: null
  },
  {
    id: 3,
    name: "Bamboo Sunglasses",
    price: "$35.00",
    originalPrice: "$42.00",
    image: "🕶️",
    category: "Accessories",
    inStock: false,
    discount: "17% OFF"
  }
];

const WishlistSheet = ({ trigger }: WishlistSheetProps) => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeItem = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (name: string) => {
    toast.success(`${name} added to cart!`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            My Wishlist
            <Badge variant="secondary" className="ml-2">{wishlistItems.length} items</Badge>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/30" />
                <div>
                  <p className="font-medium text-foreground">Your wishlist is empty</p>
                  <p className="text-sm text-muted-foreground">Save items you love for later</p>
                </div>
                <Button variant="outline">Browse Products</Button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-xl p-4 space-y-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl">
                      {item.image}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">{item.originalPrice}</span>
                        )}
                        {item.discount && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            {item.discount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      disabled={!item.inStock}
                      onClick={() => addToCart(item.name)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {wishlistItems.length > 0 && (
          <div className="p-6 border-t bg-background">
            <Button className="w-full" onClick={() => toast.success("All items added to cart!")}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
