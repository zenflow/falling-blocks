import {SprintGame} from '../lib/components/SprintGame'
import NoSSR from 'react-no-ssr'

export default function Home () {
  return (
    <main style={{
      fontFamily: "'Press Start 2P', cursive",
    }}>
      <h1 style={{textAlign: 'center'}}>
        Falling Blocks
      </h1>
      <div style={{
        margin: '12px auto',
        width: '400px',
        textAlign: 'center',
      }}>
        <NoSSR>
          <SprintGame/>
        </NoSSR>
      </div>
    </main>
  )
}
