import { useState } from 'react'

const Header = props => <h1>{props.name}</h1>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Count = ({ text, value }) => {
  if (text === "positive") {
    return (
      <tr><td>{text}</td><td>{value} %</td></tr>
    )
  }
  
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )

}

const Statistic = ({clicks}) => {
  const total = clicks.good + clicks.neutral + clicks.bad
  const average = (clicks.good * 1 + clicks.bad * -1) / total
  const positive = (clicks.good / total) * 100

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
          <Count text="good" value={clicks.good} />
          <Count  text="neutral" value={clicks.neutral} />
          <Count  text="bad" value={clicks.bad} />
          <Count text="all" value={total} />
          <Count text="average" value={average} />
          <Count text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0
  })

  const handleGoodClick = () => setClicks({...clicks, good: clicks.good + 1})
  const handleNeutralClick = () => setClicks({...clicks, neutral: clicks.neutral + 1})
  const handleBadClick = () => setClicks({...clicks, bad: clicks.bad + 1})

  return (
    <div>
      <Header name="Customer Feedback" />
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Header name="Statistics" />
      <Statistic clicks={clicks} />
    </div>
  )
}

export default App