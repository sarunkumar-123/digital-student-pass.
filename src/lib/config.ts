/**
 * Central prototype configuration.
 *
 * NOTE ON ARCHITECTURE
 * --------------------
 * Current demo storage : browser localStorage (see src/lib/store.tsx)
 * Prepared for future  : PostgreSQL + Drizzle ORM (see src/db/schema.ts)
 *
 * The running demo is NOT connected to:
 *  - a live MTC API / database
 *  - a real OTP (SMS/email) gateway
 *  - a real payment gateway (UPI/card/net banking)
 *  - live bus/route validation or real-time bus tracking
 *
 * Those are simulated in the UI and are intended to be replaced by authorized
 * integrations in a future production deployment. The storage/data layer is
 * isolated in src/lib/store.tsx so it can later be swapped for a PostgreSQL
 * backend without changing the UI.
 */

export const PROTOTYPE_CONFIG = {
  /**
   * Prototype-configured maximum number of journeys a student may record
   * per calendar day. This is a DEMO configuration only — it is NOT an
   * official MTC rule and can be changed here (or via future transport-
   * authority settings) to match the actual policy.
   */
  DAILY_JOURNEY_LIMIT: 4,

  /** Label shown next to simulated features. */
  PROTOTYPE_NOTE:
    "Prototype demonstration. Real MTC API, payment gateway, OTP gateway, live bus/service validation and production authentication are subject to future authorized integration.",
} as const;

export const DAILY_JOURNEY_LIMIT = PROTOTYPE_CONFIG.DAILY_JOURNEY_LIMIT;
