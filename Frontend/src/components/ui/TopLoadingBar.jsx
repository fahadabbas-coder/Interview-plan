import { useEffect, useState, useRef } from "react";

const TopLoadingBar = ({ loading }) => {
    const [state, setState] = useState({ show: false, progress: 0, duration: "0s", timing: "cubic-bezier(0.4, 0, 0.2, 1)" });
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setState({ show: true, progress: 0, duration: "0s", timing: "cubic-bezier(0.4, 0, 0.2, 1)" });

            const t0 = setTimeout(() => {
                setState((s) => ({ ...s, duration: "0.5s", progress: 80 }));

                const t1 = setTimeout(() => {
                    trickleRef.current = setInterval(() => {
                        setState((s) => (s.progress >= 95 ? s : { ...s, progress: s.progress + 1.5 }));
                    }, 200);
                }, 520);
                timersRef.current.push(t1);
            }, 20);
            timersRef.current.push(t0);
        } else if (wasLoadingRef.current) {
            wasLoadingRef.current = false;
            setState((s) => ({ ...s, timing: "cubic-bezier(0.65, 0, 0.35, 1)", progress: 100 }));

            const t2 = setTimeout(() => {
                setState({ show: false, duration: "0s", progress: 0 });
            }, 600);
            timersRef.current.push(t2);
        }

        return clearAll;
    }, [loading]);

    if (!state.show) return null;

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
                    width: `${state.progress}%`,
                    backgroundColor: "#1a73e8",
                    transition: `width ${state.duration} ${state.timing}`,
                }}
            />
        </div>
    );
};

export default TopLoadingBar;