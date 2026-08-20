"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./HeaderSearch.module.css";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [calcIndex, setCalcIndex] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);

  // Lazy load calculator index on focus
  const loadIndex = useCallback(async () => {
    if (calcIndex) return;
    try {
      const data = await import("@/data/calculators.json");
      const uniqueCalcs = (data.default || data).filter((c) => c.url && !c.url.includes("?"));
      setCalcIndex(uniqueCalcs);
    } catch {
      // Fallback
    }
  }, [calcIndex]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search matches debounced ~150ms
  const searchIndex = useCallback(
    (searchTerm, indexToSearch) => {
      if (!searchTerm.trim() || !indexToSearch) {
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        return;
      }

      const q = searchTerm.toLowerCase().trim();
      const matches = indexToSearch
        .filter((calc) => {
          const nameMatch = calc.name.toLowerCase().includes(q);
          const catMatch = calc.categoryName?.toLowerCase().includes(q) || calc.category?.toLowerCase().includes(q);
          const descMatch = calc.description?.toLowerCase().includes(q);
          const slugMatch = calc.slug?.toLowerCase().includes(q);
          return nameMatch || catMatch || descMatch || slugMatch;
        })
        .slice(0, 6);

      setResults(matches);
      setIsOpen(true);
      setSelectedIndex(-1);
    },
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      searchIndex(val, calcIndex);
    }, 150);
  };

  const handleFocus = () => {
    loadIndex();
    if (query.trim() && calcIndex) {
      searchIndex(query, calcIndex);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const targetUrl = results[selectedIndex].url;
        setIsOpen(false);
        router.push(targetUrl);
      } else if (results.length > 0) {
        setIsOpen(false);
        router.push(results[0].url);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (calcUrl) => {
    setIsOpen(false);
    router.push(calcUrl);
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <div className={styles.inputContainer}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Jump to a calculator…"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Search calculators"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {results.length > 0 ? (
            results.map((calc, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={calc.id || calc.slug}
                  className={`${styles.dropdownItem} ${isSelected ? styles.selected : ""}`}
                  onClick={() => handleSelect(calc.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className={styles.itemIcon}>{calc.icon || "🧮"}</span>
                  <div className={styles.itemMeta}>
                    <div className={styles.itemName}>{calc.name}</div>
                    <div className={styles.itemCategory}>{calc.categoryName}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>No calculators found for &ldquo;{query}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
}
