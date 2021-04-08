import stateAbrv from './stateAbrv';

const axios = require('axios');

const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'https://college-mapper-api.herokuapp.com/';

export async function getCollegeById(id) {
  let data = await axios.get(`${URL}/college`, {
    params: {
      id: id
    }
  });
  data = JSON.parse(data.data.data);
  return {
    name: data['institution name'],
    location: `${data['HD2019.City location of institution']}, ${stateAbrv[data['HD2019.State abbreviation']]}`,
    population: data['DRVEF122019.12-month full-time equivalent enrollment: 2018-19'],
    sat: data['ADM2019.SAT Evidence-Based Reading and Writing 75th percentile score'] + data['ADM2019.SAT Math 75th percentile score'],
    act: data['ADM2019.ACT Composite 75th percentile score']
  } 
}

export async function getCollegesInBox(swLat, swLon, neLat, neLon) {
  const data = await axios.get(`${URL}/colleges_in_box`, {
    params: {
      swLat: swLat,
      swLon: swLon,
      neLat: neLat,
      neLon: neLon
    }
  });
  return data.data.data;
}

/*
Returns { name, location, population }
*/
export async function getShortCollegeById(id) {
  let data = await axios.get(`${URL}/short_college`, {
    params: {
      id: id
    }
  });
  data = data.data.data;
  return {
    name: data['institution name'],
    location: data['city_and_state'],
    population: data['DRVEF122019.12-month full-time equivalent enrollment: 2018-19']
  }
}

if (require.main === module) {
  getCollegesInBox(33.2, -97.6, 42.36, -71.1).then(res => console.log(res));
}
