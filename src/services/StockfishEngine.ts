export class StockfishEngine {
    private static readonly MIN_ELO = 700;
    private static readonly MAX_ELO = 3150;
    private static readonly MAX_MULTI_PV = 5;

    private worker: Worker | null = null;
    private onMoveCallback?: (bestMove: string) => void;
    private onReadyCallback?: () => void;
    private multiPV = 1;
    private candidateDepth = 0;
    private candidateMoves = new Map<number, string>();
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

            this.captureCandidate(line);

            if (line.startsWith('bestmove') && this.onMoveCallback) {
                const bestMove = line.split(' ')[1];
                const onMove = this.onMoveCallback;
                this.onMoveCallback = undefined;
                const move = this.selectCandidateMove(bestMove);
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
        if (!Number.isFinite(elo) || elo < 0) {
            throw new RangeError('Elo must be a finite, non-negative number.');
        }

        const progress = Math.max(
            0,
            Math.min(
                1,
                (elo - StockfishEngine.MIN_ELO)
                    / (StockfishEngine.MAX_ELO - StockfishEngine.MIN_ELO),
            ),
        );
        this.multiPV = Math.round(
            StockfishEngine.MAX_MULTI_PV - progress * (StockfishEngine.MAX_MULTI_PV - 1),
        );
        this.sendCommand(`setoption name MultiPV value ${this.multiPV}`);
    }

    public calculateBestMove(fen: string, depth = 15, onMove: (move: string) => void): void {
        this.onMoveCallback = onMove;
        this.candidateDepth = 0;
        this.candidateMoves.clear();
        this.sendCommand(`position fen ${fen}`);
        this.sendCommand(`go depth ${depth}`);
    }

    private captureCandidate(line: string): void {
        if (!line.startsWith('info ')) return;

        const depth = Number(/\bdepth (\d+)\b/.exec(line)?.[1]);
        const multipv = Number(/\bmultipv (\d+)\b/.exec(line)?.[1] ?? 1);
        const move = /\bpv ([a-h][1-8][a-h][1-8][qrbn]?)/.exec(line)?.[1];
        if (!depth || !move || multipv > this.multiPV) return;

        if (depth > this.candidateDepth) {
            this.candidateDepth = depth;
            this.candidateMoves.clear();
        }
        if (depth === this.candidateDepth) {
            this.candidateMoves.set(multipv, move);
        }
    }

    private selectCandidateMove(bestMove: string | undefined): string | undefined {
        if (this.multiPV === 1 || this.candidateMoves.size < 2) return bestMove;

        const candidates = [...this.candidateMoves.entries()]
            .sort(([rankA], [rankB]) => rankA - rankB)
            .map(([, move]) => move);
        const index = Math.floor(Math.random() ** 2 * candidates.length);
        return candidates[index] ?? bestMove;
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