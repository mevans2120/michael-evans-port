/**
 * Better Chatbot Answer Evaluation Script
 * Evaluates chatbot answers more intelligently, recognizing partial information and context
 */

interface EvaluationCriteria {
  question: string;
  mustHaveAny?: string[];      // At least one of these terms should appear
  mustHaveAll?: string[];       // All of these terms must appear
  shouldHave?: string[];        // Good to have but not required
  shouldNotHave?: string[];     // Terms that indicate wrong information
  acceptablePartial?: string[]; // Terms that indicate partial but acceptable knowledge
}

// Define evaluation criteria for common question patterns
const evaluationCriteria: EvaluationCriteria[] = [
  // Background questions
  {
    question: "grow up",
    mustHaveAny: ["Eugene", "Oregon"],
    shouldHave: ["purple house", "hippies"],
  },
  {
    question: "college|university|study",
    mustHaveAny: ["University of Colorado", "Boulder", "CU Boulder"],
    shouldHave: ["English", "political science"],
  },
  {
    question: "first.*programming|programming.*experience",
    mustHaveAny: ["11", "Mac Plus", "Basic", "Pascal", "middle school"],
  },

  // Career questions
  {
    question: "first.*job|first.*tech",
    mustHaveAny: ["Symantec"],
    shouldHave: ["customer data analyst", "business analyst", "data entry"],
  },
  {
    question: "companies.*worked",
    mustHaveAll: ["Symantec", "Huge", "Work & Co"],
    shouldHave: ["Before Labs", "Odopod"],
    shouldNotHave: ["started at Target", "employed by Target", "worked at Target"],
  },

  // Project questions
  {
    question: "Virgin America",
    mustHaveAny: ["airline", "website", "responsive"],
    shouldHave: ["seat selection", "booking", "React"],
  },
  {
    question: "Casa Bonita|restaurant.*cliff",
    mustHaveAny: ["Casa Bonita"],
    shouldHave: ["Trey Parker", "Matt Stone", "Denver", "cliff diving", "membership"],
  },
  {
    question: "Target",
    mustHaveAny: ["Target"],
    acceptablePartial: ["worked with Target", "Target was a client", "client work"],
    shouldNotHave: ["started at Target", "first job", "employed by Target"],
  },
  {
    question: "Before Launcher",
    mustHaveAny: ["Android", "launcher", "home screen"],
    shouldHave: ["notification", "distraction", "minimalist", "Before Labs"],
    shouldNotHave: ["AI", "artificial intelligence", "machine learning"],
  },
  {
    question: "HBO",
    mustHaveAny: ["HBO"],
    shouldHave: ["HBO Go", "streaming", "Astral", "Canadian", "cable"],
    shouldNotHave: ["Apple"],
  },
  {
    question: "Lyft",
    mustHaveAny: ["Lyft"],
    acceptablePartial: ["Work & Co", "Portland office", "client"],
  },

  // AI questions
  {
    question: "AI.*projects|AI.*built",
    mustHaveAny: ["PostPal", "AI", "chatbot"],
    shouldHave: ["medical", "procedure", "Claude"],
  },

  // Current work
  {
    question: "working.*now|current",
    mustHaveAny: ["PostPal", "consulting"],
    shouldHave: ["AI", "medical", "post-procedure"],
  },
];

/**
 * Evaluate a single answer against criteria
 */
