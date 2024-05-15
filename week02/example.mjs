//'use strict'; // non serve con mjs

// CommonJS
//const dayjs = require('dayjs');

import dayjs from 'dayjs';

let oggi = dayjs(); // oggi
console.log(oggi.format('YYYY-MM-DD'));