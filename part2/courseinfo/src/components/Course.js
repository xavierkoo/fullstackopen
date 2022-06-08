import React from 'react'

const Course = ({courses}) =>
  <div>
    {courses.map(course => 
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )}
  </div>

const Header = ({course}) => {
  return (
    <h1>
      {course}
    </h1>
  
  )
}

const Content = ({parts}) => 
    <div>
      {parts.map(part => 
      <Part key={part.id} part={part.name} exercises={part.exercises}/> 
      )}
    </div>

const Part = ({part, exercises}) =>
  <p>
    {part} {exercises}
  </p>

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>
      <b>Total of {total} exercises</b>
    </p>
  )
}

export default Course