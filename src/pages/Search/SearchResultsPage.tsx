import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ProductCard } from '../../components/products/ProductCard';
import { PRODUCTS } from '../../data/products';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(currentUrlQuery);

  // Sync state with URL parameter changes without cascading renders
  const [prevQuery, setPrevQuery] = useState(currentUrlQuery);
  if (prevQuery !== currentUrlQuery) {
    setPrevQuery(currentUrlQuery);
    setSearchQuery(currentUrlQuery);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery.trim() });
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((product) => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchFamily = product.fragranceFamily.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchNotes = [...product.topNotes, ...product.heartNotes, ...product.baseNotes].some((n) =>
        n.toLowerCase().includes(q)
      );
      return matchName || matchCategory || matchFamily || matchDesc || matchNotes;
    });
  }, [searchQuery]);

  return (
    <PageLayout
      bgHex="#F0F0ED" // Soft Silver
      isDark={false}
      title={searchQuery ? `Search: "${searchQuery}"` : 'Fragrance Search'}
      description="Search across the complete NOIRÉLLE perfume collection by fragrance name, botanical notes, or olfactory family."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-widest3 text-gold-700 font-semibold">
            Olfactory Search
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-noir-950 mt-2">
            Search The Maison Archive
          </h1>

          <form onSubmit={handleSearchSubmit} className="mt-8 relative flex items-center">
            <Search className="absolute left-4 text-stone-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scent name, family (Woody, Amber), or note (Saffron, Oud)..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-stone-300 rounded-full text-sm text-noir-900 placeholder-stone-400 focus:outline-none focus:border-gold-500 shadow-sm"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 text-stone-400 hover:text-stone-700 p-1"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {/* Quick Filter Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-stone-500">
            <span className="text-gold-800 font-medium">Popular queries:</span>
            {['Oud', 'Santal', 'Rose', 'Leather', 'Vanilla', 'Discovery Coffret'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSearchParams({ q: term });
                }}
                className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-gold-500 hover:text-gold-800 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Presentation */}
        {searchQuery ? (
          <div>
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-300">
              <p className="text-xs text-stone-600 font-sans">
                Found <strong className="text-noir-950">{searchResults.length}</strong> creations matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={handleClear}
                className="text-xs text-gold-800 underline underline-offset-4 hover:text-gold-950"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 max-w-xl mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
                  <Search size={22} />
                </div>
                <h3 className="font-serif text-2xl text-noir-900">No matching creations found</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  We could not locate any perfumes matching &ldquo;{searchQuery}&rdquo;. Check spelling or explore our fragrance families.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-noir-950 font-medium text-xs tracking-widest uppercase transition-colors"
                >
                  <span>Explore Complete Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} isDark={false} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-500 text-xs">
            <Sparkles size={20} className="mx-auto text-gold-600 mb-2" />
            <p>Enter an olfactory note or perfume title above to explore the archives.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
