import { Settings, Bell, Moon, Sun, Globe, Shield, Smartphone, Eye, Volume2, Mail, Lock, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsSheetProps {
  trigger: React.ReactNode;
}

const SettingsSheet = ({ trigger }: SettingsSheetProps) => {
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    soundEffects: true,
    locationServices: true,
    twoFactorAuth: false,
    profileVisibility: true,
    marketingEmails: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Setting updated");
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
    toast.success(`${theme === 'light' ? 'Dark' : 'Light'} mode enabled`);
  };

  const settingSections = [
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Receive alerts about drops and rewards",
          key: "pushNotifications" as const
        },
        {
          icon: Mail,
          label: "Email Notifications",
          description: "Get updates via email",
          key: "emailNotifications" as const
        },
        {
          icon: Volume2,
          label: "Sound Effects",
          description: "Play sounds for actions",
          key: "soundEffects" as const
        }
      ]
    },
    {
      title: "Appearance",
      items: []
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Globe,
          label: "Location Services",
          description: "Allow location access for nearby hubs",
          key: "locationServices" as const
        },
        {
          icon: Shield,
          label: "Two-Factor Authentication",
          description: "Add extra security to your account",
          key: "twoFactorAuth" as const
        },
        {
          icon: Eye,
          label: "Profile Visibility",
          description: "Show profile to other users",
          key: "profileVisibility" as const
        }
      ]
    },
    {
      title: "Communication",
      items: [
        {
          icon: Mail,
          label: "Marketing Emails",
          description: "Receive promotional content",
          key: "marketingEmails" as const
        }
      ]
    }
  ];

  const accountOptions = [
    { icon: Lock, label: "Change Password", action: () => toast.info("Password change coming soon") },
    { icon: Smartphone, label: "Linked Devices", action: () => toast.info("Device management coming soon") },
    { icon: Globe, label: "Language", value: "English", action: () => toast.info("Language settings coming soon") }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Dark Mode Toggle - Special handling */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">
                Appearance
              </h3>
              <div 
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</p>
                  </div>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </div>

            <Separator />

            {/* Toggle Settings */}
            {settingSections.filter(s => s.title !== 'Appearance').map((section, idx, arr) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div 
                      key={item.key}
                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings[item.key]} 
                        onCheckedChange={() => toggleSetting(item.key)}
                      />
                    </div>
                  ))}
                </div>
                {idx < arr.length - 1 && <Separator />}
              </div>
            ))}

            <Separator />

            {/* Account Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">
                Account
              </h3>
              <div className="space-y-1">
                {accountOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={option.action}
                    className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{option.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {option.value && <span className="text-sm">{option.value}</span>}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* App Info */}
            <div className="pt-4 text-center text-xs text-muted-foreground space-y-1">
              <p>EcoSnap Version 1.0.0</p>
              <p>© 2024 EcoSnap. All rights reserved.</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
