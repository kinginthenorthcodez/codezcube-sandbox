import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Codezcube Home">
       <Image src="/logo.svg" alt="Codezcube Logo" width={32} height={32} />
      <span className="font-headline text-2xl font-bold text-foreground">Codezcube.</span>
    </Link>
  );
}
