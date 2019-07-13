import { useEffect } from 'react'

export function useKeyboardEvents (keyboardKeys, deps) {
  useEffect(() => {
    const keyStates = new Map()
    function handler (event) {
      if (Object.keys(keyboardKeys).includes(event.key)) {
        event.preventDefault()
        const keyboardKey = keyboardKeys[event.key]
        if (event.type === 'keydown') {
          if (!keyStates.has(keyboardKey)) {
            const keyState = keyboardKey.repeatInterval && setInterval(keyboardKey.down, keyboardKey.repeatInterval)
            keyStates.set(keyboardKey, keyState)
            keyboardKey.down()
          }
        }
        if (event.type === 'keyup') {
          if (keyboardKey.repeatInterval) {
            clearInterval(keyStates.get(keyboardKey))
          }
          keyStates.delete(keyboardKey)
          if (keyboardKey.up) {
            keyboardKey.up()
          }
        }
      }
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('keyup', handler)
    }
  }, deps)
}
