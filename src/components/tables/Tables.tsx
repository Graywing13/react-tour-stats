import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableContainer,
} from '@mui/material';
import RawData from './RawData.tsx';
import type {
  AliasType,
  DerivedPlayerInfoType,
  JsonType,
} from '../common/types.ts';
import { LS_KEY, useLocalStorage } from '../util/useLocalStorage.ts';
import { parseJsons } from '../compute/parseJsons.ts';
import { ChevronDownIcon } from '@storybook/icons';
import { StatsMain } from './StatsMain.tsx';
import { SHEET_COLUMNS } from './tableDataTypes.ts';

interface TablesProps {
  files: File[];
  shouldProcess: boolean;
  challongeData: string[][];
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
  setDerivedPlayerInfos: (newInfos: {
    [botName: string]: DerivedPlayerInfoType;
  }) => void;
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

  useEffect(() => {
    if (!finalizedPlayerInfos) return;
    const array: [string, DerivedPlayerInfoType][] = Object.entries(
      Object.fromEntries(finalizedPlayerInfos),
    ).map(([botName, playerInfo]) => {
      const statsForPlayer: [string, string | number][] = Object.entries(
        SHEET_COLUMNS,
      ).map(([columnName, columnData]) => {
        return [columnName, columnData.fn(playerInfo)];
      });
      const derivedPlayerInfo: DerivedPlayerInfoType =
        Object.fromEntries(statsForPlayer);
      return [botName, derivedPlayerInfo];
    });
    array.sort((playerA, playerB) => {
      const aStats = playerA[1] as DerivedPlayerInfoType;
      const bStats = playerB[1] as DerivedPlayerInfoType;
      return (
        (bStats['Guess rate'] as number) - (aStats['Guess rate'] as number)
      );
    });
    props.setDerivedPlayerInfos(Object.fromEntries(array));
  }, [finalizedPlayerInfos]);

  const renderJsonExtraction = useMemo(() => {
    if (!props.shouldProcess || !finalizedPlayerInfos) return <></>;

    return (
      <TableContainer>
        <RawData finalizedPlayerInfos={finalizedPlayerInfos} />
      </TableContainer>
    );
  }, [finalizedPlayerInfos, props.shouldProcess]);

  return (
    <div>
      <p>THIS IS NOT FORMATTED YET but to give you a preview heh.</p>
      {finalizedPlayerInfos && (
        <StatsMain derivedPlayerInfos={props.derivedPlayerInfos} />
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ChevronDownIcon />}>
          Raw data extracted from json/challonge
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <p>teams</p>
            {registeredPlayerNames.map((team) => (
              <p key={JSON.stringify(team)}>{JSON.stringify(team)}</p>
            ))}
          </div>
          <div>{renderJsonExtraction}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
