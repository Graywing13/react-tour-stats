import type {
  AliasType,
  CorrectGuessPlayer,
  JsonType,
  PlayerInfo,
  SongType,
} from '../common/types.ts';
import * as _ from 'lodash';

export function calculatePlayerInfos(
  jsons: JsonType[],
  registeredPlayerNames: string[][],
  storedAliases: AliasType,
) {
  const playerInfos = new Map<string, PlayerInfo>();
  console.log('hi');
  return doCalculate(jsons, registeredPlayerNames, storedAliases);

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
        console.log('35 modifying');
        playerInfos.set(listState.name, modified);
      });
    });
    playersThisGame.forEach((playerName) => {
      songCountsThisGame.forEach((count, songType) => {
        const modified = playerInfos.get(playerName)!;
        modified.songCounts[songType] += count;
        console.log('43 modifying');
        playerInfos.set(playerName, modified);
      });
    });
  }

  function prepAndGetGamePlayers(
    json: JsonType,
    registeredPlayerNames: string[][],
  ): string[] {
    const playersThisGame = new Set<string>();
    json.songs.some((song) => {
      song.correctGuessPlayers.forEach((player) =>
        playersThisGame.add(player.name),
      );
      song.listStates.forEach((player) => playersThisGame.add(player.name));
      const shouldBreak = playersThisGame.size === 8;
      return shouldBreak;
    });
    if (playersThisGame.size < 8) {
      // TODO figure out who they are based on registeredPlayerNames
      const error = `only ${playersThisGame.size} players found. people who went 0/0 will be missing stats. the other players are ${Array.from(playersThisGame)}`;
      alert(error);
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

  function doCalculate(
    jsons: JsonType[],
    registeredPlayerNames: string[][],
    storedAliases: AliasType,
  ): Map<string, PlayerInfo> {
    console.log(jsons.length);
    console.log(jsons);
    console.log(jsons[0]);
    const lol = [0, 1, 2];
    console.log(lol);
    debugger;
    jsons.forEach((json: JsonType) => {
      console.log('ba');
      const playersThisGame = prepAndGetGamePlayers(
        json,
        registeredPlayerNames,
      );
      console.log(playersThisGame);
      console.log(playerInfos);
      tallyGame(json, playersThisGame);
      console.log(playerInfos);
    });

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
      });
    }
    return playerInfos;
  }

  function initializePlayer(name: string) {
    if (!playerInfos.get(name)) {
      console.log('111 modifying');
      playerInfos.set(name, {
        correctCounts: [0, 0, 0, 0],
        difficultyCorrectSum: [0, 0, 0, 0],
        lockSpeedCorrectSum: [0, 0, 0, 0],
        rigCounts: [0, 0, 0, 0],
        songCounts: [0, 0, 0, 0],
        threeEightsCount: [0, 0, 0, 0],
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
    if (correctGuessCount <= 3) {
      modified.threeEightsCount[songType]++;
    }
    console.log('141 modifying');
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
    console.log(
      `Renaming ${oldName} to ${newName}. Data: ${JSON.stringify(oldObj)}`,
    );
    console.log('172 modifying');
    playerInfos.set(newName, oldObj);
    playerInfos.delete(oldName);
  }
}
