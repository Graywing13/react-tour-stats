import { useEffect, useMemo, useState } from 'react';
import { GAME_MODES } from '../../SETTINGS.ts';
import type { DerivedPlayerInfoType } from './common/types.ts';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import { SHEET_COLUMNS } from './tables/tableDataTypes.ts';
import { Button } from '@mui/material';
import { CopyIcon } from '@storybook/icons';
import what_to_do_in_colab from '../assets/what_to_do_in_colab.png';

interface ExportToSheetProps {
  gameMode: keyof typeof GAME_MODES;
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
}

const OG_BUTTON_COLOUR = 'bg-yellow-300';

export function ExportToSheet(props: ExportToSheetProps) {
  const [apiKey] = useLocalStorage(LS_KEY.SHEET_API_KEY, {});
  const [buttonColour, setButtonColour] = useState(OG_BUTTON_COLOUR);

  useEffect(() => {
    let timeout: number;
    if (buttonColour !== OG_BUTTON_COLOUR) {
      timeout = setTimeout(() => {
        setButtonColour(OG_BUTTON_COLOUR);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [buttonColour]);

  const dataForSheet: { [key: string]: (string | number)[] } = useMemo(() => {
    const currentDate = new Date().toISOString();
    const result = Object.entries(props.derivedPlayerInfos).map(
      ([botName, infos]) => {
        const derivedStatsArray = Object.keys(SHEET_COLUMNS).map(
          (colName) => infos[colName],
        );
        const playerRow = [currentDate, ...derivedStatsArray];
        return [botName, playerRow];
      },
    );
    return Object.fromEntries(result);
  }, [props.derivedPlayerInfos]);

  const textToCopy = useMemo(() => {
    const sheetTabName = GAME_MODES[props.gameMode].sheetTitle;
    return `# STATS DATA HERE
worksheet_name = '${sheetTabName}'
data=${JSON.stringify(dataForSheet)}
pasted_credentials = ${JSON.stringify(apiKey)}
# DATA END`;
  }, [props.gameMode, apiKey, dataForSheet]);

  return (
    <div className={'flex flex-col gap-2'}>
      3a) generate and copy data to clipboard
      <Button
        endIcon={<CopyIcon />}
        type={'button'}
        onClick={() => {
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => setButtonColour('bg-green-500'))
            .catch(() => setButtonColour('bg-red-500'));
        }}
        className={buttonColour}
      >
        Copy Data
      </Button>
      <textarea
        value={textToCopy}
        className={'font-mono bg-gray-300 text-nowrap'}
        rows={5.5}
      />
      <p>
        3b) Send to sheet.{' '}
        <b>
          Go to{' '}
          <a
            className={'underline text-blue-500'}
            href={
              'https://colab.research.google.com/drive/12_97nIj4_du2MkdSs61kFcvf28FjbGR2#offline=true&sandboxM'
            }
          >
            Google colab notebook
          </a>
        </b>{' '}
        and then paste in the copied text from 3a
      </p>
      <img
        src={what_to_do_in_colab}
        alt={'visual for what to do in google colab'}
      />
      <p>3c) press "run all" in google colab if you haven't already</p>
    </div>
  );
}
