"use client";
import React, { useEffect, useState } from "react";
import { apiUrl } from '@/lib/api';

type ModalProps = {
  onClose: () => void;
};

type Czlonek = {
  id: number;
  imie: string;
  nazwisko: string;
  e_mail: string;
};

function AddMeetingModal({ onClose }: ModalProps) {
  const [nazwa, setNazwa] = useState("");
  const [data, setData] = useState("");
  const [opis, setOpis] = useState("");
  const [idOrganizatora, setIdOrganizatora] = useState<number | "">("");

  const [czlonkowie, setCzlonkowie] = useState<Czlonek[]>([]);
  const [showCzlonkowie, setShowCzlonkowie] = useState(false);
  const [isLoadingCzlonkowie, setIsLoadingCzlonkowie] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  const payload = {
    nazwa,
    data: data ? `${data}T00:00:00` : null,
    opis,
    id_organizatora: idOrganizatora === "" ? null : idOrganizatora,
  };

  const fetchCzlonkowie = async () => {
    try {
      setIsLoadingCzlonkowie(true);
      const res = await fetch(apiUrl("/api/czlonkowie/"));
      const data = await res.json();
      setCzlonkowie(data.results);
    } finally {
      setIsLoadingCzlonkowie(false);
    }
  };

  const addMeeting = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const res = await fetch(apiUrl("/api/spotkania/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        setErrors(responseData);
        return;
      }

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOrganizator = czlonkowie.find(
    (c) => c.id === idOrganizatora
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col p-6 rounded-lg w-[420px]"
      >
        <h2 className="text-xl mb-4 text-[#6D5BD0]">Dodaj spotkanie</h2>

        <input
          type="text"
          placeholder="Nazwa spotkania"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={nazwa}
          onChange={(e) => setNazwa(e.target.value)}
        />
        {errors.nazwa && (
          <p className="text-red-500 text-sm">{errors.nazwa.join(" ")}</p>
        )}

        <input
          type="date"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        {errors.data && (
          <p className="text-red-500 text-sm">{errors.data.join(" ")}</p>
        )}

        {/* ORGANIZATOR */}
        <div className="relative mt-2">
          <input
            type="text"
            readOnly
            placeholder="Organizator spotkania"
            className="border border-gray-300 rounded p-2 w-full cursor-pointer"
            value={
              selectedOrganizator
                ? `${selectedOrganizator.imie} ${selectedOrganizator.nazwisko}`
                : ""
            }
            onClick={() => {
              setShowCzlonkowie(!showCzlonkowie);
              if (czlonkowie.length === 0) fetchCzlonkowie();
            }}
          />

          {showCzlonkowie && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
              {isLoadingCzlonkowie && (
                <div className="p-2 text-sm text-gray-500">Ładowanie...</div>
              )}

              {!isLoadingCzlonkowie &&
                czlonkowie.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 hover:bg-[#F4F2FF] cursor-pointer"
                    onClick={() => {
                      setIdOrganizatora(c.id);
                      setShowCzlonkowie(false);
                    }}
                  >
                    <div className="font-medium">
                      {c.imie} {c.nazwisko}
                    </div>
                    <div className="text-xs text-gray-500">{c.e_mail}</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {errors.id_organizatora && (
          <p className="text-red-500 text-sm">
            {errors.id_organizatora.join(" ")}
          </p>
        )}

        <textarea
          placeholder="Opis"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
        />
        {errors.opis && (
          <p className="text-red-500 text-sm">{errors.opis.join(" ")}</p>
        )}

        <div className="flex w-full justify-between mt-4">
          <button
            disabled={isLoading}
            onClick={addMeeting}
            className="bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0]"
          >
            {isLoading ? "Dodawanie..." : "Dodaj"}
          </button>
          <button
            onClick={onClose}
            className="bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0]"
          >
            Wróć
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMeetingModal;
