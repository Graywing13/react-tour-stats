import { useCallback, useEffect, useState } from 'react';

const LOCALSTORAGE_VERSION = 0.1;

export const LS_KEY = {
  LS_VERSION: 'app_lsVersion',
  SITE_ALIASES: 'tour_aliases',
  SHEET_API_KEY: 'tour_sheetApiKey',
};
type LS_KEY = (typeof LS_KEY)[keyof typeof LS_KEY];

const LS_METADATA: LsMetadataType = {
  app_lsVersion: { lastBreakingVersion: 0.1 },
  tour_sheetMetadata: { lastBreakingVersion: 0.1 },
};
interface LsMetadataType {
  [lsKey: LS_KEY]: {
    lastBreakingVersion: number;
  };
}

// TODO we dont set the version anywhere
export function useLocalStorage<T>(
  key: LS_KEY,
  defaultValue: T,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  const parseIfExists = useCallback((key: string) => {
    const stringified = localStorage.getItem(key);
    if (stringified) {
      try {
        return JSON.parse(stringified);
      } catch (e) {
        alert(`error parsing. Key ${key} has invalid json ${stringified}`);
        return undefined;
      }
    }
  }, []);

  useEffect(() => {
    const currDataVersion = parseIfExists(LS_KEY.LS_VERSION);
    if (currDataVersion && currDataVersion < LS_METADATA[key]) {
      alert(
        `Data version is outdated (${currDataVersion} < ${LS_METADATA[key]} for key ${key}). Press OK to clear field.`,
      );
      localStorage.removeItem(key);
      localStorage.setItem(
        LS_KEY.LS_VERSION,
        JSON.stringify(LOCALSTORAGE_VERSION),
      );
    }
  }, []);

  useEffect(() => {
    let parsed = parseIfExists(key);
    setValue(parsed ?? defaultValue);
  }, []);

  const saveValue = useCallback((newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }, []);

  return [value, saveValue];
}
