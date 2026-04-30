"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import Image from "next/image";

export type AlertType = "error" | "success" | "warning" | "info";

export interface AlertOptions {
  title: string;
  message: string;
  icon?: React.ReactNode;
  image?: string;
  confirmText?: string;
  onClose?: () => void;
  type?: AlertType;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const typeStyles = {
  success: {
    bg: "bg-[#e6f7f6]",
    icon: "text-[#03807a]",
    button: "bg-[#03807a] hover:bg-[#02645f]",
    defaultIcon: <CheckCircle className="h-12 w-12" />,
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-500",
    button: "bg-red-500 hover:bg-red-600",
    defaultIcon: <AlertCircle className="h-12 w-12" />,
  },
  warning: {
    bg: "bg-[#fff4df]",
    icon: "text-[#e87b1c]",
    button: "bg-[#e87b1c] hover:bg-[#cc6713]",
    defaultIcon: <AlertTriangle className="h-12 w-12" />,
  },
  info: {
    bg: "bg-[#e6f7fb]",
    icon: "text-[#08aab9]",
    button: "bg-[#08aab9] hover:bg-[#0793a0]",
    defaultIcon: <Info className="h-12 w-12" />,
  },
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsOpen(false);
    if (options?.onClose) options.onClose();
  }, [options]);

  const type = options?.type || "info";
  const styles = typeStyles[type];

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      {isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={hideAlert}
          />

          {/* MODAL */}
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">

            {/* CLOSE */}
            <button
              onClick={hideAlert}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">

              {/* ICON */}
              <div className="flex justify-center mb-6">
                <div
                  className={`h-20 w-20 rounded-[2rem] flex items-center justify-center ${styles.bg} ${styles.icon}`}
                >
                  {options.icon || styles.defaultIcon}
                </div>
              </div>

              {/* IMAGE */}
              {options.image && (
                <div className="relative aspect-video w-full mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={options.image}
                    alt="Alert"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* TEXT */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#2b2e35] mb-2">
                  {options.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {options.message}
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={hideAlert}
                className={`w-full text-white py-3 rounded-full font-semibold transition-all ${styles.button}`}
              >
                {options.confirmText || "Continuar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de AlertProvider");
  }
  return context;
};