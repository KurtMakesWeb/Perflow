import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Download,
  FileText,
  Lock,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type Tone = "Warm coaching" | "Formal" | "Direct" | "Executive summary";
type View =
  | "site"
  | "manager"
  | "managerReview"
  | "managerSelfEval"
  | "managerEval"
  | "outline"
  | "employee"
  | "employeeSelfEval"
  | "employeeManagerEval"
  | "admin"
  | "adminTeams"
  | "adminRoles"
  | "adminRoleNew"
  | "adminRoleDetail"
  | "adminEmployees"
  | "adminEmployeeNew"
  | "adminEmployeeDetail"
  | "adminSelfEvalView"
  | "adminOutlineView";

type Team = { id: number; name: string };
type JobRole = { id: number; title: string; responsibilities: string[] };
type Employee = { id: number; name: string; startDate: string; roleId: number; teamId: number };
type Review = {
  id: number;
  employeeId: number;
  cycle: string;
  dueDate: string;
  selfEvalAnswers: string[];
  selfEvalSavedAt: string;
  selfEvalSubmitted: boolean;
  selfEvalSignedOff: boolean;
  managerEvalSavedAt: string;
  managerEvalSignedOff: boolean;
  tone: Tone;
  prsReviewedYear: number;
  prsAveragePerSprint: number;
  ticketsClosed: number;
  teamPrAverageYear: number;
  teamTicketAverageYear: number;
  projectNotes: string;
  strengths: string;
  improvements: string;
};
type ReviewContext = Review & { employee: Employee; role: JobRole; team: Team };

const activeCycle = "2025 Annual Review";
const tones: Tone[] = ["Warm coaching", "Formal", "Direct", "Executive summary"];
const signedInEmployeeId = 1;

const selfEvalQuestions = [
  "What do you consider to be your most important achievements in the last review period?",
  "What do you consider to be your key strengths?",
  "What skills/areas of work do you feel you need to improve the most?",
  "Which elements of your job do you like or interest you the most?",
  "Which elements of your job do you dislike?",
  "Discuss two or three areas in which you believe you could have handled better in the past year.",
  "Discuss two or three goals you would like to focus on during the upcoming appraisal period.",
  "Do you feel there is anything that we could do to help you meet these goals?",
  "We'll be making compensation and title decisions based on a combination of performance, market data, and business needs. That said, if you have any salary or title goals you'd like for us to consider, feel free to share here (optional).",
];

const starterTeams: Team[] = [
  { id: 1, name: "Frontend" },
  { id: 2, name: "Backend" },
  { id: 3, name: "DevOps" },
  { id: 4, name: "QA" },
  { id: 5, name: "Design" },
  { id: 6, name: "Platform Engineering" },
];

const starterRoles: JobRole[] = [
  {
    id: 1,
    title: "Software Engineer",
    responsibilities: [
      "Designs, develops, tests, and maintains software applications according to project specifications.",
      "Writes clean, efficient, and maintainable code following best practices and coding standards.",
      "Participates in code reviews, providing constructive feedback to peers.",
      "Collaborates with cross-functional teams, including designers, product managers, and QA analysts, to deliver high-quality software solutions.",
      "Debugs and troubleshoots issues in development, staging, and production environments.",
      "Contributes to the design and implementation of new features and improvements.",
      "Assists in the continuous improvement of development processes and tools.",
    ],
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    responsibilities: [
      "Owns delivery of complex technical projects from planning through release.",
      "Provides code review, technical guidance, and implementation support for teammates.",
      "Translates ambiguous product or operational needs into practical engineering plans.",
      "Improves reliability, maintainability, and quality across shared systems.",
      "Communicates technical tradeoffs clearly to engineering and cross-functional partners.",
    ],
  },
  {
    id: 3,
    title: "Engineering Manager",
    responsibilities: [
      "Coaches engineers and supports growth, delivery quality, and team health.",
      "Plans and coordinates team execution across projects, incidents, and operational work.",
      "Builds alignment with product, design, leadership, and stakeholder partners.",
      "Improves team process, prioritization, and communication rituals.",
    ],
  },
];

const starterEmployees: Employee[] = [
  { id: 1, name: "David Chen", startDate: "2023-04-17", roleId: 2, teamId: 2 },
  { id: 2, name: "Avery Morgan", startDate: "2022-09-06", roleId: 3, teamId: 6 },
];

