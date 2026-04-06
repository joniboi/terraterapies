import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import Logo from "@/components/ui/logo";
import { auth } from "@/auth";
import RedeemButton from "@/components/admin/redeem-button";
import { CheckCircle2, XCircle, AlertCircle, ShieldAlert } from "lucide-react";

export default async function VerifyPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  const session = await auth();
  const isAdmin = !!session?.user;

  // 1. Error: No ID in URL
  if (!id) {
    return (
      <StatusScreen
        icon={<AlertCircle size={64} />}
        color="bg-gray-100 text-gray-500"
        title="Link no válido"
        desc="Por favor, escanea un código QR válido."
      />
    );
  }

  // 2. Fetch from DB
  const card = await db.query.giftCards.findFirst({
    where: eq(schema.giftCards.id, id),
  });

  // 3. Error: ID not found in DB
  if (!card) {
    return (
      <StatusScreen
        icon={<ShieldAlert size={64} />}
        color="bg-amber-100 text-amber-700"
        title="No Encontrado"
        desc="Este código no existe en nuestro sistema."
      />
    );
  }

  // 4. Case: Already Used
  if (card.status === "redeemed") {
    return (
      <StatusScreen
        icon={<XCircle size={64} />}
        color="bg-red-50 text-red-600"
        title="YA CANJEADA"
        desc={`Usada el ${card.redeemedAt?.toLocaleDateString()} a las ${card.redeemedAt?.toLocaleTimeString()}`}
      />
    );
  }

  // 5. SUCCESS: Valid Card
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-green-500">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6 opacity-20 grayscale">
            <Logo lang="es" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 size={48} />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">¡VÁLIDA!</h1>
          <p className="text-green-600 font-bold tracking-widest text-xs uppercase mb-8">
            Tarjeta Regalo Activa
          </p>

          <div className="space-y-4 text-left border-t border-b border-gray-100 py-6">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                Tratamiento
              </p>
              <p className="text-lg font-bold text-gray-800 leading-tight">
                {card.treatmentNameSnapshot}
              </p>
              <p className="text-sm text-gray-500">{card.durationSnapshot}</p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                  Para
                </p>
                <p className="text-md font-semibold text-gray-800">
                  {card.recipientName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-right">
                  Código
                </p>
                <p className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {card.locatorCode}
                </p>
              </div>
            </div>
          </div>

          {/* ADMIN ACTIONS */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {isAdmin ? (
              <>
                <p className="text-[10px] uppercase font-black text-gray-400 mb-3 tracking-tighter">
                  Panel de Administración
                </p>
                <RedeemButton id={card.id} code={card.locatorCode} />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-[11px] text-gray-400 italic mb-3">
                  Esta es una confirmación oficial de Terraterapies.
                </p>
                {/* 🔑 Secret Login Link for your wife */}
                <a
                  href={`/signin?callbackUrl=/verify?id=${card.id}`}
                  className="text-[10px] text-gray-300 hover:text-blue-500 transition-colors uppercase font-bold"
                >
                  Administración
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable mini-component for status states
function StatusScreen({
  icon,
  color,
  title,
  desc,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${color}`}
    >
      <div className="mb-6 animate-bounce-slow">{icon}</div>
      <h1 className="text-4xl font-black mb-2">{title}</h1>
      <p className="text-lg max-w-xs mx-auto font-medium opacity-80">{desc}</p>
      <div className="mt-12 opacity-30">
        <Logo lang="es" />
      </div>
    </div>
  );
}
