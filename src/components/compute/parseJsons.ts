import type {
  AliasType,
  CorrectGuessPlayer,
  JsonType,
  PlayerInfo,
  SongType,
} from '../common/types.ts';
import * as _ from 'lodash';

export function parseJsons(
  jsons: JsonType[],
  registeredPlayerNames: string[][],
  storedAliases: AliasType,
) {
  const playerInfos = new Map<string, PlayerInfo>();
  const jsonsWithZeroZero: (JsonType & { knownPlayers: string[] })[] = [];
  return doParse(jsons, registeredPlayerNames, storedAliases);

  function tallyGame(json: JsonType, playersThisGame: string[]) {
    const songCountsThisGame = [0, 0, 0, 0];
    json.songs.forEach((song) => {
      const songType = song.songInfo.type;
      songCountsThisGame[songType]++;
      const correctGuessCount = song.correctGuessPlayers.length;
      song.correctGuessPlayers.forEach((player) => {
        incrementForPlayer(
          player,
          songType,
          song.songInfo.animeDifficulty,
          correctGuessCount,
        );
      });
      song.listStates.forEach((listState) => {
        const modified = playerInfos.get(listState.name)!;
        modified.rigCounts[songType] += 1;
        playerInfos.set(listState.name, modified);
      });
    });
    playersThisGame.forEach((playerName) => {
      songCountsThisGame.forEach((count, songType) => {
        const modified = playerInfos.get(playerName)!;
        modified.songCounts[songType] += count;
        playerInfos.set(playerName, modified);
      });
    });
  }

  function prepAndGetGamePlayers(json: JsonType): string[] {
    const playersThisGame = gatherPlayers(json);
    if (playersThisGame.size < 8) {
      console.log(
        `Only ${playersThisGame.size} players found in room name = ${json.roomName}, start time = ${json.startTime}. the other players are ${Array.from(playersThisGame)}. Adding the missing people back in later.`,
      );
      jsonsWithZeroZero.push({
        knownPlayers: Array.from(playersThisGame),
        ...json,
      });
    } else if (playersThisGame.size > 8) {
      const error = `how you got ${playersThisGame.size} player ngmc... players are ${JSON.stringify(playersThisGame)}`;
      alert(error);
      throw new Error(error);
    }
    playersThisGame.forEach((playerName) => {
      initializePlayer(playerName);
    });
    return Array.from(playersThisGame);
  }

  function gatherPlayers(json: JsonType) {
    const playersThisGame = new Set<string>();
    json.songs.some((song) => {
      song.correctGuessPlayers.forEach((player) =>
        playersThisGame.add(player.name),
      );
      song.listStates.forEach((player) => playersThisGame.add(player.name));
      const shouldBreak = playersThisGame.size === 8;
      return shouldBreak;
    });
    return playersThisGame;
  }

  function doParse(
    jsons: JsonType[],
    registeredPlayerNames: string[][],
    storedAliases: AliasType,
  ): Map<string, PlayerInfo> {
    console.log('--[ Tallying jsons ]------------------------------');
    jsons.forEach((json: JsonType) => {
      const playersThisGame = prepAndGetGamePlayers(json);
      tallyGame(json, playersThisGame);
    });

    console.log('--[ Handling bot vs amq renames ]-----------------');
    const botNames = registeredPlayerNames.flat();
    const amqNamesDiffFromBot = _.difference(
      Array.from(playerInfos.keys()),
      botNames,
    );
    if (amqNamesDiffFromBot.length) {
      amqNamesDiffFromBot.forEach((amqName) => {
        const botName = findBotName(amqName, botNames, storedAliases);
        if (!botName) {
          const err = `Could not figure out who amqName=${amqName} is. Valid bot names are ${JSON.stringify(botNames)}. Add them to aliases in settings and update the discord pin for everyone else :)`;
          alert(err);
          throw new Error(err);
        }
        renameInObject(amqName, botName);
        jsonsWithZeroZero.forEach((json) => {
          json.knownPlayers = json.knownPlayers.map((currentAmqName) =>
            currentAmqName === amqName ? botName : currentAmqName,
          );
        });
        console.log(`renamed ${amqName} -> ${botName}`);
      });
    }

    console.log('--[ Handling 0/0s ]------------------------------');
    if (jsonsWithZeroZero.length) {
      jsonsWithZeroZero.forEach((json) => {
        let allPlayers = [...json.knownPlayers];
        json.knownPlayers.some((knownPlayer) => {
          const knownPlayerTeam = registeredPlayerNames.find((team) =>
            team.includes(knownPlayer),
          );
          if (knownPlayerTeam) {
            const missingPlayers = _.difference(knownPlayerTeam, allPlayers);
            if (missingPlayers.length) {
              missingPlayers.forEach((missingPlayer) => {
                console.log(
                  `Copying ${knownPlayer}'s song counts to ${missingPlayer}`,
                );
                playerInfos.get(missingPlayer)!.songCounts = [
                  ...playerInfos.get(knownPlayer)!.songCounts,
                ];
              });
              allPlayers = _.union(allPlayers, knownPlayerTeam);
              const shouldBreak = allPlayers.length === 8;
              return shouldBreak;
            }
          }
        });
        if (allPlayers.length !== 8) {
          const error = `Expected 8 players (${json.roomName}, ${json.startTime}). Actual: ${allPlayers.length}, namely ${JSON.stringify(allPlayers)}`;
          throw new Error(error);
        }
      });
      console.log(
        `Successfully filled in players for ${jsonsWithZeroZero.length} games`,
      );
    }

    console.log('returning playerinfos');
    console.log(playerInfos);
    return playerInfos;
  }

  function initializePlayer(name: string) {
    if (!playerInfos.get(name)) {
      playerInfos.set(name, {
        correctCounts: [0, 0, 0, 0],
        difficultyCorrectSum: [0, 0, 0, 0],
        lockSpeedCorrectSum: [0, 0, 0, 0],
        rigCounts: [0, 0, 0, 0],
        songCounts: [0, 0, 0, 0],
        ofEightOnCorrect: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        sevenEightsCount: [0, 0, 0, 0],
      });
    }
  }

  function incrementForPlayer(
    player: CorrectGuessPlayer,
    songType: SongType,
    songDifficulty: number,
    correctGuessCount: number,
  ) {
    const modified = playerInfos.get(player.name)!;
    modified.correctCounts[songType]++;
    modified.difficultyCorrectSum[songType] += isNaN(songDifficulty)
      ? 0
      : songDifficulty;
    modified.lockSpeedCorrectSum[songType] += player.answerTime;
    modified.ofEightOnCorrect[correctGuessCount]++;
    playerInfos.set(player.name, modified);
  }

  function findBotName(
    amqName: string,
    botNames: string[],
    aliases: AliasType,
  ) {
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
    const oldObj = playerInfos.get(oldName);
    if (!oldObj) {
      const error = `could not rename player from ${oldName} to ${newName}`;
      alert(error);
      throw new Error(error);
    }
    playerInfos.set(newName, oldObj);
    playerInfos.delete(oldName);
  }
}
