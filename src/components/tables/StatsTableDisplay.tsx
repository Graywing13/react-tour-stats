import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { DerivedPlayerInfoType } from '../common/types.ts';
import { ALL_COLUMNS } from './sheetColumns.ts';
import { formatValue } from '../../formatters.ts';

interface StatsTableDisplayProps {
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
  sheetColumns: (keyof typeof ALL_COLUMNS)[];
}

export function StatsTableDisplay(props: StatsTableDisplayProps) {
  return (
    <Table className={'bg-white text-black'}>
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
        {Object.entries(props.derivedPlayerInfos).map((value, idx) => {
          const [botName, stats] = value;
          return (
            <TableRow
              key={`${botName}-row`}
              className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
            >
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
