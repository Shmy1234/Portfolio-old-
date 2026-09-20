import assert from "node:assert/strict";
import test from "node:test";

const portfolioUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:3100";
const response = await fetch(portfolioUrl);
assert.equal(response.ok, true, `Expected ${portfolioUrl} to respond successfully`);
const page = await response.text();

test("renders the approved professional positioning", () => {
  assert.match(page, /Software engineer building dependable full-stack and AI products\./);
  assert.doesNotMatch(
    page,
    /3\.54|dean(?:'|’)s list|welcome to my portfolio|over a year of programming experience|\baspiring\b/i,
  );
  assert.match(page, /https:\/\/www\.linkedin\.com\/in\/sahilrr\//);
  assert.doesNotMatch(page, /linkedin\.com\/in\/sahilregonda/);
});

test("renders five experience entries in reverse chronological order", () => {
  const companies = [
    "Seagulls Labs",
    "Applied Optimal Inc.",
    "Inclusifai",
    "PashMotors",
    "Ontario Inc.",
  ];
  const positions = companies.map((company) => page.indexOf(company));

  positions.forEach((position, index) => {
    assert.notEqual(position, -1, `${companies[index]} is missing`);
  });
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(page, /estimated\s+\d+%|\(\d+\s+mos\)/i);
});

test("renders the approved six projects and links", () => {
  [
    "AccessiGo",
    "SEC Document Copilot",
    "SkillSnapAI",
    "Pathfinder Mastery",
    "Trial of the Knight",
    "Dungeon Runner",
  ].forEach((project) => {
    assert.match(page, new RegExp(project), `${project} is missing`);
  });
  assert.match(page, /https:\/\/github\.com\/Shmy1234\/SkillSnapAI/);
  assert.match(page, /https:\/\/skill-snap-ai-theta\.vercel\.app\//);
  assert.match(page, /https:\/\/github\.com\/Shmy1234\/Pathfinder-Mastery/);
  assert.match(page, /https:\/\/pathfinder-mastery\.vercel\.app\//);
  assert.doesNotMatch(page, /pathfinding-algorithms-olive|runner-dungeon-2\.vercel\.app/i);
  assert.doesNotMatch(page, /98%|under two seconds|222.*passing backend tests/i);
});

test("renders direct contact actions without a message form", () => {
  assert.doesNotMatch(page, /<form\b|Message Sent/i);
  assert.match(page, /mailto:sahil\.regonda@mail\.utoronto\.ca/);
  assert.match(page, /https:\/\/www\.linkedin\.com\/in\/sahilrr\//);
  assert.match(page, /https:\/\/github\.com\/Shmy1234/);
});
