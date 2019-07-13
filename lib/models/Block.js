import { types } from 'mobx-state-tree'
import { randomInt } from '../util'

export const Block = types.model('Block', {
  id: types.number,
  x: types.number,
  y: types.number,
  color: types.string
})

export function createBlock ({x, y, color}) {
  return {
    id: randomInt(2 ** 24),
    x,
    y,
    color,
  }
}
