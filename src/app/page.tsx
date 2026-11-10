"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFitContext } from "@/context/FitContext";

export default function HomePage() {
  const {
    addToPlan,
    addToSaved,
    isAddedToPlan,
    isSaved,
    removeFromPlan,
    removeFromSaved,
  } = useFitContext();
  const [workoutsData, setWorkoutsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/fitlog")
      .then((res) => res.json())
      .then((data) => {
        setWorkoutsData(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching workouts:", err);
        setLoading(false);
      });
  }, []);

  const filteredWorkouts = workoutsData.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#181818] border border-lime-400 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="text-lime-400">⚡</span> {toastMessage}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {/* Hero Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 border border-gray-800 bg-[#181818] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl z-10">
            <span className="text-lime-400 text-xs font-bold tracking-widest uppercase mb-3 block">
              Workout Library
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase leading-tight mb-4 text-white">
              Train with intent. <br /> Log every set.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
              into today's plan, and watch the week's work add up.
            </p>
            <a
              href="#library"
              className="inline-block bg-lime-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider hover:bg-lime-500 transition"
            >
              Browse Workouts
            </a>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/banner.png"
              alt="FitLog Banner"
              className="w-full max-w-md h-auto object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* The Library Header */}
        <div
          id="library"
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-2xl font-black tracking-wider uppercase mb-1">
              The Library
            </h2>
            <p className="text-xs text-gray-400">
              Lifts covering every major muscle group.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#181818] border border-gray-800 px-4 py-2.5 rounded-xl text-white w-full md:w-72 text-xs focus:outline-none focus:border-lime-400"
          />
        </div>

        {/* Workout Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Loading workouts from API...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredWorkouts.map((item) => {
              const id = item._id || item.id;
              const added = isAddedToPlan(id);
              const saved = isSaved(id);

              return (
                <div
                  key={id}
                  className="bg-[#181818] border border-gray-800 rounded-3xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-52 object-cover bg-gray-900"
                    />
                    <div className="p-5">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {item.muscle && (
                          <span className="bg-[#121212] text-lime-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border border-gray-800">
                            {item.muscle}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base tracking-wider mb-1 uppercase">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4">
                        {item.equipment || "Barbell, Bench"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-800/60 pt-3">
                        <span>⏱️ {item.duration || 25} min</span>
                        <span>🔥 {item.calories || 180} kcal</span>
                        <span className="text-lime-400 font-semibold">
                          ⭐ {item.rating || 4.8}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex flex-col gap-2">
                    <Link
                      href={`/workouts/${id}`}
                      onClick={() => {
                        sessionStorage.setItem(
                          "fitlog-selected-workout",
                          JSON.stringify(item),
                        );
                      }}
                      className="w-full text-center bg-[#121212] border border-gray-800 text-gray-300 py-2.5 rounded-xl text-xs font-bold hover:border-lime-400 transition mb-1"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (added) {
                            removeFromPlan(id);
                            setToastMessage(`"${item.name}" removed from plan`);
                          } else {
                            addToPlan(item);
                            setToastMessage(`"${item.name}" added to plan!`);
                          }
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                          added
                            ? "bg-gray-800 text-lime-400 border border-lime-400/40 hover:bg-gray-700"
                            : "bg-lime-400 text-black hover:bg-lime-500"
                        }`}
                      >
                        {added ? "Added to Plan" : "Add to Plan"}
                      </button>
                      <button
                        onClick={() => {
                          if (saved) {
                            removeFromSaved(id);
                            setToastMessage(
                              `"${item.name}" removed from saved list`,
                            );
                          } else {
                            addToSaved(item);
                            setToastMessage(
                              `"${item.name}" saved successfully!`,
                            );
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border border-gray-800 transition ${
                          saved
                            ? "bg-gray-800 text-lime-400 border-lime-400/40"
                            : "bg-[#121212] text-gray-300 hover:border-lime-400"
                        }`}
                      >
                        {saved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="border-t border-gray-800 bg-[#121212] py-8 px-8 mt-16">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3 font-black text-sm tracking-widest text-white uppercase">
            <img
              src="/logo.png"
              alt="FITLOG"
              className="h-6 w-auto object-contain"
            />
            <span>FITLOG</span>
          </div>
          <div>© 2026 FitLog — Workout Library. Train hard, log honest.</div>
        </div>
      </footer>
    </div>
  );
}
