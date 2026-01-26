'use client'
import Image from 'next/image';
import React from 'react'
import { useState, useEffect } from 'react';
import Select from '../select';
import AddModal2 from './addModal2';
import { apiUrl } from '@/lib/api';

type ModalProps = {
  onClose: () => void;
  mode: "add" | "edit";
  member?: any;
};

type Kierunek = {
  id: number;
  nazwa: string;
  opis: string;
};

type Projekt = {
  id: number;
  nazwa: string;
  opis: string;
};

type Sekcje = {
  id: number;
  nazwa: string;
  opis: string;
};




function addModal({onClose, mode, member }: ModalProps) {
  const [isKierunekModalOpen, setIsKierunekModalOpen] = useState(false);
  const [isSekcjaModalOpen, setIsSekcjaModalOpen] = useState(false);
  const [isProjektModalOpen, setIsProjektModalOpen] = useState(false);

  const [selectedImie, setSelectedImie] = useState("");
  const [selectedNazwisko, setSelectedNazwisko] = useState("");
  const [selectedIndeks, setSelectedIndeks] = useState<number | "">("");
  const [selectedTelefon, setSelectedTelefon] = useState<number | "">("");


  const [selectedMail, setSelectedMail] = useState("");
  const [selectedKierunek, setSelectedKierunek] = useState<number | null>(null);
  const [selectedSekcja, setSelectedSekcja] = useState<number | null>(null);
  const [selectedProjekt, setSelectedProjekt] = useState<number | null>(null);
  const [kierunki, setKierunki] = useState<Kierunek[]>([]);
  const [projekty, setProjekty] = useState<Projekt[]>([]);
  const [sekcje, setSekcje] = useState<Sekcje[]>([]);
  
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);


const addMember = async () => {
  try {
    setErrors({});
    setIsLoading(true);

    const payload = {
      imie: selectedImie,
      nazwisko: selectedNazwisko,
      e_mail: selectedMail,
      indeks: selectedIndeks || null,
      telefon: selectedTelefon || null,
      kierunek: selectedKierunek,
      sekcja: selectedSekcja,
      projekt: selectedProjekt,
    };

    const res = await fetch(apiUrl("/api/czlonkowie/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data);
      return;
    }

    onClose();
  } catch (err) {
    console.error(err);
    setErrors({ general: ["Wystąpił błąd sieciowy"] });
  } finally {
    setIsLoading(false);
  }
};


  const addKierunek = async (nazwa: string, opis: string) => {
  try {
    const res = await fetch(apiUrl("/api/kierunki/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        nazwa,
        opis 
        }),
    });

    if (!res.ok) throw new Error("Błąd dodawania kierunku");

    const data = await res.json();
    
    setKierunki(prev => [...prev, data]);
    setIsKierunekModalOpen(false); 
  } catch (err) {
    console.error(err);
  }
};

