import { Users, Copy, Share2, Gift, CheckCircle, Clock, Mail, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ReferFriendsSheetProps {
  trigger: React.ReactNode;
}

const referralHistory = [
  {
    id: 1,
    name: "Sarah M.",
    email: "sar***@email.com",
    status: "completed",
    reward: 50,
    date: "Jan 20, 2024"
  },
  {
    id: 2,
    name: "Mike T.",
    email: "mik***@email.com",
    status: "completed",
    reward: 50,
    date: "Jan 5, 2024"
  },
  {
    id: 3,
    name: "Emma L.",
    email: "emm***@email.com",
    status: "pending",
    reward: 50,
    date: "Jan 28, 2024"
  }
];

const ReferFriendsSheet = ({ trigger }: ReferFriendsSheetProps) => {
  const referralCode = "ALEXECO25";
  const referralLink = `https://ecosnap.app/join?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareVia = (platform: string) => {
    toast.success(`Opening ${platform}...`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Refer Friends
            <Badge className="bg-green-100 text-green-700 border-green-200 ml-2">Earn 50 credits</Badge>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            {/* How it works */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                How It Works
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Share your code</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Friend signs up</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Both earn 50 credits!</p>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Your Referral Code</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono font-bold text-lg text-center text-primary">
                  {referralCode}
                </div>
                <Button variant="outline" onClick={copyCode} className="px-4">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Or share your link</label>
              <div className="flex gap-2">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="text-sm"
                />
                <Button variant="outline" onClick={copyLink} className="px-4">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Share via</label>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className="flex-col h-auto py-4 gap-2"
                  onClick={() => shareVia("WhatsApp")}
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-col h-auto py-4 gap-2"
                  onClick={() => shareVia("Email")}
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-col h-auto py-4 gap-2"
                  onClick={() => shareVia("More")}
                >
                  <Share2 className="w-5 h-5 text-primary" />
                  <span className="text-xs">More</span>
                </Button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{referralHistory.filter(r => r.status === 'completed').length}</div>
                  <div className="text-xs text-muted-foreground">Successful Referrals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{referralHistory.filter(r => r.status === 'completed').length * 50}</div>
                  <div className="text-xs text-muted-foreground">Credits Earned</div>
                </div>
              </div>
            </div>

            {/* Referral History */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Referral History</h3>
              {referralHistory.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {referral.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">{referral.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={referral.status === 'completed' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }>
                      {referral.status === 'completed' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> +{referral.reward}</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Pending</>
                      )}
                    </Badge>
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

export default ReferFriendsSheet;
