import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/siteContent';
import { Eyebrow } from '../components/NepUI';

const News = () => {
  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-[72px] space-y-10">
      <div className="space-y-3 max-w-2xl">
        <Eyebrow>Giao hàng & bảo quản</Eyebrow>
        <h1 className="font-serif font-semibold text-[36px] sm:text-[48px] leading-[1.3] tracking-[-0.6px]">
          Vài điều để nem ngon trọn vẹn.
        </h1>
        <p className="text-[14px] leading-[1.6] text-nep-muted">
          Nếp viết ngắn, dễ đọc — để bạn yên tâm chọn món và thưởng thức đúng lúc.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-nep-paper border border-nep-line rounded-xl overflow-hidden">
        <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="lg:col-span-7 w-full h-[260px] sm:h-[360px] object-cover" />
        <div className="lg:col-span-5 p-6 sm:p-8 space-y-3">
          <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-nep-green">{BLOG_POSTS[0].category}</p>
          <h2 className="font-serif font-semibold text-[28px] leading-[1.3]">{BLOG_POSTS[0].title}</h2>
          <p className="text-[13px] leading-[1.6] text-nep-muted">{BLOG_POSTS[0].summary}</p>
          <p className="text-[12px] text-nep-muted">
            {BLOG_POSTS[0].date} · {BLOG_POSTS[0].readTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="space-y-3">
            <img src={post.image} alt={post.title} className="w-full h-[200px] object-cover rounded-xl" />
            <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-nep-green">{post.category}</p>
            <h3 className="font-serif font-semibold text-[20px] leading-[1.3]">
              <Link to={`/news/${post.id}`}>{post.title}</Link>
            </h3>
            <p className="text-[12px] leading-[1.6] text-nep-muted">{post.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;
