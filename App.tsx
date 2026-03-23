import React, { useMemo, useState } from "react";

type ScaleOption = {
  value: number;
  label: string;
};

type Weights = {
  ayn: number;
  hasad: number;
  sihr: number;
  mass: number;
};

type Question = {
  id: string;
  text: string;
  weights: Weights;
};

type QuestionSection = {
  title: string;
  description: string;
  items: Question[];
};

type ScoreLevel = {
  label: string;
  pct: number;
};

type Results = {
  ayn: ScoreLevel;
  hasad: ScoreLevel;
  sihr: ScoreLevel;
  mass: ScoreLevel;
};

const scale: ScaleOption[] = [
  { value: 0, label: "No" },
  { value: 1, label: "A little" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Very often" },
];

const questionSections: QuestionSection[] = [
  {
    title: "Section 1 – General Symptoms",
    description: "General bodily and emotional signs often linked to ‘ayn and hasad.",
    items: [
      {
        id: "q1",
        text: "Do you often get frontal headaches, neck or shoulder tightness, chest tightness, or sudden tiredness without a clear reason?",
        weights: { ayn: 3, hasad: 1, sihr: 1, mass: 0 },
      },
      {
        id: "q2",
        text: "Do you get heat in the body or extremities, bruises without clear cause, numbness, paleness, or a racing heartbeat?",
        weights: { ayn: 3, hasad: 2, sihr: 1, mass: 0 },
      },
      {
        id: "q3",
        text: "Do you struggle with irrational fear, sudden anger, isolation, stress, anxiety, or unusual doubt?",
        weights: { ayn: 2, hasad: 3, sihr: 1, mass: 2 },
      },
      {
        id: "q4",
        text: "Do you feel resistance to salah, Qur’an, adhkar, or other acts of worship?",
        weights: { ayn: 2, hasad: 2, sihr: 2, mass: 3 },
      },
    ],
  },
  {
    title: "Section 2 – Sleep & Spiritual Reaction",
    description: "Sleep patterns, dreams, and spiritual response.",
    items: [
      {
        id: "q5",
        text: "Do you get repeated nightmares, fear at night, dreams of animals, being chased, falling, or other disturbing dreams?",
        weights: { ayn: 2, hasad: 2, sihr: 2, mass: 3 },
      },
      {
        id: "q6",
        text: "Did the problem begin or get worse after praise, jealousy, a major life change, conflict, or clear progress in your life?",
        weights: { ayn: 3, hasad: 3, sihr: 1, mass: 1 },
      },
      {
        id: "q7",
        text: "Do you have whole-body heat, night sweats, joint pain, phlegm without a clear cause, or tiredness from doing very little?",
        weights: { ayn: 0, hasad: 4, sihr: 1, mass: 0 },
      },
    ],
  },
  {
    title: "Section 3 – Possible Sihr Signs",
    description: "Blockages, stomach symptoms, and relationship disturbance.",
    items: [
      {
        id: "q8",
        text: "Do you have stomach pain, nausea, vomiting, bloating, loss of appetite, or heat in the stomach especially when listening to ruqyah?",
        weights: { ayn: 1, hasad: 1, sihr: 4, mass: 0 },
      },
      {
        id: "q9",
        text: "Do your legs or feet react strongly, feel hot, bruise, feel pulled down, or get worse in certain places?",
        weights: { ayn: 0, hasad: 0, sihr: 4, mass: 1 },
      },
      {
        id: "q10",
        text: "Do you have repeated blockages in marriage, work, studies, or life progress without a clear reason?",
        weights: { ayn: 1, hasad: 1, sihr: 4, mass: 1 },
      },
      {
        id: "q14",
        text: "Do you have a sudden change of feelings in marriage or relationships, dislike without reason, or feel relief when a spouse leaves?",
        weights: { ayn: 0, hasad: 1, sihr: 4, mass: 1 },
      },
    ],
  },
  {
    title: "Section 4 – Possible Mass Signs",
    description: "Body movement, sensed presence, and strong recitation reactions.",
    items: [
      {
        id: "q11",
        text: "Do you feel movement in the body, twitching, electrical sensations, or a presence near you?",
        weights: { ayn: 0, hasad: 0, sihr: 1, mass: 4 },
      },
      {
        id: "q12",
        text: "Do you feel uneasy when hearing Qur’an or the adhan, or react through crying, panic, pain, yawning, or agitation during ruqyah?",
        weights: { ayn: 1, hasad: 1, sihr: 3, mass: 4 },
      },
      {
        id: "q13",
        text: "Do you hear things, feel called, smell bad odours others do not smell, or talk, cry, or laugh in sleep without remembering it?",
        weights: { ayn: 0, hasad: 0, sihr: 1, mass: 4 },
      },
      {
        id: "q15",
        text: "Have normal explanations and practical efforts not fully explained what you have been going through?",
        weights: { ayn: 1, hasad: 1, sihr: 2, mass: 2 },
      },
    ],
  },
];

const questions = questionSections.flatMap((section) => section.items);
const emptyAnswers: Record<string, string> = Object.fromEntries(
  questions.map((q) => [q.id, ""])
);

function scoreToLevel(value: number, max: number): ScoreLevel {
  const pct = Math.round((value / max) * 100);
  if (pct >= 68) return { label: "Strong indication", pct };
  if (pct >= 45) return { label: "Moderate indication", pct };
  if (pct >= 25) return { label: "Mild indication", pct };
  return { label: "Low indication", pct };
}

function resultSummary(
  recommendation: { top: { name: string }; second: { name: string } | null; mixed: boolean },
  results: Results
) {
  const lines: string[] = [];

  if (recommendation.mixed && recommendation.second) {
    lines.push(
      `Your answers show a mixed pattern, with ${recommendation.top.name} slightly higher than ${recommendation.second.name}.`
    );
  } else {
    lines.push(`Primary pattern detected: Possible ${recommendation.top.name} pattern.`);
  }

  lines.push(
    "This does not confirm the condition. It only means your symptoms match common patterns associated with it."
  );

  if (results.ayn.pct >= 55) {
    lines.push(
      "There are signs linked to bodily heaviness, headache patterns, tiredness, and symptoms often associated with ‘ayn."
    );
  }
  if (results.hasad.pct >= 55) {
    lines.push(
      "There are signs linked to anxiety, tiredness, heat, night disturbance, and jealousy-related symptom patterns often associated with hasad."
    );
  }
  if (results.sihr.pct >= 55) {
    lines.push(
      "There are signs linked to blockages, stomach-related symptoms, place-based reactions, or relationship disturbance often associated with sihr."
    );
  }
  if (results.mass.pct >= 55) {
    lines.push(
      "There are signs linked to body movement, sensed presence, sleep disturbance, or strong reactions to recitation often associated with mass."
    );
  }

  return lines;
}

function cardStyle(): React.CSSProperties {
  return {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 4px 18px rgba(15,23,42,0.05)",
  };
}

function badgeStyle(dark = false): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    border: dark ? "1px solid #0f172a" : "1px solid #cbd5e1",
    background: dark ? "#0f172a" : "#fff",
    color: dark ? "#fff" : "#334155",
    fontSize: 12,
    fontWeight: 600,
  };
}

