"use client";
import SearchBar from '@/components/searchbar'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Result from '@/components/partners/result';
import AddModal from '@/components/partners/addModal';
import DeleteModal from '@/components/partners/deleteModal';

function page() {
  const [partners, setPartners] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<any>(null);

    const loadPartners = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/partnerzy/?page=${pageNumber}`
      );
      const data = await res.json();

      setPartners(data.results || []);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setPage(pageNumber);
    } catch (err) {
      console.error("Błąd pobierania:", err);
    }
  };

    useEffect(() => {
    loadPartners(1);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    console.log("Wpisany tekst:", value);
  };

  const handleNext = () => nextPage && loadPartners(page + 1);
  const handlePrev = () => prevPage && page > 1 && loadPartners(page - 1);

  const handleEdit = async (partner: any) => {
    const res = await fetch(
      `http://localhost:8000/api/partnerzy/${partner.id}/`
    );
    const fullPartner = await res.json();
    setSelectedPartner(fullPartner);
    setMode("edit");
    setIsOpen(true);
  };

  const handleDeleteClick = (partner: any) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete) return;

    await fetch(
      `http://localhost:8000/api/partnerzy/${partnerToDelete.id}/`,
      { method: "DELETE" }
    );
    setPartners(prev => prev.filter(p => p.id !== partnerToDelete.id));
    setDeleteModalOpen(false);
  };

  const filteredPartners = partners.filter(partner =>
  `${partner.nazwa} ${partner.nazwa}`.toLowerCase().includes(searchText.toLowerCase())
);

  return (
    <div className='bg-white text-[#6D5BD0] flex flex-col rounded-lg border border-gray-300'>
      <div className='w-100 p-4 flex w-full justify-between'>
      <SearchBar placeholder="Szukaj w bazie członków..." onSearch={handleSearch} />
      <div className='bg-[#6D5BD0] hover:bg-[#F4F2FF] rounded-md px-4 py-2 text-white border border-[#6D5BD0] hover:text-[#6D5BD0] cursor-pointer'
        onClick={() => {
          setMode("add");
          setSelectedPartner(null);
          setIsOpen(true);
        }}
      >
        Dodaj partnera
      </div>
      </div>  
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className={`px-4 py-2 gap-2 border-b border-gray-300 bg-[#F4F2FF] text-sm text-[#6E6893] grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center`}>

            <div className=''>Firma</div> 
            <div className=''>Numer Telefonu</div> 
            <div>E-mail</div> 
            <div>Odpowiedź</div> 
            <div>Osoba odpowiedzialna</div> 
            <div>Jaki Przychód</div> 
            <div className='flex ml-auto items-center'>
              <Image src="/more.png" alt="Search Icon" width={6} height={20} className='cursor-pointer transition duration-200 hover:brightness-60'/>
            </div>
        </div>  


        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex flex-col flex-1 overflow-auto ">
            {filteredPartners.map(partner => (
              <Result
                key={partner.id}
                partner={partner}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
        <div className="px-4 py-4 border-t border-gray-300 rounded-b-lg bg-[#F4F2FF] items-center text-sm text-[#6E6893] flex gap-15">
          <div className='flex ml-auto items-center '>
            wierwsze na strone: 10
          </div>
          <div>
            {1+(page-1)*10}-{filteredPartners.length+(page-1)*10}
          </div>
          <div className='flex items-center gap-8'>
            <Image src="/left.png" alt="Search Icon" width={5} height={5} onClick={handlePrev} className='cursor-pointer transition duration-200 hover:brightness-60'/>
            <Image src="/right.png" alt="Search Icon" width={5} height={5} onClick={handleNext} className='cursor-pointer transition duration-200 hover:brightness-60'/>
          </div>
        </div> 
        
        
      {isOpen && (
        <AddModal
          mode={mode}
          partner={selectedPartner}
          onClose={() => {
            setIsOpen(false);
            loadPartners(page);
          }}
        />
      )}

      {deleteModalOpen && partnerToDelete && (
        <DeleteModal
          partnerName={partnerToDelete.nazwa}
          onDelete={handleDeleteConfirm}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  )
}

export default page