import './App.css';
import { LS_KEY, useLocalStorage } from './components/util/useLocalStorage.ts';
import { InputZone } from './components/InputZone.tsx';
import { Tables } from './components/Tables.tsx';
import { ExportToSheet } from './components/ExportToSheet.tsx';

const APP_VERSION = 0.1;

function App() {
  const [localStorageVersion] = useLocalStorage<number>(LS_KEY.LS_VERSION);

  return (
    <div>
      <h1> 🫐 🫐 🫐 🫐 🫐 🫐 Blueberry stats 🫐 🫐 🫐 🫐 🫐 🫐 </h1>
      <h2>Step 1. Drag all jsons here</h2>
      <InputZone />
      <h2>Step 2. Screenshot tables and send to #export-stats</h2>
      <Tables />
      <h2>Step 3. Export to sheets</h2>
      <ExportToSheet />
      <div>App version: {APP_VERSION}</div>
      <div>Data version: {localStorageVersion || 'none'}</div>
      <h2>Done!</h2>
    </div>
  );
}

export default App;
