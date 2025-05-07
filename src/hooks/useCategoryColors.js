// src/hooks/useCategoryColors.js
import { useState, useEffect } from "react";

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function useCategoryColors(categories) {
  const [categoryColors, setCategoryColors] = useState({});

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const storedColors = JSON.parse(
      localStorage.getItem("categoryColors") || "{}"
    );
    const newColors = { ...storedColors };

    let updated = false;
    categories.forEach((cat) => {
      if (!newColors[cat]) {
        newColors[cat] = generateRandomColor();
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("categoryColors", JSON.stringify(newColors));
    }

    setCategoryColors(newColors);
  }, [categories]);

  return { categoryColors };
}
