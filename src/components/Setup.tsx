import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Input,
} from '@mui/material';
import { LS_KEY, useLocalStorage } from './util/useLocalStorage.ts';
import type { AliasType, SheetMetadataType } from './common/types.ts';

export function Setup() {
  const [aliases, setAliases] = useLocalStorage<AliasType>(
    LS_KEY.SITE_ALIASES,
    {},
  );
  const [sheetMetadata, setSheetMetadata] = useLocalStorage<SheetMetadataType>(
    LS_KEY.SHEET_METADATA,
    { sheetId: '', apiKey: '' },
  );
  return (
    <Accordion>
      <AccordionSummary
        className={
          !Object.keys(aliases!).length ||
          !sheetMetadata?.sheetId ||
          !sheetMetadata.apiKey
            ? 'bg-orange-300'
            : ''
        }
      >
        One-time setup / settings (click to expand)
      </AccordionSummary>
      <AccordionDetails className={'flex flex-col'}>
        <label>Paste aliases from #stats pins here</label>
        <Input
          multiline={true}
          rows={4}
          value={JSON.stringify(aliases, undefined, 2)}
          onChange={(e) => {
            try {
              console.log(e.target.value);
              setAliases(JSON.parse(e.target.value));
            } catch (error) {
              alert(
                'Unable to set aliases. Check that the right thing is being pasted. Error:\n' +
                  error,
              );
            }
          }}
          className={'bg-gray-200'}
          placeholder={'Paste aliases from #stats pins here'}
        ></Input>
        <label>Paste sheet metadata from #stats pins here</label>
        <Input
          multiline={true}
          rows={4}
          value={JSON.stringify(sheetMetadata, undefined, 2)}
          onChange={(e) => {
            try {
              console.log(e.target.value);
              setSheetMetadata(JSON.parse(e.target.value));
            } catch (error) {
              alert(
                'Unable to set sheet metadata. Check that the right thing is being pasted. Error:\n' +
                  error,
              );
            }
          }}
          className={'bg-gray-200'}
          placeholder={'Paste sheet metadata from #stats pins here'}
        ></Input>
        And while you're here, some info. This site assumes
        <ul className={'list-disc'}>
          <li>No bot name changes</li>
          <li>No users taking over each others' aliases</li>
          <li>No mid-game subs</li>
        </ul>
        If thats needed for whatever reason... well.. i hope it isnt :)
      </AccordionDetails>
    </Accordion>
  );
}
