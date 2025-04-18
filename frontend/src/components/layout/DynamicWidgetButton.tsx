import React from "react";
import {
  DynamicUserProfile,
  DynamicWidget,
  useDynamicContext
} from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function DynamicWidgetButton (){
  const { setShowDynamicUserProfile, user } = useDynamicContext();

  if (!user) {
    return <DynamicWidget />
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" onClick={() => setShowDynamicUserProfile(true)}>
                  <User className="h-4 w-4 text-earth-medium-green" />
                </Button>
      <DynamicUserProfile />
    </>
  );
};