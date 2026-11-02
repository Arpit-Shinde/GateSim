import { useEffect } from "react";
import { propagate } from "../utils/evaluate";
import * as CONSTANTS from "../constants/constants";

export function useClocks(
    pauseSim,
    graphRef,
    clockDelaysRef,
    setGraph,
    setClockDelays
){
    useEffect(() => { //for clocks
    
        if (pauseSim) return;
    
        const intervalId = setInterval(() => {
    
          const now = performance.now();
    
          const graph = graphRef.current;
          const old_clock_delays = clockDelaysRef.current; 
          let changed = false;
          const changedClockIds = [];
    
          const newClockDelays = old_clock_delays.map(clock => {
    
            if (now >= clock.next_tick) {
    
              const clockNode = graph[clock.id];
    
              if (!clockNode) return clock;
          
              clockNode.value[0] = !clockNode.value[0];
    
              changed = true;
              changedClockIds.push(clock.id);
    
              return {
                ...clock,
                next_tick: clock.next_tick + clock.delay
              };
            }
    
            return clock;
          });
    
          if (!changed) return;
    
          const newGraph = structuredClone(graph);
    
          // Propagate only from clocks that toggled.
          for (const clockId of changedClockIds) {
            let [steps, evaluates] = propagate(newGraph, clockId);
            // console.log("Propagation steps:", steps);
            // console.log("Number of evaluations:", evaluates);
    
          }
    
          graphRef.current = newGraph;
          clockDelaysRef.current = newClockDelays;
    
          setGraph(newGraph);
          setClockDelays(newClockDelays);
    
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