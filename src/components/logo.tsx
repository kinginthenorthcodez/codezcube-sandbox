import Link from 'next/link';
import { Box } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="CodezCube Home">
      <Box className="h-7 w-7 text-primary" />
      <span className="font-headline text-2xl font-bold">CodezCube</span>
    </Link>
  );
}
