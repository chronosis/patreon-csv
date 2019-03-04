const __ = require('lodash');
const parse = require('csv-parse');
const fs = require('fs');
const filename = '/mnt/d/Users/Chrono/Downloads/Telegram\ Desktop/PatronReport_2019-03-01.csv';
const parserOptions = {
  delimiter: ',',
  columns: true
};

const fileData = fs.readFileSync(filename);
const structuredData = {}
const levels = [];
const levelAliases = ['Champion', 'Rookie', 'In-training', 'In-training'];
let preSortedData = {};
let sortedData = {};

const lastNameExceptions = [
  'Raccoon',
  'Racoon',
  'Fox',
  'Husky',
  'Dog',
  'Folf',
  'Wolf',
  'Echidna'
];

function destructureRecord(record) {
  let outputName = '';
  if (record.FirstName === '' && record.LastName === '' && record.Twitter === '') {
    outputName = '= Unnamed Patron =';
  } else if (record.FirstName !== '' && record.LastName !== '' && lastNameExceptions.includes(record.LastName)) {
    outputName = `${record.FirstName} ${record.LastName}`;
  } else if (record.FirstName !== '' && record.LastName !== '' && record.Twitter !== '') {
    outputName = record.Twitter;
  } else if (record.FirstName.length < 10 && !(record.FirstName.match(/[a-z]/g)) && record.Twitter !== '') {
    outputName = record.Twitter;
  } else if (record.FirstName !== '' && record.LastName === '') {
    outputName = record.FirstName;
  } else if (record.FirstName !== '' && record.LastName !== '' && record.Twitter === '') {
    outputName = `${record.FirstName} ${record.LastName.substr(0, 1)}.`;
  } else {
    outputName = `${record.FirstName} ${record.LastName}`;
  }

  return {
    first: record.FirstName,
    last: record.LastName,
    twitter: record.Twitter,
    truename: outputName
  };
}

function isLevel(record) {
  test = (
    record.Email === '' &&
    record.Pledge === '' &&
    record.Lifetime === '' &&
    record.Status === '' &&
    record.Twitter === '' &&
    record.Street === '' &&
    record.City === '' &&
    record.State === '' &&
    record.Zip === '' &&
    record.Country === '' &&
    record.Start === '' &&
    record.MaxAmount === '' &&
    record.Complete === ''
  );
  return test;
}

function recordsSort(val) {
  let v = '';
  if (val.hasOwnProperty('truename')) {
    v = val.truename.toLowerCase();
  }
  return v;
}

parse(fileData, parserOptions, (err, output) => {
  let currLevel = '';
  output.forEach((record) => {
    if (isLevel(record)) {
      currLevel = record.FirstName;
      levels.push(currLevel);
      structuredData[currLevel] = [];
    } else {
      let rec = destructureRecord(record);
      structuredData[currLevel].push(rec);
    }
  });

  let itr = 0;
  __.forEach(structuredData, (value, key) => {
    let newLevel = levelAliases[itr];
    if (!preSortedData.hasOwnProperty(newLevel)) {
      preSortedData[newLevel] = value;
    } else {
      preSortedData[newLevel].concat(value);
    }
    itr++;
  });

  __.forEach(preSortedData, (value, key) => {
    sortedData[key] = __.sortBy(value, recordsSort);
  });

  // console.log(levels);
  // console.log(structuredData);
  // console.log(preSortedData);
  console.log(sortedData);
});
