import { useState, useEffect } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import Add from './components/Add'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filterPersons, setFilterPersons] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addObject = (event) => {
    event.preventDefault()
    const  nameObject = {
      name: newName,
      number: newNum
    }

    const updatePerson = persons.filter(person => person.name === newName)[0]
    console.log(updatePerson)
    const updatePersonObject = { ...updatePerson, number: newNum }
    console.log(updatePersonObject)

    if (persons.some(persons => persons.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(updatePersonObject.id, updatePersonObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== updatePersonObject.id ? person : returnedPerson))
          })
          .catch(error => {
            console.log(error)
            setNotification(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }

    } else {
      personService
        .create(nameObject)
        .then(returnName => {
          setPersons(persons.concat(returnName))
          setNotification(`Added ${newName}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
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

  const deletePerson = (id) => {
    const delPerson = persons.filter(person => person.id === id)
    const delPersonName = delPerson[0].name
    const delPersonId = delPerson[0].id
    if (window.confirm(`Delete ${delPersonName}?`)) {
      personService
        .remove(delPersonId)
      setPersons(persons.filter(person => person.id !== delPersonId))
    }
  }

  const Display = ({filterPersons, persons, deletePerson}) => {
    if (filterPersons.length > 0) {
      return (
        filterPersons.map(filterPerson => 
          <Person key={filterPerson.name} person={filterPerson} deletePerson={deletePerson} />
        )
      )
    } else {
        return (
          persons.map(person => 
            <Person key={person.name} person={person} deletePerson={deletePerson}/>
          )
        )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
          <Notification message={notification}/>
      </div>
        <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <div>
        <Add onSubmit={addObject} newName={newName} handleNameChange={handleNameChange} newNum={newNum} handleNumChange={handleNumChange} />
      </div>
      <h2>Numbers</h2>
      <div>
        <Display filterPersons={filterPersons} persons={persons} deletePerson={deletePerson}/>
      </div>
    </div>
    
  )
}

export default App