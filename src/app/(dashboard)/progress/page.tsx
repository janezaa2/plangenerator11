"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, Droplets, Flame, Scale } from "lucide-react";

export default function ProgressPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ weight: "", caloriesConsumed: "", waterIntake: "", notes: "" });

  const { data: progressData = [] } = useQuery({
    queryKey: ["progress"],
    queryFn: () => axios.get("/api/progress?days=30").then((r) => r.data),
  });

  const logMutation = useMutation({
    mutationFn: (data: any) => axios.post("/api/progress", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      setForm({ weight: "", caloriesConsumed: "", waterIntake: "", notes: "" });
    },
  });

  const chartData = progressData
    .slice()
    .reverse()
    .map((p: any) => ({
      date: format(new Date(p.date), "MMM d"),
      weight: p.weight,
      calories: p.caloriesConsumed,
      water: p.waterIntake ? (p.waterIntake / 1000).toFixed(1) : null,
    }));

  const latest = progressData[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logMutation.mutate({
      weight: form.weight ? parseFloat(form.weight) : undefined,
      caloriesConsumed: form.caloriesConsumed ? parseInt(form.caloriesConsumed) : undefined,
      waterIntake: form.waterIntake ? parseFloat(form.waterIntake) * 1000 : undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor your health journey over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Latest Weight</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{latest?.weight || "--"} <span className="text-lg text-gray-400">kg</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-500">Calories Today</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{latest?.caloriesConsumed || "--"} <span className="text-lg text-gray-400">kcal</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Water Today</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {latest?.waterIntake ? (latest.waterIntake / 1000).toFixed(1) : "--"} <span className="text-lg text-gray-400">L</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Weight Over Time
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12">Log progress to see chart</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Calorie Intake
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12">Log progress to see chart</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Log Today's Progress</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 75.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)</label>
            <input
              type="number"
              value={form.caloriesConsumed}
              onChange={(e) => setForm({ ...form, caloriesConsumed: e.target.value })}
              placeholder="e.g. 1800"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Water (liters)</label>
            <input
              type="number"
              step="0.1"
              value={form.waterIntake}
              onChange={(e) => setForm({ ...form, waterIntake: e.target.value })}
              placeholder="e.g. 2.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="How do you feel?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={logMutation.isPending}
              className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
            >
              {logMutation.isPending ? "Saving..." : "Log Progress"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
