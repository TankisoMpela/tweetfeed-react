import React from "react";
import { Link } from "react-router-dom";
import "./Topics.css";
import TopicItem from "./TopicItem/TopicItem";
import { SettingsIcon } from "../../icons/index";

function Topics() {
  const trendingTopics = [
    { category: "Programming · Trending", title: "React", count: "52.4K" },
    { category: "Programming · Trending", title: "TypeScript", count: "28.1K" },
    { category: "Technology · Trending", title: "Supabase", count: "18.7K" },
    { category: "Programming · Trending", title: "JavaScript", count: "41.2K" },
    { category: "Technology · Trending", title: "AI", count: "134K" },
    { category: "Business · Trending", title: "StartupAfrica", count: "12.8K" },
    { category: "Programming · Trending", title: "CSS", count: "19.6K" },
    { category: "Programming · Trending", title: "React Native", count: "22.3K" },
    { category: "Technology · Trending", title: "DevOps", count: "15.1K" },
  ];

  return (
    <div className="widgetsTopics">
      <div className="widgetsTopicsHeader">
        <span>Trends for you</span>
        <SettingsIcon />
      </div>
      {trendingTopics.map((t, i) => (
        <Link key={i} to={`/topic/${t.title}`} style={{ textDecoration: "none" }}>
          <TopicItem
            category={t.category}
            title={t.title}
            numberoftweet={`${t.count} Tweets`}
          />
        </Link>
      ))}
      <div className="widgetsTopicMore">
        <span>Show more</span>
      </div>
    </div>
  );
}

export default Topics;
