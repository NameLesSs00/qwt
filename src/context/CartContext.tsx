import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  tripId: number;
  tripName: string;
  tripImage: string;
  destination: string;
  date: string; // YYYY-MM-DD
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (tripId: number, date: string) => void;
  clearCart: () => void;
  packageTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('qwt_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('qwt_cart', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart items to localStorage', err);
    }
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if we already have this trip for the same date
      const existingIndex = prevItems.findIndex(
        (i) => i.tripId === newItem.tripId && i.date === newItem.date
      );

      if (existingIndex >= 0) {
        // Update quantities
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          adultCount: updatedItems[existingIndex].adultCount + newItem.adultCount,
          childCount: updatedItems[existingIndex].childCount + newItem.childCount,
        };
        return updatedItems;
      }
      
      // Otherwise add new item
      return [...prevItems, newItem];
    });
  };

  const removeItem = (tripId: number, date: string) => {
    setItems((prevItems) => prevItems.filter(
      (item) => !(item.tripId === tripId && item.date === date)
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const packageTotal = items.reduce(
    (acc, item) => acc + (item.adultCount * item.adultPrice) + (item.childCount * item.childPrice),
    0
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, packageTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
