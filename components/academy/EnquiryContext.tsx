"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";

interface EnquiryContextType {
  isOpen: boolean;
  targetType: string;
  openModal: (type?: string, triggerEl?: HTMLElement | null) => void;
  closeModal: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetType, setTargetType] = useState<string>("assessment");
  const triggerRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback((type = "assessment", triggerEl: HTMLElement | null = null) => {
    setTargetType(type);
    triggerRef.current = triggerEl || (document.activeElement as HTMLElement | null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (triggerRef.current && typeof triggerRef.current.focus === "function") {
      triggerRef.current.focus();
    }
  }, []);

  return (
    <EnquiryContext.Provider value={{ isOpen, targetType, openModal, closeModal, triggerRef }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiryModal must be used within an EnquiryProvider");
  }
  return context;
}
