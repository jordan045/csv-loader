import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

interface CardWrapperProps {
    graphs: string[];
}

export default function CardWrapper({ graphs }: CardWrapperProps) {
    const Download04Icon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
            <path d="M12 14.5L12 4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    const Delete02Icon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
          <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    const handleDownload = (index: number) => {
        const link = document.createElement('a');
        link.href = graphs[index]; // La URL de datos de la imagen generada dinámicamente
        link.download = 'graph.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3 h-min mt-2 mx-auto">
            {graphs.map((graph, index) => (
                <Card key={index} className="w-full h-auto mx-auto">
                    <div className="flex items-center space-x-2 p-2 justify-end">
                        <Button variant="ghost" onClick={() => handleDownload(index)}>
                            <Download04Icon />
                        </Button>
                        <Button variant="ghost">
                            <Delete02Icon />
                        </Button>
                    </div>
                    <CardContent className='p-0'>
                        <Image src={graph} alt={`Graph ${index}`} width={500} height={500} />
                    </CardContent>

                </Card>
            ))}
        </div>
    );
}