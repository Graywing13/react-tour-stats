import JsonDropArea from './common/JsonDropArea.tsx';

export function InputZone() {
  return (
    <div>
      <label htmlFor={'gamemode-selector'}></label>
      <input type={'radio'} />
      <JsonDropArea onDrop={() => alert('dropped')} />
      <span>
        overrides <input placeholder={'player name'} />{' '}
        <input placeholder={'game'} /> <input placeholder={'song no.'} />{' '}
        <div>loaded song:</div>
        <button>override to correct</button>
      </span>
    </div>
  );
}
