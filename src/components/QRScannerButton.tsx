import { useState, useRef } from "react";
import { QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrScanner } from "@yudiel/react-qr-scanner";
import DisposalSuccessModal, { wasteTypes, WasteType } from "@/components/wallet/DisposalSuccessModal";

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

const QRScannerButton = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scannedWaste, setScannedWaste] = useState<WasteType | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const hasScanned = useRef(false);

  const handleResult = (result?: string) => {
    if (!result || hasScanned.current) return;
    hasScanned.current = true;
    
    // Parse the QR code value
    const value = parseInt(result.trim(), 10);
    
    // Close scanner
    setScannerOpen(false);
    
    // Check if valid waste type
    if (!isNaN(value) && value >= 0 && value <= 5) {
      playSuccessSound();
      setScannedWaste(wasteTypes[value]);
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

  return (
    <>
      <Button
        aria-label="Open QR scanner"
        onClick={() => setScannerOpen(true)}
        className="fixed bottom-20 right-4 z-40 lg:hidden rounded-full w-12 h-12 p-0 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <QrCode className="w-6 h-6" />
      </Button>

      {/* QR Scanner Dialog */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Point your camera at the QR code on the waste bin.
          </p>
          <div className="rounded-xl overflow-hidden border border-border">
            <QrScanner
              constraints={{ facingMode: "environment" }}
              onDecode={(text) => handleResult(text)}
              onError={() => { /* no-op */ }}
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
    </>
  );
};

export default QRScannerButton;
