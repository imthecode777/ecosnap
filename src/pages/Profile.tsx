import { Settings, Heart, Package, Award, Users, HelpCircle, LogOut, Recycle, Coins, TreePine, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderHistorySheet from "@/components/profile/OrderHistorySheet";
import WishlistSheet from "@/components/profile/WishlistSheet";
import AchievementsSheet from "@/components/profile/AchievementsSheet";
import ReferFriendsSheet from "@/components/profile/ReferFriendsSheet";
import SettingsSheet from "@/components/profile/SettingsSheet";
import HelpSupportSheet from "@/components/profile/HelpSupportSheet";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const userStats = {
    name: user?.name || "Alex Chen",
    email: user?.email || "alex.chen@email.com",
    joinDate: "March 2024",
    totalWasteRecycled: "23.4kg",
    creditsEarned: 3456,
    co2Saved: "15.7kg",
    level: "Eco Champion",
    nextLevel: "Earth Guardian",
    levelProgress: 75
  };

  const recentOrders = [
    {
      id: "#ECO001",
      date: "2 days ago",
      items: "Recycled Ocean Tote + 1 more",
      total: "$42.50",
      status: "Delivered"
    },
    {
      id: "#ECO002", 
      date: "1 week ago",
      items: "Upcycled Denim Wallet",
      total: "$28.00",
      status: "Delivered"
    },
    {
      id: "#ECO003",
      date: "2 weeks ago", 
      items: "Eco Cork Handbag",
      total: "$65.00",
      status: "Delivered"
    }
  ];

  const achievements = [
    { name: "First Drop", icon: "🎯", unlocked: true },
    { name: "Eco Warrior", icon: "🌱", unlocked: true },
    { name: "Green Shopper", icon: "🛒", unlocked: true },
    { name: "Planet Saver", icon: "🌍", unlocked: false },
    { name: "Streak Master", icon: "🔥", unlocked: true },
    { name: "Community Hero", icon: "👥", unlocked: false }
  ];

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header - Enhanced */}
      <Card className="eco-card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar with Upload */}
            <div className="relative">
              <AvatarUpload 
                currentAvatar={user?.avatar || null}
                fallback={userStats.name.split(' ').map(n => n[0]).join('')}
              />
            </div>

            <div className="flex-1 space-y-4 pt-4 md:pt-0">
              {/* Name and Badges */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{userStats.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userStats.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:ml-auto">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    {userStats.level}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Level {Math.floor(userStats.levelProgress / 25) + 1}
                  </Badge>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {userStats.joinDate}</span>
              </div>

              {/* Level Progress */}
              <div className="space-y-2 bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to {userStats.nextLevel}</span>
                  <span className="font-semibold text-primary">{userStats.levelProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 relative"
                    style={{ width: `${userStats.levelProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recycle 5kg more to unlock {userStats.nextLevel}!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="eco-card hover:border-primary/30 transition-colors">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Recycle className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{userStats.totalWasteRecycled}</div>
            <div className="text-sm text-muted-foreground">Waste Recycled</div>
          </CardContent>
        </Card>
        
        <Card className="eco-card hover:border-primary/30 transition-colors">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{userStats.creditsEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Credits Earned</div>
          </CardContent>
        </Card>
        
        <Card className="eco-card hover:border-primary/30 transition-colors">
          <CardContent className="p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <TreePine className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{userStats.co2Saved}</div>
            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
          </CardContent>
        </Card>
        
        <AchievementsSheet
          trigger={
            <Card className="eco-card cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{achievements.filter(a => a.unlocked).length}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>
          }
        />
      </div>

      {/* Recent Orders */}
      <Card className="eco-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <OrderHistorySheet
              trigger={
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div>
                <div className="font-medium text-foreground">{order.id}</div>
                <div className="text-sm text-muted-foreground">{order.items}</div>
                <div className="text-xs text-muted-foreground">{order.date}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{order.total}</div>
                <Badge className="eco-badge-success">{order.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <AchievementsSheet
        trigger={
          <Card className="eco-card cursor-pointer hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.name} className="text-center space-y-2">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="text-xs font-medium text-foreground">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      />

      {/* Menu Items */}
      <Card className="eco-card">
        <CardContent className="p-0">
          <OrderHistorySheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Order History</span>
                </div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </button>
            }
          />
          
          <WishlistSheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Wishlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">3</Badge>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
              </button>
            }
          />
          
          <AchievementsSheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Achievements</span>
                </div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </button>
            }
          />
          
          <ReferFriendsSheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Refer Friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">New</Badge>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
              </button>
            }
          />
          
          <SettingsSheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Settings</span>
                </div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </button>
            }
          />
          
          <HelpSupportSheet
            trigger={
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Help & Support</span>
                </div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </button>
            }
          />
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="eco-card border-destructive/20">
        <CardContent className="p-4">
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
