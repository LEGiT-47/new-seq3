import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { Search, PackageCheck, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { productAPI, getImageUrl } from '../lib/api';
import { buildWhatsAppEnquiryLink, getDisplayProductName } from '../lib/productUtils';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        const list = response?.data?.data || [];
        setProducts(list.filter((p) => !p.isHidden));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const options = useMemo(() => {
    return products.map((item) => {
      const id = item._id || item.id;
      const name = getDisplayProductName(item);
      const flavour = item.flavour ? ` | ${item.flavour}` : '';
      const type = item.productType === 'deliverable' ? 'Deliverable' : 'Enquiry';
      return {
        value: id,
        label: `${name}${flavour}`,
        type,
        product: item,
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products
      .filter((item) => {
        if (typeFilter !== 'all' && item.productType !== typeFilter) return false;

        if (!q) return true;

        const haystack = [
          item.name,
          getDisplayProductName(item),
          item.flavour,
          item.parentProduct,
          item.category,
          item.productType,
          item.weight,
          item.tagline,
          item.shortDescription,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        if (a.productType === b.productType) return getDisplayProductName(a).localeCompare(getDisplayProductName(b));
        return a.productType === 'deliverable' ? -1 : 1;
      });
  }, [products, query, typeFilter]);

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8762A]">Product Finder</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#0B1D35] sm:text-5xl">Search All Products</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-500">
            Browse every product in one place including deliverable and enquiry-only items.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-[#F9F9F7] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <Select
                isClearable
                options={options}
                placeholder="Search by product name or flavour"
                onChange={(selected) => {
                  if (selected?.label) {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('q', selected.label);
                      return next;
                    });
                  }
                }}
                filterOption={(candidate, input) => {
                  const text = `${candidate.label} ${candidate.data?.product?.category || ''} ${candidate.data?.product?.productType || ''}`.toLowerCase();
                  return text.includes(input.toLowerCase());
                }}
                formatOptionLabel={(option) => (
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-[#0B1D35]">{option.label}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                      {option.type}
                    </span>
                  </div>
                )}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: 48,
                    borderRadius: 12,
                    borderColor: state.isFocused ? '#E8762A' : '#E5E7EB',
                    boxShadow: state.isFocused ? '0 0 0 1px #E8762A' : 'none',
                    '&:hover': { borderColor: '#E8762A' },
                  }),
                  menu: (base) => ({ ...base, borderRadius: 12, overflow: 'hidden' }),
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${typeFilter === 'all' ? 'bg-[#0B1D35] text-white' : 'bg-white text-gray-600'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('deliverable')}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${typeFilter === 'deliverable' ? 'bg-[#0B1D35] text-white' : 'bg-white text-gray-600'}`}
              >
                Deliverable
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('enquiry')}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${typeFilter === 'enquiry' ? 'bg-[#0B1D35] text-white' : 'bg-white text-gray-600'}`}
              >
                Enquiry
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <Search className="h-4 w-4" />
          <span>{loading ? 'Loading products...' : `${filteredProducts.length} products found`}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((item) => (
            <Link key={item._id || item.id} to={`/product/${item._id || item.id}`}>
              <Card className="group h-full overflow-hidden rounded-2xl border-0 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-strong">
                <img
                  src={getImageUrl(item.image)}
                  alt={getDisplayProductName(item)}
                  className="h-44 w-full object-cover"
                />
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                      {item.productType === 'deliverable' ? 'Deliverable' : 'Enquiry'}
                    </span>
                    {item.flavour && (
                      <span className="rounded-full bg-[#E8762A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#B55312]">
                        {item.flavour}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-base font-bold text-[#0B1D35]">{getDisplayProductName(item)}</p>
                  {item.productType === 'deliverable' ? (
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#0B1D35]">Rs. {item.price}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <PackageCheck className="h-3.5 w-3.5" />
                        In Stock
                      </span>
                    </div>
                  ) : (
                    <Button
                      className="w-full rounded-full bg-[#25D366] text-sm font-semibold hover:bg-[#1fa959]"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a href={buildWhatsAppEnquiryLink(item)} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Enquire
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
