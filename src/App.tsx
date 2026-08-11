import './App.css';
import { LS_KEY, useLocalStorage } from './components/util/useLocalStorage.ts';
import { InputZone } from './components/InputZone.tsx';
import { Tables } from './components/tables/Tables.tsx';
import { useState } from 'react';
import { ExportToSheet } from './components/ExportToSheet.tsx';
import { GAME_MODES } from '../SETTINGS.ts';
import { Segment } from './components/common/Segment.tsx';
import { Setup } from './components/Setup.tsx';
import type { DerivedPlayerInfoType } from './components/common/types.ts';

const APP_VERSION = 0.1;

const STEPS = {
  INPUT: 0,
  DISCORD: 1,
  SHEETS: 2,
  DONE: 3,
};

function App() {
  const [localStorageVersion] = useLocalStorage<number>(LS_KEY.LS_VERSION, 0);
  const [onStep, setOnStep] = useState(STEPS.INPUT);

  // who cares about redux (jk want to do it later)
  const [gamemode, setGamemode] =
    useState<keyof typeof GAME_MODES>('WATCHED_0_40');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [challongeData, setChallongeData] = useState<string[][]>([['']]);
  const [derivedPlayerInfos, setDerivedPlayerInfos] = useState<{
    [botName: string]: DerivedPlayerInfoType;
  }>({});

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
      <Segment
        onStep={onStep}
        segmentIdx={STEPS.INPUT}
        title={'One time setup'}
      >
        <Setup />
      </Segment>
      <Segment
        onStep={onStep}
        segmentIdx={STEPS.INPUT}
        title={'Step 1. Enter gamemode and jsons'}
        onNext={() => {
          setOnStep(STEPS.DISCORD);
        }}
        nextText={'1d) Make Tables'}
      >
        <InputZone
          className={'pt-2 pb-2'}
          files={uploadedFiles}
          setFiles={setUploadedFiles}
          gamemode={gamemode}
          setGamemode={setGamemode}
          challongeData={challongeData}
          setChallongeData={setChallongeData}
          onEdit={() => setOnStep(STEPS.INPUT)}
        />
      </Segment>
      <Segment
        onStep={onStep}
        segmentIdx={STEPS.DISCORD}
        title={'Step 2. Screenshot tables and send to #export-stats'}
        onNext={() => {
          setOnStep(STEPS.SHEETS);
        }}
        nextText={'Prep stats for sheet'}
      >
        <Tables
          files={uploadedFiles}
          shouldProcess={onStep === STEPS.DISCORD}
          challongeData={challongeData}
          derivedPlayerInfos={derivedPlayerInfos}
          setDerivedPlayerInfos={setDerivedPlayerInfos}
        />
      </Segment>
      <Segment
        onStep={onStep}
        segmentIdx={STEPS.SHEETS}
        title={'Step 3. Export to sheets'}
        onNext={() => {
          setOnStep(STEPS.DONE);
          alert('insert fireworks');
        }}
        nextText={'ur done but here have a button'}
      >
        <ExportToSheet />
      </Segment>
      <Segment onStep={onStep} segmentIdx={STEPS.DONE} title={'Done!'} />
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
