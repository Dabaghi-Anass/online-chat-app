import React, { useEffect, useState } from 'react'
import Logo from '../utils/navUtils/app_logo'

const NotFound = () => {
    const [count, setCount] = useState(10);
    const redirect = () => {
        setInterval(() => {
            setCount(prev => {
                if (count >= 0) {
                    return count - 1
                }
            })
        }, 1000);
    setTimeout(() => {
             if (window.location.pathname === "/not-found") {
            window.location = "/profile"; 
       }
    },count * 1000)
    }
    useEffect(() => {
        redirect();
    })
  return (
      <div className="text-white grid place-content-center h-[80vh]">
          <div className="flex flex-col gap-8 items-center">
              <Logo width="10em" />
              <div className="font-bold text-4xl">
                  404 PAGE NOT FOUND
              </div>
              <div className="font-bold text-2xl">
                  redirecting you to profile in <span className="text-rose-600">{count}</span>
              </div>
          </div>
    </div>
  )
}

export default NotFound