const starterReviews: Review[] = [
  {
    id: 1,
    employeeId: 1,
    cycle: "2025 Annual Review",
    dueDate: "2026-01-15",
    selfEvalAnswers: [
      "I am proud of the AI Opt Outs work because it turned a compliance risk into a repeatable automation path and cleared the backlog.",
      "I think my strengths are ownership, pragmatic technical decisions, and communicating with compliance and operations partners.",
      "I want to improve at surfacing architectural tradeoffs earlier and delegating more implementation detail.",
      "I enjoy systems work that removes manual operational load and has a clear compliance or customer impact.",
      "I dislike work where requirements stay vague for too long and decisions are made late.",
      "I could have pulled other engineers into the design earlier and documented a few tradeoffs more clearly.",
      "Next year I want to mentor more, lead larger technical planning, and deepen my reliability work.",
      "More early design feedback and a clearer path to lead a multi-engineer project would help.",
      "I would like to be considered for a senior scope/title conversation if the business context supports it.",
    ],
    selfEvalSavedAt: "Saved May 1, 2026",
    selfEvalSubmitted: true,
    selfEvalSignedOff: false,
    managerEvalSavedAt: "",
    managerEvalSignedOff: false,
    tone: "Warm coaching",
    prsReviewedYear: 74,
    prsAveragePerSprint: 6,
    ticketsClosed: 58,
    teamPrAverageYear: 51,
    teamTicketAverageYear: 44,
    projectNotes:
      "David worked on AI Opt Outs, which automated our ability to tackle email opt out requests and cleared our entire backlog quickly, preventing the company from having to hire a large operations team in order to stay in compliance.",
    strengths:
      "Strong ownership, pragmatic technical judgment, reliable delivery, and clear partnership with compliance and operations stakeholders.",
    improvements:
      "Continue bringing architectural tradeoffs forward earlier and delegate more implementation detail to mid-level engineers on larger efforts.",
  },
  {
    id: 2,
    employeeId: 2,
    cycle: "2025 Annual Review",
    dueDate: "2026-01-22",
    selfEvalAnswers: [
      "I focused on improving billing reliability, keeping incident follow-ups moving, and helping the team stay calm during renewal pressure.",
      "Communication, coaching, incident leadership, and prioritization under pressure.",
      "I want to improve written planning artifacts so fewer decisions require follow-up meetings.",
      "I enjoy coaching and turning messy operational problems into clearer team routines.",
      "I dislike last-minute escalations that could have been prevented by earlier alignment.",
      "I could have pushed for clearer ownership on a few billing follow-ups earlier.",
      "Next year I want to improve manager onboarding, planning hygiene, and team technical health rituals.",
      "More consistent product planning windows would help the team make better commitments.",
      "",
    ],
    selfEvalSavedAt: "Saved Apr 29, 2026",
    selfEvalSubmitted: true,
    selfEvalSignedOff: true,
    managerEvalSavedAt: "Saved May 2, 2026",
    managerEvalSignedOff: false,
    tone: "Warm coaching",
    prsReviewedYear: 98,
    prsAveragePerSprint: 4,
    ticketsClosed: 31,
    teamPrAverageYear: 42,
    teamTicketAverageYear: 39,
    projectNotes:
      "Avery led the billing reliability push, coordinated incident follow-ups, and helped the team reduce failed renewal workflows before the enterprise close window.",
    strengths:
      "Excellent cross-functional communication, calm incident leadership, and consistent coaching during delivery pressure.",
    improvements:
      "Keep tightening written planning artifacts so partner teams can make decisions without additional sync meetings.",
  },
  {
    id: 3,
    employeeId: 1,
    cycle: "2024 Annual Review",
    dueDate: "2025-01-20",
    selfEvalAnswers: [
      "I shipped several backend reliability improvements and helped reduce manual support escalations.",
      "I was strongest in ownership, debugging, and steady execution.",
      "I wanted to improve written design documents and earlier stakeholder alignment.",
      "I enjoyed backend reliability and automation work.",
      "I disliked vague handoffs between product and engineering.",
      "I could have escalated ambiguous requirements sooner.",
      "I wanted to grow into broader project leadership.",
      "More design review time would have helped.",
      "",
    ],
    selfEvalSavedAt: "Saved Jan 10, 2025",
    selfEvalSubmitted: true,
    selfEvalSignedOff: true,
    managerEvalSavedAt: "Saved Jan 18, 2025",
    managerEvalSignedOff: true,
    tone: "Warm coaching",
    prsReviewedYear: 61,
    prsAveragePerSprint: 5,
    ticketsClosed: 49,
    teamPrAverageYear: 46,
    teamTicketAverageYear: 41,
    projectNotes: "David improved backend reliability and reduced manual escalation paths across support tooling.",
    strengths: "Ownership, debugging depth, consistent delivery, cross-functional follow-through.",
    improvements: "Earlier design documentation, clearer stakeholder alignment before implementation.",
  },
];

const blankSelfEval = () => selfEvalQuestions.map(() => "");

