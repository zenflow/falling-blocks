import { observer } from 'mobx-react-lite'
import { CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from '../constants'

export const GameGrid = observer(
  function GameGrid ({game}) {
    return (
      <div
        style={{
          position: 'relative',
          margin: '0 auto',
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
          backgroundColor: 'silver',
        }}
        children={[
          ...game.currentPiece.blocks.map(block => (
            <PreviewBlock key={`preview-${block.id}`} block={block} translateY={game.currentPieceVerticalClearance}/>
          )),
          ...game.allBlocks.map(block => (
            <Block key={block.id} block={block}/>
          )),
        ]}
      />
    )
  }
)
const Block = observer(
  function Block ({block}) {
    return (
      <div
        style={{
          position: 'absolute',
          width: CELL_SIZE,
          height: CELL_SIZE,
          left: block.x * CELL_SIZE,
          top: block.y * CELL_SIZE,
          backgroundColor: block.color,
          transition: 'all .05s', // TODO: Try https://cubic-bezier.com/
        }}
      />
    )
  }
)

const PreviewBlock = observer(
  function PreviewBlock ({block, translateY}) {
    return (
      <div
        style={{
          position: 'absolute',
          width: CELL_SIZE,
          height: CELL_SIZE,
          left: block.x * CELL_SIZE,
          top: (block.y +translateY) * CELL_SIZE,
          backgroundColor: block.color,
          opacity: 0.5,
          transition: 'all .05s', // TODO: Try https://cubic-bezier.com/
        }}
      />
    )
  }
)
