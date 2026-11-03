# Comprehensive Chatbot Test Plan
**Date**: October 29, 2025
**Purpose**: Thoroughly test chatbot responses, follow-up questions, and link accuracy with 40 diverse queries

## Test Objectives

1. **Response Quality**: Verify accurate, concise, and informative responses
2. **Follow-up Relevance**: Ensure follow-up questions are contextual and helpful
3. **Link Accuracy**: Validate that provided links direct to correct pages
4. **Content Coverage**: Test knowledge across all of Michael's experience
5. **Conversation Flow**: Test natural progression through follow-up questions

## Test Categories & Questions

### Category 1: Background & Education (5 questions)
1. "Where did Michael Evans grow up?"
2. "What did Michael study in college?"
3. "How did Michael get into technology?"
4. "Tell me about Michael's early exposure to computers"
5. "What was Michael's first programming experience?"

### Category 2: Career Journey (5 questions)
6. "How did Michael transition from English to tech?"
7. "What was Michael's first job in tech?"
8. "Describe Michael's career progression"
9. "What companies has Michael worked for?"
10. "When did Michael become interested in AI?"

### Category 3: Major Projects (8 questions)
11. "What was special about the Virgin America website?"
12. "Tell me about the restaurant with cliff diving"
13. "What work did Michael do for Target?"
14. "Explain the Before Launcher project"
15. "What was Broadway.com about?"
16. "Tell me about Michael's work with Alaska Airlines"
17. "What did Michael build for HBO?"
18. "Describe the Lyft project Michael worked on"

### Category 4: Technical Skills (5 questions)
19. "What programming languages does Michael know?"
20. "What is Michael's approach to technical architecture?"
21. "How does Michael work with AI tools?"
22. "What frameworks has Michael used?"
23. "Describe Michael's full-stack capabilities"

### Category 5: AI & Innovation (5 questions)
24. "What AI projects has Michael built recently?"
25. "How does Michael use AI in his workflow?"
26. "What's Michael's philosophy on AI and creativity?"
27. "Tell me about Michael's AI research"
28. "What makes Michael effective at working with AI?"

### Category 6: Leadership & Strategy (5 questions)
29. "Tell me about Michael opening the Portland office"
30. "What's Michael's approach to product strategy?"
31. "How does Michael handle challenging projects?"
32. "What leadership roles has Michael held?"
33. "Describe Michael's team collaboration style"

### Category 7: Challenges & Solutions (7 questions)
34. "What was the hardest technical challenge Michael faced?"
35. "How did Michael solve the Casa Bonita queuing problem?"
36. "What challenges did Virgin America present?"
37. "Why did the Before Launcher fail as a business?"
38. "What lessons did Michael learn from failed projects?"
39. "How does Michael approach problem-solving?"
40. "What was challenging about the pandemic for Michael?"

## Follow-up Questions Test Scenarios

These 10 questions will be asked as natural follow-ups to initial responses:

### Scenario A: Project Deep Dives
**Initial**: "Tell me about the restaurant project"
**Follow-up 1**: "What specific technology stack was used?"
**Follow-up 2**: "How many people could the membership system handle?"

### Scenario B: Technical Details
**Initial**: "What AI work has Michael done?"
**Follow-up 3**: "Can you show me examples of these AI projects?"
**Follow-up 4**: "Which AI project was most innovative?"

### Scenario C: Career Progression
**Initial**: "Explain Michael's career journey"
**Follow-up 5**: "What motivated the transition from Huge to Work & Co?"
**Follow-up 6**: "Why did Michael start his own company?"

### Scenario D: Problem Solving
**Initial**: "What was Michael's biggest challenge?"
**Follow-up 7**: "How long did it take to solve?"
**Follow-up 8**: "What was the impact of the solution?"

### Scenario E: Current Work
**Initial**: "What is Michael working on now?"
**Follow-up 9**: "How can I see Michael's recent projects?"
**Follow-up 10**: "Where can I learn more about his AI work?"

## Success Criteria

### Response Quality Metrics
- **Accuracy**: Response contains correct information from transcripts/CMS
- **Brevity**: Response is 1-2 paragraphs maximum
- **Specificity**: Names specific projects, technologies, or companies
- **Completeness**: Addresses the core of the question

### Follow-up Question Metrics
- **Relevance**: Follow-ups relate directly to the response content
- **Actionability**: Questions help users discover more information
- **Link Presence**: At least 50% of follow-ups should contain links
- **Diversity**: Mix of linked and non-linked questions

### Link Validation
- **Correct URLs**: Links point to valid pages
- **Appropriate Destinations**: Links match the context
- **Format**: Links use proper markdown format `[text](url)`

## Test Execution Plan

### Phase 1: Individual Question Testing
1. Send each of the 40 questions independently
2. Record response time, content, and follow-ups
3. Validate response accuracy against known content
4. Check follow-up question relevance

### Phase 2: Follow-up Conversation Testing
1. Execute the 5 conversation scenarios (A-E)
2. Send initial question, then follow-ups based on responses
3. Verify conversation maintains context
4. Check that follow-ups remain relevant

### Phase 3: Link Validation
1. Extract all links from responses
2. Verify link format is correct
3. Test that linked pages exist
4. Confirm link relevance to context

### Phase 4: Edge Case Testing
1. Test ambiguous questions (multiple valid interpretations)
2. Test questions with no direct answer in content
3. Test very specific technical questions
4. Test questions about future plans

## Expected Outcomes

### Quantitative Goals
- **Response Success Rate**: >90% accurate responses
- **Follow-up Relevance**: >85% relevant follow-ups
- **Link Accuracy**: 100% valid links
- **Response Time**: <5 seconds per query
- **Paragraph Compliance**: >80% responses ≤1 paragraph

### Qualitative Goals
- Natural conversation flow
- Helpful navigation through follow-ups
- Comprehensive coverage of Michael's experience
- Professional and informative tone
- Clear project attribution

## Test Data Structure

For each question, we'll record:
```json
{
  "id": "Q1",
  "question": "The question text",
  "category": "Background",
  "response": "The chatbot response",
  "responseLength": "paragraphs",
  "followUps": [
    {
      "text": "Follow-up question",
      "hasLink": true,
      "url": "/case-studies/project"
    }
  ],
  "accuracy": "accurate|partial|incorrect",
  "relevance": "high|medium|low",
  "responseTime": "milliseconds",
  "notes": "Any observations"
}
```

## Risk Mitigation

### Potential Issues & Solutions
1. **Rate Limiting**: Add delays between requests (2-3 seconds)
2. **Context Loss**: Use session IDs for conversation continuity
3. **Timeout Errors**: Set appropriate timeout values (10 seconds)
4. **Parsing Errors**: Robust error handling in test script
5. **False Positives**: Manual review of flagged issues

## Success Indicators

The chatbot will be considered successful if:
1. ✅ Casa Bonita and other projects consistently recognized
2. ✅ Response length mostly stays within 1 paragraph
3. ✅ Follow-up questions provide valuable navigation
4. ✅ Links are accurate and helpful
5. ✅ Conversation flow feels natural
6. ✅ Technical details are accurate
7. ✅ No refusals for legitimate questions
8. ✅ Comprehensive coverage of Michael's experience

## Next Steps

1. Create automated test script based on this plan
2. Execute test suite
3. Compile results into comprehensive report
4. Identify any gaps or issues
5. Recommend improvements if needed