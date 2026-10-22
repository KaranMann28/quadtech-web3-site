/**
 * Engagement process and sample-report field lists for /work.
 * Field names only — no fabricated measurements, client names, or results.
 *
 * TODO [CONFIRM] with Karan: whether this five-step process matches how
 * Quad actually sells and delivers, and whether the report field lists
 * match current templates.
 */

export const engagementSteps = [
  {
    title: "Scope",
    body: "You send the site type, technology, access constraints, and the acceptance criteria you already have. We confirm whether the work is design, field measurement, commissioning, project support, or staffing.",
  },
  {
    title: "Plan",
    body: "We write a test or design plan: routes or floors, tools, safety, site access, and the fields the report will contain. Criteria stay as you provided them; we do not invent pass/fail numbers.",
  },
  {
    title: "Collect or design",
    body: "Field crews collect drive, walk, CW, sweep, PIM, or fiber data. Design work is produced in the tools listed on the services pages. Project administrators coordinate orders and cutovers when that is the scope.",
  },
  {
    title: "Report",
    body: "You receive a daily or closeout package whose fields match the plan. Sample field lists are on this page. We do not publish example numbers from past jobs.",
  },
  {
    title: "Closeout",
    body: "Punch items and exceptions are listed against the written criteria. Follow-up visits or design revisions are scoped separately when you ask for them.",
  },
] as const;

export const sampleDeliverables = [
  "Written test or design plan with the project's acceptance criteria",
  "Daily field summary (date, site, crew role, work completed, blockers)",
  "Coverage or plant plots from the collection tool used on the job",
  "Exception and punch-item list",
  "KPI summary table using the project's named metrics — field names only until a job is under contract",
  "Closeout note that maps remaining items to the plan",
] as const;

export const dailyTestReportFields = [
  "Project or site identifier supplied by the buyer",
  "Date and shift",
  "Work type (drive, walk, CW, sweep, PIM, fiber, commissioning)",
  "Technology and band, when the buyer specifies them",
  "Route, sector, or floor covered that day",
  "Collection tool (for example XCAL, sweep/PIM set, or OTDR)",
  "Weather or access notes that affect collection",
  "Blockers and items that need buyer action",
  "Files handed over that day",
] as const;

export const kpiSummaryFields = [
  "Metric name as written in the project criteria (for example RSRP, SINR, or throughput — only if the plan names them)",
  "Sample count collected",
  "Comparison method (threshold supplied by the buyer, or relative to a baseline the buyer provides)",
  "Sectors, floors, or routes that meet the stated criteria",
  "Sectors, floors, or routes that do not, with the exception note",
  "Retest recommendation, if the buyer asks for one",
] as const;
