import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  children: React.ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children }) => {
  const { setIsOpen } = React.useContext(DialogContext);

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setIsOpen(true)
    });
  }

  return (
    <button onClick={() => setIsOpen(true)}>
      {children}
    </button>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
  const { isOpen, setIsOpen } = React.useContext(DialogContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className={`relative bg-white rounded-lg shadow-lg p-6 mx-4 ${className}`}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
};