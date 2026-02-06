import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  location: string;
  date: string;
  icon: string;
}

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: Transaction[];
}

const ActivityModal = ({ open, onOpenChange, transactions }: ActivityModalProps) => {
  const allTransactions: Transaction[] = [
    ...transactions,
    {
      id: 5,
      type: "earned",
      amount: 12,
      description: "Paper waste drop",
      location: "Ashramam Lake Station",
      date: "4 days ago",
      icon: "📄"
    },
    {
      id: 6,
      type: "earned",
      amount: 20,
      description: "Metal cans recycling",
      location: "Chinnakada Green Point",
      date: "5 days ago",
      icon: "🥫"
    },
    {
      id: 7,
      type: "redeemed",
      amount: -50,
      description: "Bamboo Water Bottle",
      location: "EcoSnap Store",
      date: "1 week ago",
      icon: "🛍️"
    },
    {
      id: 8,
      type: "bonus",
      amount: 25,
      description: "Referral bonus",
      location: "Friend joined",
      date: "1 week ago",
      icon: "🎉"
    },
    {
      id: 9,
      type: "earned",
      amount: 15,
      description: "Glass bottles drop",
      location: "Kollam Beach EcoHub",
      date: "2 weeks ago",
      icon: "🍾"
    },
    {
      id: 10,
      type: "earned",
      amount: 30,
      description: "E-waste disposal",
      location: "KSRTC Bus Stand Hub",
      date: "2 weeks ago",
      icon: "📱"
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📊 All Activity
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {allTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between py-3 px-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;
