import { useState, useMemo, useEffect } from 'react';


export const useCalendar = ({ month, year, currentDate }) => {
  const [days, setDays] = useState([]);

  // find day of week for the first day of the month
  const dayOfWeek = useMemo(() => {
    console.log('[useCalendar] in dayOfWeek:', month, year);

    const shiftedYear = (month === 1 || month === 2) ? year - 1 : year;

    const getShiftedMonth = (month) => ((month + 9) % 12) + 1;
    const getDigits = (y, from) => parseInt(y.toString().substr(from, 2), 10);


    const result = 
        (1 + Math.floor(2.6 * getShiftedMonth(month) - 0.2) + getDigits(shiftedYear, 2) 
        + Math.floor(getDigits(shiftedYear, 2) / 4) + Math.floor(getDigits(shiftedYear, 0) / 4) 
        - 2 * getDigits(shiftedYear, 0)) % 7;

    return (result < 0) ? result + 7 : result;

  }, [month, year]);

  useEffect(() => {
    const rows = 6;
    const columns = 7;
    const DaysInMonth = [];

    const getLastDayInMonth = (year, month) => {
      const date = new Date(year, month, 0);
      return date;
    };
  
    const getLastDayInPrevousMonth = (date) => {
      const copiedDate = new Date(date.getTime());
      copiedDate.setDate(1); // going to 1st of the month
      copiedDate.setHours(-1); // going to last hour before this date even started.
      return copiedDate;
    };

    const lastDayInThisMonth = getLastDayInMonth(year, month);
    const lastDayInPreviousMonth = getLastDayInPrevousMonth(lastDayInThisMonth);
    let dateInThisMonth = 1;
    let dateInNextMonth = 1;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (row === 0 && column < dayOfWeek) {
          const copiedDate = new Date(lastDayInPreviousMonth.getTime());
          copiedDate.setDate(copiedDate.getDate() - (dayOfWeek - column) + 1);
          DaysInMonth.push(copiedDate);
        } else {
          if (dateInThisMonth <= lastDayInThisMonth.getDate()) {
            const copiedDate = new Date(lastDayInPreviousMonth.getTime());
            copiedDate.setHours(dateInThisMonth*24);
            DaysInMonth.push(copiedDate);
            dateInThisMonth ++;
          } else {
            const copiedDate = new Date(lastDayInThisMonth.getTime());
            copiedDate.setHours(dateInNextMonth*24);
            DaysInMonth.push(copiedDate);
            dateInNextMonth ++;
          }
        }
      }
    }

    setDays(DaysInMonth);
  }, [year, month, currentDate, dayOfWeek]);

  return days;
}