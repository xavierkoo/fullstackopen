import { useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import Add from './components/Add'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122'}
  ]) 

  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filterPersons, setFilterPersons] = useState([])

  const addObject = (event) => {
    event.preventDefault()
    const  nameObject = {
      name: newName,
      number: newNum
    }

    if (persons.some(persons => persons.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(nameObject))
    }
    setNewName('')
    setNewNum('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    const regex = new RegExp( newFilter, 'i')
    const filteredPersons = () => persons.filter(person => person.name.match(regex))
    setFilterPersons(filteredPersons)
  }

  const Display = ({filterPersons, persons}) => {
    if (filterPersons.length > 0) {
      return (
        filterPersons.map(filterPerson => 
          <Person key={filterPerson.name} person={filterPerson} />
        )
      )
    } else {
        return (
          persons.map(person => 
            <Person key={person.name} person={person} />
          )
        )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <div>
        <Add onSubmit={addObject} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
      </div>
      <h2>Numbers</h2>
      <div>
        <Display filterPersons={filterPersons} persons={persons} />
      </div>
    </div>
    
  )
}

export default App