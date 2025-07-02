
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Package } from 'lucide-react';

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="container py-16 md:py-24">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Our Products</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Discover the innovative products and solutions we've built.
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <Card key={product.id} className="flex flex-col overflow-hidden group">
                           <div className="relative overflow-hidden">
                                <Image
                                    src={product.imageUrl || 'https://placehold.co/600x400.png'}
                                    alt={product.title}
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                           </div>
                            <CardHeader>
                                <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                                <CardTitle className="text-xl">{product.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{product.description}</CardDescription>
                            </CardContent>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={product.productUrl} target="_blank" rel="noopener noreferrer">
                                        Learn More <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
                        <Package className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                        Products Coming Soon!
                    </h2>
                    <p className="max-w-2xl text-muted-foreground mb-6">
                        We are diligently working on curating and developing a suite of innovative products. Stay tuned for exciting announcements and releases designed to empower your projects and learning journeys.
                    </p>
                    <p className="max-w-2xl text-muted-foreground">
                        In the meantime, feel free to explore our comprehensive{' '}
                        <Link href="/services" className="text-primary hover:underline">
                            services
                        </Link>{' '}
                        or get in touch for a{' '}
                        <Link href="/booking" className="text-primary hover:underline">
                            consultation
                        </Link>
                        .
                    </p>
                </div>
            )}
        </div>
    );
}
