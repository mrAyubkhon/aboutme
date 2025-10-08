import React from 'react';
import { useLoading } from '../context/LoadingContext';
import PhysicsButton from './PhysicsButton';

export default function TestLoadingButton() {
  const { startLoading, stopLoading } = useLoading();

  const handleTestLoading = () => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, 2000); // 2 секунды загрузки
  };

  return (
    <PhysicsButton
      onClick={handleTestLoading}
      variant="secondary"
      className="w-full"
    >
      Test Loading Indicator (2s)
    </PhysicsButton>
  );
}
