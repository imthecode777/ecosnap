import { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar: string | null;
  fallback: string;
}

const AvatarUpload = ({ currentAvatar, fallback }: AvatarUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState([1]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { updateAvatar } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setZoom([1]);
        setPosition({ x: 0, y: 0 });
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const maxOffset = 50 * zoom[0];
    const newX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStart.x));
    const newY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStart.y));
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (!selectedImage) return;

    // Create a canvas to crop the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        // Draw circular clip
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Calculate crop dimensions
        const scale = zoom[0];
        const offsetX = position.x;
        const offsetY = position.y;
        
        const drawSize = size * scale;
        const drawX = (size - drawSize) / 2 + offsetX;
        const drawY = (size - drawSize) / 2 + offsetY;
        
        ctx.drawImage(img, drawX, drawY, drawSize, drawSize);
        
        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        updateAvatar(croppedImage);
        toast.success('Profile photo updated!');
        setIsOpen(false);
        setSelectedImage(null);
      }
    };
    
    img.src = selectedImage;
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedImage(null);
    setZoom([1]);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <>
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/10">
          {currentAvatar ? (
            <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-primary">
              {fallback}
            </div>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Camera className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Photo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Crop Preview */}
            <div 
              ref={imageRef}
              className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-primary/30 bg-muted cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="absolute w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    transform: `scale(${zoom[0]}) translate(${position.x / zoom[0]}px, ${position.y / zoom[0]}px)`,
                    transformOrigin: 'center'
                  }}
                  draggable={false}
                />
              )}
              <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-full pointer-events-none" />
            </div>

            {/* Zoom Control */}
            <div className="flex items-center gap-4 px-4">
              <ZoomOut className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={zoom}
                onValueChange={setZoom}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-5 h-5 text-muted-foreground" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Drag to reposition • Scroll to zoom
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarUpload;
