
import { useState } from 'react';

export const usePrivacyPolicy = () => {
  const [isPolicyModalVisible, setPolicyModalVisible] = useState(false);
  const [hasAgreedToPolicy, setHasAgreedToPolicy] = useState(false);
  const [hasScrolledToPolicyBottom, setHasScrolledToPolicyBottom] = useState(false);

  const handleOpenPolicy = () => {
    setPolicyModalVisible(true);
  };

  const handleClosePolicy = () => {
    setPolicyModalVisible(false);
  };

  const handleScrollToPolicyBottom = () => {
    setHasScrolledToPolicyBottom(true);
  };

  const handleToggleAgreement = () => {
    if (hasScrolledToPolicyBottom) {
      setHasAgreedToPolicy(!hasAgreedToPolicy);
    }
  };

  return {
    isPolicyModalVisible,
    hasAgreedToPolicy,
    hasScrolledToPolicyBottom,
    handleOpenPolicy,
    handleClosePolicy,
    handleScrollToPolicyBottom,
    handleToggleAgreement,
    setHasAgreedToPolicy,
  };
};
