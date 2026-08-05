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
import { calculatePlayerInfos } from './compute/calculatePlayerInfos.ts';

interface TablesProps {
  files: File[];
  shouldProcess: boolean;
  challongeData: string[][];
}

export function Tables(props: TablesProps) {
  const [storedAliases] = useLocalStorage<AliasType>(LS_KEY.SITE_ALIASES, {});
  const [fileJsons, setFileJsons] = useState<JsonType[]>([]);
  const [blep, setBlep] = useState<Map<string, PlayerInfo>>(new Map()); // todo temp idk why race condition

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
          console.log('****Inside on Load*****');
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
  }, [calculatePlayerInfos]);

  useEffect(() => {
    readFileJsons(props.files).then((newJsons) => setFileJsons(newJsons));
  }, [readFileJsons, props.files]);

  const finalizedPlayerInfos = useMemo(() => {
    if (
      registeredPlayerNames.length &&
      props.shouldProcess &&
      fileJsons.length
    ) {
      console.log('calculated');
      console.log(fileJsons);
      const result = calculatePlayerInfos(
        fileJsons,
        registeredPlayerNames,
        storedAliases,
      );
      if (!Object.keys(result).length) {
        console.log(fileJsons);
        console.log(registeredPlayerNames);
        alert('uhhhhh');
        debugger;
      }
      return result;
    }
    console.log('not calculated');
  }, [props.files, registeredPlayerNames, props.shouldProcess, fileJsons]);

  useEffect(() => {
    if (finalizedPlayerInfos && finalizedPlayerInfos.size) {
      setBlep(finalizedPlayerInfos);
    }
  }, [finalizedPlayerInfos]);

  const renderStatsOverview = useMemo(() => {
    console.log(`props.shouldProcess: ${props.shouldProcess}`);
    console.log(finalizedPlayerInfos);
    if (!props.shouldProcess || !finalizedPlayerInfos) return <></>;

    const columns = [
      'songCounts',
      'rigCounts',
      'correctCounts',
      'difficultyCorrectSum',
      'lockSpeedCorrectSum',
    ];
    console.log('proceeded');

    return (
      <TableContainer>
        <Table>
          <TableHead>
            {['person name', ...columns].map((name) => (
              <TableCell key={`header-${name}`}>{name}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {Object.entries(blep).map(([botName, stats]) => {
              console.log(`botName: ${botName}`);
              return (
                <TableRow key={`${botName}-row`}>
                  <TableCell key={botName}>{botName}</TableCell>
                  {columns.map((colName) => {
                    const [_unused, ...remainder] =
                      stats[colName as keyof PlayerInfo]; // trust me bro but fix later
                    return (
                      <TableCell key={`${botName}-${remainder}`}>
                        {JSON.stringify(
                          remainder
                            .map((num: number) => Math.round(num * 1000) / 1000)
                            .join(' / '),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [blep, props.shouldProcess]);

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
