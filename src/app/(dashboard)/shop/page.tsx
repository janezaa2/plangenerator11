"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ShoppingCart, Star, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cartStore";

const CATEGORIES = [
  { value: "", label: "All Products" },
  { value: "protein", label: "Protein" },
  { value: "vitamins", label: "Vitamins" },
  { value: "healthy_snacks", label: "Healthy Snacks" },
  { value: "kitchen_equipment", label: "Kitchen Equipment" },
  { value: "fitness_accessories", label: "Fitness Accessories" },
  { value: "smart_devices", label: "Smart Devices" },
];

export default function ShopPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const { addItem, items, getTotalItems } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ["products", category, search],
    queryFn: () =>
      axios
        .get(`/api/products?${category ? `category=${category}&` : ""}${search ? `search=${search}` : ""}`)
        .then((r) => r.data),
  });

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Shop</h1>
          <p className="text-gray-500 mt-1">AI-recommended supplements and products</p>
        </div>
        <a
          href="/shop/cart"
          className="relative flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </a>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors",
                category === cat.value
                  ? "bg-green-500 text-white border-green-500"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-3" />
              <div className="bg-gray-200 h-4 rounded mb-2" />
              <div className="bg-gray-200 h-3 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-green-400" />
                  </div>
                )}
                {product.comparePrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
                  {product.category?.replace("_", " ")}
                </span>
                <h3 className="font-semibold text-gray-900 mt-1 text-sm line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating?.toFixed(1)} ({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">${product.comparePrice?.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem({ ...product, id: product._id })}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
