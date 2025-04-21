import React from 'react';
import { DynamicUserProfile, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export function DynamicWidgetButton() {
  const { setShowDynamicUserProfile, user } = useDynamicContext();

  if (!user) {
    return <DynamicWidget />;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hidden h-8 w-8 md:flex"
        onClick={() => setShowDynamicUserProfile(true)}
      >
        <User className="text-earth-medium-green h-4 w-4" />
      </Button>
      <DynamicUserProfile />
    </>
  );
}
