import React from 'react';
import SnakeGame from './assets/components/Snakegame';


const App: React.FC = () => {
  return (
    <div className="App">
            {/* <h1 className="text-2xl font-bold">Hello, Tailwind CSS!</h1> */}

      <SnakeGame />
    </div>
  );
};

export default App;
