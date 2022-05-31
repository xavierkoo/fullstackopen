import { useState } from 'react'

const Header = ({props}) => <h2>{props}</h2>

const Button = ({handleClick, text}) => {
  return (
  <button onClick={handleClick}>
    {text}
  </button>
  )
}

const Anecdote = ({text}) => {
  return (
    <div>
      <p>
        {text}
      </p>
    </div>
  )
}

const Vote = ({anecdotes, allVotes}) => {
  const highestVoteCount = Math.max(...allVotes)
  const winnerIndex = allVotes.indexOf(highestVoteCount)
  const winner = anecdotes[winnerIndex]
  if (highestVoteCount === 0) {
    return (
      <p>No votes yet</p>
    )
  }

  return (
    <div>
      <p>{winner}</p>
      <p>has {highestVoteCount} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [allVotes, setAllVotes] = useState(Array(6).fill(0))
  const anecClick = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    setSelected(index)
  }
  const voteClick = () => {
    const votesArr = [...allVotes]
    votesArr[selected] += 1
    setAllVotes(votesArr)
  }

  return (
    <div>
      <Header props='Anecdote of the Day' />
      <Anecdote text={anecdotes[selected]} />
      <Button handleClick={voteClick} text='Vote'/>
      <Button handleClick={anecClick} text='Next Anecdote'/>
      <Header props='Most Voted' /> 
      <Vote anecdotes={anecdotes} allVotes={allVotes} />
    </div>
  )
}

export default App

