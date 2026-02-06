import { Award, Lock, Star, Trophy, Target, Flame, Users, ShoppingBag, Recycle, TreePine } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface AchievementsSheetProps {
  trigger: React.ReactNode;
}

const achievements = [
  {
    id: 1,
    name: "First Drop",
    description: "Complete your first recycling drop-off",
    icon: "🎯",
    category: "Getting Started",
    reward: 25,
    unlocked: true,
    unlockedDate: "March 15, 2024",
    progress: 1,
    maxProgress: 1
  },
  {
    id: 2,
    name: "Eco Warrior",
    description: "Recycle 10kg of waste materials",
    icon: "🌱",
    category: "Recycling",
    reward: 100,
    unlocked: true,
    unlockedDate: "April 2, 2024",
    progress: 10,
    maxProgress: 10
  },
  {
    id: 3,
    name: "Green Shopper",
    description: "Purchase 5 eco-friendly products",
    icon: "🛒",
    category: "Shopping",
    reward: 75,
    unlocked: true,
    unlockedDate: "April 10, 2024",
    progress: 5,
    maxProgress: 5
  },
  {
    id: 4,
    name: "Planet Saver",
    description: "Save 50kg of CO₂ emissions",
    icon: "🌍",
    category: "Impact",
    reward: 200,
    unlocked: false,
    unlockedDate: null,
    progress: 32,
    maxProgress: 50
  },
  {
    id: 5,
    name: "Streak Master",
    description: "Maintain a 7-day recycling streak",
    icon: "🔥",
    category: "Consistency",
    reward: 120,
    unlocked: true,
    unlockedDate: "April 18, 2024",
    progress: 7,
    maxProgress: 7
  },
  {
    id: 6,
    name: "Community Hero",
    description: "Refer 5 friends to EcoSnap",
    icon: "👥",
    category: "Social",
    reward: 250,
    unlocked: false,
    unlockedDate: null,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 7,
    name: "Recycling Champion",
    description: "Recycle 50kg of waste materials",
    icon: "♻️",
    category: "Recycling",
    reward: 300,
    unlocked: false,
    unlockedDate: null,
    progress: 23,
    maxProgress: 50
  },
  {
    id: 8,
    name: "Eco Enthusiast",
    description: "Visit 10 different recycling locations",
    icon: "📍",
    category: "Exploration",
    reward: 150,
    unlocked: false,
    unlockedDate: null,
    progress: 6,
    maxProgress: 10
  }
];

const AchievementsSheet = ({ trigger }: AchievementsSheetProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalRewardsEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{unlockedCount}/{achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Unlocked</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{totalRewardsEarned}</div>
                  <div className="text-xs text-muted-foreground">Credits Earned</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
            </div>

            {/* Achievements List */}
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    achievement.unlocked 
                      ? 'bg-background hover:border-primary/30' 
                      : 'bg-muted/30 opacity-75'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked ? 'bg-primary/10' : 'bg-muted grayscale'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            {achievement.name}
                            {achievement.unlocked && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant={achievement.unlocked ? "default" : "secondary"} className="shrink-0">
                          +{achievement.reward}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{achievement.category}</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-muted-foreground">
                          Unlocked on {achievement.unlockedDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AchievementsSheet;
