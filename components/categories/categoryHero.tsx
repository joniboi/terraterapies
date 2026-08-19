// components/CategoryHero.tsx
import Image from "next/image";

interface HeroImage {
  src?: string; // 1. Made optional to handle database nulls gracefully
  alt: string;
}

interface CategoryHeroProps {
  title: string;
  images: HeroImage[];
}

export function CategoryHero({ title, images }: CategoryHeroProps) {
  // 2. Sanitize images: Fallback to your main default asset if src is undefined
  const defaultFallback = "/images/treatment-detail.jpg";
  const sanitizedImages = images.map((img) => ({
    src: img.src || defaultFallback,
    alt: img.alt || title,
  }));

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-1 md:pt-25">
          <div className="pb-12 text-center md:pb-1">
            <h1
              className="font-heading text-5xl font-bold mb-6 border-y [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1] md:text-6xl"
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
        <div
          className="
          w-full aspect-[3/4] 
          overflow-x-auto snap-x snap-mandatory scrollbar-hide
          flex
          
          md:w-[75%] md:h-[75vh] md:aspect-auto 
          md:overflow-hidden md:rounded-2xl md:shadow-xl
        "
        >
          {sanitizedImages.map((image, index) => (
            <div
              key={image.src + index} // 3. Use src + index to guarantee a unique React key
              className="
                relative 
                min-w-full h-full snap-center shrink-0
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
