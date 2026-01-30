// components/CategoryHero.tsx
import Image from "next/image";

interface HeroImage {
  src: string;
  alt: string;
}

interface CategoryHeroProps {
  title: string;
  images: HeroImage[];
}

export function CategoryHero({ title, images }: CategoryHeroProps) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-1 md:pt-25">
          <div className="pb-12 text-center md:pb-1">
            {/* ... (Header code remains unchanged) ... */}
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Hero images container */}
      <div
        className="w-full flex justify-center"
        data-aos="zoom-y-out"
        data-aos-delay={200}
      >
        {/* 
          MOBILE:
          - w-full: Use full width
          - aspect-[3/4]: Tall aspect ratio for mobile scroll
          - overflow-x-auto: Allow horizontal scrolling
          - snap-x snap-mandatory: CSS scroll snapping

          DESKTOP (md:):
          - md:w-[75%]: Restrict width
          - md:h-[75vh]: Fixed height
          - md:aspect-auto: Reset aspect ratio
          - md:overflow-hidden: No scroll needed
          - md:flex: Use flexbox layout
        */}
        <div
          className="
          w-full aspect-[3/4] 
          overflow-x-auto snap-x snap-mandatory scrollbar-hide
          flex
          
          md:w-[75%] md:h-[75vh] md:aspect-auto 
          md:overflow-hidden md:rounded-2xl md:shadow-xl
        "
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              className="
                relative 
                /* Mobile: Each image takes full width (shrink-0 prevents squishing) */
                min-w-full h-full snap-center shrink-0
                
                /* Desktop: Share space equally */
                md:min-w-0 md:flex-1 md:shrink
              "
              data-aos="zoom-y-out"
              data-aos-delay={225 + index * 225}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                draggable={false} // Prevents ghost dragging on desktop
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
