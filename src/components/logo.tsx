import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Codezcube Home">
       <div className="h-8 w-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#FF8C00', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#4169E1', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#1E90FF', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#DC143C', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#FF6347', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          <polygon points="50,5 95,27.5 50,50 5,27.5" fill="url(#grad1)" />
          
          <polygon points="5,27.5 50,50 50,95 5,72.5" fill="url(#grad2)" />
          
          <polygon points="95,27.5 50,50 50,95 95,72.5" fill="url(#grad3)" />

          <rect x="27.5" y="16.25" width="45" height="22.5" fill="#FFFFFF" />
          <rect x="27.5" y="38.75" width="22.5" height="22.5" fill="#000000" />
          <rect x="50" y="38.75" width="22.5" height="22.5" fill="#B22222" />
          <rect x="16.25" y="27.5" width="22.5" height="22.5" fill="#4682B4" />
          <rect x="16.25" y="50" width="22.5" height="22.5" fill="#32CD32" />

          <rect x="61.25" y="27.5" width="22.5" height="22.5" fill="#FFD700" />
          <rect x="61.25" y="50" width="22.5" height="22.5" fill="#FFFFFF" />
          
        </svg>
      </div>
      <span className="font-headline text-2xl font-bold text-foreground">Codezcube.</span>
    </Link>
  );
}
