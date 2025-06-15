export class DateUtils {
  public static timeAgo(date: Date, hasAgo: boolean = true): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units = [
      { name: "y", seconds: 31536000 },
      { name: "m", seconds: 2592000 },
      { name: "d", seconds: 86400 },
      { name: "h", seconds: 3600 },
      { name: "m", seconds: 60 },
      { name: "s", seconds: 1 },
    ];

    for (const unit of units) {
      const count = Math.floor(seconds / unit.seconds);
      if (count >= 1) {
        return `${count}${unit.name}${hasAgo ? " ago" : ""}`;
      }
    }

    return `just ${hasAgo ? "now" : ""}` ; // fallback cho case mới xảy ra
  }
}
