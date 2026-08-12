import { useEffect, useMemo, useState } from 'react';
import { GAME_MODES } from '../../SETTINGS.ts';
import type { DerivedPlayerInfoType } from './common/types.ts';
import { ALL_COLUMNS, OMIT_FROM_SHEET } from './tables/sheetColumns.ts';
import { Button } from '@mui/material';
import { CopyIcon } from '@storybook/icons';
import what_to_do_in_colab_run_all from '../assets/what_to_do_in_colab_run_all.png';
import how_to_know_ur_good_in_colab from '../assets/how_to_know_ur_good_in_colab.png';
import { SUBSTEP_INDICATOR } from '../shared/styles.ts';
import { formatValue } from '../formatters.ts';

interface ExportToSheetProps {
  gameMode: keyof typeof GAME_MODES;
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
  apiKey: object;
}

const OG_BUTTON_COLOUR = 'bg-yellow-300';

export function ExportToSheet(props: ExportToSheetProps) {
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
    const colsForSheet = Object.keys(ALL_COLUMNS).filter(
      (colName) => !OMIT_FROM_SHEET.includes(colName),
    );
    const result = Object.entries(props.derivedPlayerInfos).map(
      ([botName, infos]) => {
        const derivedStatsArray = colsForSheet.map((colName) =>
          formatValue(infos[colName]),
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
data = ${JSON.stringify(dataForSheet)}
pasted_credentials = ${JSON.stringify(props.apiKey)}
# DATA END`;
  }, [props.gameMode, props.apiKey, dataForSheet]);

  return (
    <div className={'flex flex-col gap-2'}>
      <label className={SUBSTEP_INDICATOR}>
        3a) generate and copy data to clipboard
      </label>
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
        readOnly={true}
      />
      <label className={SUBSTEP_INDICATOR}>3b) Send to sheet</label>
      <p>
        <b>
          Go to{' '}
          <a
            className={'underline text-blue-500 text-3xl'}
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
        src={what_to_do_in_colab_run_all}
        alt={'visual for what to do in google colab'}
      />
      <label className={SUBSTEP_INDICATOR}>
        3c) check for send confirmation
      </label>
      <p>
        Press "run all" in google colab if you haven't already. If it doesn't
        work u can click the play buttons individually... either way, uk ur good
        when u have 2 green checkmarks and some text at the bottom lol
      </p>
      <img
        src={how_to_know_ur_good_in_colab}
        alt={'visual for how to know ur good'}
      />
    </div>
  );
}
