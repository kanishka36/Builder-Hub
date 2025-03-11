import React from 'react'

const ActionButton = ({onClick, name}) => {
  return (
    <button className='bg-primary px-2 py-1 rounded-md' onClick={onClick}>{name}</button>
  )
}

export default ActionButton