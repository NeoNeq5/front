"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from "react-dropzone";

function Page() {
  const [groupType, setGroupType] = useState<"projekt" | "sekcja">("projekt");
  const [projekty, setProjekty] = useState<any[]>([]);
  const [sekcje, setSekcje] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "image/*": [] },
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/projekty/")
      .then(res => res.json())
      .then(data => setProjekty(data.results))
      .catch(err => console.error(err));

    fetch("http://localhost:8000/api/sekcje/")
      .then(res => res.json())
      .then(data => setSekcje(data.results))
      .catch(err => console.error(err));
  }, []);

const handleGenerate = async () => {
  setErrors({});
  if (!acceptedFiles[0] || !selectedGroupId) {
    setErrors({ general: ["Wybierz plik i grupę!"] });
    return;
  }

  setIsGenerating(true);
  try {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    const uploadRes = await fetch(
      "http://localhost:8000/api/certyfikaty-generator/upload-tlo/",
      {
        method: "POST",
        headers: {
          "X-CSRFTOKEN": "1WQie21ktkiQVbMaTEJwKVhELEge1MSIkyfSpW2ouMvKeqDSQYzyubtGLZiHl4ns",
        },
        body: formData,
      }
    );

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      setErrors(uploadData);
      return;
    }

    const tempFileName = uploadData.temp_file_name || acceptedFiles[0].name;

    const generateRes = await fetch(
      "http://localhost:8000/api/certyfikaty-generator/generuj/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": "1WQie21ktkiQVbMaTEJwKVhELEge1MSIkyfSpW2ouMvKeqDSQYzyubtGLZiHl4ns",
        },
        body: JSON.stringify({
          temp_file_name: tempFileName,
          grupa_id: selectedGroupId,
          typ_grupy: groupType,
        }),
      }
    );

    if (!generateRes.ok) {
      const errorData = await generateRes.json();
      setErrors(errorData);
      return;
    }

    const pdfBlob = await generateRes.blob();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `certyfikat_${selectedGroupId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);


  } catch (err) {
    console.error(err);
    setErrors({ general: ["Wystąpił błąd sieciowy"] });
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className='bg-white text-[#6D5BD0] h-screen flex flex-col border border-gray-300 rounded-lg'>
      <div className="flex-1 overflow-auto grid grid-cols-2 gap-6 p-8">

        <div className='bg-white flex flex-col rounded-lg border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300'>
          <div className='p-4'>
            <p className='pb-2 font-semibold text-lg'>Krok 1:</p>
            <p className='font-semibold text-lg'>Dodaj certyfikat</p>
          </div>

          <div
            {...getRootProps()}
            className="p-6 rounded-lg text-center flex flex-col items-center justify-center cursor-pointer h-full"
          >
            <input {...getInputProps()} />
            {acceptedFiles[0] ? (
              <img
                src={URL.createObjectURL(acceptedFiles[0])}
                className="mt-4 max-h-60 mx-auto"
                alt="uploaded"
              />
            ) : (
              <div className='flex items-center justify-center gap-4'>
                <Image src="/drop.png" alt="Search Icon" width={20} height={20} />
                <p className="text-[#8B83BA]">Dodaj</p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full'>
          <div className='p-4'>
            <p className='pb-2 font-semibold text-lg'>Krok 2:</p>
            <p className='font-semibold text-lg'>Wybierz dla której grupy chcesz wygenerować certyfikat</p>

            <div className="mt-4">
              <label className="text-sm text-[#6E6893]">Typ grupy</label>
              <select
                className="border border-gray-300 rounded p-2 w-full mt-1"
                value={groupType}
                onChange={(e) => {
                  setGroupType(e.target.value as "projekt" | "sekcja");
                  setSelectedGroupId("");
                }}
              >
                <option value="projekt">Projekt</option>
                <option value="sekcja">Sekcja</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm text-[#6E6893]">
                {groupType === "projekt" ? "Projekt" : "Sekcja"}
              </label>
              <select
                className="border border-gray-300 rounded p-2 w-full mt-1"
                value={selectedGroupId}
                onChange={(e) =>
                  setSelectedGroupId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">— wybierz —</option>
                {(groupType === "projekt" ? projekty : sekcje).map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nazwa}
                  </option>
                ))}
              </select>
              {errors.grupa_id && <p className="text-red-500 text-sm mt-1">{errors.grupa_id.join(" ")}</p>}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm mt-2">{errors.general.join(" ")}</p>
            )}

          </div>

          <div className='flex justify-end mt-auto m-4'>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-[#6D5BD0] hover:bg-[#5c4bb0] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isGenerating ? "Generowanie..." : "Generuj certyfikat"}
            </button>
          </div>
        </div>

      </div>
      <div className="px-4 py-4 bg-[#F4F2FF] flex items-center text-sm text-[#6E6893] gap-15 border-t border-gray-300 rounded-b-lg">
      </div>

    </div>
  );
}

export default Page;
