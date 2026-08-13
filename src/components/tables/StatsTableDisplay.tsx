import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { DerivedPlayerInfoType } from '../common/types.ts';
import { type AllowedColumnsType, colNames } from './sheetColumns.ts';
import { formatValue } from '../../formatters.ts';

interface StatsTableDisplayProps {
  derivedPlayerInfos: {
    [botName: string]: DerivedPlayerInfoType;
  };
  sheetColumns: AllowedColumnsType[];
}

export function StatsTableDisplay(props: StatsTableDisplayProps) {
  const commonCellStyling = 'p-1 border-1 border-gray-400';
  const grCellColour = 'oklch(95.1% 0.026 236.824)';
  return (
    <Table className={'bg-white text-black'}>
      <TableHead>
        <TableRow>
          {props.sheetColumns.map((columnName) => (
            <TableCell
              key={`header-${columnName}`}
              className={`text-nowrap ${commonCellStyling}`}
            >
              {columnName}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(props.derivedPlayerInfos).map((value) => {
          const [botName, stats] = value;
          return (
            <TableRow key={`${botName}-row`}>
              {props.sheetColumns.map((statName) => {
                const stat = stats[statName];
                const grCellStyle = {
                  backgroundColor: '#bce5f5',
                  background: `linear-gradient(90deg, ${grCellColour} 0%, ${grCellColour} ${stat}%, rgba(255, 255, 255, 1) ${stat}%)`,
                };
                const additionalClassnames = [
                  colNames['Player name'],
                  colNames['Guess rate'],
                ].includes(statName)
                  ? 'font-bold'
                  : '';
                return (
                  <TableCell
                    style={
                      statName === colNames['Guess rate'] ? grCellStyle : {}
                    }
                    key={`${botName}-${statName}`}
                    className={`text-ellipsis text-nowrap max-w-36 overflow-clip ${commonCellStyling} ${additionalClassnames}`}
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
