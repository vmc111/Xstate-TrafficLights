import { createMachine, assign } from "xstate";
import { decideNeighbours } from "../constants/constants";

export const trafficLightsMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbdATwKgGUAXdRsAYjPQFdYwBtAAwBdRKDIB7WLka5x+USAAeiALQAmAIwBWEgBYtAgBxqjGgJxmAbAHYBWgDQhqqgMy6BJN2eOGX1w9bWLloAviGOaFh4hKSUNHRMLGAkAE6QADK4UNiMbKjiAG5gAEJYANYA7ugpEIIiSCASUjJyCsoIGpY6ujaGWrpqZgICfg5OqtZmJGZq1lrznSP9hrphERg4BMTkVLT4DMysqRlZOSQEMugUiax5hWAAYuIpVTV1Ck3SsvIN7UGGJC0gQCujMLiMai0Lkczg6GgBahchg0Ri0GhRQMhaxAkU2MR28X2N2SaQgmWyjHO+Eu10O7EUsDpJHQADNWClkCjhkQ2Ljots4nsDkljmTTpSLrgrsT3g1Pi0fqA-v0SCtIVpBnZrJoYaoNC4pgI1JC3IYZmjjNi+VtYrsEkzSeSzpLpXS2Aymaz2ZzhgIedb8YL7SLHeKqTSZRp6mJJF9Wr9EOiNNZAQF9TZOpotIZdQg1AD+mZ0YjgUjkVaNvzbYThUdQxSSCyCK6kncik8XtVasIPrGFW1ENZLC4SF0LJZhtrLMnc6DdCRtS4NLo3GoBgIzNYK1EbQShcTRU7KU38C3bvkiqVMJUu7KY81vgOEGDukDkZZvIjjbm1JZpn14SCSxDAESxdECbc8QFO0iQdE4GxPM96UZEUvTADkuT9XlK13INYJDeCzkQ2kkjvRo+0fBMEFsFMXDA-wzRXawemsH9vBIcxQWnbx3H1FwXEgqs92DOtCOPZsSNuD1ULZdCfW5bCd0DGDaxJMTGwkyNo3Ih94yVRBgjUVVN3hM06K6JdZwnPQlyWKFs2sZdBNwlSDygNIwHwI820eZ5Xm7bT5Uo-SEBUcwjIEId+K0GwmJWXMglVRzAnBAYVh6ZzlJrNyPK88UfKvG83h7OUKL0pRVAGEhjRXTQzC0MxQUXXNgI8GKp0cmxBiBTLoOypl3LATzvOko40I5AwFIDPr9wG3KjzIoLyvaYDPDTIYjX6IcVwSnQ-GTMC6N8X8+l66tZpFagwAoChxAqbyL18ztisCsrFQq0L9SMxEQI-I7dH1YxczCoFpgawYP03I10TO4T8KOK6bruh77kK-zFrep9zCmeYzRfMEXGNeLxgQNwNBIUDLHzQI7HArpYbw1SSER277vy0bknG5BwSmnCsouhHrtZhaSvvON3vaSEpmxs0RhmFcdpJtcOKXeEN0i+ZdDnBnXKZTgeEgNgACU4C4VB+FFnTxafdwASLfwjWnSKAjUYGPw4wZggCfoul0Qwdf6kV9d4CBjdN82+BcV7dIlxMjD-cxtEhAQNF-QJLB-DUOJ8AG+J6DU1ADgXkmDw2TdgM3+DUaPraouiU2TAHjChDcDFdknLBsbOggsSLk1sQvwhxPmZpEkvuBDsOK4jqNexjp8wrsUdQKGVON0chXgahaqvz8FeLI1MIh-wcQIDgBRpqIOfa5ClRVb0AxjFMcdWJJlQ0T20FfG8Ddh2zIux7X37FRdQw4H4QmflYV+sIVADBTCsbwwQiwTg-KsIel84ZM3rDkIBwUPpUz-JCGw05BjGG0BoYGxo-wFyhCYQwh0IYAPhmpMUDYXSSTALg5aiBYrVXaiQz85DgbLgXPqDUVglwGk1qEdBI9zpj0PGGYixIuGx2fKtGYcwtbFi1tOXM2NAQGE6I1fwnQYayKUqPZhJBBrDXFKop8gx5z12xssTcMVoQkyBCOXwPQqb6GGDYGR6xLHyOsSzZG9jSrzxAcrJc1MeIrgaiMH8Rl2qQmXEaZifRgJMKZqXCADiqKaBHMaNwNFsZWAoW-Jc1CwKIhGL+E0Ggj4hCAA */

    context: {
      trafficTimer: 8,
      prevActiveTab: "RED.INTIAL",
      isPaused: false,
    },

    schema: {
      events: {} as
        | { type: "pause"; activeState: any }
        | { type: "play" }
        | { type: "reachWaitingEmoji" }
        | { type: "moveForward" }
        | { type: "moveBackward" }
        | { type: "Resume" },
    },

    initial: "playingState",
    states: {
      playingState: {
        states: {
          redLight: {
            initial: "intialState",
            states: {
              intialState: {
                after: {
                  "1000": [
                    { cond: "checkIsPaused" },
                    {
                      target: "intialState",
                      cond: "timerAboveThree",
                      actions: ["startTimer", "setRedIntial"],
                    },
                    {
                      target: "finalState",
                      actions: ["startTimer", "assignRedFinal"],
                    },
                  ],
                },

                on: {
                  moveForward: {
                    target: "finalState",
                    actions: ["setTimerToThree", "assignRedFinal"],
                  },
                  moveBackward: {
                    target: "#(machine).playingState.yellowLight",
                    actions: ["resetTimer", "setYellow"],
                  },
                  Resume: {
                    target: "intialState",
                    actions: ["setPausedFalse"],
                  },
                },
              },

              finalState: {
                after: {
                  "1000": [
                    { cond: "checkIsPaused" },
                    {
                      target: "finalState",
                      actions: "startTimer",
                      cond: "aboveZero",
                    },
                    {
                      target: "#(machine).playingState.greenLight",
                      actions: ["resetTimer", "setGreen"],
                    },
                  ],
                },

                on: {
                  moveForward: {
                    target: "#(machine).playingState.greenLight",
                    actions: ["resetTimer", "setGreen"],
                  },
                  moveBackward: {
                    target: "intialState",
                    actions: ["resetTimer", "setRedIntial"],
                  },
                  Resume: {
                    target: "finalState",
                    actions: "setPausedFalse",
                  },
                },
              },
            },
          },

          greenLight: {
            after: {
              "5000": [
                { cond: "checkIsPaused" },
                { target: "yellowLight", actions: "setYellow" },
              ],
            },

            on: {
              moveForward: { target: "yellowLight", actions: "setYellow" },
              moveBackward: {
                target: "redLight.finalState",
                actions: ["setTimerToThree", "assignRedFinal"],
              },
            },
          },

          yellowLight: {
            after: {
              "3000": [
                { cond: "checkIsPaused" },
                { target: "redLight", actions: ["setRedIntial", "resetTimer"] },
              ],
            },

            on: {
              moveForward: { target: "redLight", actions: "setRedIntial" },
              moveBackward: { target: "greenLight", actions: "setGreen" },
            },
          },

          paused: {
            on: {
              moveBackward: [
                {
                  target: decideNeighbours("RED.INTIAL")[1],
                  cond: "preRedIntial",
                  actions: ["resetTimer", "setYellow"],
                },
                {
                  target: decideNeighbours("RED.FINAL")[1],
                  cond: "prevRedFinal",
                  actions: ["resetTimer", "setRedIntial"],
                },
                {
                  target: decideNeighbours("GREEN")[1],
                  cond: "preGreen",
                  actions: ["setTimerToThree", "assignRedFinal"],
                },
                {
                  target: decideNeighbours("YELLOW")[1],
                  cond: "preYellow",
                  actions: "setGreen",
                },
              ],
              moveForward: [
                {
                  target: decideNeighbours("RED.INTIAL")[0],
                  cond: "preRedIntial",
                  actions: ["setTimerToThree", "assignRedFinal"],
                },
                {
                  target: decideNeighbours("RED.FINAL")[0],
                  cond: "prevRedFinal",
                  actions: ["resetTimer", "setGreen"],
                },
                {
                  target: decideNeighbours("GREEN")[0],
                  cond: "preGreen",
                  actions: "setYellow",
                },
                {
                  target: decideNeighbours("YELLOW")[0],
                  cond: "preYellow",
                  actions: "setRedIntial",
                },
              ],
            },
          },
        },

        initial: "redLight",

        on: {
          pause: { target: ".paused", actions: "setPreState" },
          Resume: [
            {
              target: ".redLight.intialState",
              cond: "preRedIntial",
              actions: ["setPausedFalse", "startTimer"],
            },
            {
              target: ".yellowLight",
              cond: "preYellow",
              actions: ["setPausedFalse", "startTimer"],
            },
            {
              target: ".greenLight",
              cond: "preGreen",
              actions: "setPausedFalse",
            },
            {
              target: ".redLight.finalState",
              cond: "prevRedFinal",
              actions: "setPausedFalse",
            },
          ],
        },
      },
    },
  },

  {
    actions: {
      startTimer: assign((context, event) => ({
        trafficTimer: context.trafficTimer - 1,
      })),
      resetTimer: assign((context, event) => ({
        trafficTimer: 8,
      })),
      setTimerToThree: assign((context, event) => ({
        trafficTimer: 3,
      })),
      setRedIntial: assign((context, event) => ({
        prevActiveTab: "RED.INTIAL",
        time: 8,
      })),
      assignRedFinal: assign((context, event) => ({
        prevActiveTab: "RED.FINAL",
        time: 8,
      })),
      setYellow: assign((context, event) => ({
        prevActiveTab: "YELLOW",
      })),
      setGreen: assign((context, event) => ({
        prevActiveTab: "GREEN",
      })),
      setPreState: assign((context, event) => {
        let time = 0;
        if (
          context.prevActiveTab === "RED.INTIAL" ||
          context.prevActiveTab === "YELLOW"
        ) {
          time = 8;
        } else if (context.prevActiveTab === "RED.FINAL") {
          time = 3;
        }
        return {
          isPaused: true,
          trafficTimer: time,
        };
      }),
      setPausedFalse: assign((context, event) => ({
        isPaused: false,
      })),
    },
    guards: {
      checkIsPaused: (context, event) => context.isPaused,
      timerAboveThree: (context, event) => context.trafficTimer > 4,
      aboveZero: (context, event) => context.trafficTimer > 1,
      preRedIntial: (context, event) => context.prevActiveTab === "RED.INTIAL",
      prevRedFinal: (context, event) => context.prevActiveTab === "RED.FINAL",
      preGreen: (context, event) => context.prevActiveTab === "GREEN",
      preYellow: (context, event) => context.prevActiveTab === "YELLOW",
    },
  }
);
