// import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

export function DatePicker(props) {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [mode, setMode] = useState('day');

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

  const currentDate = useMemo(() => { console.log('inside'); return new Date()}, []);
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  console.log('currentMonth:', currentMonth);
  
  useEffect(() => {
    console.log('here!!!');
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
  }, [currentDate]);

  // find day of week for the first day of the month
  const dayOfWeek = useMemo(() => {
    if (month && year) {
      console.log('in dayOfWeek:', month, year);

      const getShiftedMonth = (month) => ((month + 9) % 12) + 1;
      const getDigits = (year, from) => parseInt(year.toString().substr(from, 2), 10);

      console.log('getShiftedMonth:', getShiftedMonth(month));
      console.log('getDigits:', getDigits(year, 0));

      const result = (Math.floor(Math.abs(
        (1 + (2.6 * getShiftedMonth(month) - 0.2) + getDigits(year, 2) 
        + getDigits(year, 2) / 4 + getDigits(year, 0) / 4 - 2 * getDigits(year, 0)) % 7
      )));

      console.log('result:', result);

      return result;
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

      return DaysInMonth.map(obj => {
        const isToday = obj.toDateString() === currentDate.toDateString();
        return <span className={ classNames('date-body', { current: isToday }) } key={obj}>{obj.getDate()}</span>;
      });
    }
  }, [year, month, currentDate, dayOfWeek]);

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

    if (mode === 'month') {
      return Object.keys(monthMapping).map(key => 
        <span className={ classNames('month-grid', { current: currentMonth === parseInt(key) }) } key={key} onClick={() => updateMonth(key)}>{monthMapping[key].slice(0,3)}</span>);
    } else {
      const index = year % 12;
      const result = [];
      for (let i = 1; i <= 12; i++) {
        const outputYear = year - index + i;
        result.push(<span className={ classNames('year-grid', { current: currentYear === outputYear }) }>{outputYear}</span>);
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

  

  return (
    <div className="datepicker">
      <div className="datepicker-head">
        <span className="arrow left" onClick={() => setMonth(month - 1)}></span>
        <div className="wrapper" onClick={switchMode}>
          {head}
        </div>
        <span className="arrow right" onClick={() => setMonth(month + 1)}></span>
      </div>
      <div className="datepicker-body">
        {mode === 'day' ? renderDaysInMonth() : renderGrid()}
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  // isLoading: PropTypes.bool
};
