import { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [results, setResults] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    if (newSearch) {
      const regex = new RegExp( newSearch, 'i')
      const searchResults = () => countries.filter(country => country.name.common.match(regex))
      setResults(searchResults)
    }
  } 

  const Display = ({results}) => {
    if (results.length > 10) {
      return (
        "Too many matches, specify another filter"
      )
    } else if (results.length < 10 && results.length > 1) {
      return (
        <ul>
          {results.map((result, i) => 
            <li key={i}>{result.name.common} <button onClick={() => setResults([result])}>show</button></li>)}
        </ul>
      )
    } else if (results.length === 1) {
      return (
        <Country country={results[0]} />
      )
    }
  }

  return (
    <div>
      <Search newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <Display results={results} />
    </div>
  )
}

export default App