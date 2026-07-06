'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { src: '/logo-bravos.jpg', label: 'Logo oficial', alt: 'Logo oficial de Bravos de Zipaquirá' },
  { src: '/uniforme-bravos.jpg', label: 'Uniforme oficial', alt: 'Uniforme oficial de Bravos de Zipaquirá' },
  { src: '/bravos.jpeg', label: 'Nuestro equipo', alt: 'Equipo Bravos de Zipaquirá' },
];

const INTERVAL_MS = 4500;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (i) => setIndex((i + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-negro2 border-b-2 border-dorado"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-[450ms] ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide.src} className="relative w-full flex-shrink-0 h-[45vh] md:h-[60vh]">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-contain"
            />
            <span className="absolute bottom-4 left-4 md:left-8 font-anton text-sm md:text-base tracking-[2px] uppercase text-dorado drop-shadow-[0_1px_3px_rgba(0,0,0,.8)]">
              {slide.label}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => goTo(index - 1)}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-dorado-claro hover:bg-black/75 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-dorado-claro hover:bg-black/75 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 right-4 md:right-8 flex gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => goTo(i)}
            aria-label={`Ir a ${slide.label}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? 'bg-dorado' : 'bg-gris/40 hover:bg-gris'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
