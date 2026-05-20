import Queue from "bull";
import { prisma } from "../lib/prisma.js";

// Create a queue for analytics processing
const analyticsQueue = new Queue(
  "analytics",
  process.env.REDIS_URL || "redis://localhost:6379",
);

// Process jobs from the queue
analyticsQueue.process(async (job) => {
  const { date } = job.data;
  console.log(`📊 Processing analytics for date: ${date}`);

  try {
    // Create date range for the entire day (GMT)
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    // Aggregate reads for each article on the given date
    const aggregates = await prisma.readLog.groupBy({
      by: ["articleId"],
      where: {
        readAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: {
        id: true,
      },
    });

    console.log(`📊 Found ${aggregates.length} articles with reads on ${date}`);

    // Upsert into DailyAnalytics
    for (const agg of aggregates) {
      await prisma.dailyAnalytics.upsert({
        where: {
          articleId_date: {
            articleId: agg.articleId,
            date: startDate,
          },
        },
        update: {
          viewCount: agg._count.id,
        },
        create: {
          articleId: agg.articleId,
          date: startDate,
          viewCount: agg._count.id,
        },
      });
    }

    console.log(
      `✅ Processed analytics for ${date}: ${aggregates.length} articles updated`,
    );
    return { processed: aggregates.length, date };
  } catch (error) {
    console.error(`❌ Error processing analytics for ${date}:`, error);
    throw error;
  }
});

// Schedule daily job at midnight GMT
export const scheduleDailyAnalytics = () => {
  const scheduleNextJob = () => {
    const now = new Date();
    const nextMidnight = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
    );

    const delay = nextMidnight.getTime() - now.getTime();

    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0];
      analyticsQueue.add({ date: today });
      console.log(`⏰ Scheduled analytics job for ${today}`);

      // Schedule next day
      scheduleNextJob();
    }, delay);
  };

  scheduleNextJob();
  console.log("📅 Daily analytics scheduler started");
};

// Process yesterday's data when server starts
export const processYesterdayAnalytics = async () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  console.log(`🔄 Adding yesterday's analytics job for ${dateStr}`);
  await analyticsQueue.add({ date: dateStr });
  return dateStr;
};

// Get queue status
export const getQueueStatus = async () => {
  const [waiting, active, completed, failed] = await Promise.all([
    analyticsQueue.getWaitingCount(),
    analyticsQueue.getActiveCount(),
    analyticsQueue.getCompletedCount(),
    analyticsQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
  };
};

export { analyticsQueue };
