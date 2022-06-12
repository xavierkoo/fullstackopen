import React from 'react'

const Add = ({ onSubmit, newName, handleNameChange, newNum, handleNumChange }) => 
    <form onSubmit={onSubmit}>
        <div>
            name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
            number: <input value={newNum} onChange={handleNumChange}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>

export default Add