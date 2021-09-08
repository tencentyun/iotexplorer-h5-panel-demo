// 无感配网demo
export * from './NonInductiveDemo';
import React, { useEffect, createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { NonInductiveDemo } from './NonInductiveDemo'

function App() {
  return <NonInductiveDemo />;
}

ReactDOM.render(<App/>, document.getElementById('app'));