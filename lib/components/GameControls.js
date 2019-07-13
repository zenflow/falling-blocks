import { observer } from 'mobx-react-lite'

export const GameControls = observer(
  function GameControls ({game, resetGame}) {
    return (
      <div>
        <button
          onClick={() => game.togglePause()}
          className={`nes-btn ${game.paused ? 'is-primary' : ''}`}
          style={{margin: 24}}
        >
          {game.paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={() => resetGame()}
          className="nes-btn is-error"
          style={{margin: 24}}
        >
          Reset
        </button>
      </div>
    )
  }
)
