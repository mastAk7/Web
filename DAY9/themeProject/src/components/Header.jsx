
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Header() {
  const location = useLocation();
  const [color, setColor] = useState('gray')

  // Map routes to colors
  const routeColorMap = {
    '/': 'gray',
    '/blue': 'blue',
    '/red': 'red',
    '/yellow': 'yellow',
    '/green': 'green'
  };

  // Update color based on current route
  useEffect(() => {
    const currentColor = routeColorMap[location.pathname] || 'gray';
    setColor(currentColor);
  }, [location.pathname]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
  }

  return (
    <>
      <div className='w-full duration-200' style={{ backgroundColor: color }}>

        <div>Header</div>
        <div>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => ` ${isActive?    "text-orange-700" : "text-gray-700" }` }
                onClick={() => handleColorChange('gray')}
              > Home </NavLink>
            </li>
            <li>
              <NavLink
                to="/blue"
                className={({ isActive }) => ` ${isActive?    "text-orange-700" : "text-gray-700" }` }
                onClick={() => handleColorChange('blue')}
              > Blue </NavLink>
            </li>
            <li>
              <NavLink
                to="/red"
                className={({ isActive }) => ` ${isActive?    "text-orange-700" : "text-gray-700" }` }
                onClick={() => handleColorChange('red')}
              > Red </NavLink>
            </li>
            <li>
              <NavLink
                to="/yellow"
                className={({ isActive }) => ` ${isActive?    "text-orange-700" : "text-gray-700" }` }
                onClick={() => handleColorChange('yellow')}
              > Yellow </NavLink>
            </li>
            <li>
              <NavLink
                to="/green"
                className={({ isActive }) => ` ${isActive?    "text-orange-700" : "text-gray-700" }` }
                onClick={() => handleColorChange('green')}
              > Green </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header