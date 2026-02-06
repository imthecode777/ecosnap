import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, Heart, ShoppingBag, Leaf, Shield, Truck, RotateCcw, Plus, Minus, Award, Sparkles, CreditCard, Users, Eye, TreePine, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import productsImage from "@/assets/eco-products.jpg";

// Mock product data - in real app this would come from API
const getProductById = (id: string) => {
  const products = [
    {
      id: 1,
      name: "Recycled Ocean Tote",
      price: 45,
      credits: 25,
      images: [productsImage, productsImage, productsImage],
      rating: 4.8,
      reviews: 124,
      wasteType: "Ocean Plastic",
      badge: "Trending",
      description: "A beautifully crafted tote bag made from 100% recycled ocean plastic. This eco-friendly accessory not only looks great but also helps clean our oceans. Each bag is made from approximately 20 plastic bottles rescued from marine environments.",
      features: [
        "Made from 100% recycled ocean plastic",
        "Water-resistant and durable",
        "Spacious interior with multiple pockets",
        "Reinforced handles for heavy loads",
        "Machine washable"
      ],
      specifications: {
        dimensions: "40cm x 35cm x 15cm",
        weight: "450g",
        material: "Recycled Ocean Plastic",
        capacity: "25L",
        warranty: "2 years"
      },
      sustainability: {
        carbonFootprint: "65% lower than traditional bags",
        recycledMaterials: "20 plastic bottles",
        certifications: ["Ocean Positive", "B-Corp Certified"]
      },
      inStock: true,
      stockCount: 15
    },
    {
      id: 2,
      name: "Upcycled Denim Wallet",
      price: 28,
      credits: 15,
      images: [productsImage, productsImage],
      rating: 4.6,
      reviews: 89,
      wasteType: "Textile Waste",
      badge: "New",
      description: "Stylish wallet crafted from upcycled denim jeans, giving new life to discarded textiles. Features multiple card slots and a secure coin pocket.",
      features: [
        "Made from upcycled denim",
        "RFID blocking technology",
        "8 card slots + ID window",
        "Secure coin pocket",
        "Compact design"
      ],
      specifications: {
        dimensions: "11cm x 8cm x 2cm",
        weight: "85g",
        material: "Upcycled Denim",
        capacity: "8 cards",
        warranty: "1 year"
      },
      sustainability: {
        carbonFootprint: "70% lower than new leather wallets",
        recycledMaterials: "1 pair of jeans",
        certifications: ["Textile Exchange"]
      },
      inStock: true,
      stockCount: 8
    },
    {
      id: 3,
      name: "Eco Cork Handbag",
      price: 65,
      credits: 35,
      images: [productsImage, productsImage, productsImage],
      rating: 4.9,
      reviews: 156,
      wasteType: "Cork Waste",
      badge: "Popular",
      description: "Elegant handbag made from sustainable cork material. Lightweight, water-resistant, and incredibly durable. Perfect for everyday use.",
      features: [
        "100% sustainable cork material",
        "Water-resistant and lightweight",
        "Adjustable strap",
        "Multiple compartments",
        "Anti-microbial properties"
      ],
      specifications: {
        dimensions: "30cm x 25cm x 12cm",
        weight: "320g",
        material: "Cork",
        capacity: "15L",
        warranty: "3 years"
      },
      sustainability: {
        carbonFootprint: "80% lower than leather bags",
        recycledMaterials: "Cork bark (renewable)",
        certifications: ["FSC Certified", "Vegan Society"]
      },
      inStock: true,
      stockCount: 12
    },
    {
      id: 4,
      name: "Recycled Paper Jewelry",
      price: 22,
      credits: 12,
      images: [productsImage],
      rating: 4.4,
      reviews: 67,
      wasteType: "Paper Waste",
      badge: "Limited",
      description: "Unique jewelry pieces crafted from recycled paper and magazines. Each piece is hand-rolled and coated for durability.",
      features: [
        "Hand-crafted from recycled paper",
        "Water-resistant coating",
        "Lightweight and comfortable",
        "Unique patterns",
        "Hypoallergenic"
      ],
      specifications: {
        dimensions: "Various sizes available",
        weight: "15-25g",
        material: "Recycled Paper",
        capacity: "N/A",
        warranty: "6 months"
      },
      sustainability: {
        carbonFootprint: "90% lower than metal jewelry",
        recycledMaterials: "Magazine pages",
        certifications: ["Handmade", "Eco-Friendly"]
      },
      inStock: true,
      stockCount: 5
    }
  ,
    {
      id: 5,
      name: "Solar-Powered Phone Charger",
      price: 39,
      credits: 20,
      images: [productsImage, productsImage],
      rating: 4.7,
      reviews: 98,
      wasteType: "E-waste",
      badge: "Trending",
      description: "Compact solar charger to power your phone sustainably wherever you go. Built with recycled aluminum casing and high-efficiency panels.",
      features: [
        "High-efficiency solar cells",
        "Recycled aluminum body",
        "Dual USB output",
        "Splash resistant",
        "LED charge indicator"
      ],
      specifications: {
        dimensions: "15cm x 8cm x 1.5cm",
        weight: "180g",
        material: "Recycled Aluminum + Solar Cells",
        capacity: "10,000mAh",
        warranty: "1 year"
      },
      sustainability: {
        carbonFootprint: "50% lower than conventional chargers",
        recycledMaterials: "Recycled aluminum",
        certifications: ["RoHS", "CE"]
      },
      inStock: true,
      stockCount: 20
    },
    {
      id: 6,
      name: "Bamboo Fiber Sunglasses",
      price: 55,
      credits: 30,
      images: [productsImage, productsImage],
      rating: 4.5,
      reviews: 73,
      wasteType: "Bamboo Waste",
      badge: "Popular",
      description: "Stylish sunglasses made from bamboo fiber composites — lightweight, durable, and earth-friendly.",
      features: [
        "Polarized UV400 lenses",
        "Lightweight bamboo frame",
        "Scratch-resistant coating",
        "Includes recycled pouch",
        "Hypoallergenic"
      ],
      specifications: {
        dimensions: "Standard adult fit",
        weight: "24g",
        material: "Bamboo fiber composite",
        capacity: "N/A",
        warranty: "2 years"
      },
      sustainability: {
        carbonFootprint: "70% lower than plastic frames",
        recycledMaterials: "Bamboo offcuts",
        certifications: ["FSC Certified", "Vegan"]
      },
      inStock: true,
      stockCount: 18
    },
    {
      id: 7,
      name: "Recycled Glass Water Bottle",
      price: 18,
      credits: 10,
      images: [productsImage, productsImage],
      rating: 4.4,
      reviews: 150,
      wasteType: "Glass Waste",
      badge: "Trending",
      description: "Durable water bottle made from 100% recycled glass with protective sleeve.",
      features: [
        "BPA-free silicone sleeve",
        "Leak-proof bamboo cap",
        "Dishwasher safe",
        "Odorless and tasteless",
        "1L capacity"
      ],
      specifications: {
        dimensions: "28cm x 7cm",
        weight: "520g",
        material: "Recycled Glass + Silicone + Bamboo",
        capacity: "1000ml",
        warranty: "1 year"
      },
      sustainability: {
        carbonFootprint: "60% lower than virgin glass",
        recycledMaterials: "100% recycled glass",
        certifications: ["BPA-free"]
      },
      inStock: true,
      stockCount: 30
    },
    {
      id: 8,
      name: "Upcycled Tire Wallet",
      price: 32,
      credits: 18,
      images: [productsImage, productsImage],
      rating: 4.6,
      reviews: 61,
      wasteType: "Rubber Waste",
      badge: "Popular",
      description: "Rugged wallet handcrafted from upcycled tire inner tubes. Water resistant and built to last.",
      features: [
        "Made from tire inner tubes",
        "RFID blocking",
        "12 card slots",
        "Slim profile",
        "Hand-stitched"
      ],
      specifications: {
        dimensions: "12cm x 9cm x 1.5cm",
        weight: "95g",
        material: "Upcycled Rubber",
        capacity: "12 cards",
        warranty: "1 year"
      },
      sustainability: {
        carbonFootprint: "85% lower than new PU wallets",
        recycledMaterials: "Upcycled tire rubber",
        certifications: ["Handmade", "Fair Trade"]
      },
      inStock: true,
      stockCount: 22
    }
  ];
  
  return products.find(p => p.id === parseInt(id)) || null;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const product = getProductById(id!);

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    setAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    // notify listeners (e.g., navbar badge)
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: "Added to Cart! 🛒",
      description: `${quantity} x ${product.name} added to your cart`,
    });
    
    setAddingToCart(false);
  };

  const handleWishlist = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    
    // Get existing wishlist items
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (newWishlistState) {
      // Add to wishlist
      if (!existingWishlist.find((item: any) => item.id === product.id)) {
        existingWishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        });
      }
    } else {
      // Remove from wishlist
      const filteredWishlist = existingWishlist.filter((item: any) => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
    }
    
    if (newWishlistState) {
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
    }
    
    toast({
      title: newWishlistState ? "Added to Wishlist ❤️" : "Removed from Wishlist",
      description: newWishlistState 
        ? `${product.name} added to your wishlist`
        : `${product.name} removed from your wishlist`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Redirecting to Checkout",
      description: "Taking you to secure checkout...",
    });
    // In real app, would navigate to checkout
  };

  // Suggested products (mock data for now)
  const suggestedProducts = [
    {
      id: 2,
      name: "Upcycled Denim Wallet",
      price: 28,
      image: productsImage,
      rating: 4.6,
      wasteType: "Textile Waste"
    },
    {
      id: 3,
      name: "Eco Cork Handbag",
      price: 65,
      image: productsImage,
      rating: 4.9,
      wasteType: "Cork Waste"
    },
    {
      id: 4,
      name: "Recycled Paper Jewelry",
      price: 22,
      image: productsImage,
      rating: 4.4,
      wasteType: "Paper Waste"
    }
  ].filter(p => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl">
            <img 
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === index ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                product.badge === 'Trending' ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200' : ''
              } ${
                product.badge === 'New' ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200' : ''
              } ${
                product.badge === 'Popular' ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 border border-purple-200' : ''
              } ${
                product.badge === 'Limited' ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 border border-orange-200' : ''
              }`}>
                <Sparkles className="w-3 h-3" />
                {product.badge}
              </Badge>
              <Badge className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/20 flex items-center gap-1 px-3 py-1 rounded-full">
                <Leaf className="w-3 h-3" />
                {product.wasteType}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{Math.floor(Math.random() * 500) + 100} views today</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 space-y-3">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">₹{product.price}</span>
              <span className="text-xl text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                or {product.credits} credits
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <CreditCard className="w-4 h-4" />
                <span>EMI available</span>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">
                In Stock ({product.stockCount} available)
              </span>
            </div>
            <div className="flex items-center gap-2 text-orange-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 5} people viewing</span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <span className="font-semibold text-lg">Quantity:</span>
                <div className="flex items-center border-2 border-primary/20 rounded-xl overflow-hidden">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-12 w-12 hover:bg-primary/10"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="px-6 py-3 min-w-[80px] text-center font-semibold text-lg bg-primary/5">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                    className="h-12 w-12 hover:bg-primary/10"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="w-6 h-6 mr-3" />
                  Buy Now - ₹{product.price * quantity}
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 h-12 border-2 border-primary/30 hover:bg-primary/5"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleWishlist}
                    className={`h-12 w-16 border-2 transition-all duration-200 ${
                      isWishlisted 
                        ? "text-red-500 border-red-500 bg-red-50 hover:bg-red-100" 
                        : "border-gray-300 hover:border-red-300 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-700">Secure Payment</p>
              <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-blue-700">Free Delivery</p>
              <p className="text-xs text-muted-foreground">On orders over ₹500</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-purple-700">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12 space-y-8">
        <Card className="eco-card shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Product Description</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">{product.description}</p>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-bold text-lg text-foreground">Key Features:</h4>
            </div>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4 p-3 bg-green-50 rounded-xl">
                  <Leaf className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="eco-card shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">Specifications</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-blue-700 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-bold text-blue-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="eco-card shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">Sustainability Impact</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Carbon Footprint Reduction</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{product.sustainability.carbonFootprint}</p>
                </div>
                <Separator />
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-700">Materials Recycled</p>
                  </div>
                  <p className="font-bold text-foreground">{product.sustainability.recycledMaterials}</p>
                </div>
                <Separator />
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">Certifications</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sustainability.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Products Section */}
        <Card className="eco-card shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 mt-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">You Might Also Like</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedProducts.slice(0, 3).map((suggestedProduct) => (
                <Card key={suggestedProduct.id} className="eco-card group hover:scale-105 transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-0">
                    <Link to={`/product/${suggestedProduct.id}`}>
                      <div className="relative">
                        <img 
                          src={suggestedProduct.image}
                          alt={suggestedProduct.name}
                          className="w-full h-48 object-cover rounded-t-2xl"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary/10 text-primary border border-primary/20">
                            <Leaf className="w-3 h-3 mr-1" />
                            {suggestedProduct.wasteType}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {suggestedProduct.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{suggestedProduct.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-foreground">₹{suggestedProduct.price}</div>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;