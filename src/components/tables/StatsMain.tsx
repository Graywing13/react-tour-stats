import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { DerivedPlayerInfoType } from '../common/types.ts';
import { SHEET_COLUMNS } from './tableDataTypes.ts';
import { roundIfNumber } from '../../formatters.ts';

interface StatsMainProps {
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
}

export function StatsMain(props: StatsMainProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {Object.keys(SHEET_COLUMNS).map((columnName) => (
            <TableCell key={`header-${columnName}`}>{columnName}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(props.derivedPlayerInfos).map(([botName, stats]) => {
          return (
            <TableRow key={`${botName}-row`}>
              {Object.entries(stats).map(([statName, stat]) => (
                <TableCell key={`${botName}-${statName}`}>
                  {roundIfNumber(stat)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
