import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Revision Pack Output Schema & Quiz Validation Unit Tests', () => {

  function validateRevisionPackSchema(packData) {
    if (!packData || typeof packData !== 'object') {
      throw new Error("Invalid response format received from AI model.");
    }
    if (!packData.title || typeof packData.title !== 'string') {
      throw new Error("Missing or invalid title field.");
    }
    if (!Array.isArray(packData.notes) || packData.notes.length === 0) {
      throw new Error("AI failed to generate revision notes sections.");
    }
    if (!Array.isArray(packData.quiz) || packData.quiz.length === 0) {
      throw new Error("AI failed to generate practice quiz questions.");
    }
    if (packData.quiz.length > 5) {
      packData.quiz = packData.quiz.slice(0, 5);
    }
    return packData;
  }

  test('validateRevisionPackSchema accepts a valid, fully formed revision pack object', () => {
    const mockPack = {
      title: "IPv4 & IPv6 Addressing",
      course: "Computer Networks",
      overview: "Overview of IP addressing models",
      notes: [
        {
          id: "sec-1",
          sectionTitle: "1. IPv4 Addressing",
          summary: "32-bit dotted-decimal notation",
          bullets: ["Classful and classless", "Subnet mask /24"],
          keyTakeaway: "⚡ Key Takeaway: IPv4 provides 4.3 billion addresses.",
          concepts: [{ term: "CIDR", definition: "Classless Inter-Domain Routing" }]
        }
      ],
      quiz: [
        { id: 1, question: "Q1?", options: [{ id: "A", text: "Opt A" }, { id: "B", text: "Opt B" }, { id: "C", text: "Opt C" }, { id: "D", text: "Opt D" }], correctId: "A", explanation: "Exp 1" },
        { id: 2, question: "Q2?", options: [{ id: "A", text: "Opt A" }, { id: "B", text: "Opt B" }, { id: "C", text: "Opt C" }, { id: "D", text: "Opt D" }], correctId: "B", explanation: "Exp 2" },
        { id: 3, question: "Q3?", options: [{ id: "A", text: "Opt A" }, { id: "B", text: "Opt B" }, { id: "C", text: "Opt C" }, { id: "D", text: "Opt D" }], correctId: "C", explanation: "Exp 3" },
        { id: 4, question: "Q4?", options: [{ id: "A", text: "Opt A" }, { id: "B", text: "Opt B" }, { id: "C", text: "Opt C" }, { id: "D", text: "Opt D" }], correctId: "D", explanation: "Exp 4" },
        { id: 5, question: "Q5?", options: [{ id: "A", text: "Opt A" }, { id: "B", text: "Opt B" }, { id: "C", text: "Opt C" }, { id: "D", text: "Opt D" }], correctId: "A", explanation: "Exp 5" }
      ]
    };

    const validated = validateRevisionPackSchema(mockPack);
    assert.equal(validated.quiz.length, 5);
    assert.equal(validated.title, "IPv4 & IPv6 Addressing");
    assert.equal(validated.notes[0].keyTakeaway.startsWith('⚡ Key Takeaway:'), true);
  });

  test('validateRevisionPackSchema truncates excess quiz questions to exactly 5', () => {
    const mockPack = {
      title: "Test",
      notes: [{ id: "sec-1", sectionTitle: "Title", summary: "Sum", bullets: ["B1"] }],
      quiz: [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }
      ]
    };

    const validated = validateRevisionPackSchema(mockPack);
    assert.equal(validated.quiz.length, 5);
  });

  test('validateRevisionPackSchema throws error if notes array is missing or empty', () => {
    const invalidPack = { title: "Test", notes: [], quiz: [{ id: 1 }] };
    assert.throws(() => validateRevisionPackSchema(invalidPack), /AI failed to generate revision notes/);
  });

  test('validateRevisionPackSchema throws error if quiz array is missing or empty', () => {
    const invalidPack = { title: "Test", notes: [{ id: "sec-1" }], quiz: [] };
    assert.throws(() => validateRevisionPackSchema(invalidPack), /AI failed to generate practice quiz/);
  });

  test('JSON cleaner removes markdown fences (```json) properly', () => {
    const rawAiOutput = "```json\n{\n  \"title\": \"Network Layer\"\n}\n```";
    const cleaned = rawAiOutput.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    assert.equal(parsed.title, "Network Layer");
  });

});
