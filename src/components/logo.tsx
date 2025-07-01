import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Codezcube Home">
       <div className="h-7 w-7">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* Base faces */}
            <path d="M50 15 L5 40 L50 65 L95 40 Z" fill="#242468" />
            <path d="M5 40 L5 90 L50 115 L50 65 Z" fill="#242468" />
            <path d="M95 40 L95 90 L50 115 L50 65 Z" fill="#242468" />
            
            {/* Yellow Tiles */}
            <g fill="#fcdc00">
              {/* Top face */}
              <path d="M50 15 L35 23.33 L50 31.66 L65 23.33 Z" />
              {/* Left face */}
              <path d="M20 48.33 L35 56.66 L35 73.33 L20 65 Z" />
              <path d="M35 73.33 L50 81.66 L50 98.33 L35 90 Z" />
              {/* Right face */}
              <path d="M80 48.33 L65 56.66 L65 73.33 L80 65 Z" />
            </g>
            
            {/* Red Tiles */}
            <g fill="#b52024">
              {/* Top face */}
              <path d="M35 23.33 L20 31.66 L35 40 L50 31.66 Z" />
              <path d="M65 23.33 L80 31.66 L65 40 L50 31.66 Z" />
              {/* Left face */}
              <path d="M5 56.66 L20 65 L20 81.66 L5 73.33 Z" />
              {/* Right face */}
              <path d="M95 56.66 L80 65 L80 81.66 L95 73.33 Z" />
              <path d="M65 73.33 L50 81.66 L50 98.33 L65 90 Z" />
            </g>

            {/* Main cube outline */}
            <path d="M50 15 L95 40 L95 90 L50 115 L5 90 L5 40 Z" stroke="#242468" strokeWidth="6" fill="transparent" strokeLinejoin="round" />
            <path d="M5 40 L50 65 L95 40 M50 15 L50 65" stroke="#242468" strokeWidth="4" fill="transparent" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
      <span className="font-headline text-2xl font-bold text-primary">Codezcube.</span>
    </Link>
  );
}
