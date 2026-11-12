import {useEffect, useRef, useState} from "react";

interface TimerProps {
    startTime: number; // in ms
    active: boolean;
    increment: number; // in ms
    onEnd: () => void;
}

export function Timer({startTime, active, increment, onEnd}: TimerProps) {
    const [timer, setTimer] = useState(startTime);
    const remainingRef = useRef(startTime);
    const endedRef = useRef(false);
    const previousActiveRef = useRef(active);
    const onEndRef = useRef(onEnd);

    onEndRef.current = onEnd;

    useEffect(() => {
        remainingRef.current = startTime;
        endedRef.current = false;
        setTimer(startTime);
    }, [startTime]);

    useEffect(() => {
        if (!active || endedRef.current) {
            return;
        }

        let lastTick = Date.now();
        const interval = window.setInterval(() => {
            const now = Date.now();
            remainingRef.current = Math.max(0, remainingRef.current - (now - lastTick));
            lastTick = now;
            setTimer(remainingRef.current);

            if (remainingRef.current === 0 && !endedRef.current) {
                endedRef.current = true;
                onEndRef.current();
            }
        }, 50);

        return () => {
            window.clearInterval(interval);

            if (!endedRef.current) {
                const now = Date.now();
                const remaining = Math.max(0, remainingRef.current - (now - lastTick));
                remainingRef.current = remaining;
                setTimer(remainingRef.current);

                if (remaining === 0) {
                    endedRef.current = true;
                    onEndRef.current();
                }
            }
        };
    }, [active, startTime]);

    useEffect(() => {
        if (previousActiveRef.current && !active && !endedRef.current) {
            remainingRef.current += increment;
            setTimer(remainingRef.current);
        }

        previousActiveRef.current = active;
    }, [active, increment]);

    const format = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor(milliseconds / 1000) % 60;

        if (minutes > 0) {
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }

        const remainingMilliseconds = milliseconds % 1000;
        const centiseconds = Math.floor(remainingMilliseconds / 10);
        return `${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
    }

    return (
        <div className="timer">
            <span className={timer < 60000 ? "alert" : undefined}>
                {format(timer)}
            </span>
        </div>
    )
}