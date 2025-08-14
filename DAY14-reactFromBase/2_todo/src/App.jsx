import { useState } from 'react'
import './App.css'
import { useRef } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef();


  function addTodo() {
    if (inputRef.current.value) {
      setTodos([...todos, { todo: inputRef.current.value, update: false }])
      inputRef.current.value = ''
    }
  }
  function deleteTodo(index) {
    setTodos(todos => todos.filter((todo, i) => i !== index))
  }
  function updateTodo(index) {
    setEditValue(todos[index].todo);
    setTodos(todos => todos.map((todo, i) => i !== index ? todo : { ...todo, update: !todo.update }))
  }

  function updateTodoValue(index, update) {
    setTodos(todos => todos.map((todo, i) => i !== index ? todo : { todo: update, update: !todo.update }))
  }
  return (
    <>
      <h1> Todo App</h1>
      <div>
        <input ref={inputRef} type="text" placeholder="Todo" style={{ marginRight: '10px', fontSize: '1rem', padding: '10px' }} />
        <button onClick={addTodo}> Add </button>
      </div>
      <br />
      <div>
        {todos.length === 0
          ? <p>No todos yet</p>
          : (
            <ul>
              {todos.map((todo, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <li style={{ textAlign: 'left' }}>
                    {todo.update ?
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => updateTodoValue(index, editValue)}
                        autoFocus
                      />
                      :
                      (

                        todo.todo
                      )}
                  </li>
                  <div>
                    <button onClick={() => deleteTodo(index)} style={{ margin: '5px 0' }}> delete </button>
                    {todo.update ? null : (
                      <button onClick={() => updateTodo(index)} style={{ margin: '5px 0' }}> update </button>
                    ) }
                  </div>
                </div>
              ))}
            </ul>
          )
        }
      </div>
    </>
  )
}

export default App
