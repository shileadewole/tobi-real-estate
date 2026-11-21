import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface DateTimeCalendarPickerProps {
  selectedDate: string;
  selectedTime: string;
  onChangeDate: (date: string) => void;
  onChangeTime: (time: string) => void;
  error?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getLocalTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getLocalNowTimeHHMM(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function formatDateISO(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function DateTimeCalendarPicker({
  selectedDate,
  selectedTime,
  onChangeDate,
  onChangeTime,
  error,
}: DateTimeCalendarPickerProps) {
  const todayISO = getLocalTodayISO();
  const [todayYear, todayMonth, todayDay] = todayISO.split('-').map(Number);

  const initialYear = selectedDate ? Number(selectedDate.slice(0, 4)) : todayYear;
  const initialMonth = selectedDate ? Number(selectedDate.slice(5, 7)) - 1 : todayMonth - 1;

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth);

  const isCurrentMonth = viewYear === todayYear && viewMonth === todayMonth - 1;

  const calendarDays = useMemo(() => {
    const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ day: number; iso: string; isPast: boolean } | null> = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = formatDateISO(viewYear, viewMonth, day);
      const isPast = iso < todayISO;
      cells.push({ day, iso, isPast });
    }
    return cells;
  }, [viewYear, viewMonth, todayISO]);

  // Only show weeks that have at least one non-past day so past days/weeks aren't displayed
  const visibleWeeks = useMemo(() => {
    const weeks: Array<Array<{ day: number; iso: string; isPast: boolean } | null>> = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const week = calendarDays.slice(i, i + 7);
      while (week.length < 7) week.push(null);
      const hasCurrentOrFutureDay = week.some((cell) => cell !== null && !cell.isPast);
      if (hasCurrentOrFutureDay) {
        weeks.push(week);
      }
    }
    return weeks;
  }, [calendarDays]);

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const minTimeForSelectedDate =
    selectedDate === todayISO ? getLocalNowTimeHHMM() : undefined;

  return (
    <div className="space-y-4">
      <div className="border border-[#B6AF9D] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#B6AF9D]/40">
          <div className="flex items-center gap-2 text-sm font-medium text-[#151513]">
            <Calendar className="w-4 h-4 text-[#534F46]" aria-hidden="true" />
            <span>
              {MONTHS[viewMonth]} {viewYear}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isCurrentMonth}
              aria-label="Previous month"
              className="p-2 border border-[#B6AF9D]/60 text-[#151513] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FCF0D8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151513]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-2 border border-[#B6AF9D]/60 text-[#151513] hover:bg-[#FCF0D8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151513]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-xs font-medium text-[#534F46] py-1">
              {wd}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {visibleWeeks.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-1">
              {week.map((cell, cIdx) => {
                if (!cell || cell.isPast) {
                  return <div key={`empty-${wIdx}-${cIdx}`} className="h-10" aria-hidden="true" />;
                }
                const isSelected = selectedDate === cell.iso;
                const isToday = cell.iso === todayISO;
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    onClick={() => onChangeDate(cell.iso)}
                    aria-pressed={isSelected}
                    aria-label={`${MONTHS[viewMonth]} ${cell.day}, ${viewYear}${isToday ? ' (Today)' : ''}`}
                    className={`h-10 text-sm tabular-nums transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#151513] ${
                      isSelected
                        ? 'bg-[#151513] text-[#FFFFFF] font-semibold'
                        : isToday
                          ? 'bg-[#FCF0D8] text-[#151513] font-medium border border-[#B6AF9D] hover:bg-[#151513] hover:text-white'
                          : 'text-[#151513] hover:bg-[#FAF7F0] border border-transparent hover:border-[#B6AF9D]/60'
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-[#534F46]">
          Showing current and upcoming dates only (from {todayISO} forward).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="viewing-date-input"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
          >
            Selected Date <span className="text-[#9A4109]">*</span>
          </label>
          <input
            id="viewing-date-input"
            type="date"
            min={todayISO}
            value={selectedDate}
            onChange={(e) => {
              const val = e.target.value;
              if (!val || val >= todayISO) {
                onChangeDate(val);
              }
            }}
            required
            className="w-full h-11 px-3.5 bg-white border border-[#B6AF9D] text-sm text-[#151513] tabular-nums focus:outline-none focus:border-[#151513]"
          />
        </div>

        <div>
          <label
            htmlFor="viewing-time-input"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
          >
            Preferred Time <span className="text-[#9A4109]">*</span>
          </label>
          <div className="relative">
            <Clock
              className="w-4 h-4 text-[#534F46] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="viewing-time-input"
              type="time"
              min={minTimeForSelectedDate}
              value={selectedTime}
              onChange={(e) => onChangeTime(e.target.value)}
              required
              className="w-full h-11 pl-10 pr-3.5 bg-white border border-[#B6AF9D] text-sm text-[#151513] tabular-nums focus:outline-none focus:border-[#151513]"
            />
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-[#9A4109]">
          {error}
        </p>
      )}
    </div>
  );
}
