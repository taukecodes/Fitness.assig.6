"use client";
import Link from "next/link";
import { useFitContext } from "@/context/FitContext";

export default function Navbar() {
  const { planList, savedList } = useFitContext();

  return (
    <nav className="bg-white border-b border-gray-200 text-gray-900 sticky top-0 z-50 py-4 px-6 shadow-sm">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-black text-base tracking-widest uppercase text-gray-900"
        >
          <img
            src="/logo.png"
            alt="FITLOG"
            className="h-7 w-auto object-contain"
          />
          <span>FITLOG</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <Link
            href="/"
            className="text-gray-700 hover:text-lime-600 transition"
          >
            Workouts
          </Link>
          <Link
            href="/myplan"
            className="text-gray-700 hover:text-lime-600 transition"
          >
            My Plan
          </Link>
        </div>

        {/* Badges / Counters */}
        <div className="flex items-center gap-3">
          <Link
            href="/myplan"
            className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1.5 hover:border-lime-500 transition"
          >
            <span>Plan</span>
            <span className="bg-lime-400 text-black px-1.5 py-0.5 rounded-md text-[10px]">
              {planList.length}
            </span>
          </Link>
          <Link
            href="/myplan"
            className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1.5 hover:border-lime-500 transition"
          >
            <span>Saved</span>
            <span className="bg-lime-400 text-black px-1.5 py-0.5 rounded-md text-[10px]">
              {savedList.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
