"use client";
import React, { useEffect, useState } from "react";
import { apiUrl } from '@/lib/api';

type ModalProps = {
  onClose: () => void;
  mode: "add" | "edit";
  partner?: any;
};
type Czlonek = {
  id: number;
  imie: string;
  nazwisko: string;
  e_mail: string;
};
type Status = {
  id: number;
  nazwa: string;
  opis: string;
};


function AddPartnerModal({ onClose, mode, partner }: ModalProps) {
  const [nazwa, setNazwa] = useState("");
  const [numerTelefonu, setNumerTelefonu] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [osobaOdpowiedzialna, setOsobaOdpowiedzialna] = useState<number | "">("");
  const [przychod, setPrzychod] = useState<number | "">("");
  const [odpowiedz, setOdpowiedz] = useState<number | "">("");
  const [opis, setOpis] = useState("");
  const [czlonkowie, setCzlonkowie] = useState<Czlonek[]>([]);
  const [showCzlonkowie, setShowCzlonkowie] = useState(false);
  const [isLoadingCzlonkowie, setIsLoadingCzlonkowie] = useState(false);
  const [statusy, setStatusy] = useState<Status[]>([]);
  const [showStatusy, setShowStatusy] = useState(false);
  const [isLoadingStatusy, setIsLoadingStatusy] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  const payload = {
    nazwa,
    numer_telefonu: numerTelefonu === "" ? null : numerTelefonu,
    e_mail: email,
    osoba_odpowiedzialna:
      osobaOdpowiedzialna === "" ? null : osobaOdpowiedzialna,
    przychod: przychod === "" ? null : przychod,
    odpowiedz: odpowiedz === "" ? null : odpowiedz,
    opis,
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

  const fetchStatusy = async () => {
    try {
      setIsLoadingStatusy(true);
      const res = await fetch(apiUrl("/api/slownik-statusow/"));
      const data = await res.json();
      setStatusy(data.results);
    } finally {
      setIsLoadingStatusy(false);
    }
  };



  const addPartner = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      const res = await fetch(apiUrl("/api/partnerzy/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return setErrors(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const editPartner = async () => {
    if (!partner?.id) return;
    try {
      setIsLoading(true);
      setErrors({});
      const res = await fetch(
        apiUrl(`/api/partnerzy/${partner.id}/`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) return setErrors(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && partner) {
      setNazwa(partner.nazwa ?? "");
      setNumerTelefonu(partner.numer_telefonu ?? "");
      setEmail(partner.e_mail ?? "");
      setOsobaOdpowiedzialna(partner.osoba_odpowiedzialna ?? "");
      setPrzychod(partner.przychod ?? "");
      setOdpowiedz(partner.odpowiedz ?? "");
      setOpis(partner.opis ?? "");
    }
  }, [mode, partner]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col p-6 rounded-lg w-[420px]"
      >
        <h2 className="text-xl mb-4 text-[#6D5BD0]">
          {mode === "add" ? "Dodaj partnera" : "Edytuj partnera"}
        </h2>

        <input
          type="text"
          placeholder="Nazwa"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={nazwa}
          onChange={(e) => setNazwa(e.target.value)}
        />
        {errors.nazwa && (
          <p className="text-red-500 text-sm">{errors.nazwa.join(" ")}</p>
        )}

        <input
          type="number"
          placeholder="Numer telefonu"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={numerTelefonu}
          onChange={(e) =>
            setNumerTelefonu(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        {errors.numer_telefonu && (
          <p className="text-red-500 text-sm">{errors.numer_telefonu.join(" ")}</p>
        )}

        <input
          type="text"
          placeholder="E-mail"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.e_mail && (
          <p className="text-red-500 text-sm">{errors.e_mail.join(" ")}</p>
        )}

        <div className="relative mt-2">
          <input
            type="text"
            readOnly
            placeholder="Osoba odpowiedzialna"
            className="border border-gray-300 rounded p-2 w-full cursor-pointer"
            value={
              osobaOdpowiedzialna
                ? czlonkowie.find(c => c.id === osobaOdpowiedzialna)
                    ?.imie + " " +
                  czlonkowie.find(c => c.id === osobaOdpowiedzialna)
                    ?.nazwisko
                : ""
            }
            onClick={() => {
              setShowCzlonkowie(!showCzlonkowie);
              if (czlonkowie.length === 0) fetchCzlonkowie();
            }}
          />

          {showCzlonkowie && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
              {czlonkowie.map(c => (
                <div
                  key={c.id}
                  className="p-2 hover:bg-[#F4F2FF] cursor-pointer"
                  onClick={() => {
                    setOsobaOdpowiedzialna(c.id);
                    setShowCzlonkowie(false);
                  }}
                >
                  <div className="font-medium">
                    {c.imie} {c.nazwisko}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.e_mail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.osoba_odpowiedzialna && (
          <p className="text-red-500 text-sm">
            {errors.osoba_odpowiedzialna.join(" ")}
          </p>
        )}

        <input
          type="number"
          placeholder="Przychód"
          className="border border-gray-300 rounded p-2 mt-2 w-full"
          value={przychod}
          onChange={(e) =>
            setPrzychod(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        {errors.przychod && (
          <p className="text-red-500 text-sm">{errors.przychod.join(" ")}</p>
        )}

        <div className="relative mt-2">
          <input
            type="text"
            readOnly
            placeholder="Status odpowiedzi"
            className="border border-gray-300 rounded p-2 w-full cursor-pointer"
            value={
              odpowiedz
                ? statusy.find(s => s.id === odpowiedz)?.nazwa ?? ""
                : ""
            }
            onClick={() => {
              setShowStatusy(!showStatusy);
              if (statusy.length === 0) fetchStatusy();
            }}
          />

          {showStatusy && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
              {isLoadingStatusy && (
                <div className="p-2 text-sm text-gray-500">Ładowanie...</div>
              )}

              {!isLoadingStatusy &&
                statusy.map(s => (
                  <div
                    key={s.id}
                    className="p-2 hover:bg-[#F4F2FF] cursor-pointer"
                    onClick={() => {
                      setOdpowiedz(s.id);
                      setShowStatusy(false);
                    }}
                  >
                    <div className="font-medium">{s.nazwa}</div>
                    <div className="text-xs text-gray-500">{s.opis}</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {errors.odpowiedz && (
          <p className="text-red-500 text-sm">{errors.odpowiedz.join(" ")}</p>
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
          <div
            onClick={() => (mode === "add" ? addPartner() : editPartner())}
            className="bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer"
          >
            {isLoading ? "Ładowanie..." : mode === "add" ? "Dodaj" : "Zapisz"}
          </div>
          <div
            onClick={() => onClose()}
            className="bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer"
          >
            Wróć
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPartnerModal;
