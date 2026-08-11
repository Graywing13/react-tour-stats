import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Input,
} from '@mui/material';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import {
  type AliasType,
  API_KEY_FIELD,
  type SheetApiKeyType,
} from './common/types.ts';
import { useMemo } from 'react';
import { INPUT_FIELD_CLASSNAME } from '../shared/styles.ts';
import { ChevronDownIcon } from '@storybook/icons';

export function Setup() {
  const [aliases, setAliases] = useLocalStorage<AliasType>(
    LS_KEY.SITE_ALIASES,
    {},
  );
  const [sheetApiKey, setSheetApiKey] = useLocalStorage<
    Partial<SheetApiKeyType>
  >(LS_KEY.SHEET_API_KEY, {});

  const isNeedsSetup = useMemo(() => {
    return (
      !Object.keys(aliases!).length ||
      API_KEY_FIELD.some((fieldName) => !sheetApiKey[fieldName])
    );
  }, [aliases, sheetApiKey]);

  return (
    <Accordion>
      <AccordionSummary
        className={isNeedsSetup ? 'bg-orange-300' : ''}
        expandIcon={<ChevronDownIcon />}
      >
        <p>
          {isNeedsSetup && <b>CLICK TO SETUP</b>} One-time setup / settings
          (click to expand)
        </p>
      </AccordionSummary>
      <AccordionDetails className={'flex flex-col'}>
        <label>
          Paste aliases from #stats pins here. <br />
          Has to be "valid json", so to edit, just highlight all the old stuff
          and paste over it
        </label>
        <Input
          multiline={true}
          rows={4}
          value={JSON.stringify(aliases, undefined, 2)}
          onChange={(e) => {
            try {
              setAliases(JSON.parse(e.target.value));
            } catch (error) {
              alert(
                'Unable to set aliases. Check that the right thing is being pasted. Error:\n' +
                  error,
              );
            }
          }}
          className={INPUT_FIELD_CLASSNAME}
          placeholder={'Paste aliases from #stats pins here'}
        ></Input>
        <label>
          Paste sheet api key (ie the passcode) from #stats pins here
        </label>
        <Input
          multiline={true}
          rows={4}
          value={JSON.stringify(sheetApiKey, undefined, 2)}
          onChange={(e) => {
            try {
              setSheetApiKey(JSON.parse(e.target.value));
            } catch (error) {
              alert(
                'Unable to set sheet metadata. Check that the right thing is being pasted. Error:\n' +
                  error,
              );
            }
          }}
          className={INPUT_FIELD_CLASSNAME}
          placeholder={'Paste sheet metadata from #stats pins here'}
        ></Input>
        And while you're here, some info. This site assumes
        <ul className={'list-disc pl-4'}>
          <li>No bot name changes</li>
          <li>No users taking over each others' aliases</li>
          <li>No mid-game subs</li>
          <li>Songs that don't have difficulty are counted as 0 diff</li>
        </ul>
        If thats needed for whatever reason... well.. i hope it isnt
      </AccordionDetails>
    </Accordion>
  );
}
