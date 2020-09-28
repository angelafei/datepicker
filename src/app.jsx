import React from 'react';
import { DatePicker } from './components/DatePicker';
import { DatePickerInput } from './components/DatePickerInput';

import './styles/main.scss';

export function App() {
  return (
    <div>
      <DatePicker />
      <DatePickerInput />
    </div>
  );
}
