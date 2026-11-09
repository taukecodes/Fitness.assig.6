"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFitContext } from "@/context/FitContext";
import Link from "next/link";

export default function WorkoutDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { addToPlan, addToSaved, isAddedToPlan, isSaved } = useFitContext();

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`https://api.api-store.workers.dev/api/fitlog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkout(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching single workout:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-white">Loading details...</div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-20 text-white">Workout not found.</div>
    );
  }

  const workoutId = workout._id || workout.id;
  const added = isAddedToPlan(workoutId);
  const saved = isSaved(workoutId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
      <Link
        href="/"
        className="inline-block text-xs text-gray-400 hover:text-lime-400 mb-6"
      >
        ← Back to Library
      </Link>

      <div className="bg-[#181818] border border-gray-800 rounded-3xl overflow-hidden p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <img
            src={workout.image}
            alt={workout.name}
            className="w-full h-72 object-cover rounded-2xl bg-gray-900"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider mb-2 uppercase">
              {workout.name}
            </h1>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              {workout.description ||
                "Detailed workout plan for strength and conditioning."}
            </p>

            <div className="space-y-3 text-xs border-t border-gray-800 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">EQUIPMENT</span>{" "}
                <span className="font-semibold">
                  {workout.equipment || "Barbell"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">DIFFICULTY</span>{" "}
                <span className="font-semibold">
                  {workout.difficulty || "Intermediate"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SETS</span>{" "}
                <span className="font-semibold">{workout.sets || 3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">REPS</span>{" "}
                <span className="font-semibold">{workout.reps || "8-10"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">DURATION</span>{" "}
                <span className="font-semibold">
                  {workout.duration || 20} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CALORIES</span>{" "}
                <span className="font-semibold">
                  {workout.calories || 150} kcal
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RATING</span>{" "}
                <span className="font-semibold text-lime-400">
                  ⭐ {workout.rating || 4.8}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-gray-800 pt-6">
          <button
            onClick={() => addToPlan(workout)}
            disabled={added}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition ${
              added
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-lime-400 text-black hover:bg-lime-500"
            }`}
          >
            {added ? "Added to Plan" : "Add to Plan"}
          </button>
          <button
            onClick={() => addToSaved(workout)}
            disabled={saved}
            className={`px-6 py-3 rounded-xl text-xs font-bold border border-gray-800 transition ${
              saved
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#121212] text-gray-300 hover:border-lime-400"
            }`}
          >
            {saved ? "Saved" : "Save for Later"}
          </button>
        </div>
      </div>
    </div>
  );
}
