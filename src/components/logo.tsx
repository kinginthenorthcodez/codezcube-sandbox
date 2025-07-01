import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Codezcube Home">
       <div className="h-7 w-7">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, -5)">
                <path d="M50 15 L95 40 L95 90 L50 115 L5 90 L5 40 Z" stroke="hsl(var(--primary))" strokeWidth="5" fill="transparent" />
                <path d="M50 15 L5 40 L50 65 L95 40 Z" fill="#FFDC00" />
                <path d="M5 40 L5 90 L50 115 L50 65 Z" fill="hsl(var(--accent))" />
                <path d="M95 40 L95 90 L50 115 L50 65 Z" fill="hsl(var(--primary))" />
            </g>
        </svg>
      </div>
      <span className="font-headline text-2xl font-bold text-primary">Codezcube.</span>
    </Link>
  );
}
