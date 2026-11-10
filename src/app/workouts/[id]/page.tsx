"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFitContext } from "@/context/FitContext";

interface Workout {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  muscle?: string;
  category?: string[];
  description?: string;
  equipment?: string;
  difficulty?: string;
  sets?: number;
  reps?: string;
  duration?: number;
  calories?: number;
  rating?: number;
  instructions?: string[];
}

function WorkoutDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const {
    addToPlan,
    removeFromPlan,
    addToSaved,
    removeFromSaved,
    isAddedToPlan,
    isSaved,
  } = useFitContext();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError("");

        // First, get the exact workout clicked on Home Page
        const storedWorkout = sessionStorage.getItem("fitlog-selected-workout");

        if (storedWorkout) {
          const parsedWorkout: Workout = JSON.parse(storedWorkout);

          const storedId = String(parsedWorkout._id || parsedWorkout.id || "");

          if (storedId === String(id) && parsedWorkout.image) {
            setWorkout(parsedWorkout);
            setLoading(false);
            return;
          }
        }

        // If no matching stored workout, fetch from API
        const response = await fetch(
          "https://api.api-store.workers.dev/api/fitlog",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workout data");
        }

        const result = await response.json();

        const workouts: Workout[] = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : [];

        const selectedWorkout = workouts.find(
          (item) => String(item._id || item.id) === String(id),
        );

        if (!selectedWorkout) {
          throw new Error("Workout not found!");
        }

        setWorkout(selectedWorkout);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkout();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-lime-400 font-bold animate-pulse">
          Loading workout details...
        </p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-red-400">
          {error || "Workout not found"}
        </h2>

        <Link
          href="/"
          className="bg-lime-400 text-black px-6 py-3 rounded-xl font-bold"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const workoutId = String(workout._id || workout.id || id);

  const added = isAddedToPlan(workoutId);
  const saved = isSaved(workoutId);

  const tags = workout.muscle ? [workout.muscle] : workout.category || [];

  const instructions = Array.isArray(workout.instructions)
    ? workout.instructions
    : [];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-block text-red-400 hover:text-red-300 mb-6 text-sm font-semibold"
        >
          ← Back to Home
        </Link>

        <div className="bg-[#181818] border border-gray-800 rounded-2xl p-5 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Workout Image */}
            <div>
              <img
                src={workout.image}
                alt={workout.name}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl bg-gray-900"
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-lime-900/50 text-lime-400 px-3 py-1 rounded-full text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Workout Information */}
            <div>
              <h1 className="text-3xl font-black mb-3">{workout.name}</h1>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {workout.description || "No description available."}
              </p>

              <div className="border border-gray-800 rounded-xl px-4">
                {[
                  ["EQUIPMENT", workout.equipment || "Not specified"],
                  ["DIFFICULTY", workout.difficulty || "Not specified"],
                  ["SETS", workout.sets ?? "N/A"],
                  ["REPS", workout.reps || "N/A"],
                  ["DURATION", `${workout.duration ?? 25} mins`],
                  ["CALORIES", `${workout.calories ?? 180} kcal`],
                  ["RATING", `⭐ ${workout.rating ?? "N/A"}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 gap-3 text-xs"
                  >
                    <span className="text-gray-400">{label}</span>

                    <span className="font-bold text-white text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={() =>
                    added ? removeFromPlan(workoutId) : addToPlan(workout)
                  }
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${
                    added
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-lime-400 hover:bg-lime-500 text-black"
                  }`}
                >
                  {added ? "Remove from plan" : "Add to today's plan"}
                </button>

                <button
                  onClick={() =>
                    saved ? removeFromSaved(workoutId) : addToSaved(workout)
                  }
                  className={`px-5 py-3 rounded-xl border text-sm font-bold transition ${
                    saved
                      ? "border-lime-400 text-lime-400"
                      : "border-gray-700 text-white hover:border-lime-400"
                  }`}
                >
                  {saved ? "Saved" : "Save for later"}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {instructions.length > 0 && (
            <div className="border-t border-gray-800 mt-7 pt-6">
              <h2 className="text-lg font-black mb-4">INSTRUCTIONS</h2>

              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-300">
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkoutDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
          <p className="text-lime-400 font-bold animate-pulse">
            Loading workout...
          </p>
        </div>
      }
    >
      <WorkoutDetailContent />
    </Suspense>
  );
}
