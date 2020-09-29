import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { useCalendar } from '../hooks/useCalendar';

export function DatePicker({ isHidden, externalSelectedDate, onSelect }) {
  console.log('externalSelectedDate:', externalSelectedDate);

  const currentDate = useMemo(() => { console.log('inside'); return new Date()}, []);
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [mode, setMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const DaysInMonth = useCalendar({ month, year, currentDate });

  console.log('[DatePicker] DaysInMonth:', DaysInMonth);

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
  console.log('=== month:', month);

  useEffect(() => externalSelectedDate && setSelectedDate(externalSelectedDate), [externalSelectedDate]);

  const onDateSelected = useCallback(obj => {
    setSelectedDate(obj);
    onSelect && onSelect(obj);
  }, [onSelect]);

  const renderDaysInMonth = useCallback(() => {
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
  }, [currentDate, DaysInMonth, onDateSelected, selectedDate]);

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
        if (month === 1) {
          setYear(year - 1);
          setMonth(12);
        } else {
          setMonth(month - 1);
        }
      } else {
        if (month === 12) {
          setYear(year + 1);
          setMonth(1);
        } else {
          setMonth(month + 1);
        }
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
  onSelect: PropTypes.func,
  externalSelectedDate: PropTypes.instanceOf(Date)
};
