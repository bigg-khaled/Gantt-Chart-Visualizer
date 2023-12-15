import React from "react";
import { useEffect, useState } from "react";

const OSForm = () => {
  const [numOfProcesses, setNumOfProcesses] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);
  const [waitingTimeArray, setWaitingTimeArray] = useState([]);
  const processedIds = new Set();

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
    } else if (algorithm === "SJF-NP") {
      runSJF_NP();
      console.log("Processes at handleAlgorithm is ", processes);
    } else if (algorithm === "P-NP") {
      runPriority_NP();
    } else if (algorithm === "SJF-P") {
      runSJF_P();
    } else if (algorithm === "P-P") {
      runPriority_P();
    }
  };

  const runSJF_NP = () => {
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

    for (
      let t = Number(minArrivalTimeProcess);
      t <= Number(maxArrivalTimeProcess);
      t++
    ) {
      //find index of first process with arrival time == t
      const foundProcesses = processes.filter(
        (process) => Number(process.arrival_time) === t
      );

      if (foundProcesses.length > 0) {
        queuedProcesses.push(...foundProcesses);
      }

      if (totalBurstTime === t && queuedProcesses.length > 0) {
        //sort queuedProcesses by burst time
        queuedProcesses.sort((a, b) => a.burst - b.burst);
        //add to organizedProcesses
        organizedProcesses.push(queuedProcesses[0]);

        totalBurstTime += Number(queuedProcesses[0].burst);
        //remove from queuedProcesses
        queuedProcesses.shift();
      }
    }
    setProcesses(organizedProcesses);
  };
  const runPriority_NP = () => {
    // Assuming processes is an array of objects with properties: process_id, priority, arrival_time, and burst_time

    // Sort processes by priority (lower number means higher priority)
    processes.sort((a, b) => a.priority - b.priority);

    let completionTime = 0;
    let turnaroundTimes = [];
    let waitingTimes = [];
    let responseTimes = [];

    processes.forEach((process) => {
      completionTime += process.burst_time;
      turnaroundTimes.push(completionTime - process.arrival_time);
      waitingTimes.push(
        turnaroundTimes[turnaroundTimes.length - 1] - process.burst_time
      );
      responseTimes.push(
        waitingTimes[waitingTimes.length - 1] - process.arrival_time
      );
    });

    // Display results
    console.log(
      "Process\tPriority\tArrival Time\tBurst Time\tCompletion Time\tTurnaround Time\tWaiting Time\tResponse Time"
    );
    processes.forEach((process, index) => {
      console.log(
        `${process.process_id}\t${process.priority}\t\t${process.arrival_time}\t\t${process.burst_time}\t\t${completionTime}\t\t${turnaroundTimes[index]}\t\t${waitingTimes[index]}\t\t${responseTimes[index]}`
      );
    });
  };
  const runSJF_P = () => {
    let processesCopy = processes.map((process) => ({
      ...process,
      remainingBurstTime: Number(process.burst),
    }));

    for (let i = 0; i < processesCopy.length; i++) {
      console.log("processesCopy", i, processesCopy[i]);
    }

    let minArrivalTimeProcess = Math.min(
      ...processesCopy.map((process) => Number(process.arrival_time))
    );

    const burstTotal = processesCopy.reduce(
      (sum, process) => sum + Number(process.burst),
      0
    );
    const minArrivalTime = Math.min(
      ...processesCopy.map((process) => Number(process.arrival_time))
    );

    let maxArrivalTimeProcess = burstTotal + minArrivalTime;

    let queuedProcesses = [];
    let organizedProcesses = [];
    let totalBurstTime = Number(minArrivalTimeProcess);

    for (
      let t = Number(minArrivalTimeProcess);
      t <= Number(maxArrivalTimeProcess);
      t++
    ) {
      console.log("t", t);
      //find index of first process with arrival time == t
      const foundProcesses = processesCopy.filter(
        (process) => Number(process.arrival_time) === t
      );

      if (foundProcesses.length > 0) {
        queuedProcesses.push(...foundProcesses);
      }

      if (queuedProcesses.length > 0) {
        //sort queuedProcesses by burst time
        queuedProcesses.sort(
          (a, b) => a.remainingBurstTime - b.remainingBurstTime
        );

        //add to organizedProcesses
        organizedProcesses.push(queuedProcesses[0]);

        for (let i = 0; i < organizedProcesses.length; i++) {
          console.log("organized process", i, organizedProcesses[i]);
        }
        for (let i = 0; i < queuedProcesses.length; i++) {
          console.log("queued process", i, queuedProcesses[i]);
        }
        totalBurstTime += 1;
        //remove from queuedProcesses
        if (queuedProcesses[0].remainingBurstTime > 1) {
          queuedProcesses[0].remainingBurstTime -= 1;
        } else {
          queuedProcesses.shift();
        }
      }
    }

    let finalProcesses = [];

    let currentProcess = organizedProcesses[0];
    currentProcess.burst = 1;

    for (let i = 1; i < organizedProcesses.length; i++) {
      const current = organizedProcesses[i];
      const previous = organizedProcesses[i - 1];

      if (
        current.id === previous.id &&
        current.arrival_time === previous.arrival_time &&
        current.priority === previous.priority
      ) {
        // Consecutive duplicate, update burst
        currentProcess.burst += 1;
      } else {
        // Not a consecutive duplicate, push the current process and start a new one
        finalProcesses.push({ ...currentProcess });
        currentProcess = { ...current };
        currentProcess.burst = 1;
      }
    }

    // Push the last process
    finalProcesses.push({ ...currentProcess });
    setProcesses(finalProcesses);
  };
  const runPriority_P = () => {
    let processesCopy = processes.map((process) => ({
      ...process,
      remainingBurstTime: Number(process.burst),
    }));

    let minArrivalTimeProcess = Math.min(
      ...processesCopy.map((process) => Number(process.arrival_time))
    );

    const burstTotal = processesCopy.reduce(
      (sum, process) => sum + Number(process.burst),
      0
    );
    const minArrivalTime = Math.min(
      ...processesCopy.map((process) => Number(process.arrival_time))
    );

    let maxArrivalTimeProcess = burstTotal + minArrivalTime;

    let queuedProcesses = [];
    let organizedProcesses = [];
    let totalBurstTime = Number(minArrivalTimeProcess);

    for (
      let t = Number(minArrivalTimeProcess);
      t <= Number(maxArrivalTimeProcess);
      t++
    ) {
      //find index of first process with arrival time == t
      const foundProcesses = processesCopy.filter(
        (process) => Number(process.arrival_time) === t
      );

      if (foundProcesses.length > 0) {
        queuedProcesses.push(...foundProcesses);
      }

      if (queuedProcesses.length > 0) {
        //sort queuedProcesses by burst time
        queuedProcesses.sort((a, b) => Number(a.priority) - Number(b.priority));
        console.log(
          "At t = ",
          t,
          "the highest priority is",
          queuedProcesses[0]
        );
        for (let i = 0; i < queuedProcesses.length; i++) {
          console.log("queue number", i, "is", queuedProcesses[i]);
        }
        //add to organizedProcesses
        organizedProcesses.push(queuedProcesses[0]);

        totalBurstTime += 1;
        //remove from queuedProcesses
        if (queuedProcesses[0].remainingBurstTime > 1) {
          queuedProcesses[0].remainingBurstTime -= 1;
        } else {
          queuedProcesses.shift();
        }
      }
    }

    let finalProcesses = [];

    let currentProcess = organizedProcesses[0];
    currentProcess.burst = 1;

    for (let i = 1; i < organizedProcesses.length; i++) {
      const current = organizedProcesses[i];
      const previous = organizedProcesses[i - 1];

      if (
        current.id === previous.id &&
        current.arrival_time === previous.arrival_time &&
        current.priority === previous.priority
      ) {
        // Consecutive duplicate, update burst
        currentProcess.burst += 1;
      } else {
        // Not a consecutive duplicate, push the current process and start a new one
        finalProcesses.push({ ...currentProcess });
        currentProcess = { ...current };
        currentProcess.burst = 1;
      }
    }

    // Push the last process
    finalProcesses.push({ ...currentProcess });
    setProcesses(finalProcesses);
  };

  const sumClones = (clonedProcesses) => {
    if (Array.isArray(clonedProcesses)) {
      let counter = 1;
      const result = [];

      for (let i = 0; i < clonedProcesses.length; i++) {
        const process = clonedProcesses[i];
        const isClone = i > 0 && process.id === clonedProcesses[i - 1].id;

        if (isClone) {
          result[result.length - 1].burst += process.burst;
        } else {
          if (counter > 1) {
            // Divide process.burst only if it's not the first occurrence
            process.burst /= counter;
          }

          result.push({ ...process });
          counter = 1;
        }

        counter++; // Increment counter for each process
      }

      return result;
    }
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
                  {numOfProcesses > 1 &&
                    processes
                      .slice()
                      .sort((a, b) => a.id - b.id) // Sort the processes by id
                      .map((process) => {
                        if (!processedIds.has(process.id)) {
                          processedIds.add(process.id);
                          return (
                            <tr
                              key={process.id} // Ensure each element has a unique key
                              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
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
                          );
                        }
                        return null; // Skip rendering for duplicate ids
                      })}

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
                numOfProcesses > 1 &&
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
              {numOfProcesses > 1 &&
                buttonPressed &&
                waitingTimeArray.map((waitingTime, index) => {
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
