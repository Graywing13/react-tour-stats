import { type ReactNode } from 'react';
import { Button } from '@mui/material';
import { SUBSTEP_INDICATOR } from '../../shared/styles.ts';

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
    'pt-4 pb-4 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative';
  const headerClassname = 'border-l-4 border-cyan-500 pl-2';
  return (
    <div className={segmentClassname}>
      {props.onStep < props.segmentIdx && (
        <div
          className={
            'w-full h-full flex absolute z-10 cursor-not-allowed bg-slate-800/80 -top-2 text-white justify-center items-center font-extrabold text-4xl'
          }
        >
          Complete previous step first
        </div>
      )}
      <h2 className={headerClassname}>{props.title}</h2>
      <div className={'px-4'}>
        {props.children || <></>}
        {props.onNext && props.nextText && (
          <>
            <label className={SUBSTEP_INDICATOR}>{props.nextText}</label>
            <Button
              variant={'contained'}
              onClick={props.onNext}
              className={'normal-case ml-4 mt-2'}
            >
              Click to go next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
