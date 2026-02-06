import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Heart, ShoppingBag, Leaf, ArrowRight, Home as HomeIcon, Shirt, Watch, Gem, Footprints, Smartphone, Car, Gamepad2, Recycle, TreePine, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-eco-fashion.jpg";

// Import new eco product images
import bagsEco from "@/assets/bags-eco.png";
import sneakersEco from "@/assets/sneakers-eco.png";
import sunglassesEco from "@/assets/sunglasses-eco.png";
import detergentEco from "@/assets/detergent-eco.png";
import walletEco from "@/assets/wallet-eco.png";
import sidebagEco from "@/assets/sidebag-eco.png";
import bottleEco from "@/assets/bottle-eco.png";
import braceletEco from "@/assets/bracelet-eco.png";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([2]);
  const { toast } = useToast();

  const allProducts = [
    {
      id: 1,
      name: "Quilted Chain Shoulder Bag",
      description: "Luxurious quilted design crafted from recycled materials",
      price: 189,
      credits: 95,
      image: bagsEco,
      rating: 4.9,
      reviews: 287,
      wasteType: "Recycled Materials",
      badge: "Trending",
      category: "bags"
    },
    {
      id: 2,
      name: "EcoRun Recycled Sneakers",
      description: "Performance sneakers made from ocean plastic & recycled rubber",
      price: 129,
      credits: 65,
      image: sneakersEco,
      rating: 4.8,
      reviews: 342,
      wasteType: "Ocean Plastic",
      badge: "Popular",
      category: "shoes"
    },
    {
      id: 3,
      name: "Bamboo Wood Sunglasses",
      description: "Handcrafted wooden frames with polarized eco-lenses",
      price: 75,
      credits: 38,
      image: sunglassesEco,
      rating: 4.7,
      reviews: 198,
      wasteType: "Sustainable Wood",
      badge: "New",
      category: "accessories"
    },
    {
      id: 4,
      name: "EcoSnap Laundry Sheets",
      description: "Biodegradable, plastic-free detergent sheets - 32 pack",
      price: 24,
      credits: 12,
      image: detergentEco,
      rating: 4.9,
      reviews: 512,
      wasteType: "Plastic-Free",
      badge: "Bestseller",
      category: "home"
    },
    {
      id: 5,
      name: "Classic Leather Bifold Wallet",
      description: "Premium wallets crafted from recycled leather materials",
      price: 65,
      credits: 33,
      image: walletEco,
      rating: 4.6,
      reviews: 156,
      wasteType: "Recycled Leather",
      badge: "New",
      category: "accessories"
    },
    {
      id: 6,
      name: "Double Ring Compact Wallet",
      description: "Elegant compact wallets with signature gold hardware",
      price: 89,
      credits: 45,
      image: sidebagEco,
      rating: 4.8,
      reviews: 234,
      wasteType: "Recycled Materials",
      badge: "Trending",
      category: "accessories"
    },
    {
      id: 7,
      name: "Insulated Eco Water Bottle",
      description: "Double-wall vacuum insulated bottles from recycled steel",
      price: 42,
      credits: 21,
      image: bottleEco,
      rating: 4.7,
      reviews: 389,
      wasteType: "Recycled Steel",
      badge: "Popular",
      category: "accessories"
    },
    {
      id: 8,
      name: "Recycled Metal ID Bracelet",
      description: "Stylish wristbands crafted from recycled metals & canvas",
      price: 35,
      credits: 18,
      image: braceletEco,
      rating: 4.5,
      reviews: 127,
      wasteType: "Recycled Metals",
      badge: "Limited",
      category: "jewelry"
    }
  ];

  // Enhanced search
  const normalizeText = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const filteredProducts = allProducts.filter((product) => {
    if (searchQuery === "") {
      return selectedCategory === "all" || product.category === selectedCategory;
    }
    
    const query = normalizeText(searchQuery);
    const searchableFields = [
      product.name,
      product.wasteType,
      product.category,
      product.badge,
      product.description,
    ];
    
    const matchesSearch = searchableFields.some(field => 
      normalizeText(field).includes(query)
    );
    
    const words = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const matchesWords = words.length > 0 && words.every(word =>
      searchableFields.some(field => field.toLowerCase().includes(word))
    );
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return (matchesSearch || matchesWords) && matchesCategory;
  });

  // Dynamic category counts
  const categories = [
    { id: "all", name: "All", count: allProducts.length, icon: HomeIcon },
    { id: "bags", name: "Bags", count: allProducts.filter(p => p.category === "bags").length, icon: ShoppingBag },
    { id: "accessories", name: "Accessories", count: allProducts.filter(p => p.category === "accessories").length, icon: Watch },
    { id: "shoes", name: "Shoes", count: allProducts.filter(p => p.category === "shoes").length, icon: Footprints },
    { id: "jewelry", name: "Jewelry", count: allProducts.filter(p => p.category === "jewelry").length, icon: Gem },
    { id: "home", name: "Home", count: allProducts.filter(p => p.category === "home").length, icon: TreePine },
  ];

  const trendingProducts = allProducts.filter(p => p.badge === 'Trending' || p.badge === 'Popular' || p.badge === 'Bestseller');

  const toggleWishlist = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = stored.findIndex((it: any) => it.id === productId) >= 0;

    let nextWishlistIds: number[];
    if (exists) {
      const filtered = stored.filter((it: any) => it.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      nextWishlistIds = wishlist.filter(id => id !== productId);
      setWishlist(nextWishlistIds);
      toast({ title: "Removed from Wishlist", description: `${product.name} removed from your wishlist` });
    } else {
      const updated = [...stored, { id: product.id, name: product.name, price: product.price, image: product.image }];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      nextWishlistIds = [...wishlist, productId];
      setWishlist(nextWishlistIds);
      toast({ title: "Added to Wishlist ❤️", description: `${product.name} added to your wishlist` });
    }
  };

  const addToCart = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = existingCart.findIndex((it: any) => it.id === product.id);
    if (idx >= 0) {
      existingCart[idx].quantity = (existingCart[idx].quantity || 1) + 1;
    } else {
      existingCart.push({ id: product.id, name: product.name, price: product.price, image: product.image, credits: product.credits, wasteType: product.wasteType, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cart-updated'));
    toast({
      title: "Added to Cart! 🛒",
      description: `${product?.name} added to your cart`,
    });
  };

  const isFiltering = searchQuery !== "" || selectedCategory !== "all";

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'Trending':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg';
      case 'New':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg';
      case 'Popular':
        return 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 shadow-lg';
      case 'Limited':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg';
      case 'Bestseller':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const ProductCard = ({ product, compact = false }: { product: typeof allProducts[0], compact?: boolean }) => (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-card rounded-2xl">
      <CardContent className="p-0">
        <Link to={`/product/${product.id}`}>
          <div className="relative overflow-hidden">
            <img 
              src={product.image}
              alt={product.name}
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${compact ? 'h-40' : 'h-56'}`}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${getBadgeStyles(product.badge)} px-3 py-1 text-xs font-semibold`}>
                <Sparkles className="w-3 h-3 mr-1" />
                {product.badge}
              </Badge>
            </div>
            
            {/* Wishlist button */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-10"
            >
              <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-400'}`} />
            </button>
            
            {/* Eco badge */}
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-white/95 backdrop-blur-sm text-primary border-0 shadow-md px-3 py-1">
                <Leaf className="w-3 h-3 mr-1.5 text-primary" />
                <span className="text-xs font-medium">{product.wasteType}</span>
              </Badge>
            </div>
            
            {/* Quick add button - appears on hover */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 shadow-lg rounded-full px-4"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product.id);
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </Link>
        
        <div className={`${compact ? 'p-3' : 'p-4'} space-y-2`}>
          <Link to={`/product/${product.id}`}>
            <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
              {product.name}
            </h3>
            {!compact && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </Link>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} 
                />
              ))}
            </div>
            <span className="text-xs font-medium text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-lg font-bold text-foreground">₹{product.price}</div>
              <div className="text-xs text-primary font-semibold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {product.credits} credits
              </div>
            </div>
            {!compact && (
              <Button 
                size="sm" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product.id);
                }}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Search and Filters */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search eco-friendly products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-12 sm:pr-4 h-12 border-2 border-primary/30 focus:border-primary transition-colors rounded-full shadow-sm bg-background"
            />
            <Button
              variant="outline" 
              size="sm"
              className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-primary hover:bg-primary/90 border-primary sm:hidden rounded-full"
            >
              <Filter className="w-5 h-5 text-primary-foreground" />
            </Button>
          </div>
          <Button variant="outline" className="shrink-0 hidden sm:flex h-12 border-2 border-primary/30 hover:border-primary transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-sm px-6">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`shrink-0 transition-all duration-300 flex items-center gap-2 rounded-full px-4 ${
                  selectedCategory === category.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                    : "border-border hover:bg-accent hover:border-primary/30"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </Button>
            );
          })}
        </div>
      </section>

      {/* Show filtered results when searching/filtering */}
      {isFiltering ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : `${categories.find(c => c.id === selectedCategory)?.name} Products`}
              </h2>
              <p className="text-muted-foreground">{filteredProducts.length} products found</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="text-primary border-primary/30 hover:bg-primary/10 rounded-full"
            >
              Clear Filters
            </Button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-3xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 p-6 md:p-10">
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
              <div className="flex-1 space-y-5 text-center md:text-left">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                    <Leaf className="w-3.5 h-3.5 mr-1.5" />
                    100% Sustainable
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                    Turn Waste Into
                    <span className="text-primary block mt-1">Fashion Magic ✨</span>
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
                    Discover beautiful accessories made from recycled materials. Every purchase helps create a cleaner planet.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg px-8">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 border-primary/30 text-primary hover:bg-primary/10 rounded-full px-8">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 order-first md:order-last">
                <img 
                  src={heroImage} 
                  alt="Eco-friendly fashion accessories"
                  className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* Hot Deals Banner */}
          <section className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">💥 Up to 70% Off!</h3>
                  <p className="text-sm text-muted-foreground">Most popular eco-products this week</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 rounded-full px-4 py-1.5 shadow-lg">
                Hot Deals
              </Badge>
            </div>
          </section>

          {/* Trending Products */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg">🔥</span>
                Trending Now
              </h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
              {trendingProducts.map((product) => (
                <div key={product.id} className="min-w-[240px] max-w-[260px]">
                  <ProductCard product={product} compact />
                </div>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg">⭐</span>
                Featured Products
              </h2>
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Impact Stats */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 rounded-3xl p-6 md:p-8 border border-primary/10">
        <h3 className="text-xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
          <span className="p-1.5 bg-primary/10 rounded-lg">🌍</span>
          Your Impact This Month
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-card rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Recycle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">2.4kg</div>
            <div className="text-sm text-muted-foreground">Waste Recycled</div>
          </div>
          <div className="text-center p-4 bg-card rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Coins className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="text-sm text-muted-foreground">Credits Earned</div>
          </div>
          <div className="text-center p-4 bg-card rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Items Purchased</div>
          </div>
          <div className="text-center p-4 bg-card rounded-2xl shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">12.5%</div>
            <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
