import { useState, useRef } from "react";
import { MapPin, Filter, Navigation, Plus, Recycle, Star, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrScanner } from "@yudiel/react-qr-scanner";
import LiveMap from "@/components/map/LiveMap";
import AdvancedFiltersPanel from "@/components/map/AdvancedFiltersPanel";
import DisposalSuccessModal, { wasteTypes as disposalWasteTypes, WasteType } from "@/components/wallet/DisposalSuccessModal";

// Success sound as a short beep using Web Audio API
const playSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 880;
  oscillator.type = "sine";
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

// Error sound for invalid QR
const playErrorSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 300;
  oscillator.type = "sine";
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

const Map = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [advancedMaterials, setAdvancedMaterials] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scannedWaste, setScannedWaste] = useState<WasteType | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const hasScanned = useRef(false);

  const wasteTypes = [
    { id: "all", name: "All Bins", color: "bg-gray-500", count: 24 },
    { id: "plastic", name: "Plastic", color: "bg-blue-500", count: 8 },
    { id: "paper", name: "Paper", color: "bg-green-500", count: 6 },
    { id: "metal", name: "Metal", color: "bg-yellow-500", count: 4 },
    { id: "textile", name: "Textile", color: "bg-purple-500", count: 6 }
  ];

  const nearbyBins = [
    {
      id: 1,
      name: "Kollam Beach EcoHub",
      lat: 8.8932,
      lng: 76.6141,
      distance: "0.2 km",
      wasteTypes: ["plastic", "paper", "metal"],
      rating: 4.8,
      address: "Near Kollam Beach, Kollam",
      capacity: 85,
      hours: "24/7",
      credits: 15
    },
    {
      id: 2,
      name: "Ashramam Lake Station",
      lat: 8.8882,
      lng: 76.5941,
      distance: "0.5 km",
      wasteTypes: ["textile", "plastic"],
      rating: 4.6,
      address: "Ashramam Lake Road, Kollam",
      capacity: 60,
      hours: "6 AM - 10 PM",
      credits: 12
    },
    {
      id: 3,
      name: "Chinnakada Green Point",
      lat: 8.8812,
      lng: 76.6051,
      distance: "0.8 km",
      wasteTypes: ["paper", "metal", "textile"],
      rating: 4.9,
      address: "Chinnakada Junction, Kollam",
      capacity: 92,
      hours: "24/7",
      credits: 18
    },
    {
      id: 4,
      name: "KSRTC Bus Stand Hub",
      lat: 8.8962,
      lng: 76.6211,
      distance: "1.0 km",
      wasteTypes: ["plastic", "paper"],
      rating: 4.5,
      address: "KSRTC Bus Stand, Kollam",
      capacity: 45,
      hours: "7 AM - 9 PM",
      credits: 10
    },
    {
      id: 5,
      name: "Polayathode EcoStation",
      lat: 8.8752,
      lng: 76.5891,
      distance: "1.2 km",
      wasteTypes: ["metal", "textile"],
      rating: 4.7,
      address: "Polayathode, Kollam",
      capacity: 30,
      hours: "24/7",
      credits: 14
    },
    {
      id: 6,
      name: "Kadappakada Recycle Hub",
      lat: 8.9012,
      lng: 76.6081,
      distance: "1.5 km",
      wasteTypes: ["plastic", "metal"],
      rating: 4.4,
      address: "Kadappakada, Kollam",
      capacity: 55,
      hours: "8 AM - 8 PM",
      credits: 11
    },
    {
      id: 7,
      name: "Thevally Green Center",
      lat: 8.8672,
      lng: 76.6181,
      distance: "1.8 km",
      wasteTypes: ["paper", "textile"],
      rating: 4.3,
      address: "Thevally, Kollam",
      capacity: 40,
      hours: "24/7",
      credits: 9
    },
    {
      id: 8,
      name: "Mundakkal Temple Hub",
      lat: 8.8902,
      lng: 76.5981,
      distance: "2.0 km",
      wasteTypes: ["plastic", "paper", "textile"],
      rating: 4.6,
      address: "Near Mundakkal Temple, Kollam",
      capacity: 70,
      hours: "5 AM - 11 PM",
      credits: 16
    }
  ];

  // Filter bins based on both quick filter and advanced materials
  const filteredBinsList = nearbyBins.filter((bin) => {
    const matchesQuickFilter =
      selectedFilter === "all" || bin.wasteTypes.includes(selectedFilter);
    const matchesAdvanced =
      advancedMaterials.length === 0 ||
      advancedMaterials.some((m) => bin.wasteTypes.includes(m));
    return matchesQuickFilter && matchesAdvanced;
  });

  const handleBinSelect = (bin: typeof nearbyBins[0]) => {
    console.log("Selected bin:", bin.name);
  };

  const handleQRResult = (result?: string) => {
    if (!result || hasScanned.current) return;
    hasScanned.current = true;
    
    // Parse the QR code value
    const value = parseInt(result.trim(), 10);
    
    // Close scanner
    setShowQRScanner(false);
    
    // Check if valid waste type
    if (!isNaN(value) && value >= 0 && value <= 5) {
      playSuccessSound();
      setScannedWaste(disposalWasteTypes[value]);
      setIsInvalid(false);
    } else {
      playErrorSound();
      setScannedWaste(null);
      setIsInvalid(true);
    }
    
    setShowResult(true);
    
    // Reset for next scan
    setTimeout(() => {
      hasScanned.current = false;
    }, 1000);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setScannedWaste(null);
    setIsInvalid(false);
  };

  const openGoogleMapsNavigation = (bin: typeof nearbyBins[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Bins Near You 🗺️</h1>
          <p className="text-muted-foreground">Find the closest waste drop points and earn credits</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {wasteTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedFilter === type.id ? "default" : "outline"}
              className={`${
                selectedFilter === type.id 
                  ? "bg-primary text-primary-foreground border border-primary" 
                  : "bg-transparent text-primary border border-primary hover:bg-primary/5"
              } rounded-full`}
              onClick={() => setSelectedFilter(type.id)}
            >
              <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
              {type.name} ({type.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Live Map */}
      <Card className="eco-card">
        <CardContent className="p-0 overflow-hidden rounded-2xl">
          <LiveMap 
            bins={nearbyBins} 
            selectedFilter={selectedFilter}
            onBinSelect={handleBinSelect}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          size="lg" 
          className="h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          onClick={() => setShowQRScanner(true)}
        >
          <QrCode className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Drop Waste</div>
            <div className="text-xs opacity-90">Scan QR & Earn Credits</div>
          </div>
        </Button>
        <Button 
          size="lg" 
          className="h-14 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 shadow-sm"
          onClick={() => setShowAdvancedFilters(true)}
        >
          <Filter className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Advanced Filters</div>
            <div className="text-xs opacity-80">
              {advancedMaterials.length > 0
                ? `${advancedMaterials.length} selected`
                : "Customize Search"}
            </div>
          </div>
        </Button>
      </div>

      {/* Nearby Bins - Filtered */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Nearby Drop Points</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredBinsList.length} found
          </Badge>
        </div>
        <div className="space-y-4">
          {filteredBinsList.map((bin) => (
            <Card key={bin.id} className="eco-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{bin.name}</h3>
                    <p className="text-sm text-muted-foreground">{bin.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{bin.rating}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{bin.distance}</span>
                    </div>
                  </div>
                  <Badge className="eco-badge-success">
                    +{bin.credits} credits
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-muted-foreground">Accepts:</span>
                    <div className="flex flex-wrap gap-2">
                      {bin.wasteTypes.map((type) => {
                        const wasteType = wasteTypes.find(w => w.id === type);
                        return (
                          <div key={type} className="flex items-center gap-1 mr-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${wasteType?.color}`}></div>
                            <span className="text-sm capitalize">{type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Capacity: {bin.capacity}%</span>
                      <span>Hours: {bin.hours}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => openGoogleMapsNavigation(bin)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Navigate
                    </Button>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        bin.capacity > 80 ? 'bg-red-500' : 
                        bin.capacity > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${bin.capacity}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBinsList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No bins found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find nearby bins.</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Scanner Dialog */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Scan Bin QR Code
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Point your camera at the QR code on the waste bin to verify and earn credits.
          </p>
          <div className="rounded-xl overflow-hidden border border-border">
            <QrScanner
              constraints={{ facingMode: "environment" }}
              onDecode={(text) => handleQRResult(text)}
              onError={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Disposal Result Modal */}
      <DisposalSuccessModal
        open={showResult}
        onClose={handleCloseResult}
        wasteType={scannedWaste}
        isInvalid={isInvalid}
      />

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        selectedMaterials={advancedMaterials}
        onMaterialsChange={setAdvancedMaterials}
      />
    </div>
  );
};

export default Map;
