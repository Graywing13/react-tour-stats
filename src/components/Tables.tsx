import { useEffect, useMemo, useState } from 'react';
import type { AliasType, JsonType } from './common/types.ts';
import * as _ from 'lodash';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface TablesProps {
  files: File[];
  shouldProcess: boolean;
  challongeData: string[][];
}

interface PlayerInfo {
  // The following are arrays with length 4. idx 0 = nothing, 1 = op, 2 = ed, 3 = in
  songCounts: number[];
  rigCounts: number[];
  correctCounts: number[];
  difficultyCorrectSum: number[];
  lockSpeedCorrectSum: number[];
}

interface PlayerInfos {
  [username: string]: PlayerInfo;
}

export function Tables(props: TablesProps) {
  const [fileJsons, setFileJsons] = useState<JsonType[]>([]);
  const [aliases] = useLocalStorage<AliasType>(LS_KEY.SITE_ALIASES, {});
  const [finalizedPlayerInfos, setFinalizedPlayerInfos] = useState<PlayerInfos>(
    {},
  );

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

  useEffect(() => {
    if (!props.shouldProcess) return;
    const result: JsonType[] = [];
    props.files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(file);
    });
    console.log(result);
    setFileJsons(result);

    function onReaderLoad(loaded: ProgressEvent<FileReader>) {
      try {
        const raw = (loaded.target?.result || '') as string;
        const parsed = JSON.parse(raw);
        result.push(parsed);
      } catch (e) {
        alert('FAILED TO UPLOAD\n' + e);
      }
    }
  }, [props.shouldProcess, props.files]);

  // todo refactor kinda gross i wrote it in one go
  useEffect(() => {
    if (!registeredPlayerNames.length || !props.shouldProcess) return;

    setFinalizedPlayerInfos(calculatePlayerInfos());

    function calculatePlayerInfos(): PlayerInfos {
      const playerInfos: PlayerInfos = {};
      fileJsons.forEach((json: JsonType) => {
        const namesThisGame = new Set<string>();
        const songCountsThisGame = [0, 0, 0, 0];
        json.songs.forEach((song) => {
          const songType = song.songInfo.type;
          songCountsThisGame[songType]++;
          song.correctGuessPlayers.forEach((player) => {
            namesThisGame.add(player.name);
            initializePlayer(player.name);
            playerInfos[player.name].correctCounts[songType]++;
            playerInfos[player.name].difficultyCorrectSum[songType] +=
              song.songInfo.animeDifficulty;
            playerInfos[player.name].lockSpeedCorrectSum[songType] +=
              player.answerTime;
            playerInfos[player.name].rigCounts[songType]++;
          });
        });

        const botNames = registeredPlayerNames.flat();
        const amqNamesDiffFromBot = _.difference(
          Array.from(namesThisGame),
          botNames,
        );
        if (amqNamesDiffFromBot.length) {
          amqNamesDiffFromBot.forEach((amqName) => {
            const botName = findBotName(amqName, botNames);
            if (!botName) {
              const err = `Could not figure out who amqName=${amqName} is. Valid bot names are ${JSON.stringify(botNames)}. Add them to aliases in settings and update the discord pin for everyone else :)`;
              alert(err);
              throw new Error(err);
            }
            namesThisGame.delete(amqName);
            namesThisGame.add(botName);
            renameInObject(amqName, botName);
          });
        }

        if (namesThisGame.size < 8) {
          alert(
            'someone got 0 rig 0 score gg. i dont have time to code this rn so i will just assume that person is gw13. WAJAJA',
          );
          initializePlayer('gw13');
          namesThisGame.add('gw13');
        }

        songCountsThisGame.forEach((amount, idx) => {
          namesThisGame.forEach((botName) => {
            playerInfos[botName].songCounts[idx] += amount;
          });
        });
      });

      function initializePlayer(name: string) {
        if (!playerInfos[name]) {
          playerInfos[name] = {
            correctCounts: [0, 0, 0, 0],
            difficultyCorrectSum: [0, 0, 0, 0],
            lockSpeedCorrectSum: [0, 0, 0, 0],
            rigCounts: [0, 0, 0, 0],
            songCounts: [0, 0, 0, 0],
          };
        }
      }

      function findBotName(amqName: string, botNames: string[]) {
        const findNameCaseInsensitive = botNames.find(
          (botName) => botName.toLowerCase() === amqName.toLowerCase(),
        );
        return (
          findNameCaseInsensitive ||
          Object.entries(aliases).find(([_botName, aliasList]) =>
            aliasList.find(
              (alias) => alias.toLowerCase() === amqName.toLowerCase(),
            ),
          )?.[0]
        );
      }

      function renameInObject(oldName: string, newName: string) {
        const oldObj = Object.getOwnPropertyDescriptor(playerInfos, oldName);
        if (!oldObj) {
          const error = `could not rename player from ${oldName} to ${newName}`;
          alert(error);
          throw new Error(error);
        }
        Object.defineProperty(playerInfos, newName, oldObj);
        delete playerInfos[oldName];
      }

      return playerInfos;
    }
  }, [fileJsons, registeredPlayerNames, props.shouldProcess]);

  const renderStatsOverview = useMemo(() => {
    if (!props.shouldProcess) return <></>;

    const columns = [
      'songCounts',
      'rigCounts',
      'correctCounts',
      'difficultyCorrectSum',
      'lockSpeedCorrectSum',
    ];

    return (
      <TableContainer>
        <Table>
          <TableHead>
            {['person name', ...columns].map((name) => (
              <TableCell key={`header-${name}`}>{name}</TableCell>
            ))}
          </TableHead>
          <TableBody>
            {Object.entries(finalizedPlayerInfos).map(([botName, stats]) => {
              return (
                <TableRow>
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
  }, [finalizedPlayerInfos, props.shouldProcess]);

  return (
    <div>
      Tables<span>(WIP) download img by clicking button</span>
      <div>
        <p>teams</p>
        {registeredPlayerNames.map((team) => (
          <p>{JSON.stringify(team)}</p>
        ))}
      </div>
      <div>{renderStatsOverview}</div>
    </div>
  );
}
