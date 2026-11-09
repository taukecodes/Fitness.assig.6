"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

interface IWorkout {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  category?: string[];
  equipment?: string;
  difficulty?: string;
  sets?: number;
  reps?: string;
  duration?: number;
  calories?: number;
  rating?: number;
  description?: string;
}

interface IFitContextType {
  planList: IWorkout[];
  savedList: IWorkout[];
  addToPlan: (workout: IWorkout) => void;
  addToSaved: (workout: IWorkout) => void;
  removeFromPlan: (id: string) => void;
  removeFromSaved: (id: string) => void;
  markAsDone: (id: string) => void;
  isAddedToPlan: (id: string) => boolean;
  isSaved: (id: string) => boolean;
}

const FitContext = createContext<IFitContextType | undefined>(undefined);

export const FitProvider = ({ children }: { children: ReactNode }) => {
  const [planList, setPlanList] = useState<IWorkout[]>([]);
  const [savedList, setSavedList] = useState<IWorkout[]>([]);

  const isAddedToPlan = (id: string) => {
    return planList.some((item) => (item._id || item.id) === id);
  };

  const isSaved = (id: string) => {
    return savedList.some((item) => (item._id || item.id) === id);
  };

  const addToPlan = (workout: IWorkout) => {
    const id = workout._id || workout.id;
    if (!id) return;
    if (isAddedToPlan(id)) {
      toast.error("Already added to today's plan!");
      return;
    }
    setPlanList((prev) => [...prev, workout]);
    toast.success("Added to today's plan successfully!");
  };

  const addToSaved = (workout: IWorkout) => {
    const id = workout._id || workout.id;
    if (!id) return;
    if (isSaved(id)) {
      toast.error("Already saved for later!");
      return;
    }
    setSavedList((prev) => [...prev, workout]);
    toast.success("Saved for later successfully!");
  };

  const removeFromPlan = (id: string) => {
    setPlanList((prev) => prev.filter((item) => (item._id || item.id) !== id));
    toast.success("Removed from plan");
  };

  const removeFromSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => (item._id || item.id) !== id));
    toast.success("Removed from saved list");
  };

  const markAsDone = (id: string) => {
    removeFromPlan(id);
    toast.success("Workout marked as done!");
  };

  return (
    <FitContext.Provider
      value={{
        planList,
        savedList,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        markAsDone,
        isAddedToPlan,
        isSaved,
      }}
    >
      {children}
    </FitContext.Provider>
  );
};

export const useFitContext = () => {
  const context = useContext(FitContext);
  if (!context)
    throw new Error("useFitContext must be used within a FitProvider");
  return context;
};
