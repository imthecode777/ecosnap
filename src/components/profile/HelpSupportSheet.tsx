import { HelpCircle, MessageSquare, Phone, Mail, FileText, ChevronRight, ExternalLink, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

interface HelpSupportSheetProps {
  trigger: React.ReactNode;
}

const faqs = [
  {
    question: "How do I earn credits?",
    answer: "You can earn credits by dropping off recyclable materials at any EcoHub location. Simply scan the QR code at the drop-off point, deposit your items, and credits will be added to your wallet automatically based on the weight and type of materials."
  },
  {
    question: "What materials can I recycle?",
    answer: "We accept plastic bottles, aluminum cans, glass containers, paper products, textiles, and electronic waste. Check the app's Map section to see what each location accepts."
  },
  {
    question: "How do I redeem my credits?",
    answer: "Go to your Wallet and use the Quick Redeem feature or browse our eco-friendly shop. You can use credits to get discounts on sustainable products or convert them to gift cards."
  },
  {
    question: "Why isn't my QR code scanning?",
    answer: "Make sure you have good lighting and your camera is focused. If the problem persists, try cleaning your camera lens or manually enter the location code found below the QR code."
  },
  {
    question: "How do referrals work?",
    answer: "Share your unique referral code with friends. When they sign up and complete their first drop-off, both of you receive 50 credits as a bonus!"
  },
  {
    question: "Can I transfer credits to another user?",
    answer: "Currently, credits are non-transferable. However, you can use them to purchase gift cards that can be shared with others."
  }
];

const contactOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
    available: true
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@ecosnap.app",
    action: "Send Email",
    available: true
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Mon-Fri, 9AM-6PM",
    action: "Call Now",
    available: false
  }
];

const resources = [
  { title: "Getting Started Guide", icon: FileText },
  { title: "Video Tutorials", icon: FileText },
  { title: "Community Forum", icon: FileText },
  { title: "Terms of Service", icon: FileText },
  { title: "Privacy Policy", icon: FileText }
];

const HelpSupportSheet = ({ trigger }: HelpSupportSheetProps) => {
  const handleContact = (type: string) => {
    toast.success(`Opening ${type}...`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Help & Support
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search for help..." 
                className="pl-10"
              />
            </div>

            {/* Quick Contact */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Contact Us</h3>
              <div className="grid gap-3">
                {contactOptions.map((option) => (
                  <div 
                    key={option.title}
                    className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <option.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={option.available ? "default" : "outline"}
                      disabled={!option.available}
                      onClick={() => handleContact(option.title)}
                    >
                      {option.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border rounded-xl px-4 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Resources</h3>
              <div className="space-y-1">
                {resources.map((resource) => (
                  <button
                    key={resource.title}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => toast.info(`Opening ${resource.title}...`)}
                  >
                    <div className="flex items-center gap-3">
                      <resource.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{resource.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-muted/50 rounded-xl p-4 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Support Hours</p>
              <p className="text-xs text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
              <p className="text-xs text-muted-foreground">
                Weekend: Email support only
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HelpSupportSheet;
