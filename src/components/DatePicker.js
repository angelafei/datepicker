// import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';

export function DatePicker(props) {
  // const [year, setYear] = useState(null);
  // const [month, setMonth] = useState(null);

  const dayOfWeekMapping = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  // let year = 2018;
  // let month = 8;

  console.log('year:', year);
  console.log('month:', month);

  const getShiftedMonth = (month) => ((month + 9) % 12) + 1;
  const getDigits = (year, from) => parseInt(year.toString().substr(from,2), 10);
  const lastTwoDigitsFromYear = getDigits(year, 2);
  const firstTwoDigitsFromYear = getDigits(year, 0);

  // find day of week for the first day of the month
  const dayOfWeek = Math.floor(Math.abs((1 + (2.6 * getShiftedMonth(month) - 0.2) + lastTwoDigitsFromYear + lastTwoDigitsFromYear / 4 + firstTwoDigitsFromYear / 4 - 2 * firstTwoDigitsFromYear) % 7));


  console.log('dayOfWeek:', dayOfWeek);

  const getLastDayInMonth = (year, month) => {
    const date = new Date(year, month, 0);
    console.log('new Date(year, month, 0):', date);

    return date;
  };

  console.log('getLastDayInMonth:', getLastDayInMonth(year, month));

  const getLastDayInPrevousMonth = (date) => {
    const copiedDate = new Date(date.getTime());
    copiedDate.setDate(1); // going to 1st of the month
    copiedDate.setHours(-1); // going to last hour before this date even started.
    return copiedDate;
  }

  const renderDaysInMonth = () => {
    const rows = 6;
    const columns = 7;
    const DaysInMonth = [];

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

    console.log('DaysInMonth:', DaysInMonth);

    return DaysInMonth.map(obj => {
      const isToday = obj.toDateString() === currentDate.toDateString();
      // if (obj.toDateString() === currentDate.toDateString()) {
      //   console.log('obj is today:', obj);
      // }
      return <span className={ classNames('date-body', { current: isToday }) } key={obj}>{obj.getDate()}</span>;
    });
  }

  return (
    <div className="datepicker">
      <div className="datepicker-head">
        <span className="arrow left"></span>
        <div className="wrapper">
          <span className="month">{currentDate.toLocaleString('default', { month: 'long' })}</span>
          <span className="year">{year}</span>
        </div>
        <span className="arrow right"></span>
      </div>
      <div className="datepicker-body">
        {renderDaysInMonth()}
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  // isLoading: PropTypes.bool
};
