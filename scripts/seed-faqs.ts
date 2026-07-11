import "dotenv/config";
import { db } from "../db";
import { siteSettings } from "../db/schema";
import { eq } from "drizzle-orm";

const mappedFaqs = {
  faqHero: {
    title: {
      es: "Preguntas Frecuentes",
      ca: "Preguntes freqüents",
      en: "Frequently Asked Questions",
    },
    subtitle: {
      es: "Encuentra respuestas a las dudas más comunes sobre nuestros servicios",
      ca: "Respostes ràpides sobre reserves, targetes regal i la teva visita.",
      en: "Quick answers about bookings, gift cards, and your visit.",
    },
  },
  faqCta: {
    title: {
      es: "¿No encuentras lo que buscas?",
      ca: "Encara tens dubtes?",
      en: "Still have questions?",
    },
    subtitle: {
      es: "Estamos aquí para ayudarte. Contáctanos y resolveremos tus dudas.",
      ca: "Escriu-nos i t’ajudarem tan aviat com sigui possible.",
      en: "Message us and we’ll help you as soon as possible.",
    },
    button: {
      es: "Contactar por WhatsApp",
      ca: "Contactar per WhatsApp",
      en: "Contact via WhatsApp",
    },
    whatsappMsg: {
      es: "Hola, tengo una pregunta sobre los servicios de este centro",
      ca: "Hola! Tinc una pregunta sobre aquest centre.",
      en: "Hi! I have a question about this center.",
    },
  },
  faqSections: [
    {
      id: "reservations",
      title: {
        es: "Reservas y Servicios",
        ca: "Reserves i la teva visita",
        en: "Bookings and your visit",
      },
      questions: [
        {
          question: {
            es: "¿Cómo puedo reservar un masaje?",
            ca: "Com puc reservar una cita?",
            en: "How do I book an appointment?",
          },
          answer: {
            es: "Puedes reservar tu cita de tres formas:\n\n• A través de nuestro sistema de reservas online\n• Por teléfono al {contact_phone}\n• Por WhatsApp enviándonos un mensaje",
            ca: "Pots reservar en línia, o contactar-nos directament per telèfon ({contact_phone}) o WhatsApp per trobar el millor horari.",
            en: "You can book online, or contact us directly by phone ({contact_phone}) or WhatsApp to find the best time for you.",
          },
        },
        {
          question: {
            es: "¿Con cuánta antelación debo hacer mi reserva?",
            ca: "Amb quanta antelació hauria de reservar?",
            en: "How far in advance should I book?",
          },
          answer: {
            es: "Recomendamos reservar con al menos 48 horas de antelación para asegurar disponibilidad. Para tratamientos especiales o en fines de semana, te sugerimos reservar con una semana de antelación.",
            ca: "Recomanem reservar com a mínim amb 48 hores d’antelació. Per caps de setmana i franges amb més demanda, és millor reservar abans.",
            en: "We recommend booking at least 48 hours in advance. For weekends and peak hours, booking earlier helps ensure availability.",
          },
        },
        {
          question: {
            es: "¿Puedo cancelar o modificar mi cita?",
            ca: "Puc modificar o cancel·lar una reserva?",
            en: "Can I reschedule or cancel?",
          },
          answer: {
            es: "Sí, puedes modificar o cancelar tu reserva sin coste contactándonos con al menos 24 horas de antelación. Las cancelaciones de última hora pueden estar sujetas a una penalización.",
            ca: "Sí. Si necessites canviar la teva cita, avisa’ns tan aviat com puguis. Les cancel·lacions d’última hora poden comportar un càrrec segons l’antelació amb què s’avisi.",
            en: "Yes. Please let us know as soon as possible if you need to change your appointment. Late cancellations may be subject to a fee depending on the notice given.",
          },
        },
        {
          question: {
            es: "¿Cuál es el horario de apertura?",
            ca: "Quin és l’horari d’obertura?",
            en: "What are the opening hours?",
          },
          answer: {
            es: "Nuestro centro está abierto de lunes a viernes de 9:30 a 21:30h, y sábados y domingos de 12:00 a 21:30h. Cerramos los días 25 de diciembre y 1 de enero.",
            ca: "El nostre centre està obert de dilluns a divendres de 9:30 a 21:30 h, i dissabtes, diumenges i festius de 12:00 a 21:30 h. Tanquem els dies 25 de desembre i 1 de gener.",
            en: "Our centre is open Monday to Friday from 9:30 to 21:30, and Saturdays and Sundays from 12:00 to 21:30. We are closed on 25 December and 1 January.",
          },
        },
        {
          question: {
            es: "¿Debo llegar con antelación?",
            ca: "Quan hauria d’arribar?",
            en: "When should I arrive?",
          },
          answer: {
            es: "Te recomendamos llegar 10 minutos antes de tu cita. Esto te permitirá acomodarte, relajarte y aprovechar al máximo tu experiencia desde el primer momento.",
            ca: "Arribar 10 minuts abans t’ajuda a instal·lar-te amb calma i començar l’experiència sense presses.",
            en: "Arriving 10 minutes early gives you time to settle in and start the experience calmly.",
          },
        },
        {
          question: {
            es: "¿Qué debo llevar el día del tratamiento?",
            ca: "He de portar alguna cosa?",
            en: "What should I bring?",
          },
          answer: {
            es: "No es necesario traer nada especial. Proporcionamos todo lo necesario para tu comodidad. Solo trae ganas de desconectar.",
            ca: "No cal portar res especial. Nosaltres t’oferim el necessari per a la sessió. Si tens preferències o sensibilitats, digues-nos-ho.",
            en: "Nothing special. We provide what you need for the session. If you have any preferences or sensitivities, just tell us.",
          },
        },
        {
          question: {
            es: "¿Puedo elegir el tipo de aceite o aroma?",
            ca: "Puc escollir l’oli o l’aroma?",
            en: "Can I choose the oil or aroma?",
          },
          answer: {
            es: "Por supuesto. Nuestros terapeutas te consultarán tus preferencias antes de comenzar y adaptarán el tratamiento a tus necesidades.",
            ca: "Sí. Quan el tractament inclou oli, podem adaptar-lo a les teves preferències i sensibilitats. Si tens al·lèrgies, avisa’ns abans de començar.",
            en: "Yes. Whenever the treatment uses oil, we can adapt to your preferences and sensitivities. If you have allergies, please tell us before starting.",
          },
        },
        {
          question: {
            es: "¿El centro es responsable de objetos personales?",
            ca: "Us feu responsables dels objectes personals?",
            en: "Are you responsible for personal belongings?",
          },
          answer: {
            es: "Te recomendamos no traer objetos de valor. Terraterapies no se hace responsable de pérdidas o daños de objetos personales olvidados.",
            ca: "Et recomanem vigilar les teves pertinences i evitar portar objectes de valor. No ens podem fer responsables de pèrdues o objectes oblidats.",
            en: "Please keep an eye on your personal items. We recommend avoiding valuables, as we can’t take responsibility for lost or forgotten belongings.",
          },
        },
      ],
    },
    {
      id: "gift-cards",
      title: {
        es: "Tarjetas Regalo",
        ca: "Targetes regal",
        en: "Gift cards",
      },
      questions: [
        {
          question: {
            es: "¿Cómo compro una tarjeta regalo?",
            ca: "Com puc comprar una targeta regal?",
            en: "How do I buy a gift card?",
          },
          answer: {
            es: "Selecciona la opción 'Regalar' en cualquier tratamiento, completa los datos y realiza el pago. Recibirás la tarjeta en tu correo.",
            ca: "Tria un tractament a la web, selecciona l’opció de regal i completa la compra. Rebràs la targeta per correu electrònic.",
            en: "Choose a treatment on our website, select the gift option, and complete the purchase. You’ll receive the gift card by email.",
          },
        },
        {
          question: {
            es: "¿Cómo uso una tarjeta regalo para reservar?",
            ca: "Com puc bescanviar una targeta regal?",
            en: "How do I redeem a gift card?",
          },
          answer: {
            es: "Contáctanos para agendar tu cita por teléfono ({contact_phone}) o WhatsApp, indicando el código de localizador de la tarjeta regalo.",
            ca: "Contacta’ns per telèfon ({contact_phone}) o WhatsApp per reservar i facilita’ns el codi/localitzador de la targeta. T’ajudarem a trobar disponibilitat.",
            en: "Contact us by phone ({contact_phone}) or WhatsApp to book and share the gift card code/locator. We’ll help you find the best slot.",
          },
        },
        {
          question: {
            es: "¿Cuánto tiempo es válida una tarjeta regalo?",
            ca: "Quina validesa té una targeta regal?",
            en: "How long is a gift card valid for?",
          },
          answer: {
            es: "Las tarjetas regalo tienen una validez de 1 año desde la fecha de compra.",
            ca: "Les targetes regal tenen una validesa d’1 any des de la data de compra.",
            en: "Gift cards are valid for 1 year from the purchase date.",
          },
        },
        {
          question: {
            es: "¿Puedo cambiar el tratamiento de mi tarjeta regalo?",
            ca: "Puc canviar el tractament de la targeta regal?",
            en: "Can I switch the treatment on my gift card?",
          },
          answer: {
            es: "Sí, puedes cambiar a otro tratamiento de igual o mayor valor abonando la diferencia. No se realizan reembolsos por cambios a menor valor.",
            ca: "Sí, pots canviar-lo per un tractament d’import igual o superior. Si el nou tractament és més car, es pot abonar la diferència.",
            en: "You can switch to another treatment of equal or higher value. If the new option costs more, you can pay the difference.",
          },
        },
        {
          question: {
            es: "¿Las tarjetas regalo son reembolsables o transferibles?",
            ca: "Les targetes regal són reemborsables o transferibles?",
            en: "Are gift cards refundable or transferable?",
          },
          answer: {
            es: "No son reembolsables una vez procesado el pago, pero pueden ser transferidas a otra persona facilitando el código de localizador.",
            ca: "Les targetes regal no són reemborsables un cop comprades, però es poden transferir a una altra persona sempre que tingui el codi/localitzador.",
            en: "Gift cards are not refundable once purchased, but they can be transferred to another person as long as the code/locator is provided.",
          },
        },
        {
          question: {
            es: "¿Qué pasa si pierdo el correo con mi tarjeta regalo?",
            ca: "Què passa si perdo el correu o el PDF de la targeta regal?",
            en: "What if I lose the gift card email/PDF?",
          },
          answer: {
            es: "Si conservas el correo de confirmación de compra, contáctanos e intentaremos ayudarte a recuperar la información.",
            ca: "Si conserves la confirmació de compra, contacta’ns i intentarem ajudar-te a recuperar la informació.",
            en: "If you still have the purchase confirmation, contact us and we’ll do our best to help you recover the details.",
          },
        },
      ],
    },
    {
      id: "legal",
      title: {
        es: "Información Legal y Privacidad",
        ca: "Informació legal i privacitat",
        en: "Legal and privacy",
      },
      questions: [
        {
          question: {
            es: "¿Quién gestiona esta web?",
            ca: "Qui és el responsable d’aquest web?",
            en: "Who is responsible for this website?",
          },
          answer: {
            es: "Esta página web es gestionada por {business_name}.",
            ca: "Aquest lloc web és gestionat per {business_name}.",
            en: "This website is operated by {business_name}.",
          },
        },
        {
          question: {
            es: "¿Es seguro comprar online?",
            ca: "És segura la compra en línia?",
            en: "Is it safe to purchase online?",
          },
          answer: {
            es: "Sí. Los pagos se procesan a través de proveedores seguros y certificados. No almacenamos datos de tarjetas de crédito.",
            ca: "Sí. Els pagaments en línia es processen mitjançant proveïdors de pagament segurs. No emmagatzemem dades de targetes.",
            en: "Yes. Online payments are processed through secure payment providers. We do not store your card details.",
          },
        },
        {
          question: {
            es: "¿Qué datos personales se solicitan?",
            ca: "Quines dades personals es demanen?",
            en: "What personal data do you collect?",
          },
          answer: {
            es: "Solo los necesarios para gestionar reservas y compras. Estos datos se utilizan exclusivamente para la gestión de tu servicio.",
            ca: "Només les necessàries per gestionar reserves i compres. Les utilitzem exclusivament per a la gestió del servei i comunicacions relacionades.",
            en: "Only what is needed to manage bookings and purchases. We use it exclusively for service management and related communications.",
          },
        },
        {
          question: {
            es: "¿Se comparten mis datos con terceros?",
            ca: "Compartiu les meves dades amb tercers?",
            en: "Do you share my data with third parties?",
          },
          answer: {
            es: "No vendemos tus datos. Solo se comparten cuando es estrictamente necesario para prestar el servicio (ej. pasarela de pago).",
            ca: "No venem les teves dades. Només es comparteixen quan és necessari per prestar el servei (per exemple, processament de pagaments).",
            en: "We do not sell your data. We only share information when it’s required to provide the service (for example, payment processing).",
          },
        },
      ],
    },
  ],
};

async function seedFaqs() {
  console.log("🌱 Seeding FAQs into the database...");
  try {
    await db
      .update(siteSettings)
      .set({
        faqHero: mappedFaqs.faqHero,
        faqCta: mappedFaqs.faqCta,
        faqSections: mappedFaqs.faqSections,
      })
      .where(eq(siteSettings.id, "singleton"));

    console.log("✅ FAQs successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedFaqs();
