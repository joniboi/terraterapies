// scripts/seed-settings.ts
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { BRAND } from "@/app/lib/config";

async function seed() {
  console.log(`🌱 Seeding settings for brand: ${BRAND}...`);

  const terraData = {
    id: "singleton",
    businessName: "Terraterapies Thai & Bali",
    heroTagline: {
      es: "Masajes con esencia Tailandesa y Balinesa",
      ca: "Massatges amb essència Tailaudesa i Balinesa",
      en: "Massages with Thai and Balinese essence",
    },
    aboutUsText: {
      ca: "Som especialistes en massatges orientals, reconeguts a escala mundial per la seva excel·lència, tècnica i profund coneixement del benestar corporal.\n\nEl nostre centre està dirigit per Julie Ann Colorado, professional amb més de 10 anys d'experiència i trajectòria com a formadora, fet que garanteix un servei de màxima qualitat i rigor.\n\nA Sant Cugat, som l'únic espai que ofereix una experiència autèntica de massatge oriental. Tot el nostre equip està format per terapeutes originaris d'Àsia, experts en tècniques tradicionals que combinen saviesa ancestral amb un tracte acurat i professional.\n\nAquí no només oferim un massatge, sinó una experiència única de relaxació, equilibri i renovació.",
      en: "We are specialists in oriental massages, recognized worldwide for their excellence, technique, and deep knowledge of bodily well-being.\n\nOur center is directed by Julie Ann Colorado, a professional with over 10 years of experience and a background as a trainer, which guarantees a service of the highest quality and rigor.\n\nIn Sant Cugat, we are the only space that offers an authentic oriental massage experience. Our entire team is made up of therapists originating from Asia, experts in traditional techniques that combine ancient wisdom with careful and professional treatment.\n\nHere we do not just offer a massage, but a unique experience of relaxation, balance, and renewal.",
      es: "Somos especialistas en masajes orientales, reconocidos a nivel mundial por su excelencia, técnica y profundo conocimiento del bienestar corporal.\n\nNuestro centro está dirigido por Julie Ann Colorado, profesional con más de 10 años de experiencia y trayectoria como formadora, lo que garantiza un servicio de máxima calidad y rigor.\n\nEn Sant Cugat, somos el único espacio que ofrece una experiencia auténtica de masaje oriental. Todo nuestro equipo está formado por terapeutas originarios de Asia, expertos en técnicas tradicionales que combinan sabiduría ancestral con un trato cuidado y profesional.\n\nAquí no solo ofrecemos un masaje, sino una experiencia única de relajación, equilibrio y renovación.",
    },
    contactEmail: "info@terraterapies.com",
    contactPhone: "+34 603 17 70 49",
    addressLine1: "Carrer de Josep Puig i Cadafalch, 42-44",
    addressLine2: "08172 Sant Cugat del Vallès",
    mapsLink: "https://maps.app.goo.gl/iKQzo2bKECesL75r8",
    facebookUrl: "https://facebook.com/terraterapies",
    instagramUrl: "https://instagram.com/terraterapies",
    freshaUrl: "https://fresha.com/...",
    partners: [
      { name: "Scens", url: "https://scens.com" },
      { name: "Mezzanotte", url: "https://mezzanotte.com" },
    ],
  };

  const lotusData = {
    id: "singleton",
    businessName: "Lotus de Bali & Thai",
    heroTagline: {
      es: "Rituales de masaje y belleza con esencia de Tailandia y Bali",
      ca: "Rituals de massatge i bellesa amb essència de Tailàndia i Bali",
      en: "Massage & Beauty rituals with Thai and Balinese essence",
    },
    aboutUsText: {
      es: "Tu nuevo refugio en Sarrià...",
      ca: "El teu nou refugi a Sarrià...",
      en: "Your new retreat in Sarrià...",
    },
    contactEmail: "info@lotusdebali.com",
    contactPhone: "+34 603 17 70 49", // Use current for now
    addressLine1: "Carrer de Sant Gervasi de Cassoles, 92",
    addressLine2: "08022 Barcelona",
    mapsLink: "https://maps.app.goo.gl/QiUJs4HpuK7oVy3t9",
    facebookUrl: "",
    instagramUrl: "",
    freshaUrl: "",
    partners: [{ name: "Scens", url: "https://scens.com" }],
  };

  const finalData = BRAND === "lotus" ? lotusData : terraData;

  await db.insert(siteSettings).values(finalData).onConflictDoUpdate({
    target: siteSettings.id,
    set: finalData,
  });

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
