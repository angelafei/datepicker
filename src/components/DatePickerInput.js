import React, { useState, useCallback, useMemo, useRef } from 'react';

import { DatePicker } from './DatePicker';
import '../polyfill/polyfill';

export function DatePickerInput() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month, date } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: currentDate.getDate()
  }), [currentDate]);

  const [inputValue, setInputValue] =
    useState(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
  const [hideDatePicker, setHideDatePicker] = useState(true);
  const inputRef = useRef();

  const onDatePickerChange = newDate => {
    setCurrentDate(newDate);
    setInputValue(`${String(newDate.getFullYear()).padStart(4, '0')}-${String(newDate.getMonth() + 1)
      .padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`);
    setHideDatePicker(true);
  };

  const handleFocus = event => {
    event.preventDefault();
    setHideDatePicker(false);

    const { target } = event;
    const startPosition = inputRef.current.selectionStart;

    target.focus();

    if (startPosition <= 4) {
      target.setSelectionRange(0, 4);
    } else if (startPosition <= 7) {
      target.setSelectionRange(5, 7);
    } else {
      target.setSelectionRange(8, 10);
    }
  };

  const dateIsValid = (value) =>
    value.match('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$') !== null;

  const handleChange = useCallback(event => {
    inputValue !== event.target.value && setInputValue(event.target.value);

    if (dateIsValid(event.target.value)) {
      const splited = event.target.value.split('-');        
      setCurrentDate(new Date(splited[0], splited[1]-1, splited[2]));
    }
  }, [inputValue]);

  const handleBlur = event => {
    // find `-` in the string
    const result = event.target.value.match(/-/g);

    // Check validity, revert to previous date if invalid
    if (!result || result.length !== 2 || !dateIsValid(event.target.value)) {
      setInputValue(`${String(year).padStart(4, '0')}-${String(month)
        .padStart(2, '0')}-${String(date).padStart(2, '0')}`);
      setHideDatePicker(true);
      return;
    }

    const splited = event.target.value.split('-');

    const newYear = splited[0];
    const newMonth = splited[1];
    const newDate = splited[2];

    const updatedDate = new Date(newYear, newMonth-1, newDate);


    setCurrentDate(updatedDate);

    // Make sure the date would be converted to valid one (eg. 2020-09-31 -> 2020-10-01) 
    setInputValue(`${String(updatedDate.getFullYear()).padStart(4, '0')}-${String(updatedDate.getMonth() + 1)
      .padStart(2, '0')}-${String(updatedDate.getDate()).padStart(2, '0')}`);
    setHideDatePicker(true);

  }

  return (
    <div className="datepicker-wrapper">
      <input
        className="datepicker-input"
        ref={inputRef}
        value={inputValue}
        onClick={event => handleFocus(event)}
        onChange={event => handleChange(event)}
        onBlur={event => handleBlur(event)}
      />
      <DatePicker
        isHidden={hideDatePicker}
        onSelect={onDatePickerChange}
        externalSelectedDate={currentDate}
        showBorder={true}
      />
    </div>
  );
}


