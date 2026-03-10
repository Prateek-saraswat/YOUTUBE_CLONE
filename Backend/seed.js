import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Comment.deleteMany({});
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.create([
      {
        username: "JohnDoe",
        email: "john@example.com",
        password: hashedPassword,
        avatar:
          "https://ui-avatars.com/api/?name=John+Doe&background=FF0000&color=fff&size=128",
      },
      {
        username: "JaneSmith",
        email: "jane@example.com",
        password: hashedPassword,
        avatar:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=4285F4&color=fff&size=128",
      },
      {
        username: "TechGuru",
        email: "tech@example.com",
        password: hashedPassword,
        avatar:
          "https://ui-avatars.com/api/?name=Tech+Guru&background=0F9D58&color=fff&size=128",
      },
    ]);

    console.log("Users created.");

    const channels = await Channel.create([
      {
        channelName: "Code with John",
        owner: users[0]._id,
        description: "Coding tutorials and tech reviews by John Doe.",
        channelBanner:
          "https://placehold.co/1200x300/FF0000/FFFFFF?text=Code+with+John",
        subscribers: 5200,
      },
      {
        channelName: "Jane Music Hub",
        owner: users[1]._id,
        description: "Music covers, playlists, and music theory lessons.",
        channelBanner:
          "https://placehold.co/1200x300/4285F4/FFFFFF?text=Jane+Music+Hub",
        subscribers: 12800,
      },
      {
        channelName: "TechGuru Reviews",
        owner: users[2]._id,
        description: "Latest tech reviews, unboxings, and comparisons.",
        channelBanner:
          "https://placehold.co/1200x300/0F9D58/FFFFFF?text=TechGuru+Reviews",
        subscribers: 34500,
      },
    ]);

    console.log("Channels created.");

    await User.findByIdAndUpdate(users[0]._id, { channel: channels[0]._id });
    await User.findByIdAndUpdate(users[1]._id, { channel: channels[1]._id });
    await User.findByIdAndUpdate(users[2]._id, { channel: channels[2]._id });

    const videosData = [
      {
        title: "Learn React in 30 Minutes",
        description: "Quick beginner React tutorial.",
        videoUrl: "https://www.youtube.com/embed/hQAHSlTtcmY",
        thumbnailUrl: "https://img.youtube.com/vi/hQAHSlTtcmY/maxresdefault.jpg",
        category: "Education",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 15000,
      },
      {
        title: "JavaScript ES6 Explained",
        description: "Modern JS features explained clearly.",
        videoUrl: "https://www.youtube.com/embed/NCwa_xi0Uuc",
        thumbnailUrl: "https://img.youtube.com/vi/NCwa_xi0Uuc/maxresdefault.jpg",
        category: "Education",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 22000,
      },
      {
        title: "CSS Grid vs Flexbox",
        description: "When to use CSS Grid or Flexbox.",
        videoUrl: "https://www.youtube.com/embed/hs3piaN4b5I",
        thumbnailUrl: "https://img.youtube.com/vi/hs3piaN4b5I/maxresdefault.jpg",
        category: "Education",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 45000,
      },
      {
        title: "Build MERN Stack App",
        description: "Complete MERN stack tutorial.",
        videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
        thumbnailUrl: "https://img.youtube.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
        category: "Education",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 9000,
      },
      {
        title: "Lofi Hip Hop Radio",
        description: "Chill beats for coding and studying.",
        videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
        thumbnailUrl: "https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
        category: "Music",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 1200000,
      },
      {
        title: "Top Guitar Riffs",
        description: "Best guitar riffs ever made.",
        videoUrl: "https://www.youtube.com/embed/DmeUuoxTJdg",
        thumbnailUrl: "https://img.youtube.com/vi/DmeUuoxTJdg/maxresdefault.jpg",
        category: "Music",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 67000,
      },
      {
        title: "Epic Instrumental Music",
        description: "Motivational instrumental music.",
        videoUrl: "https://www.youtube.com/embed/WNeLUngb-Xg",
        thumbnailUrl: "https://img.youtube.com/vi/WNeLUngb-Xg/maxresdefault.jpg",
        category: "Music",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 83000,
      },
      {
        title: "Relaxing Piano Music",
        description: "Calm piano music for relaxation.",
        videoUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
        thumbnailUrl: "https://img.youtube.com/vi/1ZYbU82GVz4/maxresdefault.jpg",
        category: "Music",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 90000,
      },
      {
        title: "Best Gaming Setup Tour",
        description: "Ultimate RGB gaming setup.",
        videoUrl: "https://www.youtube.com/embed/G6dMioYm-lk",
        thumbnailUrl: "https://img.youtube.com/vi/G6dMioYm-lk/maxresdefault.jpg",
        category: "Gaming",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 89000,
      },
      {
        title: "Minecraft Survival Episode 1",
        description: "Starting new survival world.",
        videoUrl: "https://www.youtube.com/embed/bUZN6hCfKyE",
        thumbnailUrl: "https://img.youtube.com/vi/bUZN6hCfKyE/maxresdefault.jpg",
        category: "Gaming",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 203000,
      },
      {
        title: "Valorant Gameplay Highlights",
        description: "Top Valorant plays.",
        videoUrl: "https://www.youtube.com/embed/hhhlGxj0y3M",
        thumbnailUrl: "https://img.youtube.com/vi/hhhlGxj0y3M/maxresdefault.jpg",
        category: "Gaming",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 78000,
      },
      {
        title: "GTA 5 Crazy Stunts",
        description: "Amazing GTA 5 stunt compilation.",
        videoUrl: "https://www.youtube.com/embed/n3Xv_g3g-mA",
        thumbnailUrl: "https://img.youtube.com/vi/n3Xv_g3g-mA/maxresdefault.jpg",
        category: "Gaming",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 91000,
      },
      {
        title: "Top 10 Football Goals",
        description: "Best football goals ever.",
        videoUrl: "https://www.youtube.com/embed/JgSNSpoGFQo",
        thumbnailUrl: "https://img.youtube.com/vi/JgSNSpoGFQo/maxresdefault.jpg",
        category: "Sports",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 340000,
      },
      {
        title: "Epic Mountain Biking",
        description: "Extreme biking trails.",
        videoUrl: "https://www.youtube.com/embed/ygGrMcEz3Jk",
        thumbnailUrl: "https://img.youtube.com/vi/ygGrMcEz3Jk/maxresdefault.jpg",
        category: "Sports",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 198000,
      },
      {
        title: "Best Cricket Moments",
        description: "Amazing cricket highlights.",
        videoUrl: "https://www.youtube.com/embed/b9kK6sYx0n4",
        thumbnailUrl: "https://img.youtube.com/vi/b9kK6sYx0n4/maxresdefault.jpg",
        category: "Sports",
        channel: channels[1]._id,
        uploader: users[1]._id,
        views: 210000,
      },
      {
        title: "AI Takes Over the World",
        description: "AI news roundup.",
        videoUrl: "https://www.youtube.com/embed/cdiD-9MMpb0",
        thumbnailUrl: "https://img.youtube.com/vi/cdiD-9MMpb0/maxresdefault.jpg",
        category: "News",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 120000,
      },
      {
        title: "World News Headlines",
        description: "Major world events today.",
        videoUrl: "https://www.youtube.com/embed/Yh0AhrY9GjA",
        thumbnailUrl: "https://img.youtube.com/vi/Yh0AhrY9GjA/maxresdefault.jpg",
        category: "News",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 110000,
      },
      {
        title: "Stand Up Comedy Tech Edition",
        description: "Programming jokes.",
        videoUrl: "https://www.youtube.com/embed/nzIKSkbPlYE",
        thumbnailUrl: "https://img.youtube.com/vi/nzIKSkbPlYE/maxresdefault.jpg",
        category: "Entertainment",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 78000,
      },
      {
        title: "Best Movie Trailers 2024",
        description: "Upcoming movie trailers.",
        videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
        thumbnailUrl: "https://img.youtube.com/vi/EXeTwQWrcwY/maxresdefault.jpg",
        category: "Entertainment",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 130000,
      },
      {
        title: "iPhone 16 Pro Max Review",
        description: "Full smartphone review.",
        videoUrl: "https://www.youtube.com/embed/dtp6b76pMak",
        thumbnailUrl: "https://img.youtube.com/vi/dtp6b76pMak/maxresdefault.jpg",
        category: "Science & Tech",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 456000,
      },
      {
        title: "How AI is Revolutionizing Healthcare",
        description: "AI in healthcare industry.",
        videoUrl: "https://www.youtube.com/embed/Gbnep6RJinQ",
        thumbnailUrl: "https://img.youtube.com/vi/Gbnep6RJinQ/maxresdefault.jpg",
        category: "Science & Tech",
        channel: channels[2]._id,
        uploader: users[2]._id,
        views: 312000,
      },
      {
        title: "Funny Cat Compilation",
        description: "Cats doing hilarious things.",
        videoUrl: "https://www.youtube.com/embed/J---aiyznGQ",
        thumbnailUrl: "https://img.youtube.com/vi/J---aiyznGQ/maxresdefault.jpg",
        category: "Comedy",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 900000,
      },
      {
        title: "Try Not To Laugh Challenge",
        description: "Impossible laughing challenge.",
        videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
        thumbnailUrl: "https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg",
        category: "Comedy",
        channel: channels[0]._id,
        uploader: users[0]._id,
        views: 450000,
      },
    ];

    const videos = await Video.create(videosData);
    console.log("Videos created.");

    for (const video of videos) {
      await Channel.findByIdAndUpdate(video.channel, {
        $push: { videos: video._id },
      });
    }

    const comments = await Comment.create([
      {
        video: videos[0]._id,
        user: users[1]._id,
        text: "Great video! Very helpful for beginners.",
      },
      {
        video: videos[0]._id,
        user: users[2]._id,
        text: "Can you make one on React hooks too?",
      },
      {
        video: videos[3]._id,
        user: users[0]._id,
        text: "This is my go-to study music while coding.",
      },
      {
        video: videos[5]._id,
        user: users[0]._id,
        text: "The camera on this phone is insane!",
      },
      {
        video: videos[8]._id,
        user: users[1]._id,
        text: "That RGB setup is fire!",
      },
      {
        video: videos[12]._id,
        user: users[2]._id,
        text: "Goal number 3 is legendary.",
      },
    ]);

    await Video.findByIdAndUpdate(videos[0]._id, {
      likes: [users[1]._id, users[2]._id],
    });

    await Video.findByIdAndUpdate(videos[3]._id, {
      likes: [users[0]._id, users[2]._id],
    });

    await Video.findByIdAndUpdate(videos[5]._id, {
      likes: [users[0]._id, users[1]._id],
      dislikes: [users[2]._id],
    });

    console.log("\nDatabase seeded successfully!");
    console.log(`Users: ${users.length}`);
    console.log(`Channels: ${channels.length}`);
    console.log(`Videos: ${videos.length}`);
    console.log(`Comments: ${comments.length}`);
    console.log("\nLogin credentials:");
    console.log("john@example.com / password123");
    console.log("jane@example.com / password123");
    console.log("tech@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
