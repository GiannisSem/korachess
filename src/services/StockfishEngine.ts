export class StockfishEngine {
    private worker: Worker | null = null;
    private onMoveCallback?: (bestMove: string) => void;
    private onReadyCallback?: () => void;
    private ready = false;

    constructor(workerPath: string = '/stockfish/stockfish-19-lite-single.js') {
        this.worker = new Worker(workerPath);
        this.init();
    }

    private sendCommand(cmd: string): void {
        this.worker?.postMessage(cmd);
    }

    private init(): void {
        if (!this.worker) return;

        this.worker.onmessage = (event: MessageEvent<string>) => {
            const line = event.data;

            if (line === 'readyok') {
                this.ready = true;
                this.onReadyCallback?.();
                return;
            }

            if (line.startsWith('bestmove') && this.onMoveCallback) {
                const move = line.split(' ')[1];
                const onMove = this.onMoveCallback;
                this.onMoveCallback = undefined;
                if (move && move !== '(none)' && move !== '0000') {
                    onMove(move);
                }
            }
        };

        this.sendCommand('uci');
        this.sendCommand('isready');
    }

    public startNewGame(): void {
        this.sendCommand('ucinewgame');
        this.sendCommand('position startpos');
    }

    public setElo(elo: number): void {
        this.sendCommand("setoption name UCI_LimitStrength value true")
        this.sendCommand(`setoption name UCI_Elo value ${elo}`)
    }

    public calculateBestMove(fen: string, depth = 15, onMove: (move: string) => void): void {
        this.onMoveCallback = onMove;
        this.sendCommand(`position fen ${fen}`);
        this.sendCommand(`go depth ${depth}`);
    }

    public setOnReady(callback?: () => void): void {
        this.onReadyCallback = callback;

        if (this.ready && callback) {
            callback();
        }
    }

    public clearOnReady(): void {
        this.onReadyCallback = undefined;
    }

    public isReady(): boolean {
        return this.ready;
    }

    public terminate(): void {
        this.worker?.terminate();
        this.worker = null;
        this.ready = false;
        this.onReadyCallback = undefined;
    }
}