/* eslint-disable @next/next/no-img-element */
'use client'
import { X } from "lucide-react";
import { useEffect } from "react";

type PropsZoomType = {
    source: string,
    zoom: boolean,
    alt: string,
    setZoom: (val: boolean) => void
}

const ZoomImage = ({ zoom, setZoom, alt, source }: PropsZoomType) => {
    useEffect(() => {
        if (!zoom) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setZoom(false);
        };

        document.addEventListener('keydown', handleEsc);
        // Chặn scroll khi zoom
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [zoom, setZoom]);
    if (!zoom) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200 z-1000"
                onClick={() => setZoom(false)}>
                {zoom && (
                    <>
                        <img src={source} loading="lazy" alt={alt} className="max-h-[90vh] max-w-[90vw] rounded-2xl" onClick={(e) => e.stopPropagation()} />
                        <button
                            onClick={() => setZoom(false)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                            aria-label="Close"
                        >
                            <X />
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

export default ZoomImage