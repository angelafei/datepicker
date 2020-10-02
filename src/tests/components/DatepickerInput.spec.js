import React from 'react';
import jsdom from 'mocha-jsdom';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';

import { DatePickerInput } from '../../components/DatePickerInput';

describe('DatepickerInput Component', function () {

  // eslint-disable-next-line mocha/no-setup-in-describe
  jsdom({
    url: 'http://localhost'
  });

  it('opens the calendar dropdown when click on the input field', function() {
    const { container } = render(<DatePickerInput />);
    const node = container.querySelector('.datepicker-input');
    expect(container.querySelector('.datepicker').classList.contains('hidden')).to.equals(true);


    ReactTestUtils.Simulate.click(node);
    expect(container.querySelector('.datepicker').classList.contains('hidden')).to.equals(false);
  });

  it('selects year when cursor position is between index 0 - 4', function() {
    const { container } = render(<DatePickerInput />);
    const input = container.querySelector('.datepicker-input');
    input.selectionStart = 4;

    ReactTestUtils.Simulate.click(input);

    expect(input.selectionStart).to.equal(0);
    expect(input.selectionEnd).to.equal(4);
  });

  it('selects month when cursor position is between index 5 - 7', function() {
    const { container } = render(<DatePickerInput />);
    const input = container.querySelector('.datepicker-input');
    input.selectionStart = 6;

    ReactTestUtils.Simulate.click(input);

    expect(input.selectionStart).to.equal(5);
    expect(input.selectionEnd).to.equal(7);
  });

  it('selects date when cursor position is between index 8 - 10', function() {
    const { container } = render(<DatePickerInput />);
    const input = container.querySelector('.datepicker-input');
    input.selectionStart = 8;

    ReactTestUtils.Simulate.click(input);

    expect(input.selectionStart).to.equal(8);
    expect(input.selectionEnd).to.equal(10);
  });

  it('reverts to previous value while new input is invalid', function() {
    const { container } = render(<DatePickerInput />);
    const now = new Date();
    const input = container.querySelector('.datepicker-input');
    input.value = '-a-05';

    ReactTestUtils.Simulate.change(input);
    ReactTestUtils.Simulate.blur(input);

    expect(input.value).to.equal(`${String(now.getFullYear()).padStart(4, '0')}-${String(now.getMonth() + 1)
      .padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  });

  it('moves to the correct date while new input is valid but does not actually exist', function() {
    const { container } = render(<DatePickerInput />);
    const input = container.querySelector('.datepicker-input');
    input.value = '1999-02-31';

    ReactTestUtils.Simulate.change(input);
    ReactTestUtils.Simulate.blur(input);

    expect(input.value).to.equal('1999-03-03');
  });

  it('changes input value when select a date on calendar dropdown', function() {
    const { container, getAllByText } = render(<DatePickerInput />);
    const input = container.querySelector('.datepicker-input');
    const date = new Date();
    date.setHours(-24);

    ReactTestUtils.Simulate.click(input);

    const node = getAllByText((_, element) => {
      return element.classList.contains('date-body') && element.textContent === String(date.getDate());
    })[0];

    ReactTestUtils.Simulate.click(node);

    expect(input.value).to.equal(`${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1)
      .padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  });
});
