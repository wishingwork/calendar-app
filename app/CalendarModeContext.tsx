import React, { createContext, useContext, useState } from "react";

type CalendarMode = "day" | "week" | "month";

interface CalendarModeContextProps {
  calendarMode: CalendarMode;
  setCalendarMode: (mode: CalendarMode) => void;
}

const CalendarModeContext = createContext<CalendarModeContextProps>({
  calendarMode: "week",
  setCalendarMode: () => {},
});

export function CalendarModeProvider({ children }: { children: React.ReactNode }) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  return (
    <CalendarModeContext.Provider value={{ calendarMode, setCalendarMode }}>
      {children}
    </CalendarModeContext.Provider>
  );
}

export function useCalendarMode() {
  return useContext(CalendarModeContext);
}

export default CalendarModeProvider;