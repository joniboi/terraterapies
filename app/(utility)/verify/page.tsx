import { db } from "@/db";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import Logo from "@/components/ui/logo";
import { auth } from "@/auth";
import RedeemButton from "@/app/(backoffice)/admin/gift-cards/_components/redeem-button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert,
  Check,
} from "lucide-react";

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
    with: { redemptions: true },
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

  // 4. Logic to calculate status
  const isBono = card.totalSessions > 1;
  const remainingSessions = card.totalSessions - card.usedSessions;
  const isFullyRedeemed = remainingSessions === 0;

  if (isFullyRedeemed) {
    return (
      <StatusScreen
        icon={<XCircle size={64} />}
        color="bg-red-50 text-red-600"
        title={isBono ? "BONO AGOTADO" : "YA CANJEADA"}
        desc={`La última sesión fue usada el ${card.redeemedAt?.toLocaleDateString()}`}
      />
    );
  }

  // 5. SUCCESS: Valid Card
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-success">
      <div className="w-full max-w-sm bg-background rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6 opacity-20 grayscale">
            <Logo lang="es" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-background text-success mb-4">
            <CheckCircle2 size={48} />
          </div>

          <h1 className="text-3xl font-black text-foreground mb-1">¡VÁLIDA!</h1>
          <p className="text-success font-bold tracking-widest text-xs uppercase mb-6">
            Tarjeta Regalo Activa
          </p>

          {/* BONO TRACKER */}
          {isBono && (
            <div className="bg-muted p-4 rounded-2xl border border-border mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Sesiones del Bono
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {Array.from({ length: card.totalSessions }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                      i < card.usedSessions
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-success text-success-foreground shadow-sm"
                    }`}
                  >
                    {i < card.usedSessions ? <Check size={14} /> : i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground mt-3">
                Quedan{" "}
                <span className="text-success font-black">
                  {remainingSessions}
                </span>{" "}
                de {card.totalSessions} visitas
              </p>
            </div>
          )}

          <div className="space-y-4 text-left border-t border-b border-gray-100 py-6">
            {/* ... Keep the existing Treatment Name & Buyer UI here ... */}
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                Tratamiento
              </p>
              <p className="text-lg font-bold text-gray-800 leading-tight">
                {card.treatmentNameSnapshot}
              </p>
              <p className="text-sm text-gray-500">{card.durationSnapshot}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-2xl border border-border">
            {isAdmin ? (
              <>
                <p className="text-[10px] uppercase font-black text-gray-400 mb-3 tracking-tighter">
                  Panel de Administración
                </p>
                {/* 👉 Pass dynamic text to button */}
                <RedeemButton
                  id={card.id}
                  code={card.locatorCode}
                  remaining={remainingSessions}
                  isBono={isBono}
                />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <a
                  href={`/signin?callbackUrl=/verify?id=${card.id}`}
                  className="text-[10px] text-gray-300 hover:text-blue-500 font-bold"
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
