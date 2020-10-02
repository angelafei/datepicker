## Installation

```shell
$ git clone https://github.com/angelafei/datepicker
$ cd datepicker
$ npm install && npm start (Serve and demonstrate with webpack-dev-server)
```
Open browser and visit http://localhost:8080/ to see the demonstration

## Build for production
```shell
$ npm run build
```
And move dist/ folder to your hosting place

## Unit testing
Implemented with `Mocha`, `Chai`, `Sinon` and `@testing-library/react`; Generated test coverage report with `nyc` 
```shell
$ npm run test
```  

## Guide

### DatePickerInput

Displays the date input field and the calendar view.

### DatePicker

Displays calendar component.

#### Props

|Prop name|Type|Default value|Description|
|----|----|----|----|
|externalSelectedDate|object or string|n/a|Date selected in external input.|
|onSelect|function|n/a|Called when a date is selected.|
|isHidden|boolean|n/a|Whether to display calendar component.|
|showBorder|boolean|n/a|Whether to show border for calendar component.|

## File Structure

├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── app.jsx
│   ├── components
│   │   ├── DatePicker.js
│   │   ├── DatePickerInput.js
│   │   ├── _DatePicker.js
│   │   └── __DatePicker.js
│   ├── fonts
│   │   └── Roboto-Light.ttf
│   ├── hooks
│   │   └── useCalendar.js
│   ├── index.html
│   ├── main.jsx
│   ├── polyfill
│   │   └── polyfill.js
│   ├── styles
│   │   ├── _reset.scss
│   │   ├── _style.scss
│   │   └── main.scss
│   └── tests
│       └── components
│           ├── Datepicker.spec.js
│           └── DatepickerInput.spec.js
└── webpack.config.js
