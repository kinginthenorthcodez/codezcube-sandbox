
"use client";

import React, { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function CalendlyEmbed({ url }: { url: string }) {
    const { theme } = useTheme();
    const [isClient, setIsClient] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Ensure this component only renders on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const getResolvedTheme = () => {
        if (!isClient) return 'light'; // Default to light during SSR
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    };
    
    const resolvedTheme = getResolvedTheme();
    
    // Changing the key forces the widget to re-render if the URL or theme changes
    const componentKey = `${url}-${resolvedTheme}`;

    if (!isClient) {
        return <Skeleton className="h-[700px] w-full rounded-lg" />;
    }

    return (
        <div className="relative h-[700px] w-full">
            {!isLoaded && (
                <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
            )}
            <InlineWidget
                key={componentKey}
                url={url}
                styles={{ height: '100%', width: '100%' }}
                pageSettings={{
                    backgroundColor: resolvedTheme === 'dark' ? '0d1117' : 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '29abe2',
                    textColor: resolvedTheme === 'dark' ? 'c9d1d9' : '0d1117',
                }}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
}
