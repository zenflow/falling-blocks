import { observer } from 'mobx-react-lite'
import { useSprintGame } from '../hooks/useSprintGame'
import { GameGrid } from './GameGrid'
import { GameControls } from './GameControls'
import { GameDebug } from './GameDebug'

export const SprintGame = observer(
  function SprintGame () {
    const [game, resetGame] = useSprintGame()

    // debugging.. remove this
    global.game = game

    return (
      <div className="nes-container with-title">
        <p className="title">Sprint</p>
        <GameGrid game={game}/>
        <GameControls game={game} resetGame={resetGame}/>
        <GameDebug game={game}/>
      </div>
    )
  }
)
