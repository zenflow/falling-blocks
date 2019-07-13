import { observer } from 'mobx-react-lite'

export const GameDebug = observer(
  function GameDebug ({game}) {
    return (
      <div>
        <hr/>
        <pre
          style={{textAlign: 'left'}}
          children={game.debugText}
        />
      </div>
    )
  }
)
