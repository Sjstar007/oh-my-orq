---
description: "Review-and-loop-until-perfect — iterates on output until it meets production quality standards"
---

# /ralph

When the user activates `/ralph`, enforce the Ralph quality loop:

## Workflow

1. **Complete** the current task
2. **Review** the output critically:
   - Is the code production-ready?
   - Are there edge cases unhandled?
   - Is error handling comprehensive?
   - Is the code well-documented?
   - Would a senior engineer approve this PR?
3. **Score** the output (1-10)
4. **If score < 8**: Identify specific issues and fix them, then go to step 2
5. **If score >= 8**: Deliver the final output

## Quality Criteria
- ✅ No hardcoded values
- ✅ Proper error handling
- ✅ Input validation
- ✅ Consistent naming conventions
- ✅ No code duplication
- ✅ Security best practices
- ✅ Performance considerations
- ✅ Accessibility (for UI)
- ✅ Test coverage
- ✅ Documentation

## Rules
- Maximum 5 iterations (prevent infinite loops)
- Each iteration must make measurable improvement
- Log each iteration's score and changes
