import React from 'react';
import { DatePicker } from './components/DatePicker';
import { DatePickerInput } from './components/DatePickerInput';

import './styles/main.scss';

export function App() {
  return (
    <div>
      <div className="task-container">
        <h2>I. DatePicker Input</h2>
        <DatePickerInput />
      </div>
      <div className="task-container">
        <h2>II. DatePicker (Calendar Component): Responsive</h2>
        <DatePicker />
      </div>
    </div>
  );
}
