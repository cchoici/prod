import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <img src="/logo.svg" className="logo" alt="logo" />
      </div>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
