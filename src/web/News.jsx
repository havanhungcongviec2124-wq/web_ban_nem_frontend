import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/mockData';
import { IconArrowRight } from '../components/Icons';

const News = () => {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
            Kiến Thức & Cẩm Nang
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Cẩm Nang Nem Chua Xứ Thanh
          </h1>
          <p className="text-stone-600 text-sm">
            Chia sẻ bí quyết bảo quản nem, cách nướng nem Thọ Xuân thơm nức và kiến thức nhận biết nem lên men tự nhiên an toàn.
          </p>
        </div>

        {/* Featured blog post */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 aspect-16/10 w-full overflow-hidden">
            <img 
              src={BLOG_POSTS[0].image} 
              alt={BLOG_POSTS[0].title}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="font-bold text-red-700 uppercase">{BLOG_POSTS[0].category}</span>
              <span>•</span>
              <span>{BLOG_POSTS[0].date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 hover:text-red-700 transition-colors">
              <Link to={`/news/${BLOG_POSTS[0].id}`}>
                {BLOG_POSTS[0].title}
              </Link>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {BLOG_POSTS[0].summary}
            </p>
            <div className="pt-2">
              <Link 
                to={`/news/${BLOG_POSTS[0].id}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-red-700 hover:text-red-800"
              >
                <span>Xem chi tiết cẩm nang</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Other articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 w-full overflow-hidden bg-stone-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-2xs text-stone-400">
                    <span className="font-bold text-emerald-800 uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base hover:text-red-700 transition-colors line-clamp-2">
                    <Link to={`/news/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link 
                  to={`/news/${post.id}`}
                  className="text-xs font-bold text-red-700 flex items-center gap-1 hover:translate-x-1 transition-transform"
                >
                  Đọc tiếp <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default News;

