import { useEffect } from "react";
import { propagate } from "../utils/evaluate";
import * as CONSTANTS from "../constants/constants";

export function useClocks(
  pauseSim,
  graphRef,
  clockDelaysRef,
  setGraph,
  setClockDelays
) {
  useEffect(() => {
    if (pauseSim) return;

    const intervalId = setInterval(() => {
      const now = performance.now();
      const graph = graphRef.current;
      const oldDelays = clockDelaysRef.current;

      let newGraph = null;
      const changedIds = [];

      const newDelays = oldDelays.map(clock => {
        if (now < clock.next_tick) return clock;

        const node = graph[clock.id];
        if (!node) return clock;

        if (!newGraph) newGraph = graph.slice();
        newGraph[clock.id] = { ...node, value: [!node.value[0]] };
        changedIds.push(clock.id);

        let next = clock.next_tick + clock.delay;
        if (next <= now) next = now + clock.delay; // don't "catch up" after a stall
        return { ...clock, next_tick: next };
      });

      if (!newGraph) return;

      for (const id of changedIds) propagate(newGraph, id);

      graphRef.current = newGraph;
      clockDelaysRef.current = newDelays;

      setGraph(newGraph);
      setClockDelays(newDelays);
    }, CONSTANTS.MIN_FRAME_TIME);

    return () => clearInterval(intervalId);
  }, [pauseSim, clockDelaysRef, graphRef, setClockDelays, setGraph]);
}

export function togglePauseSim({
  pauseSim,
  setPauseSim,
  clockDelaysRef,
  setClockDelays,
  pausedClocksRef,
  setPausedClocks
}) {
  const newPauseState = !pauseSim;
  const now = performance.now();

  if (newPauseState) {
    //pausing
    const remainingTimes = clockDelaysRef.current.map(clock => ({
      id: clock.id,
      remaining: Math.max(0, clock.next_tick - now),
      delay: clock.delay
    }));

    pausedClocksRef.current = remainingTimes;
    setPausedClocks(remainingTimes);
  } else {
    //resuming
    const newClockDelays = clockDelaysRef.current.map(clock => {
      const paused = pausedClocksRef.current.find(
        p => p.id === clock.id
      );

      if (paused) {
        return {
          ...clock,
          next_tick: now + paused.remaining
        };
      }

      return {
        ...clock,
        next_tick: now + clock.delay
      };
    });

    clockDelaysRef.current = newClockDelays;
    setClockDelays(newClockDelays);
  }

  setPauseSim(newPauseState);
}