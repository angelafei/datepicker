// import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { DatePicker } from './DatePicker';

export function DatePickerInput(props) {
  const currentDate = useMemo(() => new Date(), []);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [date, setDate] = useState(currentDate.getDate());
  const [hideDatePicker, setHideDatePicker] = useState(true);

  const onDatePickerChange = useCallback(newDate => {
    console.log('newDate:', newDate);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
    setDate(newDate.getDate());

    setHideDatePicker(true);
  }, []);
  
  return (
    <div className="datepicker-wrapper">
      <input value={`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`} onClick={() => setHideDatePicker(false)} />
      <DatePicker isHidden={hideDatePicker} onSelect={onDatePickerChange} />
    </div>
  );
}


