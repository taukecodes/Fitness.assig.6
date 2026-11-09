"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFitContext } from "@/context/FitContext";

export default function MyPlanPage() {
  const { planList, savedList, removeFromPlan, removeFromSaved } =
    useFitContext();
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
  const [sortBy, setSortBy] = useState<string>("duration");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const currentList = activeTab === "plan" ? planList : savedList;

  // Sorting logic based on Figma's "Sort By" feature
  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === "duration") {
      return (Number(b.duration) || 25) - (Number(a.duration) || 25);
    } else if (sortBy === "calories") {
      return (Number(b.calories) || 180) - (Number(a.calories) || 180);
    } else {
      return (a.name || "").localeCompare(b.name || "");
    }
  });

  // Calculate stats for plan
  const totalExercises = planList.length;
  const totalMinutes = planList.reduce(
    (acc, item) => acc + (Number(item.duration) || 25),
    0,
  );
  const totalCalories = planList.reduce(
    (acc, item) => acc + (Number(item.calories) || 180),
    0,
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#181818] border border-lime-400 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="text-lime-400">⚡</span> {toastMessage}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Header info */}
        <h1 className="text-2xl font-black tracking-wider uppercase mb-1">
          My Plan
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          Cap of five lifts for today. Finish them, then load more.
        </p>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#181818] border border-gray-800 rounded-3xl p-6 text-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
              Exercises
            </span>
            <span className="text-4xl font-black text-lime-400">
              {totalExercises}
            </span>
          </div>
          <div className="bg-[#181818] border border-gray-800 rounded-3xl p-6 text-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
              Minutes
            </span>
            <span className="text-4xl font-black text-white">
              {totalMinutes}
            </span>
          </div>
          <div className="bg-[#181818] border border-gray-800 rounded-3xl p-6 text-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">
              Calories
            </span>
            <span className="text-4xl font-black text-white">
              {totalCalories}
            </span>
          </div>
        </div>

        {/* Tabs and Sort By (Figma Layout) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="bg-[#181818] border border-gray-800 p-1.5 rounded-2xl flex gap-2">
            <button
              onClick={() => setActiveTab("plan")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "plan"
                  ? "bg-lime-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "saved"
                  ? "bg-lime-400 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Saved
            </button>
          </div>

          {/* Figma Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Sort By
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181818] border border-gray-800 text-white text-xs px-4 py-2 rounded-xl focus:outline-none focus:border-lime-400 cursor-pointer"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* List Items */}
        {sortedList.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            No items found in{" "}
            {activeTab === "plan" ? "today's plan" : "saved list"}.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedList.map((item: any) => {
              const id = item._id || item.id;
              return (
                <div
                  key={id}
                  className="bg-[#181818] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-900"
                    />
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2">
                        {item.equipment || "Barbell, Rack"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>⏱️ {item.duration || 25} min</span>
                        <span>🔥 {item.calories || 180} kcal</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link
                      href={`/workouts/${id}`}
                      className="text-xs font-bold text-gray-400 hover:text-lime-400 transition px-3 py-2"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        if (activeTab === "plan") {
                          removeFromPlan(id);
                          setToastMessage(`"${item.name}" removed from plan`);
                        } else {
                          removeFromSaved(id);
                          setToastMessage(
                            `"${item.name}" removed from saved list`,
                          );
                        }
                      }}
                      className="text-xs font-bold text-red-400 hover:text-red-300 transition px-3 py-2 bg-[#121212] border border-gray-800 rounded-xl"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
