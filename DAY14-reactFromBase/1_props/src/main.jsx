import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function Todo({name, description, index}) {
  return(
    <li> {name} : {description} </li>
  )
}

function LoadTodos(props){
  const todos = props.todos;
  return(
    <ul>
      {todos.map((todo) => (
        <Todo key={todo.name} name={todo.name} description={todo.description}/>
      ))}
    </ul>
  )
}

const todos = [ 
  { name: 'Swimming', description : 'Love to swim'},
  { name: 'Boxing', description : 'Love to do boxing'},
]

createRoot(document.getElementById('root')).render(
  <div>
    <LoadTodos todos={todos} />
  </div>
)
