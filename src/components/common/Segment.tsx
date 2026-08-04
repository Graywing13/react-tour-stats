import { type ReactNode } from 'react';
import { Button } from '@mui/material';

interface SegmentProps {
  onStep: number;
  segmentIdx: number;
  title: string;
  children?: ReactNode;
  nextText?: string;
  onNext?: () => void;
}

export function Segment(props: SegmentProps) {
  const segmentClassname =
    'pt-4 pb-4 hover:bg-slate-100 transition-colors relative';
  const headerClassname = 'border-l-4 border-cyan-500 pl-2';
  return (
    <div className={segmentClassname}>
      {props.onStep < props.segmentIdx && (
        <div
          className={
            'w-full h-full flex absolute z-10 cursor-not-allowed bg-slate-800/60 -top-2 text-white justify-center items-center font-extrabold text-4xl'
          }
        >
          Complete previous step first
        </div>
      )}
      <h2 className={headerClassname}>{props.title}</h2>
      {props.children || <></>}
      {props.onNext && props.nextText && (
        <Button variant={'contained'} onClick={props.onNext}>
          {props.nextText}
        </Button>
      )}
    </div>
  );
}
