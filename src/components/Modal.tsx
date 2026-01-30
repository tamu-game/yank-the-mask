"use client";

import { Button } from "@/components/Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const Modal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onClose
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border-2 border-white/80 bg-white/90 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="outline" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
