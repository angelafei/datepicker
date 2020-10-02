import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { useCalendar } from '../hooks/useCalendar';

export function DatePicker({ isHidden, externalSelectedDate, onSelect, showBorder }) {
  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear(), [currentDate]);

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [mode, setMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const DaysInMonth = useCalendar({ month, year, currentDate });

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

  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
      setYear(externalSelectedDate.getFullYear());
      setMonth(externalSelectedDate.getMonth() + 1);
    }
  }, [externalSelectedDate]);

  const onDateSelected = useCallback(obj => {
    setSelectedDate(obj);
    onSelect && onSelect(obj);
  }, [onSelect]);

  const renderDaysInMonth = useCallback(() => {
    const getTitle = () => {
      const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      return (<div className="title-wrapper">
        {daysOfWeek.map(title => <span key={title} className="date-title">{title}</span>)}
      </div>);
    };

    return (<div className="days-wrapper">{getTitle()}{DaysInMonth.map(obj => {
      const isCurrentMonth = obj.getMonth() + 1 === month;
      const isToday = obj.toDateString() === currentDate.toDateString();
      const isSelected = obj.toDateString() === selectedDate.toDateString();

      return <div
        className={classNames('date-body',
          { 'non-active': !isCurrentMonth }, { 'current': isToday }, { 'selected': isSelected })}
        key={obj}
        onClick={() => onDateSelected(obj)}>
        {obj.getDate()}
      </div>;
    })}</div>);
  }, [currentDate, month, DaysInMonth, onDateSelected, selectedDate]);

  const switchMode = useCallback(() => {
    if (mode === 'day') {
      setMode('month');
    } else {
      setMode('year');
    }
  }, [mode]);

  const getYears = useCallback(() => {
    const updateYear = (outputYear) => {
      setYear(outputYear);
      setMode('month');
    };

    const index = year % 12;
    const result = [];
    const yearsRange = [];

    for (let i = 1; i <= 12; i++) {
      const outputYear = year - index + i;
      if (i === 1 || i === 12) {
        yearsRange.push(outputYear);
      }
      result.push(<div
        className={classNames('year-grid',
          { current: currentYear === outputYear })}
        key={outputYear}
        onClick={() => updateYear(outputYear)}>
        <span className={classNames({ 'selected': year === outputYear })}>{outputYear}</span>
      </div>);
    }
    return { result, yearsRange: yearsRange.join('-') };
  }, [currentYear, year]);

  const renderGrid = useCallback(() => {
    const updateMonth = (key) => {
      setMonth(parseInt(key));
      setMode('day');
    };

    if (mode === 'month') {
      return Object.keys(monthMapping).map(key =>
        <div
          className={classNames('month-grid',
            { current: currentMonth === parseInt(key) })}
          key={key}
          onClick={() => updateMonth(key)}>
          <span className={classNames({ 'selected': month === parseInt(key) })}>
            {monthMapping[key].slice(0, 3)}
          </span>
        </div>);
    } else {
      return getYears().result;
    }
  }, [mode, month, getYears, monthMapping, currentMonth]);

  const head = useMemo(() => {
    if (mode === 'day') {
      return (
        <div>
          <span className="month">{monthMapping[month]}</span>
          <span className="year">{year}</span>
        </div>);
    } else if (mode === 'month') {
      return <span className="year">{year}</span>;
    } else {
      return <span className="year">{getYears().yearsRange}</span>;
    }
  }, [mode, month, year, getYears, monthMapping]);

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
    <div
      className={classNames('datepicker', { 'hidden': isHidden }, { 'with-border': showBorder })}
      onMouseDown={event => event.preventDefault()}>
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
  externalSelectedDate: PropTypes.instanceOf(Date),
  showBorder: PropTypes.bool
};
