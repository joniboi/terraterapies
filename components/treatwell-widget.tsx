"use client";

import { useEffect, useRef } from "react";

export default function TreatwellWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean previous widget if any
    containerRef.current.innerHTML = "";

    // Append stylesheet
    const link = document.createElement("link");
    link.type = "text/css";
    link.href = "https://widget.treatwell.es/common/venue-menu/css/widget-button.css";
    link.rel = "stylesheet";
    link.media = "screen";
    document.head.appendChild(link);

    // Append widget script
    const script = document.createElement("script");
    script.src = "https://widget.treatwell.es/common/venue-menu/javascript/widget-button.js?v1";
    script.async = true;
    containerRef.current.appendChild(script);

    // Add iframe container
    const iframeDiv = document.createElement("div");
    iframeDiv.id = "wahanda-online-booking-widget-iframe";
    iframeDiv.setAttribute(
      "data-widget-url",
      "https://widget.treatwell.es/establecimiento/494602/servicios/"
    );
    containerRef.current.appendChild(iframeDiv);
  }, []);

  return <div className="h-full w-full" ref={containerRef}></div>;
}
