import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Shield,
  Truck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  Clock,
  Wind,
  Calendar,
  Compass
} from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ProductCard } from '../../components/products/ProductCard';
import { getProductBySlug, getRelatedProducts, PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';
import type { Product } from '../../types/product';

const RECENT_KEY = 'noirelle_recently_viewed_v1';

const getRecentlyViewed = (currentId?: string): Product[] => {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    if (!stored) return [];
    const list: string[] = JSON.parse(stored);
    return list
      .filter((id) => id !== currentId)
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  } catch {
    return [];
  }
};

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // State
  const [selectedSize, setSelectedSize] = useState<string>(() => product?.sizes[0]?.size || '100ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<'profile' | 'craft' | 'delivery' | null>('profile');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => getRecentlyViewed(product?.id));

  // Reset local interactive state when viewed product changes
  const [prevSlug, setPrevSlug] = useState(slug);
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    if (product) {
      setSelectedSize(product.sizes[0]?.size || '100ml');
    }
    setQuantity(1);
    setActiveImageIndex(0);
    setRecentlyViewed(getRecentlyViewed(product?.id));
  }

  // Track recently viewed items in external localStorage
  useEffect(() => {
    if (product) {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        let list: string[] = stored ? JSON.parse(stored) : [];
        list = list.filter((id) => id !== product.id);
        list.unshift(product.id);
        list = list.slice(0, 6);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <PageLayout bgHex="#F6F1E9" isDark={false} title="Fragrance Not Found">
        <div className="py-32 text-center max-w-xl mx-auto px-4">
          <h1 className="font-serif text-3xl font-light text-noir-950">Creation Unavailable</h1>
          <p className="mt-3 text-xs text-stone-600">
            The requested fragrance flacon could not be located in our current archives.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-500 text-noir-950 text-xs uppercase tracking-widest font-medium"
          >
            <span>Return to Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </PageLayout>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const relatedProducts = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    const success = addToCart(product, selectedSize, quantity);
    if (success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(product, selectedSize, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const toggleSection = (section: 'profile' | 'craft' | 'delivery') => {
    setOpenAccordion((curr) => (curr === section ? null : section));
  };

  return (
    <PageLayout
      bgHex="#F6F1E9" // Warm Ivory
      isDark={false}
      title={`${product.name} — ${product.concentration}`}
      description={product.description}
    >
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 text-xs text-stone-500 font-sans flex items-center gap-2">
        <Link to="/" className="hover:text-gold-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gold-700 transition-colors">Creations</Link>
        <span>/</span>
        <Link to={`/collections/${product.category}`} className="hover:text-gold-700 transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-noir-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Presentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-noir-950 border border-stone-300 shadow-luxury group flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.isBestseller && (
                  <span className="px-3 py-1 text-[11px] uppercase tracking-widest font-semibold bg-gold-500 text-noir-950 rounded shadow-md">
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 text-[11px] uppercase tracking-widest font-medium bg-noir-900/90 text-gold-300 border border-gold-500/30 rounded backdrop-blur-md">
                    New Millésime
                  </span>
                )}
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-md ${
                  inWishlist
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 backdrop-blur-md text-stone-700 hover:text-rose-500 hover:bg-white'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-24 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-gold-600 ring-2 ring-gold-500/20'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1 bg-noir-950" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Details & Purchasing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              {/* Classification Tag */}
              <div className="flex items-center justify-between text-xs tracking-widest uppercase font-medium text-gold-800">
                <span>{product.gender} • {product.fragranceFamily} Family</span>
                <span>{product.origin}</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-serif text-3xl sm:text-5xl font-light text-noir-950 tracking-wide leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm font-sans tracking-widest uppercase text-stone-500">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-gold-700">
                  ${currentSizeObj?.price || product.price} USD
                </span>
                {currentSizeObj?.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    ${currentSizeObj.originalPrice}
                  </span>
                )}
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                  {currentSizeObj?.inStock ? 'Ready for Immediate Dispatch' : 'Awaiting Next Compounding'}
                </span>
              </div>

              {/* Editorial Description */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans pt-2">
                {product.description}
              </p>

              {/* Olfactory Pyramid Display */}
              <div className="p-5 rounded-2xl bg-white/70 border border-stone-200 space-y-3.5 my-6">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-xs uppercase tracking-widest text-gold-800 font-semibold">
                  <Compass size={14} />
                  <span>The Olfactory Pyramid</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">
                      Head Notes:
                    </span>
                    <span className="font-serif text-sm text-noir-900 font-medium">
                      {product.topNotes.join(' • ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">
                      Heart Notes:
                    </span>
                    <span className="font-serif text-sm text-noir-900 font-medium">
                      {product.heartNotes.join(' • ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">
                      Base Notes:
                    </span>
                    <span className="font-serif text-sm text-noir-900 font-medium">
                      {product.baseNotes.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs uppercase tracking-widest text-noir-900 font-semibold">
                    Select Volume
                  </label>
                  <span className="text-xs text-stone-500">
                    {currentSizeObj?.stockQuantity} flacons remaining
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQuantity(1);
                      }}
                      disabled={!s.inStock}
                      className={`py-3 px-3 rounded-xl border text-center transition-all ${
                        selectedSize === s.size
                          ? 'border-gold-600 bg-white ring-2 ring-gold-500/20 shadow-sm'
                          : 'border-stone-200 bg-white/50 text-stone-600 hover:border-gold-500'
                      } ${!s.inStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    >
                      <p className="text-xs font-semibold text-noir-950 font-sans">{s.size}</p>
                      <p className="text-[11px] font-serif text-gold-700 mt-0.5">${s.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs uppercase tracking-widest text-noir-900 font-semibold">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:text-noir-950"
                    aria-label="Decrease"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentSizeObj?.stockQuantity || 10, q + 1))}
                    disabled={quantity >= (currentSizeObj?.stockQuantity || 10)}
                    className="px-3 py-2 text-stone-600 hover:text-noir-950 disabled:opacity-30"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 px-6 rounded-xl font-medium text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-luxury ${
                      addedToast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gold-500 hover:bg-gold-400 text-noir-950 hover:shadow-gold-glow'
                    }`}
                  >
                    {addedToast ? (
                      <>
                        <Check size={16} /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add to Bag — ${(currentSizeObj?.price || product.price) * quantity}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="sm:w-1/3 py-4 px-6 rounded-xl bg-noir-900 hover:bg-noir-950 text-page-home font-medium text-xs tracking-widest uppercase transition-colors"
                  >
                    Buy Now
                  </button>
                </div>

                {/* WhatsApp Concierge Inquiry Button */}
                <a
                  href={getProductWhatsAppUrl(product, selectedSize, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gold-600/40 bg-white/60 hover:bg-white text-gold-900 font-medium text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <span>Inquire on WhatsApp with Private Concierge</span>
                  <ExternalLink size={13} />
                </a>
                <p className="text-[10px] text-center text-stone-500">
                  Notice: WhatsApp communication is an advisory inquiry and does not charge your card.
                </p>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gold-700" />
                  <span>Complimentary Shipping over $150</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={15} className="text-gold-700" />
                  <span>Sealed Flacon Authenticity Guarantee</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-stone-200 divide-y divide-stone-200 pt-2">
              {/* Scent Profile Accordion */}
              <div>
                <button
                  onClick={() => toggleSection('profile')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-base text-noir-900 font-medium"
                >
                  <span>Scent Profile, Longevity & Sillage</span>
                  {openAccordion === 'profile' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'profile' && (
                  <div className="pb-4 text-xs text-stone-600 space-y-2 font-sans animate-fadeIn">
                    <p className="leading-relaxed">{product.story}</p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-gold-700" />
                        <span><strong>Longevity:</strong> {product.longevity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind size={13} className="text-gold-700" />
                        <span><strong>Sillage:</strong> {product.sillage}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-gold-700" />
                        <span><strong>Season:</strong> {product.season}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Craftsmanship Accordion */}
              <div>
                <button
                  onClick={() => toggleSection('craft')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-base text-noir-900 font-medium"
                >
                  <span>Artisanal Compounding & Ingredients</span>
                  {openAccordion === 'craft' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'craft' && (
                  <div className="pb-4 text-xs text-stone-600 space-y-2 font-sans leading-relaxed animate-fadeIn">
                    <p>
                      Formulated in our Grasse studio at {product.concentration} strength. Free from synthetic colorants, phthalates, and unnecessary chemical stabilizers.
                    </p>
                    <p>
                      The flacon is crafted from heavy optical crystal with our hand-finished octagonal silhouette and engraved champagne gold atomizer cap.
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Accordion */}
              <div>
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-base text-noir-900 font-medium"
                >
                  <span>White Glove Presentation & Delivery</span>
                  {openAccordion === 'delivery' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pb-4 text-xs text-stone-600 space-y-2 font-sans leading-relaxed animate-fadeIn">
                    <p>
                      Every flacon arrives nestled in our custom matte black presentation box with embossed champagne gold crest and silk ribbons.
                    </p>
                    <p>
                      Includes a complimentary matching 2ml discovery vial. Test the discovery vial first; if the scent does not suit your skin, the sealed full-size flacon may be returned within 30 days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Fragrances Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest text-gold-700 font-semibold">
                Olfactory Harmonies
              </span>
              <h2 className="font-serif text-3xl font-light text-noir-950 mt-1">
                You May Also Appreciate
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} isDark={false} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Fragrances Section */}
        {recentlyViewed.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <h3 className="font-serif text-xl font-light text-noir-900 mb-6">
              Recently Explored Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} isDark={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
