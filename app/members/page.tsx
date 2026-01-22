"use client";
import SearchBar from '@/components/searchbar'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Result from '@/components/members/result';
import AddModal from '@/components/members/addModal';
import DeleteModal from '@/components/members/deleteModal';

function page() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  



  const loadMembers = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/lista-czlonkow/?page=${pageNumber}`
      );
      const data = await res.json();

      setMembers(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setPage(pageNumber);
    } catch (err) {
      console.error("Błąd pobierania:", err);
    }
  };

  useEffect(() => {
    loadMembers(1);
  }, []);


  const handleSearch = (value: string) => {
    setSearchText(value);
    console.log("Wpisany tekst:", value);
  };

  const handleNext = () => {
    if (nextPage) {
      loadMembers(page + 1);
    }
  };


  const handlePrev = () => {
    if (prevPage && page > 1) {
      loadMembers(page - 1);
    }
  };


  const handleEdit = async (member: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/czlonkowie/${member.id}/`);
      const fullMember = await res.json();

      setSelectedMember(fullMember);
      setMode("edit");
      setIsOpen(true);
    } catch (err) {
      console.error("Błąd pobierania pełnego członka:", err);
    }
  };

  const handleDeleteClick = (member: any) => {
  setMemberToDelete(member);
  setDeleteModalOpen(true);
};

const handleDeleteConfirm = async () => {
  if (!memberToDelete) return;

  try {
    const res = await fetch(`http://localhost:8000/api/czlonkowie/${memberToDelete.id}/`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Błąd przy usuwaniu");

    setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
    setDeleteModalOpen(false);
  } catch (err) {
    console.error(err);
  }
};


const filteredMembers = members.filter(member =>
  (
    `${member.czlonek_imie ?? ""} ${member.czlonek_nazwisko ?? ""}` +
    ` ${member.indeks ?? ""}` +
    ` ${member.email ?? ""}` +
    ` ${member.telefon ?? ""}` +
    ` ${member.sekcja_nazwa ?? ""}` +
    ` ${member.projekt_nazwa ?? ""}` +
    ` ${member.kierunek_nazwa ?? ""}`
  ).toLowerCase().includes(searchText.toLowerCase())
);


  return (
    <div className=' bg-white text-[#6D5BD0]  flex flex-col rounded-lg border border-gray-300'>
      <div className='w-100 p-4 flex w-full justify-between'>
      <SearchBar placeholder="Szukaj w bazie członków..." onSearch={handleSearch} />
      <div onClick={() =>{
        setMode("add");
        setSelectedMember(null);
        setIsOpen(true);
        loadMembers(page);
        }} className='bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer'>
        Dodaj członka
      </div>
      </div>  
      <div className="overflow-x-auto">
        <div className="min-w-max">

          <div className={`px-4 py-2 gap-2 border-b border-gray-300 bg-[#F4F2FF] text-sm text-[#6E6893] grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto] items-center`}>
            <div>Imię i nazwisko</div>
            <div>Indeks</div>
            <div>Telefon</div>
            <div>Sekcje</div>
            <div>Projekty</div>
            <div>Kierunek</div>
            <div className='flex justify-end min-w-[100px]'><Image src="/more.png" alt="more" width={6} height={20} /></div>
          </div>

          {filteredMembers.map(member => (
            <Result
              key={member.id}
              id={member.id}
              imie={member.czlonek_imie}
              nazwisko={member.czlonek_nazwisko}
              indeks={member.indeks}
              email={member.email}
              telefon={member.telefon}
              sekcje={member.sekcja_nazwa}
              projekty={member.projekt_nazwa}
              kierunek={member.kierunek_nazwa}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>


        <div className="px-4 py-4 border-t border-gray-300 rounded-b-lg bg-[#F4F2FF] items-center text-sm text-[#6E6893] flex gap-15">
          <div className='flex ml-auto items-center '>
            wierwsze na strone: 10
          </div>
          <div>
            {1+(page-1)*10}-{members.length+(page-1)*10}
          </div>
          <div className='flex items-center gap-8'>
            <Image src="/left.png" alt="Search Icon" width={5} height={5} onClick={handlePrev} className='cursor-pointer transition duration-200 hover:brightness-60'/>
            <Image src="/right.png" alt="Search Icon" width={5} height={5} onClick={handleNext} className='cursor-pointer transition duration-200 hover:brightness-60'/>
          </div>
        </div>
        
      {isOpen && (
        <AddModal
              onClose={() => {
                setIsOpen(false);
                loadMembers(page);
              }}
          mode={mode}
          member={selectedMember}
        />
      )}
      
      {deleteModalOpen && memberToDelete && (
        <DeleteModal
          memberName={`${memberToDelete.imie} ${memberToDelete.nazwisko}`}
          onClose={() => {
            setDeleteModalOpen(false);
            loadMembers(page);
          }}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  )
}

export default page