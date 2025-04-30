import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useConvexAuth } from 'convex/react';

export function TopNavBlockchainStatus() {
  const { sdkHasLoaded, user } = useDynamicContext();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const convexFailed = !isLoading && !isAuthenticated;
  const dynamicFailed = sdkHasLoaded && !user;

  const authenticatedInAll = !convexFailed && !dynamicFailed;

  const dynamicAuthStatusText = !sdkHasLoaded ? 'Loading...' : dynamicFailed ? 'Failed' : 'Success';
  const convexAuthStatusText = isLoading ? 'Loading...' : convexFailed ? 'Failed' : 'Success';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className=" items-center gap-1.5 whitespace-nowrap rounded-full bg-earth-light-green/20 px-2.5 py-1.5 text-earth-dark-green sm:flex">
            {authenticatedInAll && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            )}
            {(convexFailed || dynamicFailed) && (
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            )}
            <div className="hidden sm:flex">
              {isLoading || !sdkHasLoaded ? (
                <span className="text-xs font-medium">Loading...</span>
              ) : (
                <span className="text-xs font-medium">
                  {authenticatedInAll ? 'Authenticated' : 'Not Authenticated'}
                </span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              Dynamic Auth Status: {dynamicAuthStatusText}
            </span>
            <span className="text-xs font-medium">Convex Auth Status: {convexAuthStatusText}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
