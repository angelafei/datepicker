import React, { useState, useCallback, useMemo, useRef } from 'react';

import { DatePicker } from './DatePicker';

export function DatePickerInput() {
  // const currentDate = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log('currentDate:', currentDate);
  const { year, month, date } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: currentDate.getDate() }),
  [currentDate]);

  const [inputValue, setInputValue] = useState(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
  const [hideDatePicker, setHideDatePicker] = useState(true);
  const inputRef = useRef();

  const onDatePickerChange = newDate => {
    setCurrentDate(newDate);
    setInputValue(`${String(newDate.getFullYear()).padStart(4, '0')}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`);
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
    value.match('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])') !== null;

  const handleChange = useCallback(event => {
    inputValue !== event.target.value && setInputValue(event.target.value);

    if (dateIsValid(event.target.value)) {
      setCurrentDate(new Date(event.target.value));
      setInputValue(event.target.value);
    }
  }, [inputValue]);

  const handleBlur = event => {    
    // find `-` in the string
    const result = event.target.value.match(/-/g);

    // Check validity, revert to previous date if invalid
    if (!result || result.length !== 2 || !dateIsValid(event.target.value)) {
      setInputValue(`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`);
      setHideDatePicker(true);
      return;
    }

    const splited = event.target.value.split('-');
    const isValid = value => value !== '' || !isNaN(value);

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
    
    const updatedISODate = `${String(newYear).padStart(4, '0')}-${String(newMonth).padStart(2, '0')}-${String(newDate).padStart(2, '0')}`;
    const updatedDate = new Date(updatedISODate);

    setCurrentDate(updatedDate);

    // Make sure the date would be converted to valid one (eg. 2020-09-31 -> 2020-10-01) 
    setInputValue(`${String(updatedDate.getFullYear()).padStart(4, '0')}-${String(updatedDate.getMonth() + 1).padStart(2, '0')}-${String(updatedDate.getDate()).padStart(2, '0')}`);
    setHideDatePicker(true);

  }
  
  return (
    <div className="datepicker-wrapper">
      <input
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