function App() {
  const [view, setView] = useState<View>("site");
  const [teams, setTeams] = useState<Team[]>(starterTeams);
  const [roles, setRoles] = useState<JobRole[]>(starterRoles);
  const [employees, setEmployees] = useState<Employee[]>(starterEmployees);
  const [reviews, setReviews] = useState<Review[]>(starterReviews);
  const [activeReviewId, setActiveReviewId] = useState(starterReviews[0].id);
  const [activeRoleId, setActiveRoleId] = useState(starterRoles[0].id);
  const [activeEmployeeId, setActiveEmployeeId] = useState(starterEmployees[0].id);

  const contexts = useMemo(
    () => reviews.map((review) => hydrateReview(review, employees, roles, teams)),
    [employees, reviews, roles, teams],
  );
  const activeCycleReviews = contexts.filter((review) => review.cycle === activeCycle);
  const activeReview = contexts.find((review) => review.id === activeReviewId) ?? contexts[0];
  const signedInReviews = contexts.filter((review) => review.employee.id === signedInEmployeeId);
  const activeRole = roles.find((role) => role.id === activeRoleId) ?? roles[0];
  const activeEmployee = employees.find((employee) => employee.id === activeEmployeeId) ?? employees[0];

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openReview = (id: number, next: View = "managerReview") => {
    setActiveReviewId(id);
    navigate(next);
  };

  const updateReview = <K extends keyof Review>(key: K, value: Review[K]) => {
    setReviews((current) =>
      current.map((review) => (review.id === activeReviewId ? { ...review, [key]: value } : review)),
    );
  };

  const updateSelfEvalAnswer = (reviewId: number, index: number, value: string) => {
    setReviews((current) =>
      current.map((review) => {
        if (review.id !== reviewId || review.selfEvalSignedOff || review.managerEvalSignedOff) return review;
        const next = [...review.selfEvalAnswers];
        next[index] = value;
        return { ...review, selfEvalAnswers: next, selfEvalSubmitted: false };
      }),
    );
  };

  const createReviewForEmployee = (employee: Employee) => {
    const next: Review = {
      id: Date.now(),
      employeeId: employee.id,
      cycle: activeCycle,
      dueDate: "2026-01-31",
      selfEvalAnswers: blankSelfEval(),
      selfEvalSavedAt: "",
      selfEvalSubmitted: false,
      selfEvalSignedOff: false,
      managerEvalSavedAt: "",
      managerEvalSignedOff: false,
      tone: "Warm coaching",
      prsReviewedYear: 0,
      prsAveragePerSprint: 0,
      ticketsClosed: 0,
      teamPrAverageYear: 0,
      teamTicketAverageYear: 0,
      projectNotes: "",
      strengths: "",
      improvements: "",
    };
    setReviews((current) => [next, ...current]);
    setActiveReviewId(next.id);
    navigate("managerReview");
  };

  const deleteReview = (id: number) => {
    const review = contexts.find((item) => item.id === id);
    if (!window.confirm(`Delete ${review?.employee.name ?? "this employee"}'s review?`)) return;
    setReviews((current) => current.filter((item) => item.id !== id));
    navigate("manager");
  };

  return (
    <main>
      <TopNav view={view} setView={navigate} />
      {view === "site" && <MarketingSite openDashboard={() => navigate("manager")} />}
      {view === "manager" && <ManagerDashboard reviews={activeCycleReviews} openReview={openReview} />}
      {view === "managerReview" && activeReview && (
        <ManagerReviewHub review={activeReview} openReview={openReview} back={() => navigate("manager")} remove={deleteReview} />
      )}
      {view === "managerSelfEval" && activeReview && (
        <ManagerSelfEvalPage review={activeReview} back={() => navigate("managerReview")} signOff={() => updateReview("selfEvalSignedOff", true)} />
      )}
      {view === "managerEval" && activeReview && (
        <ManagerEvalPage
          review={activeReview}
          updateReview={updateReview}
          back={() => navigate("managerReview")}
          openOutline={() => navigate("outline")}
        />
      )}
      {view === "outline" && activeReview && <OutlinePage review={activeReview} back={() => navigate("managerEval")} />}
      {view === "employee" && (
        <EmployeeDashboard
          reviews={signedInReviews}
          openSelfEval={(id) => openReview(id, "employeeSelfEval")}
          openManagerEval={(id) => openReview(id, "employeeManagerEval")}
        />
      )}
      {view === "employeeSelfEval" && activeReview && (
        <EmployeeSelfEvalPage
          review={activeReview}
          updateAnswer={updateSelfEvalAnswer}
          submit={() =>
            setReviews((current) =>
              current.map((review) => (review.id === activeReview.id ? { ...review, selfEvalSubmitted: true } : review)),
            )
          }
          saveDraft={() =>
            setReviews((current) =>
              current.map((review) =>
                review.id === activeReview.id
                  ? { ...review, selfEvalSavedAt: `Saved ${formatDate("2026-05-02")}`, selfEvalSubmitted: false }
                  : review,
              ),
            )
          }
          back={() => navigate("employee")}
        />
      )}
      {view === "employeeManagerEval" && activeReview && <EmployeeManagerEvalPage review={activeReview} back={() => navigate("employee")} />}
      {view === "admin" && <AdminHome navigate={navigate} teams={teams} roles={roles} employees={employees} />}
      {view === "adminTeams" && <AdminTeams teams={teams} setTeams={setTeams} back={() => navigate("admin")} />}
      {view === "adminRoles" && (
        <AdminRoles
          roles={roles}
          open={(id) => {
            setActiveRoleId(id);
            navigate("adminRoleDetail");
          }}
          add={() => navigate("adminRoleNew")}
          back={() => navigate("admin")}
        />
      )}
      {view === "adminRoleNew" && (
        <AdminRoleEditor
          title="Add role"
          role={{ id: 0, title: "", responsibilities: [] }}
          save={(role) => {
            setRoles([...roles, { ...role, id: Date.now() }]);
            navigate("adminRoles");
          }}
          cancel={() => navigate("adminRoles")}
        />
      )}
      {view === "adminRoleDetail" && activeRole && (
        <AdminRoleEditor
          title="Edit role"
          role={activeRole}
          save={(role) => {
            setRoles(roles.map((item) => (item.id === activeRole.id ? { ...role, id: activeRole.id } : item)));
            navigate("adminRoles");
          }}
          remove={() => {
            if (!window.confirm(`Delete ${activeRole.title}?`)) return;
            setRoles(roles.filter((item) => item.id !== activeRole.id));
            navigate("adminRoles");
          }}
          cancel={() => navigate("adminRoles")}
        />
      )}
      {view === "adminEmployees" && (
        <AdminEmployees
          employees={employees}
          roles={roles}
          teams={teams}
          reviews={contexts}
          open={(id) => {
            setActiveEmployeeId(id);
            navigate("adminEmployeeDetail");
          }}
          add={() => navigate("adminEmployeeNew")}
          back={() => navigate("admin")}
        />
      )}
      {view === "adminEmployeeNew" && (
        <AdminEmployeeEditor
          title="Add employee"
          employee={{ id: 0, name: "", startDate: "2026-01-01", roleId: roles[0]?.id ?? 0, teamId: teams[0]?.id ?? 0 }}
          roles={roles}
          teams={teams}
          save={(employee) => {
            const next = { ...employee, id: Date.now() };
            setEmployees([...employees, next]);
            createReviewForEmployee(next);
          }}
          cancel={() => navigate("adminEmployees")}
        />
      )}
      {view === "adminEmployeeDetail" && activeEmployee && (
        <AdminEmployeeEditor
          title="Employee profile"
          employee={activeEmployee}
          roles={roles}
          teams={teams}
          reviews={contexts.filter((review) => review.employee.id === activeEmployee.id)}
          openSelfEval={(id) => openReview(id, "adminSelfEvalView")}
          openOutline={(id) => openReview(id, "adminOutlineView")}
          save={(employee) => {
            setEmployees(employees.map((item) => (item.id === activeEmployee.id ? { ...employee, id: activeEmployee.id } : item)));
            navigate("adminEmployees");
          }}
          remove={() => {
            if (!window.confirm(`Delete ${activeEmployee.name}?`)) return;
            setEmployees(employees.filter((item) => item.id !== activeEmployee.id));
            navigate("adminEmployees");
          }}
          cancel={() => navigate("adminEmployees")}
        />
      )}
      {view === "adminSelfEvalView" && activeReview && (
        <ManagerSelfEvalPage review={activeReview} back={() => navigate("adminEmployeeDetail")} adminView />
      )}
      {view === "adminOutlineView" && activeReview && <OutlinePage review={activeReview} back={() => navigate("adminEmployeeDetail")} />}
    </main>
  );
}

function TopNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  const managerActive = ["manager", "managerReview", "managerSelfEval", "managerEval", "outline"].includes(view);
  const employeeActive = ["employee", "employeeSelfEval", "employeeManagerEval"].includes(view);
  const adminActive = view.startsWith("admin");
  return (
    <header className="top-nav">
      <button className="brand" onClick={() => setView("site")} aria-label="Perflow home">
        <span className="brand-mark">P</span>
        <span>Perflow</span>
      </button>
      <nav>
        <button className={view === "site" ? "active" : ""} onClick={() => setView("site")}>Overview</button>
        <button className={managerActive ? "active" : ""} onClick={() => setView("manager")}>Manager</button>
        <button className={employeeActive ? "active" : ""} onClick={() => setView("employee")}>Employee</button>
        <button className={adminActive ? "active" : ""} onClick={() => setView("admin")}>Admin</button>
      </nav>
    </header>
  );
}

function MarketingSite({ openDashboard }: { openDashboard: () => void }) {
  return (
    <>
      <section className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Performance reviews for small tech companies</p>
          <h1>Perflow helps managers turn scattered engineering evidence into review-ready drafts.</h1>
          <p className="hero-lede">
            Capture self evaluations, manager evidence, role expectations, and signoff workflows for companies under
            100 people that need process without heavy HR tooling.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={openDashboard}>Open manager dashboard <ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Perflow generated review preview">
          <div className="preview-toolbar"><span></span><span></span><span></span><strong>AI draft preview</strong></div>
          <div className="preview-document">
            <div className="doc-kicker">Senior Software Engineer</div>
            <h2>David Chen Annual Review</h2>
            <div className="metric-strip"><span>Self eval signed off</span><span>Manager draft saved</span><span>Due Jan 15</span></div>
            <section><h3>1. Owns delivery of compliance-critical systems</h3><p>David translated a backlog-heavy compliance need into durable automation that reduced manual work.</p></section>
          </div>
        </div>
      </section>
      <section className="proof-band">
        <div className="proof-item"><BriefcaseBusiness /><strong>Small-company fit</strong><span>Clear enough for process, light enough for lean teams.</span></div>
        <div className="proof-item"><BarChart3 /><strong>Metrics with context</strong><span>Use evidence without turning the review into a spreadsheet.</span></div>
        <div className="proof-item"><Lock /><strong>Signoff control</strong><span>Managers save drafts and release only when ready.</span></div>
      </section>
    </>
  );
}

function ManagerDashboard({ reviews, openReview }: { reviews: ReviewContext[]; openReview: (id: number) => void }) {
  return (
    <PageShell eyebrow="Manager dashboard" title={activeCycle} copy="Open an employee review, then choose self evaluation, manager evaluation, or generated outline.">
      <div className="review-directory">
        {reviews.map((review) => (
          <button className="employee-card" onClick={() => openReview(review.id)} key={review.id}>
            <span className="avatar large">{initials(review.employee.name)}</span>
            <span>
              <strong>{review.employee.name}</strong>
              <small>{review.role.title}</small>
              <em>{review.team.name}</em>
              <span className="card-meta">
                Due {formatDate(review.dueDate)}
                <b><FileText size={15} /> {review.selfEvalSubmitted ? "Self eval received" : "Self eval pending"}</b>
                <b className={review.selfEvalSignedOff ? "good" : "warn"}>{review.selfEvalSignedOff ? "Self eval signed off" : "Needs self eval signoff"}</b>
                <b className={review.managerEvalSignedOff ? "good" : ""}>{review.managerEvalSignedOff ? "Manager eval signed off" : "Manager draft open"}</b>
              </span>
            </span>
            <ArrowRight size={20} />
          </button>
        ))}
      </div>
    </PageShell>
  );
}

