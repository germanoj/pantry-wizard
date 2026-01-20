import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as Haptics from "expo-haptics";

type Ctx = {
  notInterestedIds: Set<string>;
  isNotInterested: (id: string) => boolean;
  toggleNotInterested: (id: string) => void;
  clearNotInterested: () => void;
};

const NotInterestedContext = createContext<Ctx | null>(null);

export function NotInterestedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const isNotInterested = useCallback((id: string) => ids.has(id), [ids]);

  const toggleNotInterested = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      const willBeNotInterested = !next.has(id);

      if (willBeNotInterested) next.add(id);
      else next.delete(id);

      // Haptics: stronger when marking "not interested", lighter when undoing
      if (willBeNotInterested) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        ).catch(() => {});
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      return next;
    });
  }, []);

  const clearNotInterested = useCallback(() => {
    setIds(new Set());
  }, []);

  const value = useMemo(
    () => ({
      notInterestedIds: ids,
      isNotInterested,
      toggleNotInterested,
      clearNotInterested,
    }),
    [ids, isNotInterested, toggleNotInterested, clearNotInterested]
  );

  return (
    <NotInterestedContext.Provider value={value}>
      {children}
    </NotInterestedContext.Provider>
  );
}

export function useNotInterested() {
  const ctx = useContext(NotInterestedContext);
  if (!ctx)
    throw new Error(
      "useNotInterested must be used within NotInterestedProvider"
    );
  return ctx;
}
