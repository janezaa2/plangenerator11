"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [shipping, setShipping] = useState({
    fullName: "", address: "", city: "", state: "", country: "US", zipCode: "",
  });

  const orderMutation = useMutation({
    mutationFn: (data: any) => axios.post("/api/orders", data),
    onSuccess: () => {
      clearCart();
      setStep("success");
    },
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  if (step === "success") {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Your order has been successfully placed. You'll receive a confirmation email shortly.</p>
        <Link href="/shop" className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <Link href="/shop" className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/shop" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === "cart" ? "Shopping Cart" : "Checkout"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {step === "cart" ? (
            <>
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
              {[
                { key: "fullName", label: "Full Name", placeholder: "John Doe" },
                { key: "address", label: "Address", placeholder: "123 Main St" },
                { key: "city", label: "City", placeholder: "New York" },
                { key: "state", label: "State", placeholder: "NY" },
                { key: "zipCode", label: "ZIP Code", placeholder: "10001" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={shipping[key as keyof typeof shipping]}
                    onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 h-fit">
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {step === "cart" ? (
            <button
              onClick={() => setStep("checkout")}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600"
            >
              Proceed to Checkout
            </button>
          ) : (
            <button
              onClick={() => orderMutation.mutate({
                items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image || "" })),
                shippingAddress: shipping,
              })}
              disabled={orderMutation.isPending}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
            >
              {orderMutation.isPending ? "Placing Order..." : "Place Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
