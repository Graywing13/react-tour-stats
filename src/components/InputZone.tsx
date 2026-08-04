import { FileUploader } from 'react-drag-drop-files';
import { useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  FormControlLabel,
  Input,
  Radio,
  RadioGroup,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { ChevronDownIcon } from '@storybook/icons';
import { GAME_MODES } from '../../SETTINGS.ts';

interface InputZoneProps {
  files: File[];
  setFiles: (newFiles: File[]) => void;
  gamemode: keyof typeof GAME_MODES;
  setGamemode: (newMode: keyof typeof GAME_MODES) => void;
  challongeData: string[][];
  setChallongeData: (newData: string[][]) => void;
  onEdit: () => void;
  className?: string;
}

export function InputZone(props: InputZoneProps) {
  const subgroupClassname = 'w-full mb-4';

  const handleDropFiles = useCallback(
    (newFiles: File | File[]) => {
      console.log(newFiles);
      const multiUploadCast = Array.from(newFiles as File[]);
      props.setFiles(multiUploadCast);
      props.onEdit();
    },
    [props.setFiles, props.onEdit],
  );

  const parseChallongeStr = useCallback((rawTeams: string) => {
    return rawTeams.split('\n').map((line) => line.split('\t'));
  }, []);

  const createRadioOptions = useMemo(() => {
    return Object.entries(GAME_MODES).map(([modeId, mode]) => (
      <FormControlLabel
        key={modeId}
        value={modeId}
        control={<Radio />}
        label={mode.name}
      />
    ));
  }, []);

  const correctnessOverrideInput = useMemo(() => {
    return (
      <>
        Add correctness override
        <div className={'flex flex-row gap-2'}>
          <Autocomplete
            className={'w-2/5'}
            options={['playername', 'otherplayername', 'etc']}
            renderInput={(params) => (
              <TextField
                {...params}
                label={'Player name'}
                placeholder={'player name'}
              />
            )}
          />
          <Autocomplete
            className={'w-1/5'}
            options={['...compute length of game list']}
            renderInput={(params) => <TextField {...params} label={'Game #'} />}
          />
          <Autocomplete
            className={'w-1/5'}
            options={['...compute song number for game']}
            renderInput={(params) => <TextField {...params} label={'Song #'} />}
          />
          <Button className={'w-1/5'}>Override to correct</Button>
        </div>
      </>
    );
  }, []);

  const correctnessOverridesTable = useMemo(() => {
    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player Name</TableCell>
                <TableCell>Game #</TableCell>
                <TableCell>Song #</TableCell>
                <TableCell>Song Name</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        {!props.files.length && (
          <div className={'text-center pt-4 text-gray-500'}>No overrides</div>
        )}
      </>
    );
  }, [props.files]);

  const renderRadioOption = useMemo(() => {
    return (
      <div className={subgroupClassname}>
        <label htmlFor={'gamemode-selector'}>Mode</label>
        <RadioGroup
          id={'gamemode-selector'}
          value={props.gamemode}
          onChange={(e) => {
            props.setGamemode(e.target.value as keyof typeof GAME_MODES);
            props.onEdit();
          }}
        >
          {createRadioOptions}
        </RadioGroup>
      </div>
    );
  }, [createRadioOptions, props.setGamemode, props.onEdit]);

  const renderTeamsInput = useMemo(() => {
    const expectedLast0thIdxRow = Math.max(4, props.challongeData.length - 1);
    const expectedLast0thIdxCol = 6;
    return (
      <div className={subgroupClassname + ' flex'}>
        <div className={'flex flex-col w-2/5'}>
          <label>Challonge Table</label>
          <ul className={'list-disc'}>
            <li className={'text-sm'}>
              Go to the challonge link and copy the results table at the bottom
            </li>
            <li className={'text-sm'}>
              Make sure you copy the header row too (ie start with Rank)
            </li>
          </ul>
          <Input
            multiline={true}
            rows={1}
            value={props.challongeData}
            onChange={(e) => {
              props.setChallongeData(parseChallongeStr(e.target.value));
              props.onEdit();
            }}
            className={'bg-white'}
            placeholder={'Paste challonge results here'}
          ></Input>
        </div>
        <Accordion>
          <AccordionSummary>
            Teams table{' '}
            {props.challongeData[0]?.[0] &&
            props.challongeData[expectedLast0thIdxRow]?.[
              expectedLast0thIdxCol
            ] != null
              ? 'OK'
              : props.challongeData[0][0].startsWith('Rank')
                ? 'MISSING TEAMS'
                : 'MISSING HEADER ROW'}{' '}
            (click to expand)
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                {props.challongeData.map((row, rowIdx) => {
                  const cells = row.map((content, colIdx) => (
                    <TableCell key={`${content}-${rowIdx}-${colIdx}`}>
                      {content}
                    </TableCell>
                  ));
                  return rowIdx === 0 ? (
                    <TableHead key={`row-${row[0]}`}>
                      <TableRow>{cells}</TableRow>
                    </TableHead>
                  ) : (
                    <TableRow key={`row-${row[0]}`}>{cells}</TableRow>
                  );
                })}
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }, [
    props.setChallongeData,
    props.onEdit,
    parseChallongeStr,
    props.challongeData,
  ]);

  return (
    <div className={props.className}>
      {renderRadioOption}
      {renderTeamsInput}
      <div className={subgroupClassname}>
        <label>JSONs</label>
        <FileUploader
          label={'Upload files here'}
          multiple={true}
          uploadedLabel={`${props.files.length} files uploaded`}
          hoverTitle={'Drop files here'}
          fileOrFiles={props.files}
          types={['json']}
          onDrop={handleDropFiles}
          onSelect={handleDropFiles}
        />
      </div>
      <Accordion className={'w-4/5'}>
        <AccordionSummary expandIcon={<ChevronDownIcon />}>
          Overrides (doesnt work yet)
        </AccordionSummary>
        <AccordionDetails className={'bg-purple-200'}>
          {correctnessOverrideInput}
          {correctnessOverridesTable}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
