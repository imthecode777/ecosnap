import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMaterials: string[];
  onMaterialsChange: (materials: string[]) => void;
}

const materials = [
  { id: "plastic", name: "Plastic", color: "bg-blue-500" },
  { id: "paper", name: "Paper", color: "bg-green-500" },
  { id: "metal", name: "Metal", color: "bg-yellow-500" },
  { id: "textile", name: "Textile", color: "bg-purple-500" },
  { id: "glass", name: "Glass", color: "bg-cyan-500" },
  { id: "organic", name: "Organic", color: "bg-orange-500" },
  { id: "e-waste", name: "E-Waste", color: "bg-red-500" },
  { id: "hazardous", name: "Hazardous", color: "bg-pink-500" },
];

const AdvancedFiltersPanel = ({
  isOpen,
  onClose,
  selectedMaterials,
  onMaterialsChange,
}: AdvancedFiltersPanelProps) => {
  if (!isOpen) return null;

  const toggleMaterial = (materialId: string) => {
    if (selectedMaterials.includes(materialId)) {
      onMaterialsChange(selectedMaterials.filter((m) => m !== materialId));
    } else {
      onMaterialsChange([...selectedMaterials, materialId]);
    }
  };

  const clearAll = () => {
    onMaterialsChange([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-background border-2 border-primary/20 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Advanced Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Materials Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Select Materials
            </p>
            {selectedMaterials.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-primary hover:text-primary/80"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {materials.map((material) => {
              const isSelected = selectedMaterials.includes(material.id);
              return (
                <button
                  key={material.id}
                  onClick={() => toggleMaterial(material.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${material.color} flex-shrink-0`}
                  />
                  <span className="text-sm font-medium text-foreground flex-1 text-left">
                    {material.name}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full border-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90"
          >
            Apply Filters ({selectedMaterials.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersPanel;
