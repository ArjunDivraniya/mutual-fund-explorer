// src/app/funds/page.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { FundCard } from "@/components/FundCard";
import { getSchemes } from "@/utils/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function FundSearchPage() {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      const data = await getSchemes();
      setSchemes(data);
      setFilteredSchemes(data);
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    const results = schemes.filter((scheme) =>
      scheme.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchemes(results);
  }, [searchQuery, schemes]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Head>
        <title>Mutual Fund Explorer</title>
      </Head>
      <header className="py-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold">Mutual Fund Explorer</h1>
      </header>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Mutual Funds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.slice(0, 100).map((scheme) => (
          <FundCard key={scheme.schemeCode} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}