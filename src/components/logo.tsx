import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Codezcube Home">
       <div className="h-7 w-7">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <path d="M50 15 L95 40 L50 65 L5 40 Z" className="fill-primary" />
            <path d="M5 40 L50 65 L50 115 L5 90 Z" className="fill-primary/70" />
            <path d="M95 40 L50 65 L50 115 L95 90 Z" className="fill-primary/40" />
          </g>
        </svg>
      </div>
      <span className="font-headline text-2xl font-bold text-primary">Codezcube.</span>
    </Link>
  );
}
