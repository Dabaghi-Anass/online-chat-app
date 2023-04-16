import React from 'react'
import { Link } from 'react-router-dom'

const User = ({data}) => {
  return (    
<div className={`w-full max-w-sm p-3 flex items-center justify-between rounded overflow-hidden flex-shrink ${data.isAdmin ? "admin" : "main"}` }>
      <div className="flex items-center gap-3">
        <div className={`flex justify-end p-3 rounded bg-white bg-opacity-20 text-3xl ${data.gender === "male" ? "cyan" : "rose"}`}>
        <ion-icon name={data.gender === "male" ? "man" : "woman"}></ion-icon>
    </div>
        <div>
        <h5 className=" text-xl font-medium text-white">{data.fullName} {data.isAdmin && <span className='text-sm bg-green-500 px-2 rounded'>Admin</span>}</h5>
        <span className="text-sm text-gray-300 truncate">{data.email}</span>
    </div>
      </div>
      <Link to={`/profile/${data._id}`} className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center rounded  hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-gray-200 text-white ${data.isAdmin ? "bg-[#43bc96]" : "bg-[#4f2360]"}`}>View</Link>
</div>
  )
}

export default User;