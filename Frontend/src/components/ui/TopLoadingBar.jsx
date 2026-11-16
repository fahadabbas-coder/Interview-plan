import { useEffect, useState, useRef } from "react";

const TopLoadingBar = ({ loading }) => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const [duration, setDuration] = useState("0s");
    const [timing, setTiming] = useState("cubic-bezier(0.4, 0, 0.2, 1)");
    const trickleRef = useRef(null);
    const timersRef = useRef([]);
    const wasLoadingRef = useRef(false);

    const clearAll = () => {
        clearInterval(trickleRef.current);
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    useEffect(() => {
        clearAll();

        if (loading) {
            wasLoadingRef.current = true;
            setShow(true);
            setProgress(0);
            setDuration("0s");
            setTiming("cubic-bezier(0.4, 0, 0.2, 1)");

            const t0 = setTimeout(() => {
                setDuration("0.5s");
                setProgress(80);

                const t1 = setTimeout(() => {
                    trickleRef.current = setInterval(() => {
                        setProgress((p) => {
                            if (p >= 95) return p;
                            return p + 1.5;
                        });
                    }, 200);
                }, 520);
                timersRef.current.push(t1);
            }, 20);
            timersRef.current.push(t0);
        } else if (wasLoadingRef.current) {
            wasLoadingRef.current = false;

            setTiming("cubic-bezier(0.65, 0, 0.35, 1)");
            setProgress(100);

            const t2 = setTimeout(() => {
                setShow(false);
                setDuration("0s");
                setProgress(0);
            }, 600);
            timersRef.current.push(t2);
        }

        return clearAll;
    }, [loading]);

    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                zIndex: 999999,
                pointerEvents: "none",
                backgroundColor: "transparent",
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: "#1a73e8",
                    transition: `width ${duration} ${timing}`,
                }}
            />
        </div>
    );
};

export default TopLoadingBar;