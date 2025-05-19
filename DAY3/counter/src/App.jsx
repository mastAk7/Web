import { useState } from 'react' // -> hook
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [counter, setCounter] = useState(15)

  // let counter = 5;
  // to set range 0-20
  const AddValue = () => {
    if(counter >= 20) {
      return;
    }
    counter++;
    setCounter(counter);
  }

  const SubValue = () => {
    if(counter <= 0) {
      return;
    }
    setCounter(counter - 1);
  }

  return (
    <>
    <h1> Counter Project</h1>
    <h2> Counter value : {counter} </h2>

    <button onClick={AddValue}> Increase value</button>
    <br />
    <button onClick={SubValue}> Decrease value</button>
    </>
  )
}

export default App
