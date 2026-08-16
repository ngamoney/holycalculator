"use client";

import { useState } from "react";
import Link from "next/link";
import { DICE_FAQS } from "@/lib/data/diceFaqs";
import styles from "./DiceReferenceContent.module.css";

const DICE_SHAPES = [
  { die: "d4", name: "Tetrahedron", faces: 4, shape: "4 triangular faces", games: "D&D damage (small weapons), Pathfinder" },
  { die: "d6", name: "Cube", faces: 6, shape: "6 square faces", games: "Most board games, Yahtzee, Catan, basic D&D" },
  { die: "d8", name: "Octahedron", faces: 8, shape: "8 triangular faces", games: "D&D longsword/crossbow damage" },
  { die: "d10", name: "Pentagonal Trapezohedron", faces: 10, shape: "10 kite-shaped faces", games: "D&D, percentile rolls (d100 = 2×d10)" },
  { die: "d12", name: "Dodecahedron", faces: 12, shape: "12 pentagonal faces", games: "D&D greataxe damage, Barbarian hit dice" },
  { die: "d20", name: "Icosahedron", faces: 20, shape: "20 triangular faces", games: "Core D&D attack/skill checks, saving throws" },
  { die: "d100", name: "Zocchihedron / 2×d10", faces: 100, shape: "100 faces (or two d10s)", games: "Percentile tables, Wild Magic Surge" },
];

export default function DiceReferenceContent() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={styles.refSection}>
      <div className={styles.prose}>
        <h2>Dice Shapes &amp; the Polyhedral Set</h2>
        <p>
          Standard tabletop RPGs use a set of <strong>Platonic solids</strong> and related polyhedra where every face has an equal probability of landing face-up. The classic seven-die set used in Dungeons &amp; Dragons consists of the d4, d6, d8, d10, d12, d20, and d100 (percentile).
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Die</th>
                <th>Shape</th>
                <th>Faces</th>
                <th>Face Geometry</th>
                <th>Common Uses</th>
              </tr>
            </thead>
            <tbody>
              {DICE_SHAPES.map((row) => (
                <tr key={row.die}>
                  <td><strong>{row.die}</strong></td>
                  <td>{row.name}</td>
                  <td>{row.faces}</td>
                  <td>{row.shape}</td>
                  <td>{row.games}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How Random Is a Virtual Dice Roll?</h2>
        <p>
          This is a genuinely interesting question with a nuanced answer. Physical dice have <strong>physical imperfections</strong> — injection-molded plastic dice can have internal air bubbles, uneven pip depths (more ink = slightly heavier face), and rounded corners that all introduce tiny, measurable biases. Casino-grade precision dice (machined to ±0.001 inch tolerance) are significantly fairer, but even those aren't mathematically perfect.
        </p>
        <p>
          Virtual dice, meanwhile, depend entirely on their random number generator. Most online dice rollers use JavaScript's <code>Math.random()</code>, which is a deterministic pseudo-random algorithm (the Xorshift128+ or similar PRNG in most browsers). It <em>appears</em> random for human perception but is technically predictable if you know the seed.
        </p>

        <div className={styles.infoCard}>
          <div className={styles.infoCardTitle}>Holy Calculator uses crypto.getRandomValues()</div>
          <div className={styles.infoCardBody}>
            This roller uses the browser's <strong>Web Cryptography API</strong> — the same source of randomness that password managers and TLS encryption use. It is seeded from OS-level entropy sources (hardware noise, timing jitter) rather than a predictable seed. Each roll is genuinely unpredictable, making it cryptographically stronger than <code>Math.random()</code> for any use case where fairness matters.
          </div>
        </div>

        <p>
          Additionally, this calculator uses <strong>rejection sampling</strong> to eliminate modulo bias — a subtle bug in naive implementations where values near the top of a random integer range appear slightly less often than values near the bottom. Every face on every die here has exactly equal probability.
        </p>

        <h2>Rolling Multiple Dice at Once</h2>
        <p>
          The notation <strong>NdX</strong> means "roll N dice, each with X sides, and add the results." Common examples in D&amp;D 5th Edition:
        </p>
        <p>
          <strong>2d6</strong> — standard roll for short sword damage, greatsword with Great Weapon Fighting. <strong>4d6 drop lowest</strong> — ability score generation (roll four d6s, drop the lowest result). <strong>8d6</strong> — Fireball spell damage. <strong>1d20 + modifier</strong> — the fundamental attack/skill check mechanic of the entire D&amp;D system.
        </p>

        <h2>Quick-Reference: Dice Probability</h2>
        <p>
          Because each face of a fair die is equally likely, the probability of any single outcome on a dN is exactly <strong>1/N</strong>. The expected value (average roll) is <strong>(N+1)/2</strong> — so a d20 averages 10.5, a d6 averages 3.5, and a d12 averages 6.5. Rolling multiple dice makes results converge toward the middle of the range (central limit theorem), which is why 4d6 ability scores cluster around 12-14 rather than spiking at 4 or 24.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {DICE_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqBtn}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${isOpen ? styles.open : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
