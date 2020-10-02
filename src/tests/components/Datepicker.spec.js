import React from 'react';
import jsdom from 'mocha-jsdom';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';

import { DatePicker } from '../../components/DatePicker';

describe('Datepicker Component', function () {

  // eslint-disable-next-line mocha/no-setup-in-describe
  jsdom({
    url: 'http://localhost'
  });

  it('displays day mode and select today by default', function() {
    const { container } = render(<DatePicker />);
    const today = new Date();
    const monthMapping = {
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
    };

    expect(container.querySelector('.datepicker-head .month').innerHTML).to.equal(monthMapping[today.getMonth() + 1]);
    expect(container.querySelector('.datepicker-head .year').innerHTML).to.equal(String(today.getFullYear()));
    expect(container.querySelector('.days-wrapper')).to.exist;
    expect(container.querySelector('.date-body.selected').innerHTML).to.equal(String(today.getDate()));
  });

  it('selects the date and trigger callback (if exist) when click', function() {
    const { container, getAllByText, rerender } = render(<DatePicker />);
    const today = new Date();
    const copy = new Date(today);
    copy.setHours(-24);

    const node = getAllByText((_, element) => 
      element.textContent === String(copy.getDate()) && element.className === 'date-body')[0];

    ReactTestUtils.Simulate.click(node);

    expect(container.querySelector('.date-body.selected').innerHTML).to.equal(String(copy.getDate()));
  
    const onSelectSpy = sinon.spy();
    rerender(<DatePicker onSelect={onSelectSpy} />);
    const copy2 = new Date(today);
    copy2.setHours(-48);

    const node2 = getAllByText((_, element) => 
      element.textContent === String(copy2.getDate()) && element.className === 'date-body')[0];

    ReactTestUtils.Simulate.click(node2);

    expect(container.querySelector('.date-body.selected').innerHTML).to.equal(String(copy2.getDate()));
    sinon.assert.calledOnce(onSelectSpy);
  });

  it('switches to month mode / year mode when click on head', function() {
    const { container } = render(<DatePicker />);
    const head = container.querySelector('.datepicker-head .wrapper');
    expect(container.querySelector('.month-grid')).to.not.exist;
    expect(container.querySelector('.year-grid')).to.not.exist;

    ReactTestUtils.Simulate.click(head);

    expect(container.querySelector('.month-grid')).to.exist;
    expect(container.querySelector('.year-grid')).to.not.exist;

    ReactTestUtils.Simulate.click(head);

    expect(container.querySelector('.month-grid')).to.not.exist;
    expect(container.querySelector('.year-grid')).to.exist;
  });

  it('switches back to month / day mode when year / month selected', function() {
    const { container } = render(<DatePicker />);
    const head = container.querySelector('.datepicker-head .wrapper');

    ReactTestUtils.Simulate.click(head);
    ReactTestUtils.Simulate.click(head);

    const node = container.querySelector('.year-grid');
    ReactTestUtils.Simulate.click(node);

    expect(container.querySelector('.month-grid')).to.exist;
    expect(container.querySelector('.year-grid')).to.not.exist;
    expect(container.querySelector('.date-body')).to.not.exist;

    const newNode = container.querySelector('.month-grid');
    ReactTestUtils.Simulate.click(newNode);

    expect(container.querySelector('.month-grid')).to.not.exist;
    expect(container.querySelector('.year-grid')).to.not.exist;
    expect(container.querySelector('.date-body')).to.exist;
  });

  it('prevents default on mouse down', function() {
    const { container } = render(<DatePicker />);
    const node = container.querySelector('.datepicker');

    const preventDefaultStub = sinon.stub();
    ReactTestUtils.Simulate.mouseDown(node, { preventDefault: preventDefaultStub });
  
    sinon.assert.calledOnce(preventDefaultStub);
  });

  describe('switch pages in day mode', function() {
    const monthMapping = {
      'January': 1,
      'February': 2,
      'March': 3,
      'April': 4,
      'May': 5,
      'June': 6,
      'July': 7,
      'August': 8,
      'September': 9,
      'October': 10,
      'November': 11,
      'December': 12
    };

    it('renders previous page', function() {
      const { container, rerender } = render(<DatePicker externalSelectedDate={new Date('2020-09-30')} />);
      
      const monthName = container.querySelector('.datepicker-head .month').innerHTML;
      const month = monthMapping[monthName];
      expect(month).to.equal(9);
  
      const node = container.querySelector('.arrow.left');
      ReactTestUtils.Simulate.click(node);
  
      const newMonthName = container.querySelector('.datepicker-head .month').innerHTML;
      const newMonth = monthMapping[newMonthName];
      // const expected = month - 1 === 0 ? 12 : month - 1;
  
      expect(newMonth).to.equal(8);

      rerender(<DatePicker externalSelectedDate={new Date('2020-01-20')} />);
      ReactTestUtils.Simulate.click(node);
      
      const newMonthName2 = container.querySelector('.datepicker-head .month').innerHTML;
      const newMonth2 = monthMapping[newMonthName2];
      expect(newMonth2).to.equal(12);
    });
  
    it('renders next page', function() {
      const { container, rerender } = render(<DatePicker />);
  
      const monthName = container.querySelector('.datepicker-head .month').innerHTML;
      const month = monthMapping[monthName];
  
      const node = container.querySelector('.arrow.right');
      ReactTestUtils.Simulate.click(node);
  
      const newMonthName = container.querySelector('.datepicker-head .month').innerHTML;
      const newMonth = monthMapping[newMonthName];
      const expected = month + 1 > 12 ? 1 : month + 1;
  
      expect(newMonth).to.equal(expected);

      rerender(<DatePicker externalSelectedDate={new Date('2020-12-20')} />);
      ReactTestUtils.Simulate.click(node);
      
      const newMonthName2 = container.querySelector('.datepicker-head .month').innerHTML;
      const newMonth2 = monthMapping[newMonthName2];
      expect(newMonth2).to.equal(1);
    });
  });

  describe('switch pages in month mode', function() {
    it('renders previous page', function() {
      const { container } = render(<DatePicker />);

      const head = container.querySelector('.datepicker-head .wrapper');
      ReactTestUtils.Simulate.click(head);

      const year = parseInt(container.querySelector('.datepicker-head .year').innerHTML);
  
      const node = container.querySelector('.arrow.left');
      ReactTestUtils.Simulate.click(node);
  
      const newYear = parseInt(container.querySelector('.datepicker-head .year').innerHTML);
  
      expect(newYear).to.equal(year - 1);
    });
  
    it('renders next page', function() {
      const { container } = render(<DatePicker />);

      const head = container.querySelector('.datepicker-head .wrapper');
      ReactTestUtils.Simulate.click(head);

      const year = parseInt(container.querySelector('.datepicker-head .year').innerHTML);
  
      const node = container.querySelector('.arrow.right');
      ReactTestUtils.Simulate.click(node);
  
      const newYear = parseInt(container.querySelector('.datepicker-head .year').innerHTML);
  
      expect(newYear).to.equal(year + 1);
    });
  });

  describe('switch pages in year mode', function() {
    it('renders previous page', function() {
      const { container } = render(<DatePicker />);

      const head = container.querySelector('.datepicker-head .wrapper');
      ReactTestUtils.Simulate.click(head);
      ReactTestUtils.Simulate.click(head);

      const yearRange = container.querySelector('.datepicker-head .year').innerHTML;
  
      const node = container.querySelector('.arrow.left');
      ReactTestUtils.Simulate.click(node);
  
      const newYearRange = container.querySelector('.datepicker-head .year').innerHTML;
  
      const years = yearRange.split('-');
      const newYears = newYearRange.split('-');

      expect(parseInt(newYears[0])).to.equal(parseInt(years[0])-12);
      expect(parseInt(newYears[1])).to.equal(parseInt(years[1])-12);
    });
  
    it('renders next page', function() {
      const { container } = render(<DatePicker />);

      const head = container.querySelector('.datepicker-head .wrapper');
      ReactTestUtils.Simulate.click(head);
      ReactTestUtils.Simulate.click(head);

      const yearRange = container.querySelector('.datepicker-head .year').innerHTML;
  
      const node = container.querySelector('.arrow.right');
      ReactTestUtils.Simulate.click(node);
  
      const newYearRange = container.querySelector('.datepicker-head .year').innerHTML;
  
      const years = yearRange.split('-');
      const newYears = newYearRange.split('-');

      expect(parseInt(newYears[0])).to.equal(parseInt(years[0])+12);
      expect(parseInt(newYears[1])).to.equal(parseInt(years[1])+12);
    });
  });
});
