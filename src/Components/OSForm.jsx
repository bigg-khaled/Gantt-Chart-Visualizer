import React from "react";
import { useState } from "react";

const OSForm = () => {
  const [numOfProcesses, setNumOfProcesses] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("");

  const [arrival_time, setArrival_time] = useState([]);
  const [priority, setPriority] = useState([]);
  const [burst, setBurst] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function handleSubmit(e) {
    e.preventDefault();

    setProcesses((currentProcesses) => {
      return [
        ...processes,
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
  }

  return (
    <>
      <div className="bg-slate-800 pt-5 h-screen ">
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
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              onClick={handleSubmit}
            >
              Add
            </button>
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
                  {processes.map((process) => {
                    return (
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
                    );
                  })}
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
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <option selected>Choose an algorithm</option>
                <option value="US">FCFS</option>
                <option value="CA">SJB</option>
                <option value="FR">Round Robin</option>
                <option value="DE">Priority</option>
              </select>
            </div>

            <div
              className={` grid-flow-col grid grid-cols-${
                numOfProcesses - 1
              } mt-10 h-10`}
            >
              {processes.map((process) => {
                return (
                  <div
                    className={`${
                      process.id % 2 == 0 ? "bg-slate-50" : "bg-green-500"
                    }`}
                  ></div>
                );
              })}
            </div>
            <hr className="mt-5" />
            <div className={` grid-flow-col grid grid-cols-${3} mt-5`}>
              <div className=" text-left text-white mr-2">4</div>
              <div className=" text-left text-white mr-2">3</div>
              <div className=" text-left text-white mr-2">3</div>
              <div className=" text-left text-white">3</div>
            </div>

            {/* <div className="flex flex-wrap gap-4 mt-5 w-full">
              <div className="bg-slate-50">4</div>
              <div className="text-center flex items-center">Text A</div>
              <div className="bg-green-500 ">3</div>
              <div className="text-center flex items-center">Text B</div>
              <div className="bg-slate-50 ">4</div>
              <div className="text-center flex items-center">Text C</div>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default OSForm;