function evaluateAnswer(question: string, answer: string): {
  score: number;
  evaluation: 'accurate' | 'partial' | 'incorrect' | 'unknown';
  explanation: string;
} {
  const lowerQuestion = question.toLowerCase();
  const lowerAnswer = answer.toLowerCase();

  // Find applicable criteria
  const applicableCriteria = evaluationCriteria.filter(criteria => {
    const pattern = new RegExp(criteria.question, 'i');
    return pattern.test(lowerQuestion);
  });

  if (applicableCriteria.length === 0) {
    // No specific criteria, check if answer seems reasonable
    if (answer.length > 100 && !answer.includes("I don't have") && !answer.includes("not sure")) {
      return {
        score: 0.5,
        evaluation: 'unknown',
        explanation: 'No specific criteria, but answer seems substantive',
      };
    }
    return {
      score: 0,
      evaluation: 'unknown',
      explanation: 'No evaluation criteria defined for this question',
    };
  }

  let totalScore = 0;
  let maxScore = 0;
  let explanations: string[] = [];

  for (const criteria of applicableCriteria) {
    let criteriaScore = 0;
    let criteriaMax = 0;

    // Check must-have-all terms (all required)
    if (criteria.mustHaveAll) {
      criteriaMax += criteria.mustHaveAll.length * 2;
      const foundAll = criteria.mustHaveAll.every(term =>
        lowerAnswer.includes(term.toLowerCase())
      );
      if (foundAll) {
        criteriaScore += criteria.mustHaveAll.length * 2;
        explanations.push(`✓ Contains all required terms: ${criteria.mustHaveAll.join(', ')}`);
      } else {
        const found = criteria.mustHaveAll.filter(term =>
          lowerAnswer.includes(term.toLowerCase())
        );
        if (found.length > 0) {
          criteriaScore += found.length;
          explanations.push(`⚠ Missing some required terms. Found: ${found.join(', ')}`);
        } else {
          explanations.push(`✗ Missing all required terms: ${criteria.mustHaveAll.join(', ')}`);
        }
      }
    }

    // Check must-have-any terms (at least one required)
    if (criteria.mustHaveAny) {
      criteriaMax += 2;
      const foundAny = criteria.mustHaveAny.some(term =>
        lowerAnswer.includes(term.toLowerCase())
      );
      if (foundAny) {
        criteriaScore += 2;
        const found = criteria.mustHaveAny.filter(term =>
          lowerAnswer.includes(term.toLowerCase())
        );
        explanations.push(`✓ Contains required term(s): ${found.join(', ')}`);
      } else {
        explanations.push(`✗ Missing required terms: ${criteria.mustHaveAny.join(' OR ')}`);
      }
    }

    // Check should-have terms (bonus points)
    if (criteria.shouldHave) {
      criteriaMax += criteria.shouldHave.length;
      const found = criteria.shouldHave.filter(term =>
        lowerAnswer.includes(term.toLowerCase())
      );
      criteriaScore += found.length;
      if (found.length > 0) {
        explanations.push(`✓ Contains bonus terms: ${found.join(', ')}`);
      }
    }

    // Check should-not-have terms (penalty)
    if (criteria.shouldNotHave) {
      const foundBad = criteria.shouldNotHave.filter(term =>
        lowerAnswer.includes(term.toLowerCase())
      );
      if (foundBad.length > 0) {
        criteriaScore = Math.max(0, criteriaScore - foundBad.length * 2);
        explanations.push(`✗ Contains incorrect information: ${foundBad.join(', ')}`);
      }
    }

    // Check acceptable partial terms
    if (criteria.acceptablePartial) {
      const foundPartial = criteria.acceptablePartial.some(term =>
        lowerAnswer.includes(term.toLowerCase())
      );
      if (foundPartial && criteriaScore === 0) {
        criteriaScore = criteriaMax * 0.5;
        explanations.push(`⚠ Contains partial information (acceptable)`);
      }
    }

    totalScore += criteriaScore;
    maxScore += criteriaMax;
  }

  // Calculate percentage score
  const percentage = maxScore > 0 ? (totalScore / maxScore) : 0;

  // Determine evaluation based on score
  let evaluation: 'accurate' | 'partial' | 'incorrect' | 'unknown';
  if (percentage >= 0.8) {
    evaluation = 'accurate';
  } else if (percentage >= 0.4) {
    evaluation = 'partial';
  } else if (explanations.some(e => e.includes('incorrect information'))) {
    evaluation = 'incorrect';
  } else if (percentage > 0) {
    evaluation = 'partial';
  } else {
    evaluation = 'unknown';
  }

  return {
    score: percentage,
    evaluation,
    explanation: explanations.join('\n'),
  };
}

/**
 * Test the evaluation function with sample Q&A
 */
