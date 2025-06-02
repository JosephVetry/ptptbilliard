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
  const [useManualTime, setUseManualTime] = useState(false);
  const [manualHours, setManualHours] = useState(1);
  const [manualMinutes, setManualMinutes] = useState(0);
  const [usePpnPercentage, setUsePpnPercentage] = useState(true);
  const [ppnValue, setPpnValue] = useState(10); // bisa persen atau nominal
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && !useManualTime) {
      interval = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted, useManualTime]);

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      startTime: sessionStarted && !useManualTime ? Date.now() : null,
      endTime: null,
      isFinished: false,
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const startSession = () => {
    const startTime = Date.now();
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        startTime: useManualTime ? null : (p.startTime ?? startTime),
      }))
    );
    setSessionStarted(true);
  };

  const finishPlayer = (id: string) => {
    if (useManualTime) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFinished: true, endTime: Date.now() } : p
      )
    );
  };

  const resetAll = () => {
    setPlayers([]);
    setSessionStarted(false);
    setNow(Date.now());
  };

  const getPlayerDuration = (player: Player) => {
    if (useManualTime) {
      return manualHours + manualMinutes / 60;
    }

    if (!player.startTime) return 0;
    const end = player.isFinished ? player.endTime! : now;
    return (end - player.startTime) / (1000 * 60 * 60);
  };

  const totalDuration = players.reduce(
    (sum, p) => sum + getPlayerDuration(p),
    0
  );

  const totalCost = rate * totalDuration;

  const totalWithPPN = usePpnPercentage
    ? totalCost + (totalCost * ppnValue) / 100
    : totalCost + ppnValue;

  return (
    <main className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Aplikasi Patungan Billiard</h1>

        <div className="flex items-center gap-2">
          <label>Gunakan input waktu manual:</label>
          <input
            type="checkbox"
            checked={useManualTime}
            onChange={(e) => setUseManualTime(e.target.checked)}
          />
        </div>

        {useManualTime && (
          <div className="flex items-center gap-2">
            <label>Durasi:</label>
            <input
              type="number"
              value={manualHours}
              onChange={(e) => setManualHours(Number(e.target.value))}
              className="w-16 border p-1 rounded"
              min={0}
            />
            <span>jam</span>
            <input
              type="number"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(Number(e.target.value))}
              className="w-16 border p-1 rounded"
              min={0}
              max={59}
            />
            <span>menit</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label>Gunakan PPN (%):</label>
          <input
            type="checkbox"
            checked={usePpnPercentage}
            onChange={(e) => setUsePpnPercentage(e.target.checked)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <label>PPN:</label>
          <input
            type="number"
            value={ppnValue}
            onChange={(e) => setPpnValue(Number(e.target.value))}
            className="w-24 border p-1 rounded"
          />
          {usePpnPercentage ? <span>%</span> : <span>Rp</span>}
        </div>

        <div className="flex gap-2 items-center">
          <label>Harga per jam:</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-32 border p-1 rounded"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nama pemain"
            className="border p-2 rounded w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                addPlayer(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
          <button
            onClick={startSession}
            className="bg-green-500 text-white px-4 rounded"
            disabled={sessionStarted || players.length === 0}
          >
            Mulai Sesi
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Daftar Pemain</h2>
          {players.map((player) => {
            const duration = getPlayerDuration(player);
            const cost =
              (duration * rate * (usePpnPercentage ? (1 + ppnValue / 100) : 1)) +
              (usePpnPercentage ? 0 : ppnValue / players.length);

            return (
              <div
                key={player.id}
                className="flex justify-between items-center bg-white rounded shadow p-2"
              >
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-gray-600">
                    {duration.toFixed(2)} jam | Rp {cost.toFixed(0)}
                  </p>
                </div>
                {!player.isFinished && sessionStarted && !useManualTime && (
                  <button
                    onClick={() => finishPlayer(player.id)}
                    className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Selesai
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {sessionStarted && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <p>
              <strong>Total Waktu:</strong> {totalDuration.toFixed(2)} jam
            </p>
            <p>
              <strong>Total Biaya:</strong> Rp {totalWithPPN.toFixed(0)}
            </p>
          </div>
        )}

        <button
          onClick={resetAll}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
