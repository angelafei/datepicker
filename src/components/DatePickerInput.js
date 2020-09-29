// import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';

import { DatePicker } from './DatePicker';

export function DatePickerInput(props) {
  // const currentDate = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log('currentDate:', currentDate);
  const { year, month, date } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: currentDate.getDate() }),
  [currentDate]);

  console.log('[root] year:', year);
  console.log('[root] month:', month);
  console.log('[root] date:', date);

  // const [year, setYear] = useState(currentDate.getFullYear());
  // const [month, setMonth] = useState(currentDate.getMonth() + 1);
  // const [date, setDate] = useState(currentDate.getDate());
  const [inputValue, setInputValue] = useState(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
  const [hideDatePicker, setHideDatePicker] = useState(true);
  const inputRef = useRef();

  const onDatePickerChange = useCallback(newDate => {
    console.log('newDate:', newDate);
    // setYear(newDate.getFullYear());
    // setMonth(newDate.getMonth() + 1);
    // setDate(newDate.getDate());
    setCurrentDate(newDate);
    setHideDatePicker(true);
  }, []);

  const handleFocus = useCallback(event => {
    event.preventDefault();
    setHideDatePicker(false);

    const { target } = event;
    const startPosition = inputRef.current.selectionStart;
    // var endPosition = inputRef.selectionEnd;
    console.log('startPosition:', startPosition);
    // const extensionStarts = target.value.lastIndexOf('-');

    target.focus();

    if (startPosition <= 4) {
      target.setSelectionRange(0, 4);
    } else if (startPosition <= 7) {
      target.setSelectionRange(5, 7);
    } else {
      target.setSelectionRange(8, 10);
    }
    
  }, []);

  const handleChange = useCallback(event => {
    console.log('event.target.value:', event.target.value);
    inputValue !== event.target.value && setInputValue(event.target.value);
  }, [inputValue]);

  const handleBlur = event => {
    console.log('event.target.value:', event.target.value);
    
    // find `-` in the string
    const result = event.target.value.match(/-/g);

    console.log('result:', result);

    console.log('year:', year);
    console.log('montht:', month);
    console.log('date:', date);

    // check validity
    if (!result || result.length !== 2 || event.target.value.match('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])')==null) {
      setInputValue(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
      return;
    }


    console.log('event.target.value.match(/-/g);', event.target.value.match(/-/g));

    // eslint-disable-next-line no-useless-escape
    // console.log('event.target.value.match("^[a-zA-Z ]*$")!=null', event.target.value.match('^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$')!=null);
    console.log('event.target.value.match("^[a-zA-Z ]*$")!=null', event.target.value.match('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])')!=null);

    const splited = event.target.value.split('-');
    console.log('splited:', splited);
    const isValid = value => value !== '' || !isNaN(value);
    // const year = currentDate.getFullYear();
    // const month = currentDate.getMonth() + 1;
    // const date = currentDate.getDate();

    let newYear = 0;
    let newMonth = 1;
    let newDate = 1;

    if (year !== splited[0] && isValid(splited[0])) {
      newYear = splited[0];
    }

    if (month !== splited[1] && isValid(splited[1])) {
      newMonth = splited[1];
    }

    if (date !== splited[2] && isValid(splited[2])) {
      newDate = splited[2];
    }

    console.log('newYear:', newYear);
    console.log('newMonth:', newMonth);
    console.log('newDate:', newDate);

    
    const updateDate = `${String(newYear).padStart(4, '0')}-${String(newMonth).padStart(2, '0')}-${String(newDate).padStart(2, '0')}`;
    console.log('===', updateDate);

    console.log('updateDate:', updateDate);

    setCurrentDate(new Date(updateDate));
    setInputValue(updateDate);

  }
  
  return (
    <div className="datepicker-wrapper">
      <input
        ref={inputRef}
        value={inputValue}
        // onClick={() => setHideDatePicker(false)}
        onClick={event => handleFocus(event)}
        onChange={event => handleChange(event)}
        onBlur={event => handleBlur(event)}
      />
      <DatePicker isHidden={hideDatePicker} onSelect={onDatePickerChange} externalSelectedDate={currentDate} />
    </div>
  );
}