function ManagerReviewHub({
  review,
  openReview,
  back,
  remove,
}: {
  review: ReviewContext;
  openReview: (id: number, next: View) => void;
  back: () => void;
  remove: (id: number) => void;
}) {
  return (
    <DetailShell back={back} title={review.employee.name} eyebrow={`Review workspace / ${activeCycle}`} action={<button className="icon-button danger" onClick={() => remove(review.id)}><Trash2 size={18} /></button>}>
      <InfoGrid review={review} />
      <div className="hub-grid">
        <ActionCard title="Self Evaluation" body="Review employee answers and sign off before release." status={review.selfEvalSignedOff ? "Signed off" : review.selfEvalSubmitted ? "Ready for review" : "Waiting on employee"} onClick={() => openReview(review.id, "managerSelfEval")} />
        <ActionCard title="Manager Evaluation" body="Enter metrics, accomplishments, improvement areas, and save drafts." status={review.managerEvalSignedOff ? "Signed off" : review.managerEvalSavedAt || "Draft open"} onClick={() => openReview(review.id, "managerEval")} />
        <ActionCard title="Generated Outline" body="AI-ready review outline generated from self eval and manager eval." status="Separate review page" onClick={() => openReview(review.id, "outline")} />
      </div>
    </DetailShell>
  );
}

function ManagerSelfEvalPage({
  review,
  back,
  signOff,
  adminView = false,
}: {
  review: ReviewContext;
  back: () => void;
  signOff?: () => void;
  adminView?: boolean;
}) {
  return (
    <DetailShell
      back={back}
      title="Self evaluation"
      eyebrow={`${review.employee.name} / ${review.cycle}`}
      action={
        !adminView && (
          <button className="primary-action compact-button" onClick={signOff} disabled={!review.selfEvalSubmitted || review.selfEvalSignedOff}>
            <Check size={17} /> {review.selfEvalSignedOff ? "Signed off" : "Sign off"}
          </button>
        )
      }
    >
      <InfoGrid review={review} />
      <div className="answer-stack">
        {selfEvalQuestions.map((question, index) => (
          <article className="answer-card" key={question}>
            <h3>{index + 1}. {question}</h3>
            <p>{review.selfEvalAnswers[index] || "No answer submitted."}</p>
          </article>
        ))}
      </div>
    </DetailShell>
  );
}

function ManagerEvalPage({
  review,
  updateReview,
  back,
  openOutline,
}: {
  review: ReviewContext;
  updateReview: <K extends keyof Review>(key: K, value: Review[K]) => void;
  back: () => void;
  openOutline: () => void;
}) {
  const locked = review.managerEvalSignedOff;
  const signOff = () => {
    if (!review.selfEvalSignedOff) {
      window.alert("Review and sign off on the self evaluation first.");
      return;
    }
    updateReview("managerEvalSavedAt", `Saved ${formatDate("2026-05-02")}`);
    updateReview("managerEvalSignedOff", true);
    window.alert("Manager evaluation signed off. In production, the employee would be notified.");
  };
  return (
    <DetailShell
      back={back}
      title="Manager evaluation"
      eyebrow={review.employee.name}
      action={
        <div className="button-row">
          <button className="secondary-action compact-button" onClick={() => updateReview("managerEvalSavedAt", `Saved ${formatDate("2026-05-02")}`)} disabled={locked}><Save size={17} /> Save</button>
          <button className="secondary-action compact-button" onClick={openOutline}><FileText size={17} /> Generate outline</button>
          <button className="primary-action compact-button" onClick={signOff} disabled={locked || !review.selfEvalSignedOff}><Check size={17} /> {locked ? "Signed off" : "Sign off"}</button>
        </div>
      }
    >
      <InfoGrid review={review} />
      <fieldset className="tone-picker" disabled={locked}>
        <legend>Review tone</legend>
        {tones.map((tone) => <button type="button" className={review.tone === tone ? "selected" : ""} onClick={() => updateReview("tone", tone)} key={tone}>{tone}</button>)}
      </fieldset>
      <div className="metrics-grid">
        <NumberField label="MRs / PRs reviewed" value={review.prsReviewedYear} onChange={(value) => updateReview("prsReviewedYear", value)} disabled={locked} />
        <NumberField label="MRs / PRs average per sprint" value={review.prsAveragePerSprint} onChange={(value) => updateReview("prsAveragePerSprint", value)} disabled={locked} />
        <NumberField label="Tickets closed" value={review.ticketsClosed} onChange={(value) => updateReview("ticketsClosed", value)} disabled={locked} />
        <NumberField label="Team PR average per year" value={review.teamPrAverageYear} onChange={(value) => updateReview("teamPrAverageYear", value)} disabled={locked} />
        <NumberField label="Team ticket average per year" value={review.teamTicketAverageYear} onChange={(value) => updateReview("teamTicketAverageYear", value)} disabled={locked} />
      </div>
      <TextArea label="Project and feature notes" value={review.projectNotes} onChange={(value) => updateReview("projectNotes", value)} placeholder="Paste short project notes." disabled={locked} />
      <TextArea label="Strengths and accomplishments" value={review.strengths} onChange={(value) => updateReview("strengths", value)} placeholder="Use comma or line-separated strengths." disabled={locked} />
      <TextArea label="Areas of improvement" value={review.improvements} onChange={(value) => updateReview("improvements", value)} placeholder="Use comma or line-separated improvement areas." disabled={locked} />
    </DetailShell>
  );
}