const addSekcja = async (nazwa: string, opis: string) => {
  try {
    const res = await fetch(apiUrl("/api/sekcje/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nazwa, opis }),
    });

    if (!res.ok) throw new Error("Błąd dodawania kierunku");

    const data = await res.json();
    
    setSekcje(prev => [...prev, data]);
    setIsSekcjaModalOpen(false);
  } catch (err) {
    console.error(err);
  }
};

  const addProjekt = async (nazwa: string, opis: string) => {
    try {
      const res = await fetch(apiUrl("/api/projekty/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nazwa, opis }),
      });

      if (!res.ok) throw new Error("Błąd dodawania kierunku");

      const data = await res.json();
      
      setProjekty(prev => [...prev, data]);
      setIsProjektModalOpen(false); 
    } catch (err) {
      console.error(err);
    }
  };


  const editMember = async () => {
  if (!member?.id) return;

  try {
    setErrors({});
    setIsLoading(true);

    const payload = {
      imie: selectedImie,
      nazwisko: selectedNazwisko,
      e_mail: selectedMail,
      indeks: selectedIndeks || null,
      telefon: selectedTelefon || null,
      kierunek: selectedKierunek,
      sekcja: selectedSekcja,
      projekt: selectedProjekt,
    };

    const res = await fetch(
      apiUrl(`/api/czlonkowie/${member.id}/`),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setErrors(data);
      return;
    }

    onClose();
  } catch (err) {
    console.error(err);
    setErrors({ general: ["Wystąpił błąd sieciowy"] });
  } finally {
    setIsLoading(false);
  }
};




  useEffect(() => {
    fetch(apiUrl("/api/kierunki/"))
      .then(res => res.json())
      .then(data => setKierunki(data.results))
      .catch((err) => console.error("Błąd pobierania kierunków:", err));
  }, []);

  useEffect(() => {
    fetch(apiUrl("/api/projekty/"))
      .then(res => res.json())
      .then(data => setProjekty(data.results))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    fetch(apiUrl("/api/sekcje/"))
      .then(res => res.json())
      .then(data => setSekcje(data.results))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (mode === "edit" && member) {
      setSelectedImie(member.imie ?? "");
      setSelectedNazwisko(member.nazwisko ?? "");
      setSelectedMail(member.e_mail ?? "");
      setSelectedIndeks(member.indeks ?? "");
      setSelectedTelefon(member.telefon ?? "");
      setSelectedKierunek(member.kierunek ?? null); 
      setSelectedSekcja(member.sekcja ?? null); 
      setSelectedProjekt(member.projekt ?? null); 
    }
  }, [mode, member]);

  return (
    <div onClick={() => onClose()} className='fixed bg-black/50 inset-0 flex justify-center items-center'>
      <div className='bg-white flex flex-col p-6 rounded-lg' onClick={(e) => e.stopPropagation()}>
        <h2 className='text-xl mb-4 text-[#6D5BD0]'>
          {mode === "add" ? "Dodaj nowego członka" : "Edytuj członka"}
        </h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Imię" 
            className="border border-gray-300 rounded p-2 mt-2 w-full"
            value={selectedImie}
            onChange={(e) => setSelectedImie(e.target.value)}
          />
          {errors.imie && <p className="text-red-500 text-sm mt-1">{errors.imie.join(" ")}</p>}
          <input 
            type="text" 
            placeholder="Nazwisko" 
            className="border border-gray-300 rounded p-2 mt-2 w-full"
            value={selectedNazwisko}
            onChange={(e) => setSelectedNazwisko(e.target.value)}
          />
          {errors.nazwisko && <p className="text-red-500 text-sm mt-1">{errors.nazwisko.join(" ")}</p>}

        </div>
          <input 
            type="text" 
            placeholder="e-mail" 
            className="border border-gray-300 rounded p-2 mt-2 w-full"
            value={selectedMail}
            onChange={(e) => setSelectedMail(e.target.value)}
          />
          {errors.e_mail && <p className="text-red-500 text-sm mt-1">{errors.e_mail.join(" ")}</p>}


          <input 
            type="number" 
            placeholder="Indeks" 
            className="border border-gray-300 rounded p-2 mt-2 w-full"
            value={selectedIndeks}
            onChange={(e) =>
              setSelectedIndeks(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          {errors.indeks && <p className="text-red-500 text-sm mt-1">{errors.indeks.join(" ")}</p>}


          <input 
            type="tel"
            placeholder="Numer telefonu" 
            className="border border-gray-300 rounded p-2 mt-2 w-full"
            value={selectedTelefon}
            onChange={(e) =>
              setSelectedTelefon(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }      
          />
          {errors.telefon && <p className="text-red-500 text-sm mt-1">{errors.telefon.join(" ")}</p>}

          <Select
            label="Wybierz sekcję"
            options={sekcje.map(s => ({
              label: s.nazwa,
              value: s.id
            }))}
            value={selectedSekcja}
            onChange={setSelectedSekcja}
            onAddNew={() => setIsSekcjaModalOpen(true)}
          />
          {errors.sekcja && <p className="text-red-500 text-sm mt-1">{errors.sekcja.join(" ")}</p>}

          <Select
            label="Wybierz projekt"
            options={projekty.map(p => ({
              label: p.nazwa,
              value: p.id
            }))}
            value={selectedProjekt}
            onChange={setSelectedProjekt}
            onAddNew={() => setIsProjektModalOpen(true)}
          />
          {errors.projekt && <p className="text-red-500 text-sm mt-1">{errors.projekt.join(" ")}</p>}

          <Select
            label="Wybierz kierunek"
            options={kierunki.map(k => ({
              label: k.nazwa,
              value: k.id
            }))}
            value={selectedKierunek}
            onChange={setSelectedKierunek}
            onAddNew={() => setIsKierunekModalOpen(true)}
          />
          {errors.kierunek && <p className="text-red-500 text-sm mt-1">{errors.kierunek.join(" ")}</p>}


        <div className='flex w-full justify-between mt-2'>
          <div onClick={() =>{
             mode === "add" ? addMember() : editMember();
          }} 
            className='bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer'
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              mode === "add" ? "Dodaj" : "Zapisz zmiany"
            )}
          </div>
          <div onClick={() =>onClose()} className='bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer'>
              wróć
          </div>
        </div>
      </div>
      {isKierunekModalOpen && <AddModal2 onAdd={addKierunek} name='Dodaj nowy Kierunek' onClose={() => setIsKierunekModalOpen(false)} />}
      {isProjektModalOpen && <AddModal2 onAdd={addProjekt} name='Dodaj nowy Projekt' onClose={() => setIsProjektModalOpen(false)} />}
      {isSekcjaModalOpen && <AddModal2 onAdd={addSekcja} name='Dodaj nową sekcje' onClose={() => setIsSekcjaModalOpen(false)} />}
    </div>
  )
}

export default addModal