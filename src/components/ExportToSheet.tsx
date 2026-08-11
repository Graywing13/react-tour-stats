import { useMemo } from 'react';
import { GAME_MODES } from '../../SETTINGS.ts';
import type { DerivedPlayerInfoType } from './common/types.ts';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import { SHEET_COLUMNS } from './tables/tableDataTypes.ts';
import { Button } from '@mui/material';
import { CopyIcon } from '@storybook/icons';

interface ExportToSheetProps {
  gameMode: keyof typeof GAME_MODES;
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
}

export function ExportToSheet(props: ExportToSheetProps) {
  const [apiKey] = useLocalStorage(LS_KEY.SHEET_API_KEY, {});

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
pasted_credentials = ${JSON.stringify(apiKey)}
data=${JSON.stringify(dataForSheet)}
    `;
  }, [props.gameMode, apiKey, dataForSheet]);

  return (
    <div className={'flex flex-col'}>
      3a) generate and copy data to clipboard
      <Button
        endIcon={<CopyIcon />}
        type={'button'}
        onClick={() => navigator.clipboard.writeText(textToCopy)}
      >
        Copy Data
      </Button>
      <textarea value={textToCopy} />
      <p>
        3b) Send to sheet. Go to{' '}
        <a
          className={'underline text-blue-500'}
          href={
            'https://colab.research.google.com/drive/12_97nIj4_du2MkdSs61kFcvf28FjbGR2#offline=true&sandboxM'
          }
        >
          Google colab notebook
        </a>{' '}
        and then paste in the copied text from 3a
      </p>
      {'<insert image>'}
      <p>3c. press "run all" in google colab if you haven't already</p>
    </div>
  );
}
