"use client";

import SearchBar from "@/components/searchbar";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Result from "@/components/budget/result";
import AddModal from "@/components/budget/addModal";
import DeleteModal from "@/components/budget/deleteModal";

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [income, setIncome] = useState("");
  const [przychody, setPrzychody] = useState<any[]>([]);
  const [wydatki, setWydatki] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetItemToDelete, setBudgetItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<"przychod" | "wydatek">("przychod");
  const [pageWyd, setPageWyd] = useState(1);
  const [nextPageWyd, setNextPageWyd] = useState<string | null>(null);
  const [prevPageWyd, setPrevPageWyd] = useState<string | null>(null);
  const [pagePrzy, setPagePrzy] = useState(1);
  const [nextPagePrzy, setNextPagePrzy] = useState<string | null>(null);
  const [prevPagePrzy, setPrevPagePrzy] = useState<string | null>(null);


  const loadPrzychody = async (pageNumber = 1) => {
    try {
      const res = await fetch(`http://localhost:8000/api/przychody/?page=${pageNumber}`);
      const data = await res.json();
      setPrzychody(data.results || []);
      setNextPagePrzy(data.next);
      setPrevPagePrzy(data.previous);
      setPagePrzy(pageNumber);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWydatki = async (pageNumber = 1) => {
    try {
      const res = await fetch(`http://localhost:8000/api/wydatki/?page=${pageNumber}`);
      const data = await res.json();
      setWydatki(data.results || []);
      setNextPageWyd(data.next);
      setPrevPageWyd(data.previous);
      setPageWyd(pageNumber);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadPrzychody(1);
    loadWydatki(1);
  }, []);

  const handleDeleteClick = (item: any, type: "przychod" | "wydatek") => {
    setBudgetItemToDelete(item);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };


  const handleDeleteConfirm = async () => {
    if (!budgetItemToDelete) return;

    const endpoint =
      deleteType === "przychod"
        ? `http://localhost:8000/api/przychody/${budgetItemToDelete.id}/`
        : `http://localhost:8000/api/wydatki/${budgetItemToDelete.id}/`;

    await fetch(endpoint, { method: "DELETE" });

    if (deleteType === "przychod") {
      setPrzychody(prev => prev.filter(p => p.id !== budgetItemToDelete.id));
    } else {
      setWydatki(prev => prev.filter(w => w.id !== budgetItemToDelete.id));
    }

    setDeleteModalOpen(false);
    setBudgetItemToDelete(null);
  };



  const handleSearch = (value: string) => {
    setSearchText(value);
  };

const handleNextWyd = () => {
  if (nextPageWyd) {
    loadWydatki(pageWyd + 1);
  }
};

const handlePrevWyd = () => {
  if (prevPageWyd && pageWyd > 1) {
    loadWydatki(pageWyd - 1);
  }
};

const handleNextPrzy = () => {
  if (nextPagePrzy) {
    loadPrzychody(pagePrzy + 1);
  }
};

const handlePrevPrzy = () => {
  if (prevPagePrzy && pagePrzy > 1) {
    loadPrzychody(pagePrzy - 1);
  }
};

const filteredPrzychody = przychody.filter(item =>
  (item.nazwa ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
  (item.kwota ?? "").toString().includes(searchText) ||
  (item.osoba_odpowiedzialna ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
  (item.data_dodania ? new Date(item.data_dodania).toLocaleDateString("pl-PL") : "").includes(searchText)
);

const filteredWydatki = wydatki.filter(item =>
  (item.nazwa ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
  (item.kwota ?? "").toString().includes(searchText) ||
  (item.osoba_odpowiedzialna ?? "").toString().toLowerCase().includes(searchText.toLowerCase()) ||
  (item.data_dodania ? new Date(item.data_dodania).toLocaleDateString("pl-PL") : "").includes(searchText)
);






  return (
    <div className="bg-white text-[#6D5BD0] h-screen flex flex-col rounded-lg border border-gray-300">

      <div className="p-4 flex justify-between items-center">
        <SearchBar
          placeholder="Szukaj w budżecie..."
          onSearch={handleSearch}
        />
        <div className="bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Dodaj kwotę
        </div>
      </div>

      <div className="flex flex-1 border-t border-gray-300">

        <div className="w-1/2 border-r border-gray-300 flex flex-col">
          <div className="py-4 text-center font-medium bg-[#F4F2FF] border-b border-gray-300">
            Przychody
          </div>
          <div className="overflow-x-auto flex-1">
            <div className="min-w-[700px]">

              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.5fr] px-4 py-2 border-b border-gray-300 text-sm text-[#6E6893]">
                <div>Kwota</div>
                <div>Nazwa</div>
                <div>Osoba odpowiedzialna</div>
                <div>Data dodania</div>
              </div>

              {filteredPrzychody.map(item => (
                <Result
                  key={item.id}
                  item={item}
                  onDelete={(item) => handleDeleteClick(item, "przychod")}
                  loadPage={() => loadPrzychody(1)}
                />
              ))}


            </div>
          </div>
                <div className="px-4 py-4 border-t border-gray-300 bg-[#F4F2FF] flex items-center text-sm text-[#6E6893]">
        <div className="ml-auto">Wiersze na stronę: 10</div>
        <div className="mx-6">
          {1+(pagePrzy-1)*10}-{przychody.length+(pagePrzy-1)*10}</div>
        <div className="flex gap-6">
          <Image
            src="/left.png"
            alt="prev"
            width={5}
            height={5}
            className="cursor-pointer hover:brightness-75"
            onClick={()=>handlePrevPrzy()}
          />
          <Image
            src="/right.png"
            alt="next"
            width={5}
            height={5}
            className="cursor-pointer hover:brightness-75"
            onClick={()=>handleNextPrzy()}
          />
        </div>
      </div>
        </div>
        <div className="w-1/2 border-l border-gray-300 flex flex-col">
          <div className="py-4 text-center font-medium bg-[#F4F2FF] border-b border-gray-300">
            Wydatki
          </div>
          <div className="overflow-x-auto flex-1">
            <div className="min-w-[700px]">

              <div className="grid  grid-cols-[1fr_1fr_1fr_1fr_0.5fr] px-4 py-2 border-b border-gray-300 text-sm text-[#6E6893]">
                <div>Kwota</div>
                <div>Nazwa</div>
                <div>Osoba odpowiedzialna</div>
                <div>Data dodania</div>
              </div>

              {filteredWydatki.map(item => (
                <Result
                  key={item.id}
                  item={item}
                  onDelete={(item) => handleDeleteClick(item, "wydatek")}
                  loadPage={() => loadWydatki(1)}
                />
              ))}


            </div>
          </div>
                <div className="px-4 py-4 border-t border-gray-300 bg-[#F4F2FF] flex items-center text-sm text-[#6E6893]">
        <div className="ml-auto">Wiersze na stronę: 10</div>
        <div className="mx-6">{1+(pageWyd-1)*10}-{wydatki.length+(pageWyd-1)*10}</div>
        <div className="flex gap-6">
          <Image
            src="/left.png"
            alt="prev"
            width={5}
            height={5}
            className="cursor-pointer hover:brightness-75"
            onClick={()=>handlePrevWyd()}
          />
          <Image
            src="/right.png"
            alt="next"
            width={5}
            height={5}
            className="cursor-pointer hover:brightness-75"
            onClick={()=>handleNextWyd()}
          />
        </div>
      </div>
        </div>

      </div>


      {isOpen && (
        <AddModal
          onClose={() => {
            setIsOpen(false);
            loadWydatki(pageWyd)
            loadPrzychody(pagePrzy)
          }}
        />
      )}

      {deleteModalOpen && budgetItemToDelete && (
        <DeleteModal
          name={budgetItemToDelete.nazwa}
          onDelete={handleDeleteConfirm}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
