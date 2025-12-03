"use client";

import { useState } from "react";

const BlogDetailsPage = () => {
  const [likes, setLikes] = useState(234);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, _setComments] = useState([
    {
      id: 1,
      author: {
        name: "Michael Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        verified: true,
      },
      content:
        "This is absolutely incredible! I visited Switzerland last year but missed most of these hidden gems. The Lake Oeschinen recommendation is spot on - the crystal clear water is mesmerizing. Definitely saving this for my next trip!",
      timestamp: "2 hours ago",
      likes: 24,
      replies: [
        {
          id: 11,
          author: {
            name: "Sarah Mitchell",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b643?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            isAuthor: true,
          },
          content:
            "So glad you found it helpful! Lake Oeschinen was definitely one of my favorite discoveries. The hiking trail there is moderate and totally worth it for those views!",
          timestamp: "1 hour ago",
          likes: 8,
        },
      ],
    },
    {
      id: 2,
      author: {
        name: "Emma Thompson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        verified: false,
      },
      content:
        "As a solo female traveler, I really appreciate the safety tips you included for each location. The detailed transportation information is gold! How long did you spend researching and visiting all these places?",
      timestamp: "4 hours ago",
      likes: 18,
      replies: [],
    },
    {
      id: 3,
      author: {
        name: "David Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        verified: true,
      },
      content:
        "The photography tips scattered throughout this post are fantastic! That golden hour shot of the Matterhorn is stunning. What camera setup do you use for your travel photography?",
      timestamp: "6 hours ago",
      likes: 31,
      replies: [
        {
          id: 31,
          author: {
            name: "Photography Enthusiast",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            verified: false,
          },
          content:
            "I second this! The composition in those mountain shots is incredible. Please share your camera settings!",
          timestamp: "5 hours ago",
          likes: 12,
        },
      ],
    },
  ]);

  const blogPost = {
    title:
      "Hidden Gems of the Swiss Alps: A Complete Guide to Off-the-Beaten-Path Adventures",
    subtitle:
      "Discover breathtaking mountain villages, pristine alpine lakes, and secret hiking trails that even most locals don't know about.",
    featuredImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    author: {
      name: "Sarah Mitchell",
      bio: "Travel photographer and adventure seeker with 8+ years of exploring hidden corners of Europe. Currently based in Zurich.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b643?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "52.8k",
      posts: 127,
      verified: true,
    },
    publishDate: "December 15, 2024",
    readTime: "8 min read",
    category: "Destinations",
    tags: [
      "Switzerland",
      "Alps",
      "Hidden Gems",
      "Hiking",
      "Photography",
      "Travel Tips",
    ],
    content: `
      The Swiss Alps are renowned worldwide for their stunning beauty, but beyond the famous peaks of the Matterhorn and Jungfrau lies a treasure trove of hidden gems waiting to be discovered. After spending three years exploring every nook and cranny of this magnificent mountain range, I'm excited to share some of the most spectacular yet lesser-known destinations that will take your breath away.

      ## Why Seek Out Hidden Gems?

      While popular destinations like Zermatt and Interlaken are undoubtedly beautiful, they're often crowded and expensive. The hidden gems I'm about to share offer equally stunning scenery, authentic Swiss culture, and unforgettable experiences - all while being more budget-friendly and peaceful.

      ## 1. Lake Oeschinen - Nature's Hidden Mirror

      Tucked away in the Bernese Oberland, Lake Oeschinen is a pristine alpine lake that reflects the surrounding peaks like a perfect mirror. The moderate 45-minute hike from Kandersteg cable car station is well worth the effort.

      **What makes it special:**
      - Crystal-clear turquoise waters perfect for swimming (if you're brave enough!)
      - Dramatic backdrop of snow-capped peaks
      - Peaceful atmosphere with fewer crowds than major lakes
      - Excellent picnic spots along the shoreline

      **Best time to visit:** June to October for hiking access, though winter offers spectacular snowshoeing opportunities.

      ## 2. The Village of Soglio - The Gateway to Paradise

      Perched on a sunny terrace high above the Bregaglia Valley, Soglio has been called the "Gateway to Paradise" - and for good reason. This perfectly preserved stone village offers breathtaking panoramic views of the surrounding peaks.

      **Highlights:**
      - Historic 17th-century architecture
      - Traditional grotto restaurants serving local specialties
      - Peaceful walking trails through chestnut forests
      - Artists' studios and galleries showcasing local talent

      ## 3. Aletsch Glacier Viewpoints - Beyond the Tourist Trails

      While many visitors flock to the main Aletsch viewpoints, there are several lesser-known spots that offer equally spectacular views of Europe's largest glacier without the crowds.

      **Hidden viewpoints to explore:**
      - Belalp: Accessible via cable car, offers stunning sunset views
      - Riederalp: Perfect for photography with multiple angles
      - Fiescheralp: Best for sunrise shots and peaceful contemplation

      ## Essential Tips for Your Swiss Alps Adventure

      ### Transportation Hacks
      - Invest in a Swiss Travel Pass for unlimited public transport
      - Book cable cars and mountain railways in advance during peak season
      - Consider staying in valley towns and taking day trips to save money

      ### Photography Tips
      - Golden hour (sunrise/sunset) provides the most dramatic lighting
      - Bring a polarizing filter to reduce glare from snow and water
      - Pack extra batteries - cold weather drains them quickly

      ### Safety Considerations
      - Always check weather conditions before heading out
      - Inform someone of your hiking plans
      - Carry a map and GPS device, even on marked trails
      - Pack appropriate clothing for changing mountain weather

      ## The Best Time to Visit

      Each season offers unique advantages for exploring the Swiss Alps:

      **Spring (April-May):** Fewer crowds, wildflowers beginning to bloom, some high-altitude trails may still be snow-covered.

      **Summer (June-August):** Perfect hiking conditions, all trails accessible, warmest weather but also most crowded.

      **Fall (September-October):** Stunning autumn colors, crisp clear days, fewer tourists, some facilities may start closing.

      **Winter (November-March):** Magical snow-covered landscapes, winter sports opportunities, some areas inaccessible without proper equipment.

      ## Final Thoughts

      The Swiss Alps hold countless secrets beyond the well-trodden tourist paths. These hidden gems offer not just breathtaking scenery, but a chance to connect with the authentic spirit of the mountains. Take your time, respect the environment, and prepare to be amazed by the natural wonders that await.

      Remember, the journey is just as important as the destination. Some of my most memorable moments have come from unexpected discoveries along the way - a hidden waterfall, a friendly local sharing stories, or a perfect picnic spot with million-dollar views.
    `,
  };

  const relatedPosts = [
    {
      id: 1,
      title: "Ultimate Guide to Swiss Train Journeys",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      readTime: "6 min read",
      category: "Transportation",
    },
    {
      id: 2,
      title: "Budget Travel: Switzerland Without Breaking the Bank",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      readTime: "5 min read",
      category: "Budget Tips",
    },
    {
      id: 3,
      title: "Swiss Mountain Photography: Pro Tips & Techniques",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      readTime: "7 min read",
      category: "Photography",
    },
  ];

  const tableOfContents = [
    { id: "why-seek", title: "Why Seek Out Hidden Gems?", level: 2 },
    {
      id: "lake-oeschinen",
      title: "Lake Oeschinen - Nature's Hidden Mirror",
      level: 2,
    },
    { id: "soglio", title: "The Village of Soglio", level: 2 },
    { id: "aletsch", title: "Aletsch Glacier Viewpoints", level: 2 },
    { id: "tips", title: "Essential Tips for Your Adventure", level: 2 },
    { id: "best-time", title: "The Best Time to Visit", level: 2 },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Icons
  const HeartIcon = ({ filled = false }) => (
    <svg
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const BookmarkIcon = ({ filled = false }) => (
    <svg
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );

  const ShareIcon = () => (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
      />
    </svg>
  );

  // const CommentIcon = () => (
  //   <svg
  //     className="w-5 h-5"
  //     fill="none"
  //     stroke="currentColor"
  //     viewBox="0 0 24 24"
  //   >
  //     <path
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       strokeWidth={2}
  //       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
  //     />
  //   </svg>
  // );

  const VerifiedIcon = () => (
    <svg
      className="h-4 w-4 text-blue-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: "45%" }}
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* FIXED: Main Grid - Sidebar stacks below content on mobile */}
        <div className="grid grid-cols-1 gap-8 lg:gap-12 xl:grid-cols-4">
          {/* Main Content */}
          <div className="w-full xl:col-span-3">
            {/* Article Header */}
            <article className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl">
              {/* Featured Image */}
              <div className="relative h-64 sm:h-96 md:h-[500px]">
                <img
                  src={blogPost.featuredImage}
                  alt={blogPost.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Article Meta Overlay */}
                <div className="absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                      {blogPost.category}
                    </span>
                    <span className="text-sm text-white">
                      {blogPost.readTime}
                    </span>
                    <span className="text-sm text-white">
                      {blogPost.publishDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8 md:p-12">
                <h1 className="mb-4 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
                  {blogPost.title}
                </h1>

                <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
                  {blogPost.subtitle}
                </p>

                {/* FIXED: Author Info - Responsive Layout */}
                <div className="mb-8 flex flex-col items-center space-y-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                  <img
                    src={blogPost.author.avatar}
                    alt={blogPost.author.name}
                    className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-blue-200"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2 flex items-center justify-center space-x-2 sm:justify-start">
                      <h3 className="text-lg font-bold text-gray-900">
                        {blogPost.author.name}
                      </h3>
                      {blogPost.author.verified && <VerifiedIcon />}
                    </div>
                    <p className="mb-2 text-sm leading-relaxed text-gray-600">
                      {blogPost.author.bio}
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 sm:justify-start">
                      <span>{blogPost.author.followers} followers</span>
                      <span>{blogPost.author.posts} posts</span>
                    </div>
                  </div>

                  {/* Action Buttons - Responsive */}
                  <div className="flex flex-shrink-0 items-center space-x-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 rounded-full px-3 py-2 transition-all duration-200 sm:px-4 ${
                        isLiked
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <HeartIcon filled={isLiked} />
                      <span className="text-sm">{likes}</span>
                    </button>

                    <button
                      onClick={handleBookmark}
                      className={`rounded-full p-2 transition-all duration-200 ${
                        isBookmarked
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <BookmarkIcon filled={isBookmarked} />
                    </button>

                    <button className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                      <ShareIcon />
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6 leading-relaxed text-gray-800">
                    {blogPost.content.split("\n\n").map((paragraph, index) => {
                      if (paragraph.trim().startsWith("##")) {
                        return (
                          <h2
                            key={index}
                            className="mt-8 mb-4 text-xl font-bold text-gray-900 sm:text-2xl"
                          >
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      } else if (paragraph.trim().startsWith("###")) {
                        return (
                          <h3
                            key={index}
                            className="mt-6 mb-3 text-lg font-bold text-gray-900 sm:text-xl"
                          >
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      } else if (
                        paragraph.trim().startsWith("**") &&
                        paragraph.trim().endsWith(":**")
                      ) {
                        return (
                          <h4
                            key={index}
                            className="mt-4 mb-2 text-base font-semibold text-gray-900 sm:text-lg"
                          >
                            {paragraph.replace(/\*\*/g, "")}
                          </h4>
                        );
                      } else if (paragraph.trim().startsWith("- ")) {
                        const listItems = paragraph
                          .split("\n")
                          .filter((item) => item.trim().startsWith("- "));
                        return (
                          <ul
                            key={index}
                            className="ml-4 list-inside list-disc space-y-2"
                          >
                            {listItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-700">
                                {item.replace("- ", "")}
                              </li>
                            ))}
                          </ul>
                        );
                      } else if (paragraph.trim()) {
                        return (
                          <p
                            key={index}
                            className="leading-relaxed text-gray-700"
                          >
                            {paragraph.trim()}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <div className="flex flex-wrap gap-2">
                    {blogPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="cursor-pointer rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 text-sm text-blue-700 transition-colors hover:from-blue-100 hover:to-purple-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* FIXED: Comments Section - Responsive Design */}
            <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8 md:p-12">
              <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Comments ({comments.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none">
                    <option>Most Recent</option>
                    <option>Most Liked</option>
                    <option>Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Add Comment Form - Responsive */}
              <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Your avatar"
                    className="mx-auto h-12 w-12 flex-shrink-0 rounded-full sm:mx-0"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts about this adventure guide..."
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white/80 p-4 text-sm backdrop-blur-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-base"
                      rows={4}
                    ></textarea>
                    <div className="mt-3 flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
                      <div className="order-2 flex items-center space-x-4 text-sm text-gray-500 sm:order-1">
                        <button className="transition-colors hover:text-blue-500">
                          📷 Photo
                        </button>
                        <button className="transition-colors hover:text-blue-500">
                          😊 Emoji
                        </button>
                        <button className="transition-colors hover:text-blue-500">
                          🔗 Link
                        </button>
                      </div>
                      <button className="order-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 sm:order-2">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIXED: Comments List - Mobile Responsive */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="group">
                    {/* Main comment container - responsive flex */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="mx-auto h-12 w-12 flex-shrink-0 rounded-full sm:mx-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="rounded-2xl bg-gray-50 p-4 transition-colors group-hover:bg-gray-100">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-gray-900">
                              {comment.author.name}
                            </h4>
                            {comment.author.verified && <VerifiedIcon />}
                            {(comment.author as any).isAuthor && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                Author
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-800 sm:text-base">
                            {comment.content}
                          </p>
                        </div>

                        {/* Comment Actions */}
                        <div className="mt-2 ml-0 flex items-center justify-center space-x-4 sm:ml-4 sm:justify-start">
                          <button className="flex items-center space-x-1 text-gray-500 transition-colors hover:text-red-500">
                            <HeartIcon />
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button className="text-sm text-gray-500 transition-colors hover:text-blue-500">
                            Reply
                          </button>
                          <button className="text-sm text-gray-500 transition-colors hover:text-gray-700">
                            Share
                          </button>
                        </div>

                        {/* Replies - Responsive */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="ml-0 flex flex-col space-y-3 border-l-2 border-gray-100 pl-4 sm:ml-8 sm:flex-row sm:space-y-0 sm:space-x-3 sm:border-l-0 sm:pl-0"
                              >
                                <img
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  className="mx-auto h-10 w-10 flex-shrink-0 rounded-full sm:mx-0"
                                />
                                <div className="flex-1">
                                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                      <h5 className="text-sm font-medium text-gray-900">
                                        {reply.author.name}
                                      </h5>
                                      {(reply.author as any).isAuthor && (
                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                          Author
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {reply.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-800">
                                      {reply.content}
                                    </p>
                                  </div>

                                  <div className="mt-1 ml-0 flex items-center justify-center space-x-3 sm:ml-3 sm:justify-start">
                                    <button className="flex items-center space-x-1 text-gray-500 transition-colors hover:text-red-500">
                                      <HeartIcon />
                                      <span className="text-xs">
                                        {reply.likes}
                                      </span>
                                    </button>
                                    <button className="text-xs text-gray-500 transition-colors hover:text-blue-500">
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Comments */}
              <div className="mt-8 text-center">
                <button className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
                  Load more comments
                </button>
              </div>
            </div>
          </div>

          {/* FIXED: Sidebar - Stacks below content on mobile */}
          <div className="space-y-8 xl:col-span-1">
            {/* Table of Contents - Only sticky on larger screens */}
            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur xl:sticky xl:top-8">
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Table of Contents
              </h4>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block border-l-2 border-transparent py-1 pl-3 text-sm text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-600"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Author Follow Card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-4 flex items-center space-x-4">
                <img
                  src={blogPost.author.avatar}
                  alt={blogPost.author.name}
                  className="h-16 w-16 rounded-full border-2 border-white"
                />
                <div>
                  <h4 className="font-bold">{blogPost.author.name}</h4>
                  <p className="text-sm text-blue-100">
                    {blogPost.author.followers} followers
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm text-blue-100">
                {blogPost.author.bio}
              </p>
              <button className="w-full rounded-xl bg-white py-2 font-semibold text-blue-600 transition-colors hover:bg-gray-100">
                Follow
              </button>
            </div>

            {/* Related Posts */}
            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur">
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Related Articles
              </h4>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <div className="flex space-x-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 to-gray-300">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                          {post.title}
                        </p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share This Article */}
            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur">
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Share This Article
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 rounded-xl bg-blue-500 px-3 py-2 text-white transition-colors hover:bg-blue-600">
                  <span className="text-sm">Twitter</span>
                </button>
                <button className="flex items-center justify-center space-x-2 rounded-xl bg-blue-700 px-3 py-2 text-white transition-colors hover:bg-blue-800">
                  <span className="text-sm">Facebook</span>
                </button>
                <button className="flex items-center justify-center space-x-2 rounded-xl bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-600">
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button className="flex items-center justify-center space-x-2 rounded-xl bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-800">
                  <span className="text-sm">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
