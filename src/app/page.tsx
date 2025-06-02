// 'use client';

// import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";

// interface Player {
//   id: string;
//   name: string;
//   startTime: number | null;
//   endTime: number | null;
//   isFinished: boolean;
// }

// export default function Home() {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [sessionStarted, setSessionStarted] = useState(false);
//   const [rate, setRate] = useState(35000);
//   const [useManualTime, setUseManualTime] = useState(false);
//   const [manualHours, setManualHours] = useState(1);
//   const [manualMinutes, setManualMinutes] = useState(0);
//   const [usePpnPercentage, setUsePpnPercentage] = useState(true);
//   const [ppnValue, setPpnValue] = useState(10);
//   const [now, setNow] = useState(Date.now());

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (sessionStarted && !useManualTime) {
//       interval = setInterval(() => {
//         setNow(Date.now());
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [sessionStarted, useManualTime]);

//   const addPlayer = (name: string) => {
//     const newPlayer: Player = {
//       id: uuidv4(),
//       name,
//       startTime: sessionStarted && !useManualTime ? Date.now() : null,
//       endTime: null,
//       isFinished: false,
//     };
//     setPlayers((prev) => [...prev, newPlayer]);
//   };

//   const deletePlayer = (id: string) => {
//     setPlayers((prev) => prev.filter((p) => p.id !== id));
//   };

//   const renamePlayer = (id: string, name: string) => {
//     setPlayers((prev) =>
//       prev.map((p) => (p.id === id ? { ...p, name } : p))
//     );
//   };

//   const startSession = () => {
//     const startTime = Date.now();
//     setPlayers((prev) =>
//       prev.map((p) => ({
//         ...p,
//         startTime: useManualTime ? null : p.startTime ?? startTime,
//       }))
//     );
//     setSessionStarted(true);
//   };

//   const finishPlayer = (id: string) => {
//     if (useManualTime) return;
//     setPlayers((prev) =>
//       prev.map((p) =>
//         p.id === id ? { ...p, isFinished: true, endTime: Date.now() } : p
//       )
//     );
//   };

//   const resetAll = () => {
//     setPlayers([]);
//     setSessionStarted(false);
//     setNow(Date.now());
//   };

//   const getPlayerDuration = (player: Player) => {
//     if (useManualTime) return 0;
//     if (!player.startTime) return 0;
//     const end = player.isFinished ? player.endTime! : now;
//     return (end - player.startTime) / (1000 * 60 * 60);
//   };

//   const manualTotalDuration = manualHours + manualMinutes / 60;

//   const totalDuration = useManualTime
//     ? manualTotalDuration
//     : players.reduce((sum, p) => sum + getPlayerDuration(p), 0);

//   const totalCost = rate * totalDuration;

//   const totalWithPPN = usePpnPercentage
//     ? totalCost + (totalCost * ppnValue) / 100
//     : totalCost + ppnValue;

//   return (
//     <main className="min-h-screen p-4 bg-gradient-to-br from-sky-100 to-indigo-200 text-gray-800">
//       <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-xl shadow-md">
//         <h1 className="text-3xl font-bold text-center text-indigo-700">Patungan Billiard</h1>

//         <div className="flex items-center justify-between">
//           <label className="font-medium">Input waktu manual:</label>
//           <input
//             type="checkbox"
//             checked={useManualTime}
//             onChange={(e) => setUseManualTime(e.target.checked)}
//             className="scale-125"
//           />
//         </div>

//         {useManualTime && (
//           <div className="flex items-center gap-2">
//             <label>Durasi:</label>
//             <input
//               type="number"
//               value={manualHours || ""}
//               onChange={(e) => setManualHours(Number(e.target.value) || 0)}
//               className="w-16 border p-1 rounded text-center"
//               min={0}
//               placeholder="00"
//             />
//             <span>jam</span>
//             <input
//               type="number"
//               value={manualMinutes || ""}
//               onChange={(e) => setManualMinutes(Number(e.target.value) || 0)}
//               className="w-16 border p-1 rounded text-center"
//               min={0}
//               max={59}
//               placeholder="00"
//             />
//             <span>menit</span>
//           </div>
//         )}

