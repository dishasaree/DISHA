'use client';

import { useState } from 'react';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length > 0 ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000'];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-maroon-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={list[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? 'border-maroon-600' : 'border-transparent'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
