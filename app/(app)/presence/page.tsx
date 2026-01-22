"use client";
import SearchBar from '@/components/searchbar'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Result from '@/components/presence/result';
import AddModal from '@/components/presence/addModal';



function page() {
  const [searchText, setSearchText] = useState("");
  const [members, setMembers] = useState <any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [spotkania, setSpotkania] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);


  const filteredMembers = members.filter(member =>
    member.czlonek_imie.toLowerCase().includes(searchText.toLowerCase()) ||
    member.czlonek_email.toLowerCase().includes(searchText.toLowerCase())
  );

    const handleSearch = (value: string) => {
    setSearchText(value);
    console.log("Wpisany tekst:", value);
  };


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

  const loadSpotkania = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/spotkania/");
      const data = await res.json();

      // jeśli masz paginację DRF
      setSpotkania(data.results ?? data);
    } catch (err) {
      console.error("Błąd pobierania spotkań:", err);
    }
  };

  useEffect(() => {
    loadMembers(1);
    loadSpotkania();
  }, []);

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

  return (
    <div className='bg-white text-[#6D5BD0] flex flex-col rounded-lg border border-gray-300'>
      <div className='w-100 p-4 flex w-full justify-between'>
        <SearchBar placeholder="Szukaj w bazie członków..." onSearch={handleSearch} />

      </div>  
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className={`flex px-4 py-2 border-b border-gray-300 bg-[#F4F2FF] text-sm text-[#6E6893] items-center`}>
            <div className='w-60'>Imie i nazwisko</div> 
              { spotkania.map(item => (
                <div key={item.id} className='flex w-30 items-center justify-center'>{new Date(item.data).toLocaleDateString("pl-PL")}</div> 
              ))}
              <div className='flex w-30 items-center justify-center'>
                <Image src="/add.png" alt="Search Icon" width={20} height={20}  className='cursor-pointer transition duration-200 hover:brightness-60'
                onClick={() => setIsOpen(true)}/>
              </div> 
            </div>  
          <div className="flex-1 flex flex-col overflow-auto">
            <div className=' overflow-auto flex flex-col flex-1'>
              { filteredMembers.map(item => (
                <Result key={item.id} id={item.id} spotkania={spotkania} czlonek_imie={item.czlonek_imie} czlonek_email={item.czlonek_email}/>
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
            {1+(page-1)*10}-{members.length+(page-1)*10}
          </div>
          <div className='flex items-center gap-8'>
            <Image 
              src="/left.png" 
              alt="Previous" 
              width={5} 
              height={5}  
              onClick={handlePrev} 
              className='cursor-pointer transition duration-200 hover:brightness-60'
            />
            <Image 
              src="/right.png" 
              alt="Next" 
              width={5} 
              height={5}  
              onClick={handleNext} 
              className='cursor-pointer transition duration-200 hover:brightness-60'
            />
          </div>
        </div> 
        {isOpen && (
        <AddModal
              onClose={() => {
                setIsOpen(false);
                loadMembers(page);
                loadSpotkania();       
              }}
        />
      )}
    </div>
  )
}

export default page