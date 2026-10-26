import { ChessBoard } from './components/ChessBoard';
import themes from './assets/themes.json'

function App() {

  return (
    <>
      <ChessBoard
        //initialFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onEndGame={console.log}
        reversed={false}
        theme={themes[2]}
      />
    </>
  )
}

export default App
