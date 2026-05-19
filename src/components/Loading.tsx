"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
      {/* Contenedor del Spinner Segmentado */}
      <div className="relative h-24 w-24 flex items-center justify-center">
        
        {/* Anillo de fondo sutil */}
        <div className="absolute inset-0 rounded-full border-[6px] border-slate-50" />

        {/* Spinner segmentado (Rebanadas) */}
        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-[#d00000] border-r-[#d00000] animate-spin duration-700 ease-in-out" />
        
        {/* Segundo set de rebanadas con velocidad distinta para profundidad */}
        <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-b-slate-900 border-l-slate-900 animate-spin-reverse opacity-20" />

        {/* Núcleo Central */}
        <div className="relative h-10 w-10 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_#f1f5f9] flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-[#d00000] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Texto Minimalista */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
          Cargando
        </span>
        {/* Línea de carga sutil */}
        <div className="flex gap-1">
          <div className="h-1 w-1 bg-[#d00000] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 bg-[#d00000] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 bg-[#d00000] rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}