//         <div className="flex items-center justify-between">
//           <label className="font-medium">Gunakan PPN (%):</label>
//           <input
//             type="checkbox"
//             checked={usePpnPercentage}
//             onChange={(e) => setUsePpnPercentage(e.target.checked)}
//             className="scale-125"
//           />
//         </div>

//         <div className="flex gap-2 items-center">
//           <label>PPN:</label>
//           <input
//             type="number"
//             value={ppnValue || ""}
//             onChange={(e) => setPpnValue(Number(e.target.value) || 0)}
//             className="w-24 border p-1 rounded text-center"
//             placeholder="00"
//           />
//           {usePpnPercentage ? <span>%</span> : <span>Rp</span>}
//         </div>

//         <div className="flex gap-2 items-center">
//           <label>Harga per jam:</label>
//           <input
//             type="number"
//             value={rate || ""}
//             onChange={(e) => setRate(Number(e.target.value) || 0)}
//             className="w-32 border p-1 rounded text-center"
//             placeholder="00000"
//           />
//         </div>

//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Nama pemain"
//             className="border p-2 rounded w-full"
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && e.currentTarget.value.trim()) {
//                 addPlayer(e.currentTarget.value.trim());
//                 e.currentTarget.value = "";
//               }
//             }}
//           />
//           <button
//             onClick={startSession}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
//             disabled={sessionStarted || players.length === 0}
//           >
//             Mulai
//           </button>
//         </div>

//         <div className="space-y-2">
//           <h2 className="text-lg font-semibold">Daftar Pemain</h2>
//           {players.map((player) => {
//             const duration = getPlayerDuration(player);
//             const cost = useManualTime
//               ? totalWithPPN / players.length
//               : duration * rate * (usePpnPercentage ? 1 + ppnValue / 100 : 1) +
//                 (!usePpnPercentage ? ppnValue / players.length : 0);

//             return (
//               <div
//                 key={player.id}
//                 className="flex justify-between items-center bg-gray-100 rounded p-2 shadow"
//               >
//                 <div className="flex flex-col w-full">
//                   <input
//                     className="font-semibold text-lg bg-transparent w-full outline-none"
//                     value={player.name}
//                     onChange={(e) => renamePlayer(player.id, e.target.value)}
//                   />
//                   <p className="text-sm text-gray-600">
//                     {useManualTime ? manualTotalDuration.toFixed(2) : duration.toFixed(2)} jam | Rp {cost.toFixed(0)}
//                   </p>
//                 </div>
//                 <div className="flex gap-1">
//                   {!player.isFinished && sessionStarted && !useManualTime && (
//                     <button
//                       onClick={() => finishPlayer(player.id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                       Selesai
//                     </button>
//                   )}
//                   <button
//                     onClick={() => deletePlayer(player.id)}
//                     className="bg-gray-400 text-white px-2 py-1 rounded"
//                   >
//                     Hapus
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {sessionStarted && (
//           <div className="bg-indigo-100 p-4 rounded shadow space-y-2">
//             <p>
//               <strong>Total Waktu:</strong> {totalDuration.toFixed(2)} jam
//             </p>
//             <p>
//               <strong>Total Biaya:</strong> Rp {totalWithPPN.toFixed(0)}
//             </p>
//           </div>
//         )}

//         <button
//           onClick={resetAll}
//           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full"
//         >
//           Reset Semua
//         </button>
//       </div>
//     </main>
//   );
// }

'use client';

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Player {
  id: string;
  name: string;
  startTime: number | null;
  endTime: number | null;
  isFinished: boolean;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [rate, setRate] = useState(35000);
  const [usePpnPercentage, setUsePpnPercentage] = useState(true);
  const [ppnValue, setPpnValue] = useState(10);
  const [now, setNow] = useState(Date.now());
  const [notification, setNotification] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted) {
      interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName.trim(),
      startTime: sessionStarted ? Date.now() : null,
      endTime: null,
      isFinished: false,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayerName("");
    showNotification("Pemain ditambahkan!");
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    showNotification("Pemain dihapus!");
  };

  const renamePlayer = (id: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const startSession = () => {
    const startTime = Date.now();
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        startTime: p.startTime ?? startTime,
      }))
    );
    setSessionStarted(true);
  };

  const finishPlayer = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFinished: true, endTime: Date.now() } : p
      )
    );
  };

  const finishAllPlayers = () => {
    const endTime = Date.now();
    setPlayers((prev) =>
      prev.map((p) =>
        !p.isFinished ? { ...p, isFinished: true, endTime } : p
      )
    );
    showNotification("Sesi telah selesai untuk semua pemain!");
  };

  const resetAll = () => {
    setPlayers([]);
    setSessionStarted(false);
    setNow(Date.now());
    showNotification("Semua data telah direset!");
  };

  const getPlayerDuration = (player: Player) => {
    if (!player.startTime) return 0;
    const end = player.isFinished ? player.endTime! : now;
    return (end - player.startTime) / (1000 * 60 * 60);
  };

  const totalDuration = players.reduce((sum, p) => sum + getPlayerDuration(p), 0);
  const totalCost = rate * totalDuration;
  const totalWithPPN = usePpnPercentage
    ? totalCost + (totalCost * ppnValue) / 100
    : totalCost + ppnValue;

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-sky-100 to-indigo-200 text-gray-800">
      <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700">Patungan Billiard</h1>

        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {notification}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="font-medium">Gunakan PPN (%):</label>
          <input
            type="checkbox"
            checked={usePpnPercentage}
            onChange={(e) => setUsePpnPercentage(e.target.checked)}
            className="scale-125"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>PPN:</label>
          <input
            type="number"
            value={ppnValue || ""}
            onChange={(e) => setPpnValue(Math.max(0, Number(e.target.value) || 0))}
            className="w-24 border p-1 rounded text-center"
            placeholder="00"
          />
          {usePpnPercentage ? <span>%</span> : <span>Rp</span>}
        </div>

        <div className="flex gap-2 items-center">
          <label>Harga per jam:</label>
          <input
            type="number"
            value={rate || ""}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
            className="w-32 border p-1 rounded text-center"
            placeholder="00000"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nama pemain"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addPlayer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
          >
            Tambah
          </button>
          <button
            onClick={startSession}
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
            disabled={sessionStarted || players.length === 0}
          >
            Mulai
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Daftar Pemain</h2>
          {players.map((player) => {
            const duration = getPlayerDuration(player);
            const cost = duration * rate * (usePpnPercentage ? 1 + ppnValue / 100 : 1) + (!usePpnPercentage ? ppnValue / players.length : 0);

            return (
              <div
                key={player.id}
                className="flex justify-between items-center bg-gray-100 rounded p-2 shadow"
              >
                <div className="flex flex-col w-full">
                  <input
                    className="font-semibold text-lg bg-transparent w-full outline-none"
                    value={player.name}
                    onChange={(e) => renamePlayer(player.id, e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    {duration.toFixed(2)} jam | Rp {cost.toFixed(0)}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!player.isFinished && sessionStarted && (
                    <button
                      onClick={() => finishPlayer(player.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Selesai
                    </button>
                  )}
                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {sessionStarted && (
          <div className="bg-indigo-100 p-4 rounded shadow space-y-2">
            <p>
              <strong>Total Waktu:</strong> {totalDuration.toFixed(2)} jam
            </p>
            <p>
              <strong>Total Biaya:</strong> Rp {totalWithPPN.toFixed(0)}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={finishAllPlayers}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
          >
            Selesai Sesi
          </button>
          <button
            onClick={resetAll}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded w-full"
          >
            Reset Semua
          </button>
        </div>
      </div>
    </main>
  );
}