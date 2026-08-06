import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AliasType, JsonType, PlayerInfo } from './common/types.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import { parseJsons } from './compute/parseJsons.ts';

interface TablesProps {
  files: File[];
  shouldProcess: boolean;
  challongeData: string[][];
}

export function Tables(props: TablesProps) {
  const [storedAliases] = useLocalStorage<AliasType>(LS_KEY.SITE_ALIASES, {});
  const [fileJsons, setFileJsons] = useState<JsonType[]>([]);

  const registeredPlayerNames = useMemo(() => {
    if (!props.shouldProcess) return [];
    const playerNameIdx = 1;
    try {
      const [_headerRow, ...nameRows] = props.challongeData;
      return nameRows
        .map((row) => row[playerNameIdx])
        .map((rowStr) => rowStr.split('|')[0])
        .map((nameStr) => ') ' + nameStr)
        .map((nameStr) =>
          nameStr
            .split(' (')
            .map((name) => name.split(') ')[1])
            .filter((name) => !!name),
        );
    } catch (e) {
      alert('Failed to get names. Check challonge input. Error:\n' + e);
      return [];
    }
  }, [props.challongeData, props.shouldProcess]);

  const readFileJsons = useCallback(async (files: File[]) => {
    const results: JsonType[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsText(files[i]);

      await new Promise((resolve, reject) => {
        // https://stackoverflow.com/questions/75599571/filereader-should-complete-onload-function-first-then-process-further
        reader.onload = () => {
          try {
            const raw = reader.result!.toString();
            const parsed = JSON.parse(raw);
            results.push(parsed);
            resolve(parsed);
          } catch (e) {
            alert('FAILED TO UPLOAD\n' + e);
            reject(e);
          }
        };
      });
    }
    return results;
  }, []);

  useEffect(() => {
    console.log(`registeredPlayerNames changed ${registeredPlayerNames}`);
  }, [registeredPlayerNames]);

  useEffect(() => {
    console.log(`shouldProcess changed ${props.shouldProcess}`);
  }, [props.shouldProcess]);

  useEffect(() => {
    console.log(`calculatePlayerInfos changed`);
  }, [parseJsons]);

  useEffect(() => {
    readFileJsons(props.files).then((newJsons) => setFileJsons(newJsons));
  }, [readFileJsons, props.files]);

  const finalizedPlayerInfos = useMemo(() => {
    if (
      registeredPlayerNames.length &&
      props.shouldProcess &&
      fileJsons.length
    ) {
      const result = parseJsons(
        fileJsons,
        registeredPlayerNames,
        storedAliases,
      );
      console.log(result);
      return result;
    }
  }, [props.files, registeredPlayerNames, props.shouldProcess, fileJsons]);

  const renderStatsOverview = useMemo(() => {
    if (!props.shouldProcess || !finalizedPlayerInfos) return <></>;

    const columns = [
      'songCounts',
      'rigCounts',
      'correctCounts',
      'difficultyCorrectSum',
      'lockSpeedCorrectSum',
      'ofEightOnCorrect',
    ];

    function roundNumbers(numbersToRound: number[]) {
      return JSON.stringify(
        numbersToRound
          .map((num: number) => Math.round(num * 1000) / 1000)
          .join(' / '),
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['person name', ...columns].map((name) => (
                <TableCell key={`header-${name}`}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(Object.fromEntries(finalizedPlayerInfos)).map(
              ([botName, stats]) => {
                return (
                  <TableRow key={`${botName}-row`}>
                    <TableCell key={botName}>{botName}</TableCell>
                    {columns.map((colName) => {
                      const [_unused, ...remainder] =
                        stats[colName as keyof PlayerInfo]; // trust me bro but fix later
                      const formatted = roundNumbers(remainder);
                      return (
                        <TableCell key={`${botName}-${formatted}`}>
                          {formatted}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [finalizedPlayerInfos, props.shouldProcess]);

  return (
    <div>
      Tables<span>(WIP) download img by clicking button</span>
      <div>
        <p>teams</p>
        {registeredPlayerNames.map((team) => (
          <p key={JSON.stringify(team)}>{JSON.stringify(team)}</p>
        ))}
      </div>
      <div>{renderStatsOverview}</div>
    </div>
  );
}
