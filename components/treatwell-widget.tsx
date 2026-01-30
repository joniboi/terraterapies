"use client";

export default function TreatwellWidget() {
  return (
    <div className="h-full w-full">
      <iframe
        src="https://widget.treatwell.es/establecimiento/494602/servicios/"
        className="h-full w-full border-0"
        title="Reserva tu cita"
        loading="lazy"
        allow="payment" // Sometimes needed for payment gateways inside iframes
      />
    </div>
  );
}
