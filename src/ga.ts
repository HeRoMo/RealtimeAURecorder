/**
 * Google Analytics の リアルタイムのアクティブユーザ数を取得する。
 * エラーの場合、status:"ERROR", activeUsers:0 で返す。
 * @param ids Google AnalyticsのView ID
 * @return 取得時刻[yyyy-MM-dd HH:mm:ss]とアクティブユーザ数
 */
function getActiveUsers(ids: string): { datetime: string, activeUsers: number, status: string } {
  let status = 'SUCCESS';
  const metrics = 'rt:activeUsers';
  const datetime = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss');
  let activeUsers = 0;
  try {
    const res = Analytics.Data.Realtime.get(`ga:${ids}`, metrics);
    activeUsers = res.totalsForAllResults[metrics];
  } catch (error) {
    const message = 'getActiveUsers error';
    console.error({ message, error });
    status = 'ERROR';
  }
  return { datetime, activeUsers, status };
}

export default getActiveUsers;
