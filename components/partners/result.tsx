import React, { useEffect, useState }  from 'react'
import Image from 'next/image';
import { apiUrl } from '@/lib/api';

type Props = {
  partner: {
    id: number;
    nazwa: string;
    numer_telefonu: string | number;
    e_mail: string;
    status: string;
    osoba_odpowiedzialna: string | number;
    przychod: string | number;
    odpowiedz: string | number;
    opis: string;
  };
  onEdit: (partner: any) => void;
  onDelete: (partner: any) => void;
};

type Status = {
  id: number;
  nazwa: string;
  opis: string;
};


function result({ partner, onEdit, onDelete }: Props) {
  const [statusy, setStatusy] = useState<Status[]>([]);
  
  useEffect(() => {
    const fetchStatusy = async () => {
      const res = await fetch(apiUrl("/api/slownik-statusow/"));
      const data = await res.json();
      setStatusy(data.results);
    };

    fetchStatusy();
  }, []);
  const statusNazwa =
    statusy.find(s => s.id === Number(partner.odpowiedz))?.nazwa
    ?? partner.odpowiedz;


  return (
    <div className="">
      <div className=" border-b border-gray-200 p-2 px-4 grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 text-[#6E6893] min-w-[1000px]">
        <div className='text-[#25213B] text-md'>{partner.nazwa}</div>
        <div className='text-sm'>{partner.numer_telefonu}</div>
        <div className='text-sm'>{partner.e_mail}</div>
        <div className='bg-[#CDFFCD] mr-auto px-1 rounded-[100px] flex items-center gap-1 text-sm pr-2'>
          <div className="w-[6px] h-[6px] bg-[#007F00] rounded-full"></div>
          {statusNazwa}

        </div>
        
        <div className='text-sm'>{partner.osoba_odpowiedzialna}</div>
        <div className='text-sm'>{partner.przychod}</div>

        <div className='pl-4 flex ml-auto items-center justify-end gap-4 min-w-[100px]'        >
          <Image src="/pen.png" alt="Search Icon" width={20} height={20} className='cursor-pointer transition duration-200 hover:brightness-60'
            onClick={() => onEdit(partner)}
          />
          <Image src="/trash.png" alt="Search Icon" width={20} height={20} className='cursor-pointer transition duration-200 hover:brightness-60'
            onClick={() => onDelete(partner)}
          />
        </div>

        </div>
  </div>
  )
}

export default result