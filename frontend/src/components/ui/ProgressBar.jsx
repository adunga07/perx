// TODO: horizontal budget bar
export function ProgressBar({ value, max, color }) {
  return <div className='progress-bar'><div style={{ width: ${(value/max)*100}% }} /></div>
}

