import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2, Recycle, Leaf } from "lucide-react";
import ConfettiEffect from "./ConfettiEffect";

export interface WasteType {
  id: number;
  name: string;
  icon: string;
  color: string;
  credits: number;
  message: string;
}

export const wasteTypes: Record<number, WasteType> = {
  0: { id: 0, name: "Trash", icon: "🗑️", color: "from-gray-500 to-gray-600", credits: 5, message: "Trash Has Been Disposed Correctly" },
  1: { id: 1, name: "Plastic", icon: "♻️", color: "from-blue-500 to-blue-600", credits: 15, message: "Plastic Has Been Disposed Correctly" },
  2: { id: 2, name: "Paper", icon: "📄", color: "from-green-500 to-green-600", credits: 12, message: "Paper Has Been Disposed Correctly" },
  3: { id: 3, name: "Glass", icon: "🫙", color: "from-cyan-500 to-cyan-600", credits: 18, message: "Glass Has Been Disposed Correctly" },
  4: { id: 4, name: "Metal", icon: "🥫", color: "from-yellow-500 to-amber-600", credits: 20, message: "Metal Has Been Disposed Correctly" },
  5: { id: 5, name: "Cardboard", icon: "📦", color: "from-orange-500 to-orange-600", credits: 10, message: "Cardboard Has Been Disposed Correctly" },
};

interface DisposalSuccessModalProps {
  open: boolean;
  onClose: () => void;
  wasteType: WasteType | null;
  isInvalid?: boolean;
}

const AnimatedCounter = ({ target, duration = 1500 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutExpo * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count}</span>;
};

const DisposalSuccessModal = ({ open, onClose, wasteType, isInvalid = false }: DisposalSuccessModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open && !isInvalid && wasteType) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [open, isInvalid, wasteType]);

  return (
    <>
      <ConfettiEffect show={showConfetti} />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent shadow-none p-0">
          {isInvalid ? (
            // Invalid QR Code UI
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white text-center shadow-2xl animate-scale-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <XCircle className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Invalid QR Code</h2>
              <p className="text-white/80 mb-6">
                This QR code is not recognized. Please scan a valid waste bin QR code.
              </p>
              <Button 
                onClick={onClose}
                className="w-full bg-white text-red-600 hover:bg-white/90 font-semibold rounded-full h-12"
              >
                Try Again
              </Button>
            </div>
          ) : wasteType ? (
            // Success UI
            <div className={`bg-gradient-to-br ${wasteType.color} rounded-3xl p-8 text-white text-center shadow-2xl animate-scale-in overflow-hidden relative`}>
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
              
              {/* Success icon with pulse animation */}
              <div className="relative z-10">
                <div className="w-28 h-28 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <span className="text-6xl">{wasteType.icon}</span>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg font-medium">Success!</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 leading-tight">
                  {wasteType.message}
                </h2>
                
                {/* Credits earned with animation */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Leaf className="w-5 h-5" />
                    <span className="text-sm font-medium">Credits Earned</span>
                  </div>
                  <div className="text-5xl font-bold">
                    +<AnimatedCounter target={wasteType.credits} />
                  </div>
                </div>
                
                {/* Environmental impact message */}
                <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-6">
                  <Recycle className="w-4 h-4" />
                  <span>Thank you for helping the environment!</span>
                </div>
                
                <Button 
                  onClick={onClose}
                  className="w-full bg-white text-gray-800 hover:bg-white/90 font-semibold rounded-full h-12 shadow-lg"
                >
                  Continue Recycling
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisposalSuccessModal;
