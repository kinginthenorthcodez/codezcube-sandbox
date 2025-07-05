
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 sm:max-w-md z-50 shadow-2xl animate-in slide-in-from-bottom-12">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            {' '}
            <Link href="/cookie-policy" className="text-primary hover:underline">
              Learn more
            </Link>
            .
          </p>
        </div>
        <Button onClick={handleAccept} size="sm">Accept</Button>
      </CardContent>
    </Card>
  );
}
