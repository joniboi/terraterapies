// app/[lang]/contact/page.tsx

import { getDictionary } from "@/app/lib/getDictionary";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const contact = dict.contact;

  return (
    <main className="relative py-20 bg-gray-50 min-h-[70vh] flex flex-col items-center">
      {/* 1. INCREASED WIDTH: Changed max-w-5xl to max-w-6xl to match About page */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {contact.title}
          </h1>
          <p className="text-lg text-gray-600">{contact.subtitle}</p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12 w-full">
          {/* Card 1: Schedule */}
          <div
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🕒</span>
              <h2 className="text-2xl font-semibold text-gray-900">
                {contact.schedule.title}
              </h2>
            </div>

            <ul className="space-y-5 text-lg flex-grow">
              {/* 
                2. FIXED BREAKLINES: 
                - Stacks cleanly on medium screens (flex-col)
                - Spreads side-by-side on large screens (lg:flex-row)
                - "whitespace-nowrap" completely forbids the hours from breaking 
              */}
              <li className="flex flex-col lg:flex-row lg:justify-between lg:items-center border-b border-gray-50 pb-4">
                <span className="text-gray-600 mb-1 lg:mb-0 block">
                  {contact.schedule.weekdays}
                </span>
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  9:30 - 21:30
                </span>
              </li>
              <li className="flex flex-col lg:flex-row lg:justify-between lg:items-center border-b border-gray-50 pb-4">
                <span className="text-gray-600 mb-1 lg:mb-0 block">
                  {contact.schedule.weekends}
                </span>
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  12:00 - 21:30
                </span>
              </li>
              <li className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <span className="text-gray-600 mb-1 lg:mb-0 block">
                  {contact.schedule.holidays}
                </span>
                <span className="font-medium text-gray-900 whitespace-nowrap">
                  12:00 - 21:30
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Contact Info */}
          <div
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl font-semibold text-gray-900">
                {contact.info.title}
              </h2>
            </div>

            <div className="space-y-8 flex-grow">
              {/* Phone / WhatsApp */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {contact.info.phoneTitle}
                </h3>
                <a
                  href="https://wa.me/34603177049"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-medium text-gray-900 hover:text-[#25D366] transition-colors flex items-center gap-2"
                >
                  {contact.info.phone}
                </a>
              </div>

              {/* Address with Google Maps Pin */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {contact.info.addressTitle}
                </h3>
                <a
                  href="https://maps.app.goo.gl/w2wpi4x6ZJ6FogrS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-red-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{contact.info.address}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Embedded Google Map */}
        <div
          className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-200"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <iframe
            title="Terraterapies Thai & Bali Location Map"
            src="https://maps.google.com/maps?q=Terraterapies%20Thai%20&%20Bali,%20Sant%20Cugat&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </main>
  );
}
