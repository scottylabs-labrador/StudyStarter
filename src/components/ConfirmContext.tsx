import React, { createContext, useContext, useState } from "react";

type ConfirmOptions = {
  message: string;
  resolve: (value: boolean) => void;
};

const ConfirmContext = createContext<(msg: string) => Promise<boolean>>(
  async () => false
);

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ message, resolve });
    });
  };

  const handleYes = () => {
    confirmState?.resolve(true);
    setConfirmState(null);
  };

  const handleNo = () => {
    confirmState?.resolve(false);
    setConfirmState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {/* Modal */}
      {confirmState && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-80">
            <p className="text-gray-900 dark:text-gray-100 text-center mb-6">
              {confirmState.message}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleNo}
                className="px-4 py-2 rounded-lg bg-lightSidebar dark:darkSidebar text-black dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleYes}
                className="px-4 py-2 rounded-lg bg-lightButton dark:bg-darkButton text-black dark:text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
