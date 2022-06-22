import React from 'react'

const Notification = ({ message }) => {
    if (message === null) {
      return null
    }

    if (message.includes("Added")) {
      return (
        <div className='success'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='fail'>
          {message}
        </div>
      )
    }
  }

export default Notification