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
          {/* Section header */}
          <div className="pb-12 text-center md:pb-1">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]"
              data-aos="zoom-y-out"
            >
              <div className="-mx-0.5 flex justify-center -space-x-3"></div>
            </div>
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

      {/* Hero images */}
      <div
        className="w-full flex justify-center"
        data-aos="zoom-y-out"
        data-aos-delay={200}
      >
        <div className="w-[75%] h-[75vh] flex overflow-hidden rounded-2xl shadow-xl">
          {images.map((image, index) => (
            <div
              key={image.src}
              className="relative flex-1"
              data-aos="zoom-y-out"
              data-aos-delay={225 + index * 225}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
