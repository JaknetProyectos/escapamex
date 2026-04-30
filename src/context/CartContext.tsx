"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Experience } from "@/data/experiences";

function getTarifaPorCantidad(tafiras: any[], cantidad: number) {
  return tafiras.find((t) => {
    if (t.max === null) return cantidad >= t.min;
    return cantidad >= t.min && cantidad <= t.max;
  });
}

export interface CartItem {
  experience: Experience;
  quantity: number;
  selectedDate?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addToCart: (experience: Experience, quantity?: number, date?: string) => void;
  removeFromCart: (experienceId: string) => void;
  updateQuantity: (experienceId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (experienceId: string) => boolean;
  getItem: (experienceId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "add-your-experience-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const total = items.reduce(
    (sum, item) => sum + item.experience.price * item.quantity,
    0
  );

  const addToCart = useCallback(
    (experience: Experience, quantity = 1, date?: string) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.experience.id === experience.id
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.experience.id === experience.id
              ? { ...item, quantity: item.quantity + quantity, selectedDate: date || item.selectedDate }
              : item
          );
        }

        return [...prevItems, { experience, quantity, selectedDate: date }];
      });
    },
    []
  );

  const removeFromCart = useCallback((experienceId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.experience.id !== experienceId)
    );
  }, []);

  const updateQuantity = useCallback(
    (experienceId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(experienceId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.experience.id !== experienceId) return item;

          let updatedExperience = item.experience;

          // 👉 recalcular precio si hay tafiras
          if (
            item.experience.tafiras &&
            item.experience.tafiras.length > 0
          ) {
            const tarifa = getTarifaPorCantidad(
              item.experience.tafiras,
              quantity
            );

            if (tarifa) {
              updatedExperience = {
                ...item.experience,
                price: tarifa.precioPorPersona,
              };
            }
          }

          return {
            ...item,
            quantity,
            experience: updatedExperience,
          };
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (experienceId: string) => items.some((item) => item.experience.id === experienceId),
    [items]
  );

  const getItem = useCallback(
    (experienceId: string) => items.find((item) => item.experience.id === experienceId),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
