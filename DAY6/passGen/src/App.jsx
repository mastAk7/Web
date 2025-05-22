import { useState , useCallback , useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false) 
  const [charAllowed, setCharAllowed] = useState(false) 
  const [password, setPassword] = useState("")

  //useRef hook
  const passwordRef = useRef(null)

  const copyPassword = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0,100);
    window.navigator.clipboard.writeText(password);
  }, [password]) 
  
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if(numberAllowed) str += "0123456789"
    if(charAllowed) str += "!@#$%^&*()_+[]{}|;:,.<>?/~`"
    

    for(let i=1; i<=length; i++){
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass)
  }, [length, numberAllowed, charAllowed]) // for optimization of the dependency array
  // useCallback is used to memoize the function so that it doesn't get recreated on every render
  
  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator]) // for running the function when the dependencies change
  // useEffect is used to call the passwordGenerator function whenever the dependencies change

  

  return (
    <>
      <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-400 bg-gray-700'>
        <h1 className='text-white text-center my-3'>Password Generator</h1>
        <div className='flex shadow rounded-lg overflow-hidden mb-4'>
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3 text-black placeholder-gray-400 bg-white"
            placeholder="Password"
            readOnly
            ref = {passwordRef}
          />
          <button className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'
            onClick={copyPassword}
          >copy</button>
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className='cursor-pointer'
              onChange={(e) => { setLength(e.target.value) }}
            />
            <label>Length: {length}</label>
          </div>
          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => {
                setNumberAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="characterInput"
              onChange={() => {
                setCharAllowed((prev) => !prev)
              }}
            />
            <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
