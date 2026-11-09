"use client";

import React, { useState, useEffect } from "react";
import { useFitContext } from "@/context/FitContext";
import Link from "next/link";

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
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
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-xl">Loading workout details...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-xl text-red-400">Workout not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-[#181818] p-6 rounded-2xl border border-gray-800">
        <Link
          href="/"
          className="text-red-400 hover:underline mb-6 inline-block"
        >
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-4">
          {workout.title || workout.name}
        </h1>
        <p className="text-gray-400 mb-6">{workout.description}</p>

        <div className="flex gap-4 mb-6">
          <span className="bg-gray-800 px-3 py-1 rounded-lg text-sm">
            Duration: {workout.duration} mins
          </span>
          <span className="bg-gray-800 px-3 py-1 rounded-lg text-sm">
            Calories: {workout.calories} kcal
          </span>
        </div>

        <button
          onClick={() => addToPlan(workout)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold transition"
        >
          {isAddedToPlan(workout.id || workout._id)
            ? "Added to Plan"
            : "Add to My Plan"}
        </button>
      </div>
    </div>
  );
}
