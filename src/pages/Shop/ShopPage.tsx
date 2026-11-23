import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ProductCard } from '../../components/products/ProductCard';
import { PRODUCTS } from '../../data/products';
import type { SortOption } from '../../types/product';
import { FRAGRANCE_FAMILIES } from '../../data/collections';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const categoryParam = searchParams.get('category') || 'all';
  const genderParam = searchParams.get('gender') || 'all';
  const familyParam = searchParams.get('family') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';
  const searchParam = searchParams.get('search') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedGender, setSelectedGender] = useState<string>(genderParam);
  const [selectedFamily, setSelectedFamily] = useState<string>(familyParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [maxPrice, setMaxPrice] = useState<number>(550);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Sync state with URL changes during render without cascading effects
  const [prevParamsString, setPrevParamsString] = useState(searchParams.toString());
  if (prevParamsString !== searchParams.toString()) {
    setPrevParamsString(searchParams.toString());
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedGender(searchParams.get('gender') || 'all');
    setSelectedFamily(searchParams.get('family') || 'all');
    setSortBy((searchParams.get('sort') as SortOption) || 'featured');
    if (searchParams.get('search') !== null) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }

  // Update URL params helper
  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'all') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateParams({ category: cat });
  };

  const handleGenderChange = (gen: string) => {
    setSelectedGender(gen);
    updateParams({ gender: gen });
  };

  const handleFamilyChange = (fam: string) => {
    setSelectedFamily(fam);
    updateParams({ family: fam });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateParams({ sort });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedFamily('all');
    setSortBy('featured');
    setMaxPrice(550);
    setInStockOnly(false);
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'all' && product.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }
      // Fragrance family
      if (selectedFamily !== 'all' && product.fragranceFamily.toLowerCase() !== selectedFamily.toLowerCase()) {
        return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      // In Stock
      if (inStockOnly && !product.inStock) {
        return false;
      }
      // Live search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesFamily = product.fragranceFamily.toLowerCase().includes(query);
        const matchesNotes = [...product.topNotes, ...product.heartNotes, ...product.baseNotes].some((n) =>
          n.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesFamily && !matchesNotes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'bestselling') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // featured default
    });
  }, [selectedCategory, selectedGender, selectedFamily, maxPrice, inStockOnly, searchQuery, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedFamily !== 'all' ? 1 : 0) +
    (maxPrice < 550 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <PageLayout
      bgHex="#FAF9F6" // Pearl White
      isDark={false}
      title="Complete Haute Parfumerie Catalog"
      description="Explore the full collection of NOIRÉLLE luxury fragrances. Filter by olfactory family, concentration, or gender."
    >
      {/* Editorial Header */}
      <div className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest3 text-gold-600 font-semibold">
          Haute Parfumerie Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-noir-950 mt-2 tracking-wide">
          The Complete Collection
        </h1>
        <p className="mt-4 text-sm sm:text-base text-noir-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Explore our twenty master creations, each formulated in Grasse with high extrait oil concentrations and housed in signature octagonal crystal flacons.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar: Search, Filters toggle, Sorting, Count */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-8 border-b border-stone-200">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateParams({ search: e.target.value });
              }}
              placeholder="Search by scent name, or note (e.g. Saffron, Sandalwood)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-full text-xs text-noir-900 placeholder-stone-400 focus:outline-none focus:border-gold-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateParams({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle & Sort Select */}
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 rounded-full text-xs font-medium text-noir-800 shadow-sm hover:border-gold-500"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-sans hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-white border border-stone-300 rounded-full px-4 py-2.5 text-xs text-noir-800 font-sans focus:outline-none focus:border-gold-500 shadow-sm cursor-pointer"
              >
                <option value="featured">Featured Creations</option>
                <option value="newest">Newest Millésimes</option>
                <option value="bestselling">Bestselling Scents</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Desktop Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="font-serif text-base uppercase tracking-wider font-semibold text-noir-950">
                Filter Portfolios
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] text-gold-700 hover:text-gold-900 font-medium"
                >
                  <RotateCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-noir-900 font-semibold mb-3">
                Collection
              </h3>
              <div className="space-y-1.5 text-xs text-noir-700 font-sans">
                {[
                  { id: 'all', label: 'All Collections' },
                  { id: 'men', label: "Men's Fragrances" },
                  { id: 'women', label: "Women's Fragrances" },
                  { id: 'unisex', label: 'Unisex Fragrances' },
                  { id: 'oud', label: 'Oud & Oriental' },
                  { id: 'luxury', label: 'Haute Parfumerie' },
                  { id: 'gift-sets', label: 'Luxury Gift Sets' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryChange(item.id)}
                    className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                      selectedCategory === item.id
                        ? 'bg-gold-500/15 text-gold-900 font-semibold border-l-2 border-gold-600'
                        : 'hover:text-gold-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-noir-900 font-semibold mb-3">
                Intended Persona
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Men', 'Women', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGenderChange(g)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      selectedGender.toLowerCase() === g.toLowerCase()
                        ? 'bg-gold-500 text-noir-950 font-semibold shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-gold-500'
                    }`}
                  >
                    {g === 'all' ? 'All Personas' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Family Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-noir-900 font-semibold mb-3">
                Olfactory Family
              </h3>
              <div className="space-y-1.5 text-xs text-noir-700 font-sans">
                <button
                  onClick={() => handleFamilyChange('all')}
                  className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                    selectedFamily === 'all'
                      ? 'bg-gold-500/15 text-gold-900 font-semibold border-l-2 border-gold-600'
                      : 'hover:text-gold-700'
                  }`}
                >
                  All Olfactory Families
                </button>
                {FRAGRANCE_FAMILIES.map((fam) => (
                  <button
                    key={fam.name}
                    onClick={() => handleFamilyChange(fam.name)}
                    className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                      selectedFamily.toLowerCase() === fam.name.toLowerCase()
                        ? 'bg-gold-500/15 text-gold-900 font-semibold border-l-2 border-gold-600'
                        : 'hover:text-gold-700'
                    }`}
                  >
                    {fam.name} ({fam.description.split(',')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs uppercase tracking-widest text-noir-900 font-semibold">
                  Max Price
                </h3>
                <span className="text-xs font-serif font-bold text-gold-700">${maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="180"
                max="550"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>$180</span>
                <span>$550</span>
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-noir-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-gold-600 focus:ring-gold-500 accent-gold-600 h-4 w-4"
                />
                <span>In Stock & Ready for Dispatch</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone-100 rounded-xl text-xs">
                <span className="text-stone-500 font-medium">Applied Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-noir-800">
                    Category: {selectedCategory}
                    <button onClick={() => handleCategoryChange('all')}><X size={12} /></button>
                  </span>
                )}
                {selectedGender !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-noir-800">
                    Persona: {selectedGender}
                    <button onClick={() => handleGenderChange('all')}><X size={12} /></button>
                  </span>
                )}
                {selectedFamily !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-noir-800">
                    Family: {selectedFamily}
                    <button onClick={() => handleFamilyChange('all')}><X size={12} /></button>
                  </span>
                )}
                {maxPrice < 550 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-noir-800">
                    &lt; ${maxPrice}
                    <button onClick={() => setMaxPrice(550)}><X size={12} /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-noir-800">
                    In Stock
                    <button onClick={() => setInStockOnly(false)}><X size={12} /></button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-gold-700 underline ml-auto text-[11px] font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6 text-xs text-stone-500 font-sans">
              <span>Showing <strong className="text-noir-900">{filteredProducts.length}</strong> creations</span>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-2xl border border-stone-200 p-8">
                <p className="font-serif text-2xl text-noir-900">No creations match your selected filters</p>
                <p className="text-xs text-noir-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Try broadening your price range, clearing active olfactory filters, or searching for a different keyword.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-noir-950 font-medium text-xs tracking-widest uppercase transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isDark={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="font-serif text-lg font-semibold text-noir-950">Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Collections */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-2">Collection</h4>
                <div className="space-y-1 text-xs">
                  {['all', 'men', 'women', 'unisex', 'oud', 'luxury', 'gift-sets'].map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCategoryChange(c)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${
                        selectedCategory === c ? 'bg-gold-500/20 font-bold text-gold-900' : ''
                      }`}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Olfactory Family */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-2">Olfactory Family</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFamilyChange('all')}
                    className={`px-2.5 py-1 text-xs rounded border ${
                      selectedFamily === 'all' ? 'bg-gold-500 text-noir-950 font-bold' : 'border-stone-200'
                    }`}
                  >
                    All
                  </button>
                  {FRAGRANCE_FAMILIES.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => handleFamilyChange(f.name)}
                      className={`px-2.5 py-1 text-xs rounded border ${
                        selectedFamily.toLowerCase() === f.name.toLowerCase()
                          ? 'bg-gold-500 text-noir-950 font-bold'
                          : 'border-stone-200'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3 bg-gold-500 text-noir-950 font-medium text-xs tracking-widest uppercase rounded-xl"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 text-stone-500 text-xs underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
