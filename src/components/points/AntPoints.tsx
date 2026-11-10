import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

const labelClassName = ' pt-4 font-2xl font-bold';
const defaultButtonColour = 'bg-blue-400';

// @ts-ignore
enum VALUES {
  TOUR_PLAYER = 'Tour player',
  COUNTED = 'Counted',
  REPORTED = 'Reported',
  BUY_GP = 'Buy grand prix round',
  BUY_TOUR = 'Buy tour',
}

export function AntPoints() {
  const [playersStr, setPlayersStr] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [counters, setCounters] = useState<string[]>([]);
  const [reporters, setReporters] = useState<string[]>([]);
  const [notesStr, setNotesStr] = useState('');
  const [resultingString, setResultingString] = useState('');
  const [copyColour, setCopyColour] = useState(defaultButtonColour);

  useEffect(() => {
    let buttonColourTimeout: number;
    if (copyColour !== defaultButtonColour) {
      buttonColourTimeout = setTimeout(
        () => setCopyColour(defaultButtonColour),
        500,
      );
    }
    return () => clearTimeout(buttonColourTimeout);
  }, [copyColour]);

  const addOrRemovePlayer = useCallback(
    (
      name: string,
      current: string[],
      setter: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
      if (current.includes(name)) {
        setter(current.filter((n) => n !== name));
      } else {
        setter([...current, name]);
      }
    },
    [],
  );

  useEffect(() => {
    try {
      const namesAndRatings = playersStr
        .replaceAll(',', '')
        .split('\n')
        .map((team) => team.split('|')[0])
        .join('');
      const playerNamesOnly = namesAndRatings
        .replace(/ *\([^)]*\) */g, ' ')
        .split(' ')
        .map((name) => name.trim())
        .filter((name) => !!name);
      setPlayers(playerNamesOnly);
      setCounters(counters.filter((n) => playerNamesOnly.includes(n)));
      setReporters(reporters.filter((n) => playerNamesOnly.includes(n)));
    } catch (e) {
      console.log(e);
      alert('error occurred: ' + e);
    }
  }, [playersStr]);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    let dataPerRow = [
      ...players.map((name) => `"${VALUES.TOUR_PLAYER}", "${name}"`),
      ...counters.map((name) => `"${VALUES.COUNTED}", "${name}"`),
      ...reporters.map((name) => `"${VALUES.REPORTED}", "${name}"`),
    ];
    dataPerRow = dataPerRow.map(
      (row, idx) => `"${idx === 0 ? notesStr : ''}", "${timestamp}", ${row}`,
    );
    setResultingString(`={${dataPerRow.join('; ')}}`);
  }, [players, counters, reporters, notesStr]);

  console.log(resultingString);

  return (
    <div className={'flex flex-col'}>
      <label className={labelClassName} htmlFor={'paste-players'}>
        1. Paste players
      </label>
      <textarea
        id={'paste-players'}
        placeholder={EXAMPLE_PLAYERS}
        className={'bg-slate-300 placeholder-slate-400 text-slate-800 italic'}
        rows={8}
        onChange={(e) => setPlayersStr(e.target.value)}
        value={playersStr}
      />
      <br />
      <label className={labelClassName}>Counters</label>
      {players.length ? '' : '< paste players first >'}
      <div className={'grid grid-cols-4 px-16'}>
        {players.map((name) => (
          <button
            key={`counter-${name}`}
            className={`hover:bg-green-200 p-4 cursor-pointer text-black ${counters.includes(name) ? 'bg-green-300' : 'bg-slate-300'}`}
            onClick={() => addOrRemovePlayer(name, counters, setCounters)}
          >
            {name} 🐜
          </button>
        ))}
      </div>
      <label className={labelClassName}>Reporters</label>
      {players.length ? '' : '< paste players first >'}
      <div className={'grid grid-cols-4 px-16'}>
        {players.map((name) => (
          <button
            key={`reporter-${name}`}
            className={`hover:bg-orange-200 p-4 cursor-pointer text-black ${reporters.includes(name) ? 'bg-orange-300' : 'bg-slate-300'}`}
            onClick={() => addOrRemovePlayer(name, reporters, setReporters)}
          >
            {name} 👯
          </button>
        ))}
      </div>
      <label className={labelClassName} htmlFor={'notes'}>
        Notes
      </label>
      <textarea
        id={'notes'}
        placeholder={'your name, other info'}
        className={'bg-slate-300 placeholder-slate-400 text-slate-800 italic'}
        rows={4}
        onChange={(e) => setNotesStr(e.target.value)}
        value={notesStr}
      />
      <label className={labelClassName}>2. Text to copy</label>
      <button
        className={`cursor-pointer rounded-md ${copyColour} transition-colors w-72 p-8`}
        onClick={(e) => {
          try {
            e.preventDefault();
            navigator.clipboard.writeText(resultingString);
            setCopyColour('bg-green-400');
          } catch (e) {
            console.log(e);
            setCopyColour('bg-red-400');
          }
        }}
      >
        Click to copy
      </button>
      <textarea
        className={'font-mono font-white bg-black'}
        readOnly={true}
        rows={5}
        onChange={() => {}}
        value={resultingString}
      />
    </div>
  );
}

const EXAMPLE_PLAYERS = `Ryouta (12.00) 2skr (11.50) Ryanteous (7.50) unknown17 (5.00) | Total = 36.00 | Guesses = 5544
Sabetin (13.50) chommy (11.50) JustaWeirdo (7.50) Ireland (3.50) | Total = 36.00 | Guesses = 5553
Vigard (12.50) potassiumf (12.00) Ilffam (7.50) UwUKingPikachu (4.00) | Total = 36.00 | Guesses = 5543
Aryssiel (11.50) caramel36 (10.50) onai (9.00) RattingAround (4.50) | Total = 35.50 | Guesses = 5553

OR 

chommy (AE86), hoiboi (Starlight Queen), Spitzell (A-), gw13 (None), Remie (Poomo), onai (X-Drive), yonyon (None), Kiraya (C+), miiarad (A+)

OR 

chommy, hoiboi, Spitzell
`;
