import { detach, types } from 'mobx-state-tree'
import { GRID_COLUMN_COUNT, GRID_ROW_COUNT, NORMAL_STEP_INTERVAL, TURBO_STEP_INTERVAL, } from '../constants'
import { createPiece, Piece } from './Piece'
import { Block } from './Block'

const compose = (fnA, fnB) => arg => fnB(fnA(arg))
const transformLeft = ({x, y}) => ({x: x - 1, y})
const transformRight = ({x, y}) => ({x: x + 1, y})
const transformUp = ({x, y}) => ({x, y: y - 1})
const transformDown = ({x, y}) => ({x, y: y + 1})
const transformClockwise = center => ({x, y}) => ({x: center.x - (y - center.y), y: center.y + (x - center.x)})
const transformCounterClockwise = center => ({x, y}) => ({x: center.x + (y - center.y), y: center.y - (x - center.x)})

export const SprintGame = types
  .model('SprintGame', {
    paused: false,
    turbo: false,
    currentPiece: Piece,
    placedBlocks: types.array(Block),
    over: false,
  })
  .extend(self => {
    function pointsHasCollision (points) {
      const matrix = self.placedBlocksMatrix
      return points.some(({x, y}) =>
        // collision with a wall
        (x < 0) || (x >= GRID_COLUMN_COUNT) || (y < 0) || (y >= GRID_ROW_COUNT)
        // collision with a placed block
        || matrix[x][y]
      )
    }

    function maybeTransformPiece (transformFn) {
      if (!pointsHasCollision(self.currentPiece.blocks.map(transformFn))) {
        self.currentPiece.transform(transformFn)
      }
    }

    function tryTransformPiece (transformFn) {
      const isTransformOk = transformFn => !pointsHasCollision(self.currentPiece.blocks.map(transformFn))
      const transformFnsToTry = [
        transformFn,
        compose(transformFn, transformLeft),
        compose(transformFn, transformRight),
        compose(transformFn, transformUp),
        compose(transformFn, transformDown),
      ]
      const effectiveTransformFn = transformFnsToTry.find(isTransformOk)
      if (effectiveTransformFn) {
        self.currentPiece.transform(effectiveTransformFn)
      }
    }

    function placePiece () {
      self.currentPiece.blocks.forEach(block => {
        detach(block)
        self.placedBlocks.push(block)
      })
      const rowsToRemove = Array.from({length: GRID_ROW_COUNT}, (_, index) => index)
        .filter(y => self.placedBlocksMatrix.every(column => column[y]))
      rowsToRemove.forEach(y => {
        self.placedBlocksMatrix.forEach(column => {
          detach(column[y])
          column.slice(0, y).filter(Boolean).forEach(block => {
            block.y++
          })
        })
      })
      self.currentPiece = createPiece()
      if (pointsHasCollision(self.currentPiece.blocks)) {
        self.over = true
      }
    }

    return {
      views: {
        get debugText () {
          const {over, paused, turbo, currentPiece, tickInterval} = self
          return JSON.stringify({over, paused, turbo, currentPiece, tickInterval}, null, 2)
        },
        get tickInterval () {
          return (self.paused || self.over) ? null : self.turbo ? TURBO_STEP_INTERVAL : NORMAL_STEP_INTERVAL
        },
        get allBlocks () {
          return [...self.placedBlocks, ...self.currentPiece.blocks] // TODO: render these separately for cool effects
        },
        get placedBlocksMatrix () {
          const matrix = Array.from({length: GRID_COLUMN_COUNT}, () =>
            Array.from({length: GRID_ROW_COUNT}, () => null)
          )
          self.placedBlocks.forEach(block => {
            matrix[block.x][block.y] = block
          })
          return matrix
        },
        get currentPieceVerticalClearance () {
          let points = self.currentPiece.blocks.map(transformDown)
          let result = 0
          while (!pointsHasCollision(points)) {
            points = points.map(transformDown)
            result++
          }
          return result
        },
        get active () {
          return !self.paused && !self.over
        }
      },
      actions: {
        togglePause () {
          if (!self.over) {
            self.paused = !self.paused
          }
        },
        toggleTurbo (value) {
          if (self.active) {
            self.turbo = !!value
          }
        },
        tick () {
          if (self.active) {
            if (!pointsHasCollision(self.currentPiece.blocks.map(transformDown))) {
              self.currentPiece.transform(transformDown)
            } else {
              placePiece()
            }
          }
        },
        rotatePieceClockwise () {
          if (self.active) {
            tryTransformPiece(transformClockwise(self.currentPiece.center))
          }
        },
        rotatePieceCounterClockwise () {
          if (self.active) {
            tryTransformPiece(transformCounterClockwise(self.currentPiece.center))
          }
        },
        movePieceLeft () {
          if (self.active) {
            maybeTransformPiece(transformLeft)
          }
        },
        movePieceRight () {
          if (self.active) {
            maybeTransformPiece(transformRight)
          }
        },
        dropPiece () {
          if (self.active) {
            const deltaY = self.currentPieceVerticalClearance
            self.currentPiece.transform(({x, y}) => ({x, y: y + deltaY}))
            placePiece()
          }
        }
      }
    }
  })

export function createSprintGame () {
  const initialState = {
    currentPiece: createPiece(),
    keyboard: {},
    placedBlocks: [],
  }
  return SprintGame.create(initialState)
}
