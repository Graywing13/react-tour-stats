import { useCallback, useEffect, useState } from 'react';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import { GAME_MODES } from '../../SETTINGS.ts';

interface SheetMetadataType {
  sheetId: string;
  apiKey: string;
}

export function ExportToSheet() {
  const [sheetMetadata, setSheetMetadata] = useLocalStorage<SheetMetadataType>(
    LS_KEY.SHEET_METADATA,
  );
  const [dirtyMetadata, setDirtyMetadata] = useState('');
  const generateAndCopy = useCallback(() => {}, []);

  useEffect(() => {
    setDirtyMetadata(JSON.stringify(sheetMetadata));
  }, [sheetMetadata]);

  const onSave = useCallback(() => {
    try {
      setSheetMetadata(JSON.parse(dirtyMetadata));
    } catch (e) {
      alert(`invalid json: ${e}`);
    }
  }, []);

  return (
    <div>
      3a. set metadata if blank
      <input
        placeholder={'sheet metadata'}
        value={dirtyMetadata}
        onChange={(e) => setDirtyMetadata(e.target.value)}
      />
      <button onClick={onSave}>save metadata</button>
      3b. generate and copy data to clipboard
      <button type={'button'} onClick={generateAndCopy}></button>
      <textarea value={'the text to paste over' + GAME_MODES.TEST.sheetTitle} />
      3c. send to sheet via google colab
      <p>
        Send to sheet by copying the text above and then paste in{' '}
        <a
          href={
            'https://colab.research.google.com/drive/12_97nIj4_du2MkdSs61kFcvf28FjbGR2#offline=true&sandboxM'
          }
        >
          Google colab notebook
        </a>
      </p>
      {'<insert image>'}
      3d. press "run all" in google colab if you haven't already
    </div>
  );
}
