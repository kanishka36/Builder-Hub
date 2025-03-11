import React from 'react'
import { Trash2 } from "lucide-react";

const DeleteButton = ({onClick}) => {
  return (
    <button className="text-blue-500" onClick={onClick}>
      <Trash2 className="text-red-600 cursor-pointer" size={20} />
    </button>
  )
}

export default DeleteButton