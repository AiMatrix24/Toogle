import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Calendar as CalIcon,
} from 'lucide-react';

const STATUS_COLORS = {
  confirmed: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800', badge: 'bg-blue-500 text-white' },
  pending: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800', badge: 'bg-yellow-500 text-white' },
  'en-route': { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-800', badge: 'bg-indigo-500 text-white' },
  'arriving-soon': { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800', badge: 'bg-purple-500 text-white' },
  arrived: { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-800', badge: 'bg-teal-500 text-white' },
  'in-progress': { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800', badge: 'bg-orange-500 text-white' },
  completed: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800', badge: 'bg-green-500 text-white' },
  blocked: { bg: 'bg-gray-200', border: 'border-gray-400', text: 'text-gray-600', badge: 'bg-gray-500 text-white' },
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

function formatHour(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display} ${suffix}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateRange(weekStart) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts = { month: 'short', day: 'numeric' };
  const yearOpts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${weekStart.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', yearOpts)}`;
}

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

export default function ProviderCalendar({ schedule = [], onStatusChange }) {
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [blockTooltip, setBlockTooltip] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = useMemo(() => startOfWeek(currentDate), [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const todaysBookings = useMemo(() => {
    return schedule.filter((b) => {
      const bd = new Date(b.date);
      bd.setHours(0, 0, 0, 0);
      return isSameDay(bd, today);
    });
  }, [schedule, today]);

  const nextBooking = useMemo(() => {
    const now = new Date();
    return todaysBookings
      .filter((b) => {
        const [h, m] = b.startTime.split(':').map(Number);
        return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
  }, [todaysBookings]);

  const todaysEarnings = useMemo(() => {
    return todaysBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  }, [todaysBookings]);

  // Month view helpers
  const monthStart = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return d;
  }, [currentDate]);

  const monthGrid = useMemo(() => {
    const first = new Date(monthStart);
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const gridStart = new Date(first);
    gridStart.setDate(gridStart.getDate() - startDay);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(d.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [monthStart]);

  function bookingsForDay(date) {
    return schedule.filter((b) => {
      const bd = new Date(b.date);
      bd.setHours(0, 0, 0, 0);
      return isSameDay(bd, date);
    });
  }

  function navigateWeek(dir) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
    setSelectedBooking(null);
  }

  function navigateMonth(dir) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
    setSelectedBooking(null);
  }

  function countBadgeColor(count) {
    if (count >= 3) return 'bg-blue-700 text-white';
    if (count === 2) return 'bg-blue-500 text-white';
    if (count === 1) return 'bg-blue-300 text-blue-900';
    return '';
  }

  function formatTimeDisplay(t) {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Today's Summary Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <span className="font-medium">
            Today: {todaysBookings.length} booking{todaysBookings.length !== 1 ? 's' : ''}
          </span>
          {nextBooking && (
            <span className="text-blue-100">
              Next: {nextBooking.customer} at {formatTimeDisplay(nextBooking.startTime)}
            </span>
          )}
          <span className="text-blue-100">
            Earnings today: ${todaysEarnings}
          </span>
        </div>
        <div className="relative">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            onMouseEnter={() => setBlockTooltip(true)}
            onMouseLeave={() => setBlockTooltip(false)}
          >
            Block Time
          </button>
          {blockTooltip && (
            <div className="absolute right-0 top-full mt-1 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap z-20">
              Click a time slot to block
            </div>
          )}
        </div>
      </div>

      {/* View Toggle & Navigation */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'week'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'month'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => (viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[200px] text-center">
            {viewMode === 'week'
              ? formatDateRange(weekStart)
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => (viewMode === 'week' ? navigateWeek(1) : navigateMonth(1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <CalIcon className="w-4 h-4" />
          <span className="text-xs">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="overflow-x-auto relative">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200">
              <div className="p-2" />
              {weekDays.map((d, i) => {
                const isToday = isSameDay(d, today);
                return (
                  <div
                    key={i}
                    className={`p-3 text-center border-l border-gray-100 ${
                      isToday ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-xs text-gray-500 uppercase">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-0.5 ${
                        isToday
                          ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto'
                          : 'text-gray-700'
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hour Rows */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-50 min-h-[60px]"
              >
                <div className="p-2 text-xs text-gray-400 text-right pr-4 pt-1 border-r border-gray-100">
                  {formatHour(hour)}
                </div>
                {weekDays.map((day, dayIdx) => {
                  const dayBookings = bookingsForDay(day).filter((b) => {
                    const start = parseTime(b.startTime);
                    const end = parseTime(b.endTime);
                    return start < hour + 1 && end > hour;
                  });

                  return (
                    <div
                      key={dayIdx}
                      className="relative border-l border-gray-50 p-0.5"
                    >
                      {dayBookings.map((booking, bIdx) => {
                        const start = parseTime(booking.startTime);
                        const end = parseTime(booking.endTime);
                        const topOffset = Math.max(0, (start - hour) * 100);
                        const height = Math.min(100, (end - Math.max(start, hour)) * 100);
                        const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.confirmed;

                        return (
                          <button
                            key={bIdx}
                            onClick={() => setSelectedBooking(booking)}
                            className={`absolute left-0.5 right-0.5 ${colors.bg} ${colors.border} border rounded-md px-1.5 py-0.5 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden z-10`}
                            style={{
                              top: `${topOffset}%`,
                              height: `${Math.max(height, 30)}%`,
                            }}
                          >
                            <div className={`text-[10px] font-semibold ${colors.text} truncate`}>
                              {booking.customer?.[0]}. {booking.service}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Booking Detail Popup */}
          {selectedBooking && (
            <div className="absolute top-24 right-6 z-30 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{selectedBooking.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedBooking.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatTimeDisplay(selectedBooking.startTime)} -{' '}
                    {formatTimeDisplay(selectedBooking.endTime)}
                  </span>
                </div>
                {selectedBooking.notes && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    {selectedBooking.notes}
                  </p>
                )}
                <div>
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                      (STATUS_COLORS[selectedBooking.status] || STATUS_COLORS.confirmed).badge
                    }`}
                  >
                    {selectedBooking.status?.charAt(0).toUpperCase() +
                      selectedBooking.status?.slice(1)}
                  </span>
                </div>
                {onStatusChange && selectedBooking.status === 'pending' && (
                  <button onClick={() => { onStatusChange(selectedBooking.id, 'confirmed'); setSelectedBooking(null) }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Confirm Booking
                  </button>
                )}
                {onStatusChange && selectedBooking.status === 'confirmed' && (
                  <button onClick={() => { onStatusChange(selectedBooking.id, 'en-route'); setSelectedBooking(null) }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Mark En Route
                  </button>
                )}
                {onStatusChange && selectedBooking.status === 'en-route' && (
                  <button onClick={() => { onStatusChange(selectedBooking.id, 'arrived'); setSelectedBooking(null) }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Mark Arrived
                  </button>
                )}
                {onStatusChange && selectedBooking.status === 'arrived' && (
                  <button onClick={() => { onStatusChange(selectedBooking.id, 'in-progress'); setSelectedBooking(null) }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Start Job
                  </button>
                )}
                {onStatusChange && selectedBooking.status === 'in-progress' && (
                  <button onClick={() => { onStatusChange(selectedBooking.id, 'completed'); setSelectedBooking(null) }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Mark Complete
                  </button>
                )}
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors">
                  Message Customer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="p-4">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday2 = isSameDay(day, today);
              const count = bookingsForDay(day).length;

              return (
                <div
                  key={idx}
                  className={`min-h-[80px] rounded-lg p-2 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday2 ? 'ring-2 ring-blue-500' : 'border border-gray-100'}`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  {count > 0 && (
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center justify-center text-[10px] font-bold w-5 h-5 rounded-full ${countBadgeColor(count)}`}
                      >
                        {count}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
