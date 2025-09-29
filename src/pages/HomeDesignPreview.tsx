import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import HomeMinimal from './HomeMinimal';
import HomeLuxurious from './HomeLuxurious';
import HomeNeoBrutalist from './HomeNeoBrutalist';

type DesignVersion = 'minimal' | 'luxurious' | 'neobrutalist';

const HomeDesignPreview: React.FC = () => {
  const [activeDesign, setActiveDesign] = useState<DesignVersion>('minimal');

  const renderDesign = () => {
    switch (activeDesign) {
      case 'minimal':
        return <HomeMinimal />;
      case 'luxurious':
        return <HomeLuxurious />;
      case 'neobrutalist':
        return <HomeNeoBrutalist />;
      default:
        return <HomeMinimal />;
    }
  };

  return (
    <div className="relative">
      {/* Fixed Design Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
        <Button
          variant={activeDesign === 'minimal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveDesign('minimal')}
        >
          Minimal
        </Button>
        <Button
          variant={activeDesign === 'luxurious' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveDesign('luxurious')}
        >
          Luxurious
        </Button>
        <Button
          variant={activeDesign === 'neobrutalist' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveDesign('neobrutalist')}
        >
          Neo-Brutalist
        </Button>
      </div>

      {/* Render Active Design */}
      {renderDesign()}
    </div>
  );
};

export default HomeDesignPreview;