function OutlinePage({ review, back }: { review: ReviewContext; back: () => void }) {
  const draft = generateDraft(review);
  return (
    <DetailShell back={back} title="Generated outline" eyebrow={`${review.employee.name} / ${activeCycle}`} action={<button className="primary-action compact-button" onClick={() => window.alert("Prototype only: PDF download will be wired later.")}><Download size={17} /> PDF</button>}>
      <ReviewPaper review={review} draft={draft} />
    </DetailShell>
  );
}

function EmployeeDashboard({
  reviews,
  openSelfEval,
  openManagerEval,
}: {
  reviews: ReviewContext[];
  openSelfEval: (id: number) => void;
  openManagerEval: (id: number) => void;
}) {
  const employee = reviews[0]?.employee;
  const currentReviews = reviews.filter((review) => review.cycle === activeCycle);
  const historicalReviews = reviews.filter((review) => review.cycle !== activeCycle);
  return (
    <PageShell eyebrow="Employee dashboard" title={employee?.name ?? "My reviews"} copy="Review your current self evaluation, previous evaluations, and released manager evaluations.">
      <div className="hub-grid">
        {currentReviews.map((review) => (
          <article className="input-panel" key={review.id}>
            <p className="eyebrow">{review.cycle}</p>
            <h2>Current review</h2>
            <p className="muted-line">Due {formatDate(review.dueDate)} / {review.role.title}</p>
            <div className="button-row left">
              <button className="primary-action compact-button" onClick={() => openSelfEval(review.id)}>Self evaluation</button>
              <button className="secondary-action compact-button" onClick={() => openManagerEval(review.id)} disabled={!review.managerEvalSignedOff}>Manager evaluation</button>
            </div>
          </article>
        ))}
        {historicalReviews.map((review) => (
          <article className="input-panel" key={review.id}>
            <p className="eyebrow">History</p>
            <h2>{review.cycle}</h2>
            <p className="muted-line">Due {formatDate(review.dueDate)} / {review.role.title} / Manager evaluation {review.managerEvalSignedOff ? "signed off" : "not released"}</p>
            <div className="button-row left">
              <button className="secondary-action compact-button" onClick={() => openSelfEval(review.id)}>Self evaluation</button>
              <button className="secondary-action compact-button" onClick={() => openManagerEval(review.id)} disabled={!review.managerEvalSignedOff}>Manager evaluation</button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function EmployeeSelfEvalPage({
  review,
  updateAnswer,
  saveDraft,
  submit,
  back,
}: {
  review: ReviewContext;
  updateAnswer: (id: number, index: number, value: string) => void;
  saveDraft: () => void;
  submit: () => void;
  back: () => void;
}) {
  return (
    <DetailShell
      back={back}
      title="Self evaluation"
      eyebrow={review.cycle}
      action={
        <div className="button-row">
          <button className="secondary-action compact-button" onClick={saveDraft} disabled={review.selfEvalSignedOff || review.managerEvalSignedOff}>
            <Save size={17} /> Save draft
          </button>
          <button className="primary-action compact-button" onClick={submit} disabled={review.selfEvalSignedOff}>
            <Check size={17} /> Submit self eval
          </button>
        </div>
      }
    >
      {review.selfEvalSavedAt && <p className="muted-line">{review.selfEvalSavedAt}</p>}
      <div className="question-stack">
        {selfEvalQuestions.map((question, index) => (
          <label className="field area-field" key={question}>
            <span>{index + 1}. {question}</span>
            <textarea value={review.selfEvalAnswers[index] ?? ""} onChange={(event) => updateAnswer(review.id, index, event.target.value)} disabled={review.selfEvalSignedOff || review.managerEvalSignedOff} placeholder="Write your response..." />
          </label>
        ))}
      </div>
    </DetailShell>
  );
}

function EmployeeManagerEvalPage({ review, back }: { review: ReviewContext; back: () => void }) {
  return (
    <DetailShell back={back} title="Manager evaluation" eyebrow={review.managerEvalSignedOff ? "Released" : "Not released yet"}>
      {review.managerEvalSignedOff ? <ReviewPaper review={review} draft={generateDraft(review)} /> : <p className="muted-line">Your manager has not released this evaluation yet.</p>}
    </DetailShell>
  );
}

function AdminHome({
  navigate,
  teams,
  roles,
  employees,
}: {
  navigate: (view: View) => void;
  teams: Team[];
  roles: JobRole[];
  employees: Employee[];
}) {
  return (
    <PageShell eyebrow="Admin dashboard" title="Company setup" copy="Manage company settings from separate section pages.">
      <div className="hub-grid">
        <ActionCard title="Teams" body="Create and manage team options." status={`${teams.length} teams`} onClick={() => navigate("adminTeams")} />
        <ActionCard title="Job roles" body="Manage role titles and assessment bullet points." status={`${roles.length} roles`} onClick={() => navigate("adminRoles")} />
        <ActionCard title="Employees" body="Add employees, edit profiles, and review history." status={`${employees.length} employees`} onClick={() => navigate("adminEmployees")} />
      </div>
    </PageShell>
  );
}

function AdminTeams({ teams, setTeams, back }: { teams: Team[]; setTeams: (teams: Team[]) => void; back: () => void }) {
  const [name, setName] = useState("");
  return (
    <DetailShell back={back} title="Teams" eyebrow="Admin">
      <div className="inline-form">
        <TextField label="Team name" value={name} onChange={setName} />
        <button className="primary-action compact-button" onClick={() => { if (!name.trim()) return; setTeams([...teams, { id: Date.now(), name: name.trim() }]); setName(""); }}><Plus size={17} /> Add</button>
      </div>
      <div className="pill-list">{teams.map((team) => <span key={team.id}>{team.name}</span>)}</div>
    </DetailShell>
  );
}

function AdminRoles({ roles, open, add, back }: { roles: JobRole[]; open: (id: number) => void; add: () => void; back: () => void }) {
  return (
    <DetailShell back={back} title="Job roles" eyebrow="Admin" action={<button className="primary-action compact-button" onClick={add}><Plus size={17} /> Add role</button>}>
      <div className="review-directory">{roles.map((role) => <button className="employee-card list-card" onClick={() => open(role.id)} key={role.id}><span><strong>{role.title}</strong><small>{role.responsibilities.length} assessment bullets</small></span><ArrowRight size={20} /></button>)}</div>
    </DetailShell>
  );
}

function AdminRoleEditor({
  title,
  role,
  save,
  cancel,
  remove,
}: {
  title: string;
  role: JobRole;
  save: (role: JobRole) => void;
  cancel: () => void;
  remove?: () => void;
}) {
  const [roleTitle, setRoleTitle] = useState(role.title);
  const [bullets, setBullets] = useState(role.responsibilities.map((item) => `- ${item}`).join("\n"));
  return (
    <DetailShell back={cancel} title={title} eyebrow="Admin" action={remove && <button className="icon-button danger" onClick={remove}><Trash2 size={18} /></button>}>
      <TextField label="Role title" value={roleTitle} onChange={setRoleTitle} />
      <TextArea label="Assessment bullet points" value={bullets} onChange={setBullets} placeholder="- Designs, develops, tests, and maintains software applications..." />
      <div className="button-row left">
        <button className="primary-action compact-button" onClick={() => save({ id: role.id, title: roleTitle, responsibilities: bullets.split("\n").map((item) => item.replace(/^- /, "").trim()).filter(Boolean) })}><Save size={17} /> Save role</button>
        <button className="secondary-action compact-button" onClick={cancel}>Cancel</button>
      </div>
    </DetailShell>
  );
}

function AdminEmployees({
  employees,
  roles,
  teams,
  reviews,
  open,
  add,
  back,
}: {
  employees: Employee[];
  roles: JobRole[];
  teams: Team[];
  reviews: ReviewContext[];
  open: (id: number) => void;
  add: () => void;
  back: () => void;
}) {
  return (
    <DetailShell back={back} title="Employees" eyebrow="Admin" action={<button className="primary-action compact-button" onClick={add}><Plus size={17} /> Add employee</button>}>
      <div className="review-directory">
        {employees.map((employee) => (
          <button className="employee-card" onClick={() => open(employee.id)} key={employee.id}>
            <span className="avatar large">{initials(employee.name)}</span>
            <span>
              <strong>{employee.name}</strong>
              <small>{roles.find((role) => role.id === employee.roleId)?.title}</small>
              <em>{teams.find((team) => team.id === employee.teamId)?.name} / Started {formatDate(employee.startDate)}</em>
              <span className="card-meta"><b>{reviews.filter((review) => review.employee.id === employee.id).length} reviews</b></span>
            </span>
            <ArrowRight size={20} />
          </button>
        ))}
      </div>
    </DetailShell>
  );
}

function AdminEmployeeEditor({
  title,
  employee,
  roles,
  teams,
  reviews = [],
  openSelfEval,
  openOutline,
  save,
  cancel,
  remove,
}: {
  title: string;
  employee: Employee;
  roles: JobRole[];
  teams: Team[];
  reviews?: ReviewContext[];
  openSelfEval?: (id: number) => void;
  openOutline?: (id: number) => void;
  save: (employee: Employee) => void;
  cancel: () => void;
  remove?: () => void;
}) {
  const [draft, setDraft] = useState(employee);
  return (
    <DetailShell back={cancel} title={title} eyebrow="Admin" action={remove && <button className="icon-button danger" onClick={remove}><Trash2 size={18} /></button>}>
      <div className="form-grid">
        <TextField label="Employee name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
        <TextField label="Start date" type="date" value={draft.startDate} onChange={(startDate) => setDraft({ ...draft, startDate })} />
        <SelectField label="Job role" value={String(draft.roleId)} options={roles.map((role) => ({ label: role.title, value: String(role.id) }))} onChange={(roleId) => setDraft({ ...draft, roleId: Number(roleId) })} />
        <SelectField label="Team" value={String(draft.teamId)} options={teams.map((team) => ({ label: team.name, value: String(team.id) }))} onChange={(teamId) => setDraft({ ...draft, teamId: Number(teamId) })} />
      </div>
      <div className="button-row left"><button className="primary-action compact-button" onClick={() => save(draft)}><Save size={17} /> Save employee</button><button className="secondary-action compact-button" onClick={cancel}>Cancel</button></div>
      {!!reviews.length && (
        <div className="role-list">
          <h2>Review history</h2>
          {reviews.map((review) => (
            <article key={review.id}>
              <strong>{review.cycle}</strong>
              <p>Due {formatDate(review.dueDate)} / Self eval {review.selfEvalSubmitted ? "submitted" : "pending"} / Generated manager eval {review.managerEvalSignedOff ? "released" : "not released"}</p>
              <div className="button-row left">
                <button className="secondary-action compact-button" onClick={() => openSelfEval?.(review.id)}>View self eval</button>
                <button className="secondary-action compact-button" onClick={() => openOutline?.(review.id)} disabled={!review.managerEvalSignedOff}>View generated eval</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DetailShell>
  );
}

function InfoGrid({ review }: { review: ReviewContext }) {
  return (
    <div className="info-grid">
      <div><span>Employee</span><strong>{review.employee.name}</strong></div>
      <div><span>Role</span><strong>{review.role.title}</strong></div>
      <div><span>Team</span><strong>{review.team.name}</strong></div>
      <div><span>Due date</span><strong>{formatDate(review.dueDate)}</strong></div>
    </div>
  );
}

function ActionCard({ title, body, status, onClick }: { title: string; body: string; status: string; onClick: () => void }) {
  return (
    <button className="action-card" onClick={onClick}>
      <span><strong>{title}</strong><small>{body}</small><em>{status}</em></span>
      <ArrowRight size={20} />
    </button>
  );
}

function PageShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: React.ReactNode }) {
  return (
    <section className="dashboard-home">
      <div className="dashboard-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></div></div>
      {children}
    </section>
  );
}

function DetailShell({ eyebrow, title, back, action, children }: { eyebrow: string; title: string; back: () => void; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="review-workspace">
      <div className="workspace-title">
        <button className="secondary-action" onClick={back}><ArrowLeft size={18} /> Back</button>
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
        <div>{action}</div>
      </div>
      <section className="input-panel wide-panel">{children}</section>
    </section>
  );
}

function TextField({ label, value, type = "text", disabled = false, onChange }: { label: string; value: string; type?: string; disabled?: boolean; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SelectField({ label, value, options, disabled = false, onChange }: { label: string; value: string; options: Array<string | { label: string; value: string }>; disabled?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="field"><span>{label}</span><select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        return <option value={value} key={value}>{label}</option>;
      })}
    </select></label>
  );
}

function NumberField({ label, value, disabled = false, onChange }: { label: string; value: number; disabled?: boolean; onChange: (value: number) => void }) {
  return <label className="field"><span>{label}</span><input type="number" value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function TextArea({ label, value, disabled = false, onChange, placeholder }: { label: string; value: string; disabled?: boolean; onChange: (value: string) => void; placeholder: string }) {
  return <label className="field area-field"><span>{label}</span><textarea value={value} disabled={disabled} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ReviewPaper({ review, draft }: { review: ReviewContext; draft: ReturnType<typeof generateDraft> }) {
  return (
    <article className="review-paper">
      <header><p>{review.cycle}</p><h1>{review.employee.name}</h1><span>{review.role.title} / {review.team.name}</span></header>
      <section className="paper-metrics">{draft.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</section>
      <section><h2>High-level job responsibilities</h2>{draft.responsibilities.map((item, index) => <div className="responsibility" key={item.title}><h3>{index + 1}. {item.title}</h3><p>{item.first}</p><p>{item.second}</p></div>)}</section>
      <section><h2>Strengths and accomplishments</h2><ul className="review-list">{draft.strengths.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>Areas of improvement</h2><ul className="review-list">{draft.improvements.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </article>
  );
}

function generateDraft(review: ReviewContext) {
  const employeeName = review.employee.name;
  const selfEvalSummary = review.selfEvalAnswers.filter(Boolean).slice(0, 3).join(" ");
  const projectText = review.projectNotes || `${employeeName} contributed to important team initiatives and helped move priority work forward during the review period.`;
  const prDelta = review.teamPrAverageYear ? review.prsReviewedYear - review.teamPrAverageYear : review.prsReviewedYear;
  const ticketDelta = review.teamTicketAverageYear ? review.ticketsClosed - review.teamTicketAverageYear : review.ticketsClosed;
  return {
    metrics: [
      { label: "MRs / PRs reviewed", value: review.prsReviewedYear.toString() },
      { label: "MRs / PRs average per sprint", value: review.prsAveragePerSprint.toString() },
      { label: "Tickets closed", value: review.ticketsClosed.toString() },
      { label: "Team PR average per year", value: review.teamPrAverageYear.toString() },
      { label: "Team ticket average per year", value: review.teamTicketAverageYear.toString() },
    ],
    responsibilities: review.role.responsibilities.slice(0, 7).map((responsibility) => ({
      title: responsibility,
      first: `${employeeName} is assessed against this ${review.role.title} expectation. ${projectText}`,
      second: `The manager evidence is strengthened by the employee self evaluation, which notes: ${selfEvalSummary || "no self evaluation details have been submitted yet."}`,
    })),
    strengths: bulletize(`${review.strengths}. These strengths showed up through both delivery behavior and the quality of outcomes captured in the review evidence.`),
    improvements: bulletize(`${review.improvements}. Compared with annual team baselines, this contribution was ${describeDelta(prDelta, "MR/PR")} and ${describeDelta(ticketDelta, "ticket")} throughput.`),
  };
}

function bulletize(text: string) {
  return text
    .split(/\n|;|,(?=\s[a-zA-Z])/)
    .map((item) => item.trim().replace(/\.$/, ""))
    .filter(Boolean);
}

function hydrateReview(review: Review, employees: Employee[], roles: JobRole[], teams: Team[]): ReviewContext {
  const employee = employees.find((item) => item.id === review.employeeId) ?? employees[0];
  const role = roles.find((item) => item.id === employee.roleId) ?? roles[0];
  const team = teams.find((item) => item.id === employee.teamId) ?? teams[0];
  return { ...review, employee, role, team };
}

function formatDate(value: string) {
  if (!value) return "not set";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function describeDelta(delta: number, noun: string) {
  if (delta > 0) return `${Math.abs(delta)} above average in ${noun}`;
  if (delta < 0) return `${Math.abs(delta)} below average in ${noun}`;
  return `aligned with team average ${noun}`;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default App;
