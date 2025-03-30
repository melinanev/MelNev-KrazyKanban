import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

import InactivityTimer from './components/InactivityTimer';


function App() {

  return (
    <div className='container'>
      <InactivityTimer timeoutMinutes={0.5} countdownSeconds={30} />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}



export default App
