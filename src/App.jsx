import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRouter />
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  )
}


export default App
