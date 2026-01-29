import React from 'react';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
}

const blogPosts: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: 'Top 10 Fashion Trends for 2025',
    author: 'Sara Johnson',
    date: 'March 20, 2025',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1490725967868-a0aa59e6aab1?w=1200&h=600&fit=crop',
    excerpt: 'Discover the latest fashion trends that are taking over the industry this season.',
    content: `Fashion is constantly evolving, and 2025 brings some exciting new trends. Color Trends: Bold vibrant colors dominate with rich jewel tones like emerald green and sapphire blue. Sustainable Fashion: More designers focus on eco-friendly materials and ethical production. Oversized Silhouettes: This trend offers comfort with oversized blazers and wide-leg pants. Vintage and Retro: Vintage fashion is making a comeback through thrift shopping. Minimalist Aesthetic: Clean lines and neutral colors create understated looks. Conclusion: Express yourself with style and wear what makes you feel confident.`,
  },
  2: {
    id: 2,
    title: 'How to Choose Perfect Shoes',
    author: 'Mike Smith',
    date: 'March 18, 2025',
    category: 'Style',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop',
    excerpt: 'A complete guide to finding the perfect shoes for any occasion and style preference.',
    content: `Choosing shoes can be challenging. Consider Your Foot Type: Understand if you're flat-footed or have arches. Think About Your Lifestyle: Match shoes to your daily routine. Occasion Matters: Different occasions need different shoes. Quality Over Quantity: Invest in well-made shoes. Proper Fit: Your shoes should be comfortable immediately. Style and Preference: Choose what reflects your personal style. Care and Maintenance: Proper care extends shoe lifespan. Conclusion: Finding perfect shoes requires understanding needs and quality.`,
  },
  3: {
    id: 3,
    title: 'Electronics Buying Guide 2025',
    author: 'Emma Davis',
    date: 'March 15, 2025',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1516111309421-b37b4d5aa22f?w=1200&h=600&fit=crop',
    excerpt: 'Everything you need to know before buying your next electronic device.',
    content: `
The electronics market is flooded with new products every year. Making the right choice can be overwhelming, but this guide will help you navigate through the options and find the best electronics for your needs.

## Determine Your Needs

Before you start shopping, identify what you need. Are you looking for a smartphone, laptop, tablet, or another device? Understanding your specific requirements will help narrow down your options.

## Research Thoroughly

Take time to research different brands and models. Read reviews from reputable tech websites and check user feedback. This will give you a comprehensive understanding of the pros and cons of each option.

## Set a Budget

Electronics can be expensive, so it's important to set a budget before you start shopping. Decide how much you're willing to spend and stick to it. Remember that more expensive doesn't always mean better.

## Consider Specifications

When comparing devices, look at the specifications. For computers, consider processor speed, RAM, and storage capacity. For phones, look at camera quality, battery life, and display resolution.

## Check Warranty and After-Sales Service

Always check the warranty period and after-sales service offered by the manufacturer. Good customer service can make a huge difference if you encounter any issues.

## Compare Prices

Don't buy from the first store you visit. Compare prices across different retailers and look for special offers or discounts. You might find the same product at a lower price elsewhere.

## Test Before You Buy

If possible, test the device before making a purchase. Visit a showroom and see how the device feels in your hands. This will help you make a more informed decision.

## Energy Efficiency

Consider the energy consumption of the device. Energy-efficient electronics not only save you money on electricity bills but also reduce your carbon footprint.

## Conclusion

Buying electronics requires careful consideration of your needs, budget, and preferences. Take your time, do your research, and make an informed decision. With this guide, you'll be able to find the perfect electronics for your lifestyle.
    `,
  },
  4: {
    id: 4,
    title: 'Spring Collection Preview',
    author: 'Lisa Anderson',
    date: 'March 12, 2025',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=600&fit=crop',
    excerpt: 'Get an exclusive preview of our spring collection before the official release.',
    content: `
Spring is the season of renewal and fresh starts. Our new spring collection captures the essence of this beautiful season with vibrant colors, light fabrics, and modern designs.

## Collection Highlights

This spring, we've brought together the best of fashion trends and timeless classics. Our collection features a perfect blend of comfort and style, making it ideal for the spring season.

## Color Palette

The spring collection showcases a beautiful palette of colors. From soft pastels to bold jewel tones, there's a color for every preference. Light blues, soft pinks, fresh greens, and warm yellows dominate the collection.

## Fabrics and Materials

We've carefully selected fabrics that are perfect for spring weather. Breathable cotton, lightweight linen, and flowy fabrics are featured throughout the collection. These materials ensure comfort while looking stylish.

## Key Pieces

Some of the key pieces in our spring collection include:
- Light jackets and blazers
- Flowy dresses and skirts
- Comfortable and stylish jeans
- Fresh and vibrant t-shirts
- Accessories that complete any outfit

## Perfect for Every Occasion

Whether you're heading to work, a casual brunch, or a special event, our spring collection has something for you. Mix and match pieces to create unique outfits that reflect your personal style.

## Sustainability Focus

We're committed to sustainability, and our spring collection reflects that. We've used eco-friendly materials and ethical production practices throughout the collection.

## Pre-Order Now

If you're excited about our spring collection, you can pre-order now and be among the first to wear these exclusive pieces. Limited quantities are available, so don't miss out.

## Conclusion

Our spring collection is all about celebrating the season with fresh, stylish, and sustainable fashion. We're confident that you'll find pieces that you'll love and cherish for years to come.
    `,
  },
  5: {
    id: 5,
    title: 'Best Interior Design Trends',
    author: 'John Wilson',
    date: 'March 10, 2025',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop',
    excerpt: 'Transform your home with the latest interior design trends. Modern and comfortable living spaces.',
    content: `
Your home is your sanctuary, and the way you design it should reflect your personality and lifestyle. Let's explore the latest interior design trends that can help you create a space you love.

## Minimalist Design

Minimalism continues to be a popular trend in interior design. The idea is to keep only what you need and love, creating a clean and organized space. This trend promotes tranquility and reduces clutter.

## Natural Materials

Using natural materials like wood, stone, and plants brings warmth and authenticity to your space. These materials add texture and create a connection to nature, making your home feel more welcoming.

## Warm and Earthy Tones

Instead of cold, neutral colors, warm and earthy tones like terracotta, ochre, and sage green are becoming popular. These colors create a cozy and inviting atmosphere.

## Functional Furniture

Furniture that serves multiple purposes is gaining popularity. Pieces that combine storage, style, and functionality are perfect for modern homes where space is often limited.

## Indoor Plants

Bringing plants into your home not only adds visual appeal but also improves air quality. From large statement plants to small succulents, plants can transform any space.

## Personalized Decor

Personalizing your space with items that are meaningful to you is important. Display artwork, photos, and collectibles that tell your story and reflect your interests.

## Technology Integration

Smart home technology is becoming more prevalent. From smart lighting to temperature control, integrating technology can improve your home's comfort and efficiency.

## Lighting Design

Proper lighting can completely change the mood of a room. Layering different types of lighting creates depth and allows you to adjust the ambiance based on your needs.

## Conclusion

Interior design is about creating a space that makes you feel comfortable and happy. Whether you prefer minimalist, traditional, or eclectic styles, there are trends and ideas to suit every taste. Use these trends as inspiration and create a home that truly reflects you.
    `,
  },
  6: {
    id: 6,
    title: 'Sustainable Fashion: A Guide',
    author: 'Alice Brown',
    date: 'March 8, 2025',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop',
    excerpt: 'Learn about sustainable fashion and how to make eco-friendly choices when shopping.',
    content: `
The fashion industry has a significant impact on the environment. By making conscious choices about what we wear, we can contribute to a more sustainable future. Let's explore sustainable fashion and how you can be part of the change.

## What is Sustainable Fashion?

Sustainable fashion refers to clothing and accessories that are produced and consumed in a way that is environmentally and socially responsible. This includes using eco-friendly materials, ethical labor practices, and reducing waste.

## Environmental Impact of Fashion

The fashion industry is one of the largest polluters globally. It consumes vast amounts of water, uses harmful chemicals, and produces massive amounts of waste. Understanding this impact motivates us to make better choices.

## Eco-Friendly Materials

Look for clothing made from sustainable materials like:
- Organic cotton
- Linen
- Hemp
- Recycled polyester
- Bamboo fabric

These materials have a lower environmental impact compared to conventional alternatives.

## Buy Less, Choose Well

The most sustainable approach is to buy less but invest in quality pieces. Choose timeless designs that won't go out of style quickly. This reduces waste and saves money in the long run.

## Support Ethical Brands

Research brands that prioritize ethical practices. Look for certifications and transparency in their supply chain. Supporting these brands encourages more companies to adopt sustainable practices.

## Thrift and Vintage Shopping

Buying second-hand clothing is an excellent way to practice sustainable fashion. Thrift stores and vintage shops offer unique pieces while reducing waste.

## Care for Your Clothes

Proper care extends the lifespan of your clothing. Wash in cold water, air dry when possible, and repair items instead of replacing them.

## Circular Fashion

Some brands are implementing circular fashion models where you can return worn clothes for recycling or resale. This creates a circular economy and reduces waste.

## Conclusion

Sustainable fashion is not just about wearing eco-friendly clothes; it's about making conscious choices as a consumer. By adopting these practices, you contribute to a healthier planet while supporting ethical businesses.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((id) => ({
    id: id,
  }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  const post = blogPosts[postId];

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/mysite/blogs" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold transition">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/mysite/blogs" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 bg-gray-100">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Badge */}
        <div className="inline-block bg-pink-100 text-pink-600 text-sm font-bold px-4 py-1 rounded-full mb-6">
          {post.category}
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span className="font-semibold">{post.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={20} />
            <span>{post.date}</span>
          </div>
          <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition ml-auto">
            <Share2 size={20} />
            Share
          </button>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-16">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
              // Heading
              return (
                <h2 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            
            if (paragraph.startsWith('-')) {
              // List
              const items = paragraph.split('\n').filter(item => item.startsWith('-'));
              return (
                <ul key={index} className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  {items.map((item, i) => (
                    <li key={i} className="ml-4">{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className="text-gray-700 text-lg leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Author Card */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">About the Author</h3>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{post.author}</span> is an experienced writer and expert in {post.category.toLowerCase()}. 
            With years of experience, they share valuable insights and trends that help readers stay informed and inspired.
          </p>
        </div>

        {/* Related Articles */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(blogPosts)
              .filter(p => p.id !== postId && p.category === post.category)
              .slice(0, 3)
              .map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={`/mysite/blogs/${relatedPost.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
                >
                  <div className="overflow-hidden h-48 bg-gray-100">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-block bg-pink-100 text-pink-600 text-sm font-bold px-3 py-1 rounded-full mb-3">
                      {relatedPost.category}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{relatedPost.author}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}
