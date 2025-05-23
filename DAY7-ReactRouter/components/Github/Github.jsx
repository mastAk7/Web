import React from 'react'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

function Github() {
    const data = useLoaderData()
    // const [data, setData] = React.useState([])
    // useEffect(() => {
    //     fetch('https://api.github.com/users/mastAk7') 
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data)
    //         setData(data)
    //     })
    // } ,[])      
  return (
    <div className='text-center m-4 bg-gray-600 text-white text-2xl p-4 rounded-lg'>  
        Github followers: {data.followers}  
        <img src={data.avatar_url} alt="GitHub Picture" width={300} />
    </div>
  )
}

export default Github

export const githubLoader = async () => {
    const response = await fetch('https://api.github.com/users/mastAk7')
    return response.json()
}