import React, { useEffect, useState } from "react";
import { apiUrl } from '@/lib/api';

type Spotkanie = {
  id: number;
  nazwa: string;
  data: string; 
};

type ObecnoscRecord = {
  id: number;
  czlonek_email: string;
  spotkanie_data: string;
  czy_obecny: boolean;
};

type ResultProps = {
  spotkania: Spotkanie[];
  id: number; 
  czlonek_imie: string;
  czlonek_email: string;
};


function Result({
  spotkania,
  czlonek_imie,
  czlonek_email,
}: ResultProps) {

  const [presence, setPresence] = useState<
    Record<string, ObecnoscRecord>
  >({});

  const formatDate = (iso: string) => iso.slice(0, 10);

  useEffect(() => {
    const fetchAllPresence = async () => {
      try {
        let url = apiUrl("/api/widok-obecnosci/");
        const allResults: any[] = [];

        while (url) {
          const res = await fetch(url);
          const data = await res.json();

          allResults.push(...data.results);
          url = data.next; 
        }

        const map: Record<string, ObecnoscRecord> = {};

        allResults.forEach(r => {
          const key = `${r.czlonek_email}|${r.spotkanie_data.slice(0, 10)}`;
          map[key] = r;
        });

      console.log("PRESENCE MAP:", map);
      console.log(
        "PRESENCE KEYS:",
        Object.keys(map)
      );

        setPresence(map);
      } catch (err) {
        console.error("Błąd pobierania obecności:", err);
      }
    };

    fetchAllPresence();
  }, []);


  const fetchAllWidokObecnosci = async () => {
  let url = apiUrl("/api/widok-obecnosci/");
  const allResults: any[] = [];

  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    allResults.push(...data.results);
    url = data.next;
  }

  return allResults;
};


const togglePresence = async (dataSpotkania: string) => {
  try {
    const allRecords = await fetchAllWidokObecnosci();

    const record = allRecords.find(
      (r: any) =>
        r.czlonek_email === czlonek_email &&
        formatDate(r.spotkanie_data) === formatDate(dataSpotkania)
    );

    if (!record) {
      console.warn(
        "Nie znaleziono rekordu w widok-obecnosci:",
        czlonek_email,
        dataSpotkania
      );
      return;
    }

    const newValue = !record.czy_obecny;

    const res = await fetch(
      apiUrl(`/api/obecnosci/${record.id}/`),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          czy_obecny: newValue,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("PATCH STATUS:", res.status);
      console.error("PATCH RESPONSE:", text);
      return;
    }

    const key = `${czlonek_email}|${formatDate(dataSpotkania)}`;

    setPresence(prev => ({
      ...prev,
      [key]: {
        id: record.id,
        czlonek_email: record.czlonek_email,
        spotkanie_data: record.spotkanie_data,
        czy_obecny: newValue,
      },
    }));
  } catch (err) {
    console.error("Błąd togglePresence:", err);
  }
};


  return (
    <div>
      <div className="flex p-2 px-4 border-b border-gray-200 text-[#6E6893] items-center">
        <div className="w-60">
          <div className="text-[#25213B] text-md">
            {czlonek_imie}
          </div>
          <div>{czlonek_email}</div>
        </div>

        {spotkania.map(spotkanie => {
          const key = `${czlonek_email}|${formatDate(
            spotkanie.data
          )}`;
          const record = presence[key];

          return (
            <div
              key={spotkanie.id}
              className="pt-1 w-30 flex justify-center"
            >
              <input
                type="checkbox"
                checked={record?.czy_obecny ?? false}
                onChange={() =>
                  togglePresence(spotkanie.data)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Result;
