import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
  const [weather, setWeather] = useState([])
  const languages = Object.values(country.languages)

  useEffect(() => {
    const params = {
      access_key: process.env.REACT_APP_API_KEY,
      query: country.capital[0]
    }
    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        const apiResponse = response.data;
        setWeather([apiResponse])
        console.log(response.data)
      })
  }, [])
  console.log(country.capital)
  

  if (weather.length > 0) {
    const currentWeather = weather[0].current
    return (
      <div>
        {console.log(Array.from(country.languages))}
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Spoken Languages:</h2>
        <ul>
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt='Country Flag'></img>
        <h2>Weather in {country.capital}</h2>
        <p>temperature: {currentWeather.temperature}° Celcius</p>
        <img src={currentWeather.weather_icons[0]} alt="Weather icon"></img>
        <p>wind: {currentWeather.wind_speed} mph direction {currentWeather.wind_dir}</p>
      </div>
    )
  } else {
    
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Spoken Languages:</h2>
        <ul>
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt='Country Flag'></img>
      </div>
    )
  }
}

export default Country