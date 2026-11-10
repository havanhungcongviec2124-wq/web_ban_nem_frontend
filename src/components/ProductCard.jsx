import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatVnd } from './NepUI';

const ProductCard = ({ product }) => {
  const { openSpiceModal } = useCart();
  const navigate = useNavigate();
  const isCombo = product.category === 'combo';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCombo) {
      navigate(`/product/${product.id}`);
      return;
    }
    openSpiceModal(product);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Link to={`/product/${product.id}`} className="relative block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[254px] object-cover rounded-xl"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-nep-mint text-nep-green text-[11px] font-medium px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      <Link to={`/product/${product.id}`} className="font-serif font-semibold text-[21px] leading-[1.4] text-nep-ink">
        {product.name}
      </Link>
      <p className="text-[12px] text-nep-muted">{product.pack || product.shortDesc}</p>

      <div className="flex items-center justify-between">
        <p className="text-[16px] font-semibold text-nep-rose">{formatVnd(product.price)}</p>
        <button
          type="button"
          onClick={handleAdd}
          className="size-10 rounded-full border border-nep-line flex items-center justify-center bg-transparent"
          aria-label="Chọn món"
        >
          <img src="/assets/plus.svg" alt="" width={17} height={17} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
