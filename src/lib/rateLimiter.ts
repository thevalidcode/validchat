const requests: Record<string, { count: number; last: number }> = {};
export function rateLimit(ip: string, limit = 20, windowMs = 60000) {
  const now = Date.now();
  if (!requests[ip]) requests[ip] = { count: 1, last: now };
  else {
    if (now - requests[ip].last > windowMs) {
      requests[ip] = { count: 1, last: now };
    } else {
      requests[ip].count++;
    }
  }
  if (requests[ip].count > limit) return false;
  return true;
}
