'use client';

import { useNavigation } from '@/contexts/NavigationContext';
import { MobileHeader } from './MobileHeader';
import { HamburgerMenu } from './HamburgerMenu';

export function MobileNav() {
  const { chatExpanded, mobileMenuOpen, setMobileMenuOpen } = useNavigation();

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <MobileHeader
        onMenuClick={handleMenuClick}
        chatExpanded={chatExpanded}
        mobileMenuOpen={mobileMenuOpen}
      />
      <HamburgerMenu isOpen={mobileMenuOpen} onClose={handleMenuClose} />
    </>
  );
}
