import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { DerivedPlayerInfoType } from '../common/types.ts';
import { SHEET_COLUMNS } from './sheetColumns.ts';
import { formatValue } from '../../formatters.ts';

interface StatsTableDisplayProps {
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
  sheetColumns: (keyof typeof SHEET_COLUMNS)[];
}

export function StatsTableDisplay(props: StatsTableDisplayProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {props.sheetColumns.map((columnName) => (
            <TableCell key={`header-${columnName}`} className={'text-nowrap'}>
              {columnName}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(props.derivedPlayerInfos).map(([botName, stats]) => {
          return (
            <TableRow key={`${botName}-row`}>
              {props.sheetColumns.map((statName) => {
                const stat = stats[statName];
                return (
                  <TableCell
                    key={`${botName}-${statName}`}
                    className={
                      'text-ellipsis text-nowrap max-w-36 overflow-clip p-1'
                    }
                  >
                    {formatValue(stat)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