function buttonStyle(primary = true, active = false): React.CSSProperties {
  if (active) {
    return {
      padding: "14px",
      borderRadius: 14,
      border: "1px solid #0f172a",
      background: "#0f172a",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    };
  }

  return {
    padding: "14px",
    borderRadius: 14,
    border: primary ? "none" : "1px solid #cbd5e1",
    background: primary ? "#0f172a" : "#fff",
    color: primary ? "#fff" : "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  };
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>(emptyAnswers);
  const [submitted, setSubmitted] = useState(false);

  const completion = useMemo(() => {
    const answered = Object.values(answers).filter((v) => v !== "").length;
    return Math.round((answered / questions.length) * 100);
  }, [answers]);

  const results: Results = useMemo(() => {
    const totals = { ayn: 0, hasad: 0, sihr: 0, mass: 0 };
    const maxTotals = { ayn: 0, hasad: 0, sihr: 0, mass: 0 };

    questions.forEach((q) => {
      const answer = Number(answers[q.id] || 0);
      (Object.entries(q.weights) as Array<[keyof Weights, number]>).forEach(([key, weight]) => {
        totals[key] += answer * weight;
        maxTotals[key] += 4 * weight;
      });
    });

    return {
      ayn: scoreToLevel(totals.ayn, Math.max(maxTotals.ayn, 1)),
      hasad: scoreToLevel(totals.hasad, Math.max(maxTotals.hasad, 1)),
      sihr: scoreToLevel(totals.sihr, Math.max(maxTotals.sihr, 1)),
      mass: scoreToLevel(totals.mass, Math.max(maxTotals.mass, 1)),
    };
  }, [answers]);

  const recommendation = useMemo(() => {
    const ordered = [
      { key: "ayn", name: "‘Ayn", pct: results.ayn.pct },
      { key: "hasad", name: "Hasad", pct: results.hasad.pct },
      { key: "sihr", name: "Sihr", pct: results.sihr.pct },
      { key: "mass", name: "Mass", pct: results.mass.pct },
    ].sort((a, b) => b.pct - a.pct);

    const top = ordered[0];
    const second = ordered[1] ?? null;
    const mixed = !!second && top.pct - second.pct <= 8;

    return { top, second, mixed };
  }, [results]);

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: String(value) }));
  };

  const resetForm = () => {
    setIssueText("");
    setAnswers(emptyAnswers);
    setStarted(false);
    setSubmitted(false);
  };

  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch {
      alert("Could not copy automatically. Please copy the link manually.");
    }
  };

  if (!started) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff, #f1f5f9)",
          color: "#0f172a",
          fontFamily: "Arial, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" , padding: "0 12px" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <span style={badgeStyle(true)}>Online Ruqyah Pre-Assessment</span>
              <span style={badgeStyle(false)}>Private • Self-guided • Structured</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px, 6vw, 42px)", marginBottom: 12 }}>Start your ruqyah pre-assessment</h1>
            <p style={{ color: "#475569", lineHeight: 1.7, maxWidth: 820 }}>
              This website is for people who want to check their symptoms first before contacting a
              practitioner. You can describe what you have been going through, answer the symptom
              questions, receive a likely pre-assessment, and then follow a structured 3-night
              ruqyah plan.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={cardStyle()}>
              <div style={{ color: "#64748b", fontSize: 14 }}>Questions</div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>15</div>
            </div>
            <div style={cardStyle()}>
              <div style={{ color: "#64748b", fontSize: 14 }}>Categories checked</div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>4</div>
            </div>
            <div style={cardStyle()}>
              <div style={{ color: "#64748b", fontSize: 14 }}>Next step</div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>3-night plan</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            <div style={cardStyle()}>
              <h2>How this site works</h2>
              <p style={{ color: "#64748b", marginBottom: 14 }}>
                A simple self-service process before speaking to a practitioner.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  ["Step 1", "Briefly describe what you have been experiencing, then answer the symptom questions honestly."],
                  ["Step 2", "The website reviews your answers and gives a likely pre-assessment for ‘ayn, hasad, sihr, or mass."],
                  ["Step 3", "You are then guided through all three ruqyah recordings over three nights."],
                  ["Step 4", "Listen correctly for three nights, continue daily protection, and contact a practitioner if the reaction becomes strong."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 16,
                      padding: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle()}>
              <h2>Important notes before starting</h2>
              <p style={{ color: "#64748b", marginBottom: 14 }}>Please read this first.</p>
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    border: "1px solid #fde68a",
                    background: "#fffbeb",
                    color: "#92400e",
                    borderRadius: 16,
                    padding: 14,
                    lineHeight: 1.6,
                  }}
                >
                  <strong>This is a pre-assessment only</strong>
                  <p>
                    This website does not give a final diagnosis. It gives a likely direction so
                    you can start with a structured ruqyah process.
                  </p>
                </div>

                <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
                  <strong>Medical and mental health issues</strong>
                  <p>
                    Serious physical, emotional, or psychological symptoms should also be checked
                    through the appropriate professional channels.
                  </p>
                </div>

                <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 14 }}>
                  <strong>Privacy</strong>
                  <p>
                    You can complete this assessment without calling anyone first. It is meant to
                    help people start privately and calmly.
                  </p>
                </div>

                <button style={buttonStyle(true)} onClick={() => setStarted(true)}>
                  Begin assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff, #f1f5f9)",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 12px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={badgeStyle(true)}>Online Ruqyah Pre-Assessment</span>
            <span style={badgeStyle(false)}>No phone call needed first</span>
          </div>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", marginBottom: 10 }}>Answer the questions below</h1>
          <p style={{ color: "#64748b", maxWidth: 800, marginBottom: 16 }}>
            Once you finish, the site will show your likely pattern and then guide you through a
            3-night ruqyah plan.
          </p>

          <div style={{ ...cardStyle(), maxWidth: 360 }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#64748b" }}
            >
              <span>Progress</span>
              <span>{completion}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 12,
                borderRadius: 999,
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${completion}%`,
                  height: "100%",
                  background: "#0f172a",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={cardStyle()}>
            <h2>Describe your issue</h2>
            <p style={{ color: "#64748b", marginBottom: 12 }}>
              Optional, but helpful. Briefly explain what you have been experiencing.
            </p>
            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="Example: My symptoms became worse after a big life change, I feel heavy, and I react strongly when Qur’an is played..."
              style={{
                width: "100%",
                minHeight: 130,
                border: "1px solid #cbd5e1",
                borderRadius: 16,
                padding: 14,
                resize: "vertical",
              }}
            />
          </div>

          {questionSections.map((section) => (
            <div key={section.title} style={cardStyle()}>
              <h2>{section.title}</h2>
              <p style={{ color: "#64748b", marginBottom: 14 }}>{section.description}</p>

              <div style={{ display: "grid", gap: 14 }}>
                {section.items.map((q) => {
                  const globalIndex = questions.findIndex((item) => item.id === q.id);
                  const currentLabel =
                    answers[q.id] === ""
                      ? "Pending"
                      : scale.find((s) => String(s.value) === answers[q.id])?.label;

                  return (
                    <div
                      key={q.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "flex-start",
                          marginBottom: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <p style={{ margin: 0, lineHeight: 1.6, color: "#1e293b" }}>
                          {globalIndex + 1}. {q.text}
                        </p>
                        <span style={badgeStyle(false)}>{currentLabel}</span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                          gap: 10,
                        }}
                      >
                        {scale.map((option) => {
                          const active = answers[q.id] === String(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleAnswer(q.id, option.value)}
                              style={buttonStyle(false, active)}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={cardStyle()}>
            <h2>Finish and view result</h2>
            <p style={{ color: "#64748b", marginBottom: 14 }}>
              Your result and 3-night ruqyah plan will appear immediately below after submission.
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <button
                style={buttonStyle(true)}
                onClick={() => setSubmitted(true)}
                disabled={completion < 100}
              >
                Show my result
              </button>

              {completion < 100 && (
                <p style={{ color: "#64748b", fontSize: 12 }}>
                  Please answer all 15 questions before viewing the result.
                </p>
              )}

              {submitted && (
                <div
                  style={{
                    border: "1px solid #bbf7d0",
                    background: "#f0fdf4",
                    color: "#166534",
                    borderRadius: 16,
                    padding: 14,
                  }}
                >
                  Your result is shown below.
                </div>
              )}

              <button style={buttonStyle(false)} onClick={resetForm}>
                Start over
              </button>
            </div>
          </div>

          {submitted && (
            <>
              <div style={{ ...cardStyle(), border: "2px solid #0f172a" }}>
                <h2>Your pre-assessment result</h2>
                <p style={{ color: "#64748b", marginBottom: 14 }}>
                  This is a likely direction, not a final ruling.
                </p>

                <div style={{ display: "grid", gap: 12 }}>
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      borderRadius: 16,
                      padding: 14,
                    }}
                  >
                    <span style={badgeStyle(true)}>Result ready</span>
                    <p style={{ color: "#64748b", marginTop: 10, fontSize: 13 }}>
                      Primary pattern detected
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>
                      Possible {recommendation.top.name} pattern
                    </p>
                    <p style={{ color: "#64748b", marginTop: 6 }}>
                      {results[recommendation.top.key as keyof Results].label} •{" "}
                      {recommendation.top.pct}%
                    </p>
                  </div>

                  {recommendation.mixed && recommendation.second && (
                    <div
                      style={{
                        border: "1px solid #fde68a",
                        background: "#fffbeb",
                        color: "#92400e",
                        borderRadius: 16,
                        padding: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      Your answers are mixed. {recommendation.top.name} is slightly higher, but{" "}
                      {recommendation.second.name} is also showing strongly.
                    </div>
                  )}

                  {issueText.trim() && (
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>What you described</strong>
                      <p>{issueText}</p>
                    </div>
                  )}

                  <div style={{ display: "grid", gap: 10 }}>
                    {resultSummary(recommendation, results).map((line, i) => (
                      <p key={i} style={{ color: "#334155", lineHeight: 1.6 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div style={cardStyle()}>
                <h2>How to listen to the ruqyah</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    "Be in wudhu before listening.",
                    "Lay down while listening.",
                    "Both earphones must be in your ears.",
                    "Close your eyes and focus on the recitation.",
                    "Listen to one ruqyah per night for 3 nights in a row.",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle()}>
                <h2>Ruqyah listening plan</h2>
                <p style={{ color: "#64748b", marginBottom: 14 }}>
                  Regardless of the result, listen to all three ruqyah recordings over three nights.
                </p>

                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    {
                      night: "Night 1",
                      title: "‘Ayn / Hasad Ruqyah",
                      url: "https://youtu.be/rXQFrk33Dcs?si=ukM8-Oe4fZbacMuW",
                      primary: true,
                    },
                    {
                      night: "Night 2",
                      title: "Sihr Ruqyah",
                      url: "https://youtu.be/FpKwZmj63fE?si=Wt0BGfuP7wM9YhR9",
                      primary: true,
                    },
                    {
                      night: "Night 3",
                      title: "Mass Ruqyah",
                      url: "https://youtu.be/qn3wezcmQX4?si=NwIA-hs7kHYFlOYG",
                      primary: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.night}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                      }}
                    >
                      <p style={{ color: "#64748b", fontSize: 13 }}>{item.night}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{item.title}</p>
                      <div
                        style={{
                          border: "1px solid #e2e8f0",
                          background: "#f8fafc",
                          borderRadius: 14,
                          padding: 12,
                          fontSize: 12,
                          color: "#475569",
                          wordBreak: "break-all",
                          marginTop: 10,
                        }}
                      >
                        {item.url}
                      </div>
                      <button
                        style={{ ...buttonStyle(item.primary), width: "100%", marginTop: 10 }}
                        onClick={() => copyText(item.url, `${item.night} ruqyah link copied.`)}
                      >
                        Copy {item.night} Link
                      </button>
                    </div>
                  ))}

                  <div
                    style={{
                      border: "1px solid #fde68a",
                      background: "#fffbeb",
                      color: "#92400e",
                      borderRadius: 16,
                      padding: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    Listen to one recording per night for three nights in a row. Pay attention to
                    any reactions that occur during recitation.
                  </div>
                </div>
              </div>

              <div style={cardStyle()}>
                <h2>Possible reactions during ruqyah</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    "Some people may experience yawning, crying, heat, body movement, stomach discomfort, panic, or agitation.",
                    "Not every reaction means the same thing, but a clear increase during recitation can be useful to note.",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle()}>
                <h2>Daily protection</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    "Read your morning adhkar daily.",
                    "Read your evening adhkar daily.",
                    "Read Ayatul Kursi before sleep.",
                    "Read the last three surahs before sleep.",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  ...cardStyle(),
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                }}
              >
                <h2>When to contact a practitioner</h2>
                <div style={{ display: "grid", gap: 12 }}>
                  <p style={{ color: "#991b1b" }}>
                    If you react strongly during the ruqyah, you should then consult a qualified
                    practitioner.
                  </p>
                  <div
                    style={{
                      border: "1px solid #fecaca",
                      background: "rgba(255,255,255,0.7)",
                      color: "#991b1b",
                      borderRadius: 16,
                      padding: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    Strong reactions can include pain, crying, shaking, panic, strong discomfort,
                    or other clear worsening during the recitation.
                  </div>
                </div>
              </div>
            </>
          )}

          <div
            style={{
              ...cardStyle(),
              border: "1px solid #fde68a",
              background: "#fffbeb",
              color: "#92400e",
            }}
          >
            <strong>Purpose of this site</strong>
            <p style={{ marginTop: 8, lineHeight: 1.6 }}>
              This site is designed so people can start privately with a short symptom review and a
              structured 3-night ruqyah plan before needing to call a practitioner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}