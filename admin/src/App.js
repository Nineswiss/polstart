import DashView from './Views/DashView/DashView';
import { Stack } from "@phosphor-icons/react";
import './App.scss';

function App() {
  return (
    <div className="App">
      <nav>
        <div className='navLink'>
          <Stack size={24} color="#ffffff" weight="bold" />
        </div>
      </nav>
      <DashView/>
    </div>
  );
}

export default App;
