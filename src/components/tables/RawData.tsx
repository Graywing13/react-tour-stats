import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMemo } from 'react';
import type { PlayerInfo } from '../common/types.ts';
import { roundNumbers } from '../../formatters.ts';

interface RawDataProps {
  finalizedPlayerInfos: Map<string, PlayerInfo>;
}

export default function RawData(props: RawDataProps) {
  const columns = useMemo(() => {
    return [
      'songCounts',
      'rigCounts',
      'correctCounts',
      'difficultyCorrectSum',
      'lockSpeedCorrectSum',
      'ofEightOnCorrect',
    ];
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          {['person name', ...columns].map((name) => (
            <TableCell key={`header-${name}`}>{name}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(Object.fromEntries(props.finalizedPlayerInfos)).map(
          ([botName, stats]) => {
            return (
              <TableRow key={`${botName}-row`}>
                <TableCell key={botName}>{botName}</TableCell>
                {columns.map((colName) => {
                  const [_unused, ...remainder] =
                    stats[colName as keyof PlayerInfo]; // trust me bro but fix later
                  const formatted = roundNumbers(remainder);
                  return (
                    <TableCell key={`${botName}-${formatted}`}>
                      {formatted}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          },
        )}
      </TableBody>
    </Table>
  );
}
