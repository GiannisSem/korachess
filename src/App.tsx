import { ChessBoard } from './components/ChessBoard';

function App() {

  return (
    <>
      <ChessBoard
        initialFen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onEndGame={console.log}
      />
    </>
  )
}

export default App
