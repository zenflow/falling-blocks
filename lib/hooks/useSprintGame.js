import { useEffect, useState } from 'react'
import { createSprintGame } from '../models/SprintGame'
import { useInterval } from './useInterval'
import { useKeyboardEvents } from './useKeyboardEvents'
import { MOVEMENT_INTERVAL } from '../constants'


export function useSprintGame () {
  const [game, setGame] = useState(() => createSprintGame())

  // TODO: set this up in such a way that the component using this hook doesn't need to be an @observer, and
  //   (completely?) rerender whenever tickInterval changes
  //   (probably using useEffect directly and managing the timer inside the model)
  useInterval(game.tick, game.tickInterval)

  useKeyboardEvents({
    ArrowLeft: {
      down: () => game.movePieceLeft(),
      repeatInterval: MOVEMENT_INTERVAL,
    },
    ArrowRight: {
      down: () => game.movePieceRight(),
      repeatInterval: MOVEMENT_INTERVAL,
    },
    ArrowUp: {
      down: () => game.rotatePieceClockwise(),
    },
    ArrowDown: {
      down: () => game.toggleTurbo(true),
      up: () => game.toggleTurbo(false),
    },
    ' ': {
      down: () => game.dropPiece()
    },
    p: {
      down: () => game.togglePause(),
    }
  }, [game])

  function resetGame () {
    setGame(createSprintGame())
  }

  return [game, resetGame]
}
