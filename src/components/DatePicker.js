import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

export function DatePicker({ isHidden, onSelect }) {
  const currentDate = useMemo(() => { console.log('inside'); return new Date()}, []);
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [mode, setMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const monthMapping = useMemo(() => ({
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }), []);

  // const dayOfWeekMapping = {
  //   0: 'Sunday',
  //   1: 'Monday',
  //   2: 'Tuesday',
  //   3: 'Wednesday',
  //   4: 'Thursday',
  //   5: 'Friday',
  //   6: 'Saturday'
  // }

  console.log('currentMonth:', currentMonth);
  
  // useEffect(() => {
  //   console.log('here!!!');
  //   setMonth(currentDate.getMonth() + 1);
  //   setYear(currentDate.getFullYear());
  // }, [currentDate]);

  // find day of week for the first day of the month
  const dayOfWeek = useMemo(() => {
    if (month && year) {
      console.log('in dayOfWeek:', month, year);

      const shiftedYear = (month === 1 || month === 2) ? year - 1 : year;

      const getShiftedMonth = (month) => ((month + 9) % 12) + 1;
      const getDigits = (y, from) => parseInt(y.toString().substr(from, 2), 10);

      // console.log('getShiftedMonth:', getShiftedMonth(month));
      // console.log('getDigits:', getDigits(shiftedYear, 0));

      const result = 
        (1 + Math.floor(2.6 * getShiftedMonth(month) - 0.2) + getDigits(shiftedYear, 2) 
        + Math.floor(getDigits(shiftedYear, 2) / 4) + Math.floor(getDigits(shiftedYear, 0) / 4) 
        - 2 * getDigits(shiftedYear, 0)) % 7;

      console.log('result:', result);

      return (result < 0) ? result + 7 : result;

      // console.log('=========', -1%7);

      // return result;
    }
  }, [month, year]);

  console.log('=== dayOfWeek:', dayOfWeek);
  console.log('=== month:', month);

  const renderDaysInMonth = useCallback(() => {
    console.log('year:', year);
    console.log('month:', month);

    if (year && month) {
      const rows = 6;
      const columns = 7;
      const DaysInMonth = [];

      const getLastDayInMonth = (year, month) => {
        const date = new Date(year, month, 0);
        // console.log('new Date(year, month, 0):', date);

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

      console.log('lastDayInThisMonth:', lastDayInThisMonth.getDate());
      console.log('lastDayInPreviousMonth:', lastDayInPreviousMonth.getDate());

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          if (row === 0 && column < dayOfWeek) {
            const copiedDate = new Date(lastDayInPreviousMonth.getTime());
            copiedDate.setDate(copiedDate.getDate() - (dayOfWeek - column) + 1);
            DaysInMonth.push(copiedDate);
          // DaysInMonth.push(lastDayInPreviousMonth.getDate() - (dayOfWeek - column) + 1)
          } else {
            if (dateInThisMonth <= lastDayInThisMonth.getDate()) {
              const copiedDate = new Date(lastDayInPreviousMonth.getTime());
              copiedDate.setHours(dateInThisMonth*24);
              DaysInMonth.push(copiedDate);
              // DaysInMonth.push(dateInThisMonth);
              dateInThisMonth ++;
            } else {
              const copiedDate = new Date(lastDayInThisMonth.getTime());
              copiedDate.setHours(dateInNextMonth*24);
              DaysInMonth.push(copiedDate);
              // DaysInMonth.push(dateInNextMonth);
              dateInNextMonth ++;
            }
          }
        }
      }

      // console.log('DaysInMonth:', DaysInMonth);

      const onDateSelected = obj => {
        setSelectedDate(obj);
        onSelect && onSelect(obj);
      }

      return DaysInMonth.map(obj => {
        const isToday = obj.toDateString() === currentDate.toDateString();
        const isSelected = obj.toDateString() === selectedDate.toDateString();
        return <span 
          className={ classNames('date-body', { current: isToday }, { selected: isSelected }) }
          key={obj}
          onClick={() => onDateSelected(obj)}>
          {obj.getDate()}
        </span>;
      });
    }
  }, [year, month, currentDate, dayOfWeek, onSelect, selectedDate]);

  useEffect(() => renderDaysInMonth, [renderDaysInMonth]);

  const switchMode = useCallback(() => {
    if (mode === 'day') {
      setMode('month');
    } else if (mode === 'month') {
      setMode('year');
    }
  }, [mode]);

  const renderGrid = useCallback(() => {
    const updateMonth = (key) => {
      setMonth(parseInt(key));
      setMode('day');
    };

    const updateYear = (outputYear) => {
      setYear(outputYear);
      setMode('month');
    };

    if (mode === 'month') {
      return Object.keys(monthMapping).map(key => 
        <span className={ classNames('month-grid', { current: currentMonth === parseInt(key) }) } key={key} onClick={() => updateMonth(key)}>{monthMapping[key].slice(0,3)}</span>);
    } else {
      const index = year % 12;
      const result = [];
      for (let i = 1; i <= 12; i++) {
        const outputYear = year - index + i;
        result.push(<span className={ classNames('year-grid', { current: currentYear === outputYear }) } key={outputYear} onClick={() => updateYear(outputYear)}>{outputYear}</span>);
      }
      return result;
    }
  }, [mode, year, monthMapping, currentMonth, currentYear]);

  const head =  useMemo(() => {
    if (mode === 'day') {
      /* <span className="month">{currentDate.toLocaleString('default', { month: 'long' })}</span> */
      return (
        <div>
          <span className="month">{monthMapping[month]}</span>
          <span className="year">{year}</span>
        </div>);
    } else if (mode === 'month') {
      return <span className="year">{year}</span>;
    } else {
      return <span className="year">{year}</span>;
    }
  }, [mode, month, year, monthMapping]);

  const switchPage = useCallback((nav) => {
    if (mode === 'day') {
      if (nav === 'prev') {
        setMonth(month - 1);
      } else {
        setMonth(month + 1);
      }
    } else if (mode === 'month') {
      if (nav === 'prev') {
        setYear(year - 1);
      } else {
        setYear(year + 1);
      }
    } else {
      if (nav === 'prev') {
        setYear(year - 12);
      } else {
        setYear(year + 12);
      }
    }
  }, [mode, month, year]);

  return (
    <div className={ classNames('datepicker', { hidden: isHidden }) }>
      <div className="datepicker-head">
        <span className="arrow left" onClick={() => switchPage('prev')}></span>
        <div className="wrapper" onClick={switchMode}>
          {head}
        </div>
        <span className="arrow right" onClick={() => switchPage('next')}></span>
      </div>
      <div className="datepicker-body">
        {mode === 'day' ? renderDaysInMonth() : renderGrid()}
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  isHidden: PropTypes.bool,
  onSelect: PropTypes.func
};
