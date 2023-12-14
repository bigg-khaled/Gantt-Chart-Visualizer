import React from "react";
import { useEffect, useState } from "react";

const OSForm = () => {
  const [numOfProcesses, setNumOfProcesses] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [waitingTimeArray, setWaitingTimeArray] = useState([]);

  const [arrival_time, setArrival_time] = useState("");
  const [priority, setPriority] = useState("");
  const [burst, setBurst] = useState("");

  const burstSum = () => {
    return processes.reduce((sum, process) => sum + parseInt(process.burst), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setProcesses((currentProcesses) => {
      return [
        ...currentProcesses,
        {
          id: numOfProcesses,
          arrival_time: arrival_time,
          priority: priority,
          burst: burst,
        },
      ];
    });

    setArrival_time("");
    setPriority("");
    setBurst("");
    setNumOfProcesses(numOfProcesses + 1);
  };

  const handleReset = () => {
    setButtonPressed(false);
    setProcesses([]);
    setNumOfProcesses(1);
    setWaitingTimeArray([]);
    setArrival_time("");
    setPriority("");
    setBurst("");
    setAlgorithm("");
  };

  const handleWaitingTime = () => {
    let waitingTimeArrayTemp = [];

    waitingTimeArrayTemp = processes.reduce(
      (accumulator, process) => {
        const currentWaitingTime =
          accumulator.length > 0
            ? accumulator[accumulator.length - 1]
            : processes[0].arrival_time;
        const newWaitingTime = currentWaitingTime + Number(process.burst);
        return [...accumulator, newWaitingTime];
      },
      [Number(processes[0].arrival_time)]
    );
    setWaitingTimeArray(waitingTimeArrayTemp);
  };

  const handleAlgorithm = () => {
    setButtonPressed(true);

    if (algorithm === "FCFS") {
      const sortedProcesses = [...processes];
      sortedProcesses.sort((a, b) => a.arrival_time - b.arrival_time);
      setProcesses(sortedProcesses);
    } else if (algorithm === "SJF-P") {
      runSJF_P();
      console.log("Processes at handleAlgorithm is ", processes);
    } else if (algorithm === "P-NP") {
      const sortedProcesses = [...processes].sort(
        (a, b) => b.priority - a.priority
      );
      setProcesses(sortedProcesses);
    }
  };

  const runSJF_P = () => {
    let minArrivalTimeProcess = Math.min(
      ...processes.map((process) => Number(process.arrival_time))
    );

    const burstTotal = processes.reduce(
      (sum, process) => sum + Number(process.burst),
      0
    );
    const minArrivalTime = Math.min(
      ...processes.map((process) => Number(process.arrival_time))
    );

    let maxArrivalTimeProcess = burstTotal + minArrivalTime;

    let queuedProcesses = [];
    let organizedProcesses = [];
    let totalBurstTime = Number(minArrivalTimeProcess);

    console.log("min", minArrivalTimeProcess);
    console.log("max", maxArrivalTimeProcess);

    console.log("start for loop");
    for (
      let t = Number(minArrivalTimeProcess);
      t <= Number(maxArrivalTimeProcess);
      t++
    ) {
      console.log("Increment", t);

      //find index of first process with arrival time == t
      const foundProcesses = processes.filter(
        (process) => Number(process.arrival_time) === t
      );

      if (foundProcesses.length > 0) {
        console.log("Processes found at", t);
        console.log("The found objects are", foundProcesses);

        for (let x = 0; x < queuedProcesses.length; x++) {
          console.log("queuedProcess before", x, " ", queuedProcesses[x]);
        }

        queuedProcesses.push(...foundProcesses);

        for (let x = 0; x < queuedProcesses.length; x++) {
          console.log("queuedProcess after", x, " ", queuedProcesses[x]);
        }
      }

      console.log("Total burst time at if is", totalBurstTime);
      console.log("t is", t);
      console.log(queuedProcesses.length);

      if (totalBurstTime === t && queuedProcesses.length > 0) {
        console.log("found burst overlap", queuedProcesses[0]);
        for (let x = 0; x < queuedProcesses.length; x++) {
          console.log("queuedProcess in if ", x, " ", queuedProcesses[x]);
        }
        for (let x = 0; x < organizedProcesses.length; x++) {
          console.log(
            "Organized processes in if",
            x,
            " ",
            organizedProcesses[x]
          );
        }
        //sort queuedProcesses by burst time
        queuedProcesses.sort((a, b) => a.burst - b.burst);
        //add to organizedProcesses
        organizedProcesses.push(queuedProcesses[0]);

        totalBurstTime += Number(queuedProcesses[0].burst);
        //remove from queuedProcesses
        queuedProcesses.shift();
        console.log("finished adding queue");
      }

      for (let x = 0; x < organizedProcesses.length; x++) {
        console.log(
          "Organized processes at end",
          x,
          "for increment ",
          t,
          " ",
          organizedProcesses[x]
        );
      }
    }
    setProcesses(organizedProcesses);
    console.log("organized", organizedProcesses);
    console.log("processes", processes);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (buttonPressed) {
      handleWaitingTime();
    }
  }, [waitingTimeArray, buttonPressed]);

  return (
    <>
      <div className="bg-slate-800 pt-5 min-h-screen max-h-full">
        <div className="w-1/2 flex mx-auto ">
          <form onSubmit={handleSubmit} className="new-item-form">
            <div className="form-row">
              <div class="mb-6">
                <div class="grid grid-cols-4 gap-4">
                  <label
                    for="text"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white my-auto"
                  >
                    Enter new process:
                  </label>
                  <input
                    type="text"
                    id="arrival_time"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Arrival Time"
                    value={arrival_time}
                    onChange={(e) => setArrival_time(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="processes"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    id="processes"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Burst Time"
                    value={burst}
                    onChange={(e) => setBurst(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>

            <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Process Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Arrival Time
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Priority
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Burst
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processes
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((process) => (
                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          P{process.id}
                        </th>
                        <td class="px-6 py-4">{process.arrival_time}</td>
                        <td class="px-6 py-4">{process.priority}</td>
                        <td class="px-6 py-4">{process.burst}</td>
                      </tr>
                    ))}

                  {numOfProcesses == 1 && (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td
                        colSpan="4"
                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        No Processes yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select an algorithm
              </label>
              <select
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value);
                }}
              >
                <option selected>Choose an algorithm</option>
                <option value="FCFS">FCFS</option>
                <option value="SJF-P">SJF Preemptive</option>
                <option value="SJF-NP">SJF Non-Preemptive</option>
                <option value="RR">Round Robin</option>
                <option value="P-P">Priority Preemptive</option>
                <option value="P-NP">Priority Non-Preemptive</option>
              </select>
            </div>

            <div className="text-right mt-5">
              <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={() => {
                  handleAlgorithm();
                }}
              >
                Generate
              </button>
            </div>

            <div className="flex flex-row mt-10 h-10">
              {buttonPressed &&
                processes.map((process, index) => {
                  return (
                    <div
                      className={`${
                        index % 2 == 0 ? "bg-slate-500" : "bg-slate-600"
                      }`}
                      style={{
                        width: `${(process.burst / burstSum()) * 100}%`,
                      }}
                    >
                      <p className="">P{process.id}</p>
                    </div>
                  );
                })}
            </div>
            {buttonPressed && <hr className="mt-5" />}
            <div className="flex flex-row h-10">
              {waitingTimeArray.map((waitingTime, index) => {
                const process = processes[index];

                return (
                  <div
                    className="text-left text-white "
                    style={
                      index !== waitingTimeArray.length - 1
                        ? { width: `${(process.burst / burstSum()) * 100}%` }
                        : {}
                    }
                  >
                    {waitingTime}
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OSForm;
