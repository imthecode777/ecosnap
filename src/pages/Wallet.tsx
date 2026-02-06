import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Coins, TrendingUp, Gift, Award, History, Star, ArrowRight, Recycle, TreePine, Sparkles, Zap, Target, Trophy, Leaf, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import ConfettiEffect from "@/components/wallet/ConfettiEffect";
import ActivityModal from "@/components/wallet/ActivityModal";

const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [redeemAmount, setRedeemAmount] = useState([50]);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [totalBonusCredits, setTotalBonusCredits] = useState(0);
  const [displayedCredits, setDisplayedCredits] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [lastScanBonus, setLastScanBonus] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const bonusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if we came from QR scan
  const qrScanned = searchParams.get("qr_scanned") === "true";
  
  // Wallet stats with calculated values
  const baseCredits = 892;
  const walletData = useMemo(() => ({
    totalEarned: 1247 + totalBonusCredits,
    totalRedeemed: 355,
    available: baseCredits + totalBonusCredits,
    lifetime: 3456 + totalBonusCredits,
    pendingCredits: 45,
    thisWeek: 87 + totalBonusCredits,
    lastWeek: 62,
  }), [totalBonusCredits]);

  // Initialize displayed credits on mount
  useEffect(() => {
    setDisplayedCredits(baseCredits + totalBonusCredits);
  }, []);

  // Handle QR scan bonus - works EVERY time!
  useEffect(() => {
    if (qrScanned) {
      // Clear URL param immediately to allow next scan
      setSearchParams({}, { replace: true });
      
      // Clear any existing animations
      if (animationRef.current) clearInterval(animationRef.current);
      if (bonusTimeoutRef.current) clearTimeout(bonusTimeoutRef.current);
      
      setIsAnimating(true);
      
      // Trigger confetti with new key
      setConfettiTrigger(prev => prev + 1);
      
      // Add +20 credits
      const scanBonus = 20;
      setLastScanBonus(scanBonus);
      
      // Calculate animation values
      const startValue = displayedCredits;
      const newTotal = totalBonusCredits + scanBonus;
      const endValue = baseCredits + newTotal;
      
      // Update total bonus
      setTotalBonusCredits(newTotal);
      
      // Smooth count-up animation with easing
      const duration = 1800;
      const steps = 40;
      const startTime = Date.now();
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      animationRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
        setDisplayedCredits(currentValue);
        
        if (progress >= 1) {
          if (animationRef.current) clearInterval(animationRef.current);
          setDisplayedCredits(endValue);
          setIsAnimating(false);
        }
      }, duration / steps);
      
      // Hide bonus message after delay
      bonusTimeoutRef.current = setTimeout(() => {
        setLastScanBonus(0);
      }, 5000);
      
      return () => {
        if (animationRef.current) clearInterval(animationRef.current);
        if (bonusTimeoutRef.current) clearTimeout(bonusTimeoutRef.current);
      };
    }
  }, [qrScanned]);

  const weeklyGrowth = useMemo(() => {
    return Math.round(((walletData.thisWeek - walletData.lastWeek) / walletData.lastWeek) * 100);
  }, [walletData]);

  const recentTransactions = [
    {
      id: 1,
      type: "earned",
      amount: 25,
      description: "Plastic bottles drop",
      location: "EcoHub Central",
      date: "2 hours ago",
      icon: "♻️"
    },
    {
      id: 2,
      type: "redeemed",
      amount: -35,
      description: "Eco Cork Handbag",
      location: "EcoSnap Store",
      date: "1 day ago",
      icon: "🛍️"
    },
    {
      id: 3,
      type: "earned",
      amount: 18,
      description: "Textile waste drop",
      location: "Green Corner Station",
      date: "2 days ago",
      icon: "👕"
    },
    {
      id: 4,
      type: "bonus",
      amount: 50,
      description: "Weekly milestone bonus",
      location: "Achievement Reward",
      date: "3 days ago",
      icon: "🏆"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Eco Warrior",
      description: "Recycled 10kg of waste",
      progress: 85,
      maxProgress: 100,
      reward: 100,
      icon: "🌱",
      unlocked: false
    },
    {
      id: 2,
      title: "Green Shopper",
      description: "Purchased 5 eco products",
      progress: 5,
      maxProgress: 5,
      reward: 75,
      icon: "🛒",
      unlocked: true
    },
    {
      id: 3,
      title: "Consistent Contributor",
      description: "7-day recycling streak",
      progress: 7,
      maxProgress: 7,
      reward: 120,
      icon: "🔥",
      unlocked: true
    }
  ];

  const quickRedemptions = [
    { amount: 25, label: "Small Item", icon: "🎁" },
    { amount: 50, label: "Accessory", icon: "👜" },
    { amount: 100, label: "Premium", icon: "💎" },
  ];

  const creditTiers = [
    { name: "Bronze", min: 0, max: 500, color: "from-amber-600 to-amber-800", current: false },
    { name: "Silver", min: 500, max: 1500, color: "from-gray-400 to-gray-600", current: true },
    { name: "Gold", min: 1500, max: 3000, color: "from-yellow-400 to-yellow-600", current: false },
    { name: "Platinum", min: 3000, max: 5000, color: "from-cyan-400 to-cyan-600", current: false },
  ];

  const currentTier = creditTiers.find(t => walletData.lifetime >= t.min && walletData.lifetime < t.max) || creditTiers[creditTiers.length - 1];
  const nextTier = creditTiers[creditTiers.indexOf(currentTier) + 1];
  const tierProgress = nextTier 
    ? ((walletData.lifetime - currentTier.min) / (nextTier.min - currentTier.min)) * 100 
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
      <ConfettiEffect show={confettiTrigger > 0} key={confettiTrigger} />
      
      {/* Hero Wallet Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-6 text-primary-foreground">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Header with tier badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Eco Wallet</h1>
                <p className="text-sm opacity-80">Your green rewards</p>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${currentTier.color} border-0 text-white px-3 py-1`}>
              <Trophy className="w-3 h-3 mr-1" />
              {currentTier.name}
            </Badge>
          </div>

          {/* Main Balance */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className={`p-3 bg-white/20 rounded-xl transition-transform duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                <Coins className={`w-8 h-8 transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`} />
              </div>
              <div className="text-left">
                <p className="text-sm opacity-80">Available Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
                    {displayedCredits.toLocaleString()}
                  </span>
                  <span className="text-lg opacity-80">credits</span>
                </div>
                {lastScanBonus > 0 && (
                  <div className="flex items-center gap-2 mt-1 animate-fade-in">
                    <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      +{lastScanBonus} credits earned! 🎉
                    </span>
                  </div>
                )}
              </div>
            </div>
            {walletData.pendingCredits > 0 && (
              <p className="text-sm mt-2 opacity-80">
                +{walletData.pendingCredits} credits pending verification
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{walletData.thisWeek}</div>
              <div className="text-xs opacity-70">This Week</div>
              {weeklyGrowth > 0 && (
                <div className="text-xs mt-1 opacity-90">+{weeklyGrowth}%</div>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{walletData.totalEarned.toLocaleString()}</div>
              <div className="text-xs opacity-70">Total Earned</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Target className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{walletData.lifetime.toLocaleString()}</div>
              <div className="text-xs opacity-70">Lifetime</div>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="opacity-80">Progress to {nextTier.name}</span>
                <span className="font-medium">{nextTier.min - walletData.lifetime} credits to go</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Redeem Section */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Quick Redeem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Redeem Amount</span>
              <span className="font-semibold text-foreground">{redeemAmount[0]} credits</span>
            </div>
            <Slider
              value={redeemAmount}
              onValueChange={setRedeemAmount}
              max={walletData.available}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>{walletData.available}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickRedemptions.map((quick) => (
              <Button
                key={quick.amount}
                variant={redeemAmount[0] === quick.amount ? "default" : "outline"}
                size="sm"
                onClick={() => setRedeemAmount([quick.amount])}
                className="w-full rounded-xl flex flex-col items-center gap-1 h-auto py-3"
              >
                <span className="text-lg">{quick.icon}</span>
                <span className="text-xs font-medium">{quick.amount}</span>
              </Button>
            ))}
          </div>

          <Button className="w-full eco-button-primary h-12 text-base font-semibold" disabled={redeemAmount[0] > walletData.available}>
            <Gift className="w-4 h-4 mr-2" />
            Swipe to Redeem {redeemAmount[0]} Credits
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="eco-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                      {achievement.unlocked && (
                        <Badge className="eco-badge-success">
                          +{achievement.reward} credits
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {achievement.unlocked && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    achievement.unlocked ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Impact Stats - More visual */}
      <Card className="eco-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-primary" />
            Your Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-center overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <Recycle className="w-16 h-16 text-primary" />
              </div>
              <Recycle className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">15.2kg</div>
              <div className="text-sm text-primary/80">Waste Recycled</div>
              <div className="text-xs text-primary/60 mt-1">↑ 2.3kg this month</div>
            </div>
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-accent to-accent/50 text-center overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <Droplets className="w-16 h-16 text-primary" />
              </div>
              <TreePine className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">8.7kg</div>
              <div className="text-sm text-primary/80">CO₂ Saved</div>
              <div className="text-xs text-primary/60 mt-1">≈ 3 trees planted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="eco-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => setShowActivityModal(true)}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{transaction.icon}</span>
                <div>
                  <div className="font-medium text-foreground">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">{transaction.location}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.amount > 0 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <ActivityModal 
        open={showActivityModal} 
        onOpenChange={setShowActivityModal}
        transactions={recentTransactions}
      />
    </div>
  );
};

export default Wallet;