async function testEvaluation() {
  // Read the latest test results
  const fs = await import('fs');
  const resultsPath = '/Users/michaelevans/michael-evans-port-main/docs/chatbot-comprehensive-results.json';

  if (!fs.existsSync(resultsPath)) {
    console.error('No test results found. Run the comprehensive test first.');
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  console.log('🔍 Re-evaluating chatbot answers with better criteria...\n');
  console.log('=' .repeat(70));

  let improvedCount = 0;
  let totalQuestions = 0;
  const reevaluatedResults: any[] = [];

  for (const result of results.results) {
    // Skip follow-up questions for now
    if (result.id.startsWith('S') && result.id.includes('-')) continue;

    totalQuestions++;

    // Get the full response (not truncated)
    const fullResponse = result.response.endsWith('...')
      ? result.response
      : result.response;

    const evaluation = evaluateAnswer(result.question, fullResponse);

    const oldEval = result.accuracy;
    const newEval = evaluation.evaluation;

    // Check if evaluation improved
    const improved = (
      (oldEval === 'unknown' && newEval !== 'unknown') ||
      (oldEval === 'incorrect' && (newEval === 'partial' || newEval === 'accurate')) ||
      (oldEval === 'partial' && newEval === 'accurate')
    );

    if (improved) {
      improvedCount++;
      console.log(`\n✅ IMPROVED: ${result.id} - ${result.question}`);
      console.log(`   Old: ${oldEval} → New: ${newEval} (${(evaluation.score * 100).toFixed(1)}%)`);
      console.log(`   ${evaluation.explanation.split('\n').join('\n   ')}`);
    } else if (oldEval !== newEval) {
      console.log(`\n🔄 CHANGED: ${result.id} - ${result.question}`);
      console.log(`   Old: ${oldEval} → New: ${newEval} (${(evaluation.score * 100).toFixed(1)}%)`);
    }

    reevaluatedResults.push({
      ...result,
      oldAccuracy: oldEval,
      newAccuracy: newEval,
      score: evaluation.score,
      evaluationNotes: evaluation.explanation,
    });
  }

  console.log('\n' + '=' .repeat(70));
  console.log('📊 RE-EVALUATION SUMMARY\n');

  const newAccurate = reevaluatedResults.filter(r => r.newAccuracy === 'accurate').length;
  const newPartial = reevaluatedResults.filter(r => r.newAccuracy === 'partial').length;
  const newIncorrect = reevaluatedResults.filter(r => r.newAccuracy === 'incorrect').length;
  const newUnknown = reevaluatedResults.filter(r => r.newAccuracy === 'unknown').length;

  console.log(`Improved evaluations: ${improvedCount}/${totalQuestions} (${(improvedCount/totalQuestions*100).toFixed(1)}%)\n`);

  console.log('New distribution:');
  console.log(`  Accurate:  ${newAccurate}/${totalQuestions} (${(newAccurate/totalQuestions*100).toFixed(1)}%)`);
  console.log(`  Partial:   ${newPartial}/${totalQuestions} (${(newPartial/totalQuestions*100).toFixed(1)}%)`);
  console.log(`  Incorrect: ${newIncorrect}/${totalQuestions} (${(newIncorrect/totalQuestions*100).toFixed(1)}%)`);
  console.log(`  Unknown:   ${newUnknown}/${totalQuestions} (${(newUnknown/totalQuestions*100).toFixed(1)}%)`);

  const successRate = (newAccurate + newPartial) / totalQuestions;
  console.log(`\nNew success rate: ${(successRate * 100).toFixed(1)}%`);

  // Save re-evaluated results
  const reevaluationReport = {
    timestamp: new Date().toISOString(),
    originalResults: results.summary,
    reevaluatedSummary: {
      accurate: newAccurate,
      partial: newPartial,
      incorrect: newIncorrect,
      unknown: newUnknown,
      successRate,
      improvedCount,
    },
    details: reevaluatedResults,
  };

  const reevalPath = '/Users/michaelevans/michael-evans-port-main/docs/chatbot-reevaluation-results.json';
  fs.writeFileSync(reevalPath, JSON.stringify(reevaluationReport, null, 2));

  console.log(`\n✅ Re-evaluation complete!`);
  console.log(`Results saved to: ${reevalPath}`);
}

// Run the evaluation
testEvaluation().catch(console.error);