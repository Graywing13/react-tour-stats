import './App.css';
import { LS_KEY, useLocalStorage } from './components/util/useLocalStorage.ts';
import { InputZone } from './components/InputZone.tsx';
import { Tables } from './components/Tables.tsx';
import { Button } from '@mui/material';
import { type ReactNode, useCallback, useState } from 'react';
import { ExportToSheet } from './components/ExportToSheet.tsx';
import { GAME_MODES } from '../SETTINGS.ts';

const APP_VERSION = 0.1;

const STEPS = {
  INPUT: 0,
  DISCORD: 1,
  SHEETS: 2,
  DONE: 3,
};

function App() {
  const [localStorageVersion] = useLocalStorage<number>(LS_KEY.LS_VERSION);
  const [onStep, setOnStep] = useState(STEPS.INPUT);

  // who cares about redux (jk want to do it later)
  const [gamemode, setGamemode] = useState<keyof typeof GAME_MODES>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [challongeData, setChallongeData] = useState<string[][]>([]);
  const createSegment = useCallback(
    (
      stepIdx: number,
      title: string,
      children?: ReactNode,
      nextText?: string,
      onNext?: () => void,
    ) => {
      const segmentClassname =
        'pt-4 pb-4 hover:bg-slate-100 transition-colors relative';
      const headerClassname = 'border-l-4 border-cyan-500 pl-2';
      return (
        <div className={segmentClassname}>
          {onStep < stepIdx && (
            <div
              className={
                'w-full h-full flex absolute z-10 cursor-not-allowed bg-slate-800/60 -top-2 text-white justify-center items-center font-extrabold text-4xl'
              }
            >
              Complete previous step first
            </div>
          )}
          <h2 className={headerClassname}>{title}</h2>
          {children || <></>}
          {onNext && nextText && (
            <Button variant={'contained'} onClick={onNext}>
              {nextText}
            </Button>
          )}
        </div>
      );
    },
    [onStep],
  );

  return (
    <div className={'text-left'}>
      <div className={'text-center'}>
        <h1> 🐜 🫐 🐜 🫐 🐜 🫐 🐜 Ant stats 🐜 🫐 🐜 🫐 🐜 🫐 🐜</h1>
        <p className={'text-gray-400 italic text-sm pb-4'}>
          An ant, a small, industrious insect that lives in a colony. May be
          used to represent ants specifically, as well as various insects or
          other bugs.
        </p>
      </div>
      {createSegment(
        STEPS.INPUT,
        'Step 1. Enter gamemode and jsons',
        <InputZone
          className={'pt-2 pb-2 pl-4 pr-4'}
          files={uploadedFiles}
          setFiles={setUploadedFiles}
          gamemode={gamemode}
          setGamemode={setGamemode}
          challongeData={challongeData}
          setChallongeData={setChallongeData}
          onEdit={() => setOnStep(STEPS.INPUT)}
        />,
        'Make Tables',
        () => {
          setOnStep(STEPS.DISCORD);
          console.log('clicked');
        },
      )}
      {createSegment(
        STEPS.DISCORD,
        ' Step 2. Screenshot tables and send to #export-stats',
        <Tables />,
        'Prep stats for sheet',
        () => {
          console.log('clicked');
        },
      )}
      {createSegment(
        STEPS.SHEETS,
        'Step 3. Export to sheets',
        <ExportToSheet />,
        'ur done but here have a button',
        () => {
          alert('insert fireworks');
        },
      )}
      {createSegment(STEPS.DONE, 'Done!')}
      <div
        className={
          'bg-slate-700 text-gray-200 italic text-sm p-4 text-right w-full'
        }
      >
        <div>App version: {APP_VERSION}</div>
        <div>Data version: {localStorageVersion || 'none'}</div>
      </div>
    </div>
  );
}

export default App;
