/**
 * ════════════════════════════════════════════════════════════════
 *  LOOKER STUDIO DASHBOARDS — the ONLY file you edit to plug in data
 * ════════════════════════════════════════════════════════════════
 *
 *  For every Looker Studio report you want to track:
 *   1. In Looker Studio open the report → File → Report settings →
 *      paste the GA4 Measurement ID (looks like G-XXXXXXXXXX).
 *   2. Copy the same Measurement ID into `measurementId` below.
 *   3. Copy the report ID from the report URL into `lookerReportId`:
 *      https://lookerstudio.google.com/reporting/<THIS-PART>/page/...
 *   4. (Optional) If this dashboard sends data to a different GA4
 *      property than the default one in .env.local, set `ga4PropertyId`.
 *
 *  Dashboards with an empty `measurementId` keep showing demo data.
 */

export type DashboardConfig = {
  id: string;
  name: string;
  category: string;
  /** GA4 Measurement ID used inside Looker Studio, e.g. "G-ABC123XYZ" */
  measurementId: string;
  /** Report ID taken from the Looker Studio URL */
  lookerReportId: string;
  /** Numeric GA4 property ID. Leave empty to use GA4_PROPERTY_ID from .env.local */
  ga4PropertyId?: string;
  /** Full link to the Looker Studio report (used for the "Open" button) */
  lookerUrl?: string;
};

export const DASHBOARDS: DashboardConfig[] = [
  { id: "executive-overview", name: "Executive Overview", category: "Leadership", measurementId: "", lookerReportId: "" },
  { id: "sales-performance", name: "Sales Performance", category: "Sales", measurementId: "", lookerReportId: "" },
  { id: "regional-sales", name: "Regional Sales", category: "Sales", measurementId: "", lookerReportId: "" },
  { id: "lead-pipeline", name: "Lead Pipeline", category: "Sales", measurementId: "", lookerReportId: "" },
  { id: "marketing-campaigns", name: "Marketing Campaigns", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "google-ads", name: "Google Ads Spend", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "meta-ads", name: "Meta Ads", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "seo-insights", name: "SEO Insights", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "social-media", name: "Social Media", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "email-campaigns", name: "Email Campaigns", category: "Marketing", measurementId: "", lookerReportId: "" },
  { id: "website-traffic", name: "Website Traffic", category: "Web", measurementId: "", lookerReportId: "" },
  { id: "ecommerce-orders", name: "E-commerce Orders", category: "Web", measurementId: "", lookerReportId: "" },
  { id: "product-usage", name: "Product Usage", category: "Product", measurementId: "", lookerReportId: "" },
  { id: "client-retention", name: "Client Retention", category: "Clients", measurementId: "", lookerReportId: "" },
  { id: "customer-support", name: "Customer Support", category: "Clients", measurementId: "", lookerReportId: "" },
  { id: "finance-summary", name: "Finance Summary", category: "Finance", measurementId: "", lookerReportId: "" },
  { id: "inventory", name: "Inventory", category: "Operations", measurementId: "", lookerReportId: "" },
  { id: "operations-kpis", name: "Operations KPIs", category: "Operations", measurementId: "", lookerReportId: "" },
  { id: "project-tracker", name: "Project Tracker", category: "Operations", measurementId: "", lookerReportId: "" },
  { id: "hr-hiring", name: "HR & Hiring", category: "People", measurementId: "", lookerReportId: "" },
];

export function getDashboard(id: string) {
  return DASHBOARDS.find((d) => d.id === id);
}

export function isConnected(d: DashboardConfig) {
  return d.measurementId.trim() !== "" && d.lookerReportId.trim() !== "";
}
