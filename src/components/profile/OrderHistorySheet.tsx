import { Package, ChevronRight, Truck, CheckCircle, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderHistorySheetProps {
  trigger: React.ReactNode;
}

const orders = [
  {
    id: "#ECO001",
    date: "Jan 28, 2024",
    items: [
      { name: "Recycled Ocean Tote", quantity: 1, price: "$32.50", image: "🛍️" },
      { name: "Bamboo Cutlery Set", quantity: 1, price: "$10.00", image: "🥢" }
    ],
    total: "$42.50",
    status: "Delivered",
    statusIcon: CheckCircle,
    trackingNumber: "ECO-TRK-28901"
  },
  {
    id: "#ECO002",
    date: "Jan 21, 2024",
    items: [
      { name: "Upcycled Denim Wallet", quantity: 1, price: "$28.00", image: "👛" }
    ],
    total: "$28.00",
    status: "Delivered",
    statusIcon: CheckCircle,
    trackingNumber: "ECO-TRK-28456"
  },
  {
    id: "#ECO003",
    date: "Jan 14, 2024",
    items: [
      { name: "Eco Cork Handbag", quantity: 1, price: "$65.00", image: "👜" }
    ],
    total: "$65.00",
    status: "Delivered",
    statusIcon: CheckCircle,
    trackingNumber: "ECO-TRK-27892"
  },
  {
    id: "#ECO004",
    date: "Jan 5, 2024",
    items: [
      { name: "Organic Cotton T-Shirt", quantity: 2, price: "$50.00", image: "👕" },
      { name: "Recycled Paper Notebook", quantity: 1, price: "$12.00", image: "📓" }
    ],
    total: "$62.00",
    status: "Delivered",
    statusIcon: CheckCircle,
    trackingNumber: "ECO-TRK-27234"
  }
];

const OrderHistorySheet = ({ trigger }: OrderHistorySheetProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "In Transit": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order History
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-primary/5 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{orders.length}</div>
                <div className="text-xs text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$197.50</div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.8kg</div>
                <div className="text-xs text-muted-foreground">CO₂ Saved</div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">{order.id}</span>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <order.statusIcon className="w-3 h-3 mr-1" />
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-t first:border-t-0">
                        <span className="text-2xl">{item.image}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold text-foreground">{order.total}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default OrderHistorySheet;
