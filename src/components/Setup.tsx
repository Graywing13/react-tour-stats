import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Input,
} from '@mui/material';
import {
  type AliasType,
  API_KEY_FIELD,
  type SheetApiKeyType,
} from './common/types.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { INPUT_FIELD_CLASSNAME } from '../shared/styles.ts';
import { ChevronDownIcon } from '@storybook/icons';

interface SetupProps {
  aliases: AliasType;
  setAliases: (newValue: AliasType) => void;
  apiKey: Partial<SheetApiKeyType>;
  setApiKey: (newValue: Partial<SheetApiKeyType>) => void;
}

export function Setup(props: SetupProps) {
  const [dirtyAliases, setDirtyAliases] = useState('');
  const [dirtyApiKey, setDirtyApiKey] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setDirtyAliases(JSON.stringify(props.aliases, null, 2));
    setDirtyApiKey(JSON.stringify(props.apiKey, null, 2));
  }, []);

  const isNeedsSetup = useMemo(() => {
    return (
      !Object.keys(props.aliases!).length ||
      API_KEY_FIELD.some((fieldName) => !props.apiKey[fieldName])
    );
  }, [props.aliases, props.apiKey]);

  const onSave = useCallback(() => {
    try {
      props.setAliases(JSON.parse(dirtyAliases));
      props.setApiKey(JSON.parse(dirtyApiKey));
      setIsDirty(false);
    } catch (e) {
      alert(`invalid json: ${e}`);
    }
  }, [dirtyAliases, dirtyApiKey, props.setAliases, props.setApiKey]);

  return (
    <Accordion>
      <AccordionSummary
        className={isNeedsSetup ? 'bg-red-300' : ''}
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
        </label>
        <Input
          multiline={true}
          rows={4}
          value={dirtyAliases}
          onChange={(e) => {
            setDirtyAliases(e.target.value);
            setIsDirty(true);
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
          value={dirtyApiKey}
          onChange={(e) => {
            setDirtyApiKey(e.target.value);
            setIsDirty(true);
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
          <li>Always 8 player ngmc</li>
        </ul>
        If thats needed for whatever reason... well.. i hope it isnt
        <Button
          className={isDirty ? 'bg-yellow-300' : 'bg-gray;300'}
          onClick={onSave}
          disabled={!isDirty}
        >
          {isDirty ? 'Save Changes' : 'Up-to-date'}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
