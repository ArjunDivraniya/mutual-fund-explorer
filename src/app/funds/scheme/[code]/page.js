// src/app/scheme/[code]/page.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { getSchemeData } from "@/utils/api";
import { NavChart } from "@/components/NavChart";
import { SipCalculator } from "@/components/SipCalculator";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SchemeDetailPage({ params }) {
  const { code } = params;
  const [scheme, setScheme] = useState(null);

  useEffect(() => {
    if (code) {
      const fetchScheme = async () => {
        const data = await getSchemeData(code);
        setScheme(data);
      };
      fetchScheme();
    }
  }, [code]);

  if (!scheme) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const navData = scheme.data
    .map((d) => ({
      date: new Date(d.date),
      nav: parseFloat(d.nav),
    }))
    .slice(0, 365); // Last 1 year

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Head>
        <title>{scheme.meta.scheme_name} - Details</title>
      </Head>
      <header className="py-6 mb-8 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <Link href="/funds" passHref>
          <div className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </div>
        </Link>
        <h1 className="text-3xl font-bold ml-4">{scheme.meta.scheme_name}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Scheme Details</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Fund House:</strong> {scheme.meta.fund_house}
            </p>
            <p>
              <strong>Scheme Type:</strong> {scheme.meta.scheme_type}
            </p>
            <p>
              <strong>Category:</strong> {scheme.meta.scheme_category}
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">NAV History</h2>
          <div className="w-full h-80">
            <NavChart data={navData} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <SipCalculator schemeCode={scheme.meta.scheme_code} />
        </div>
      </div>
    </div>
  );
}