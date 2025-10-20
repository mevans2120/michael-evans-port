import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const VideoIntro = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="group w-16 h-16 bg-accent/10 hover:bg-accent/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 animate-slow-pulse"
        >
          <Play size={24} className="text-accent ml-1" fill="currentColor" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none [&>button]:hidden">
        <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden shadow-elegant">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 p-3 bg-background/90 hover:bg-background text-foreground rounded-full transition-colors shadow-lg border border-border"
            aria-label="Close video"
          >
            <X size={24} />
          </button>
          
          {/* Video placeholder - replace with actual video */}
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">▶️</div>
              <p className="text-muted-foreground text-lg">Video player placeholder</p>
              <p className="text-sm text-muted-foreground mt-2">Replace with your introduction video</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoIntro;