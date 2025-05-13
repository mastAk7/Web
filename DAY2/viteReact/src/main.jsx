import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';

function Temp(){ //only works if capital
  return (
    <a href="https://www.google.com" target='_blank'> Click me to visit google</a>
  )
}

const tempObject1 ={ // doesnt work no matter what
  type : 'a',
  props: {
    href: 'https://www.google.com',
    target: '_blank'
  },
  children: 'Click me to visit google'
}

const tempObject2 = ( //works always
  <a href="https://www.google.com" target='_blank'> Click me to visit google</a>
)

const username = " Aryan Kansal"

const tempObject3 = React.createElement( // react always
  'a',
  {
    href: 'https://www.google.com',
    target: '_blank'
  },
  'Click me to visit google',
  username
)


createRoot(document.getElementById('root')).render(
  <App />
  // <Temp />
  // tempObject1
  // tempObject2
  // tempObject3
)
 