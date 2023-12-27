export const runFCFS = (processes) => {
  const sortedProcesses = [...processes];
  sortedProcesses.sort((a, b) => a.arrival_time - b.arrival_time);
  return sortedProcesses;
};

export const runSJF_NP = (processes) => {
  let minArrivalTimeProcess = Math.min(
    ...processes.map((process) => Number(process.arrival_time))
  );

  const burstTotal = processes.reduce(
    (sum, process) => sum + Number(process.burst),
    0
  );

  let maxArrivalTimeProcess = burstTotal + minArrivalTimeProcess;

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
  return organizedProcesses;
};
export const runPriority_NP = (processes) => {
  let minArrivalTimeProcess = Math.min(
    ...processes.map((process) => Number(process.arrival_time))
  );

  const burstTotal = processes.reduce(
    (sum, process) => sum + Number(process.burst),
    0
  );
  // const minArrivalTime = Math.min(
  //   ...processes.map((process) => Number(process.arrival_time))
  // );

  let maxArrivalTimeProcess = burstTotal + minArrivalTimeProcess;

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
      queuedProcesses.sort((a, b) => b.priority - a.priority);
      //add to organizedProcesses
      organizedProcesses.push(queuedProcesses[0]);

      totalBurstTime += Number(queuedProcesses[0].burst);
      //remove from queuedProcesses
      queuedProcesses.shift();
    }
  }
  return organizedProcesses;
};
export const runSJF_P = (processes) => {
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
      queuedProcesses.sort(
        (a, b) => a.remainingBurstTime - b.remainingBurstTime
      );

      //add to organizedProcesses
      organizedProcesses.push(queuedProcesses[0]);

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
  return finalProcesses;
};
export const runPriority_P = (processes) => {
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
      queuedProcesses.sort((a, b) => Number(b.priority) - Number(a.priority));

      //add to organizedProcesses
      organizedProcesses.push(queuedProcesses[0]);

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
  return finalProcesses;
};
export const runRoundRobin = (processes, timeQuantum) => {
  let processesCopy = processes.map((process) => ({
    ...process,
    remainingBurstTime: Number(process.burst),
  }));

  let queuedProcesses = [];
  let organizedProcesses = [];
  queuedProcesses = processesCopy;

  let counter = 0;

  while (queuedProcesses.length > 0) {
    if (queuedProcesses[counter].remainingBurstTime - timeQuantum <= 0) {
      if (
        queuedProcesses[counter].id ===
        organizedProcesses[organizedProcesses.length - 1]?.id
      ) {
        organizedProcesses[organizedProcesses.length - 1].burst +=
          queuedProcesses[counter].burst % timeQuantum || timeQuantum;
        queuedProcesses.splice(counter, 1);
      } else {
        queuedProcesses[counter].burst =
          queuedProcesses[counter].burst % timeQuantum || timeQuantum;
        organizedProcesses.push(queuedProcesses[counter]);
        queuedProcesses.splice(counter, 1);
      }
    } else {
      if (
        queuedProcesses[counter].id ===
        organizedProcesses[organizedProcesses.length - 1]?.id
      ) {
        organizedProcesses[organizedProcesses.length - 1].burst += timeQuantum;
      } else {
        queuedProcesses[counter].remainingBurstTime -= timeQuantum;
        const pushedProcess = { ...queuedProcesses[counter] };
        pushedProcess.burst = timeQuantum;
        organizedProcesses.push(pushedProcess);
      }
      counter++;
    }
    if (counter > queuedProcesses.length - 1) {
      counter = 0;
    }
  }

  return organizedProcesses;
};

export const getUniqueProcesses = (processes) => {
  const uniqueProcessesMap = new Map();

  processes.forEach((process) => {
    uniqueProcessesMap.set(process.id, process);
  });

  return Array.from(uniqueProcessesMap.values());
};

export const findLastInstanceById = (array, targetId) => {
  let lastInstance = null;

  for (let i = array.length - 1; i >= 0; i--) {
    const current = array[i];
    if (current.id === targetId) {
      lastInstance = current;
      break;
    }
  }

  return lastInstance;
};
