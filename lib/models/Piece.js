import { types } from 'mobx-state-tree'
import { GRID_COLUMN_COUNT } from '../constants'
import { pieceTypes } from '../pieceTypes'
import { randomInt } from '../util'
import { Block, createBlock } from './Block'

export const Piece = types
  .model('Piece', {
    centerX: types.number,
    centerY: types.number,
    blocks: types.array(Block),
  })
  .views(self => {
    return {
      get center () {
        // TODO: just use `center` as the an atom of state, the source of truth. remove centerX, centerY.
        return {x: self.centerX, y: self.centerY}
      }
    }
  })
  .actions(self => {
    return {
      transform(transformFn) {
        const transformdCenter = transformFn({x: self.centerX, y: self.centerY})
        self.centerX = transformdCenter.x
        self.centerY = transformdCenter.y
        self.blocks.forEach(block => {
          Object.assign(block, transformFn({x: block.x, y: block.y}))
        })
      }
    }
  })

export function createPiece () {
  const pieceType = pieceTypes[randomInt(pieceTypes.length)]
  const isCenterBetweenBlocks = (Math.abs(pieceType.center.x) % 1) === 0.5

  const centerX = (isCenterBetweenBlocks ? -0.5 : 0) + GRID_COLUMN_COUNT / 2
  let centerY = (isCenterBetweenBlocks ? -0.5 : 0)

  const blocks = [] // could use flatmap?
  pieceType.form.forEach((col, x) => col.forEach((cell, y) => {
    if (cell) {
      blocks.push(createBlock({
        x: centerX + x - pieceType.center.x,
        y: centerY + y - pieceType.center.y,
        color: pieceType.color
      }))
    }
  }))

  // set piece to exact top of grid
  // TODO: simplify this, fp style (no `let centerY = `)
  const deltaY = -Math.min(...blocks.map(block => block.y))
  centerY += deltaY
  blocks.forEach(block => {
    block.y += deltaY
  })

  return Piece.create({centerX, centerY, blocks})
}
