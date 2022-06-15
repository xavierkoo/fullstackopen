import React from 'react'

const Search = ({newSearch, handleSearchChange}) => 
    <div>
      Find Countries: <input value={newSearch} onChange={handleSearchChange} />
    </div>

export default Search