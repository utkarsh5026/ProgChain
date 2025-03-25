from .base import ModeType, ModeConfig


class StandardMode(ModeConfig):
    """Standard comprehensive explanation mode."""
    mode_type = ModeType.STANDARD
    name = "Standard Explanation"
    description = "Comprehensive explanation of the topic with examples and applications"

    prompt_template = """
    Create a comprehensive educational explanation of {topic_title}.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with the following sections:

    # {topic_title}

    ## Core Concept Provide a clear, concise explanation of the central idea behind {topic_title}. Focus on what 
    makes this concept unique and its foundational principles. This should be accessible to someone new to the topic.

    ## Detailed Explanation
    Elaborate on the core concept with in-depth technical details. Include:
    - Historical context if relevant
    - Theoretical foundations
    - Key mechanisms or processes
    - Important variations or subtypes
    - Common misconceptions

    ## Practical Example
    Present a concrete example that demonstrates {topic_title} in action. This could be:
    - A code snippet if it's a programming concept
    - A worked-through problem if it's mathematical
    - A real-world scenario if it's a theoretical concept
    - A step-by-step procedure if it's a process

    ## Key Insights
    - Highlight 3-5 crucial insights that deepen understanding of {topic_title}
    - Focus on non-obvious aspects that experts know but beginners might miss
    - Include any special cases or exceptions worth noting

    ## Practical Applications
    - Provide 3-5 real-world applications or use cases
    - Explain how {topic_title} solves specific problems in these contexts
    - Include examples from different domains if applicable

    ## Related Concepts
    - List 3-5 related concepts that build upon or complement {topic_title}
    - Briefly explain how each concept relates to {topic_title}
    - Suggest a logical learning sequence if applicable

    {extra_instructions}
    """


class InterviewMode(ModeConfig):
    """Interview preparation mode with questions and answers."""
    mode_type = ModeType.INTERVIEW
    name = "Interview Prep"
    description = "Common interview questions and model answers on this topic"

    prompt_template = """
    Create an interview preparation guide for {topic_title}.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with the following sections:

    # Interview Questions: {topic_title}

    ## Overview Start with a brief overview of why {topic_title} is important in technical interviews and what 
    interviewers are typically looking for when they ask about it.

    ## Foundational Questions

    1. **Question**: What is {topic_title} and why is it important?
       **Answer**: [Provide a concise, clear definition and explanation of importance]

    2. **Question**: [Basic conceptual question about {topic_title}]
       **Answer**: [Clear, concise answer that demonstrates understanding]

    3. **Question**: [Common entry-level question about {topic_title}]
       **Answer**: [Detailed answer with simple examples]

    ## Intermediate Questions

    4. **Question**: [Question about implementation details or practical applications]
       **Answer**: [Comprehensive answer with examples or code snippets if applicable]

    5. **Question**: [Question about common challenges or limitations]
       **Answer**: [Answer that shows deeper understanding of nuances]

    6. **Question**: [Question about alternatives or related approaches]
       **Answer**: [Comparative answer highlighting pros and cons]

    ## Advanced Questions

    7. **Question**: [Complex question testing deep understanding]
       **Answer**: [In-depth answer showing expert knowledge]

    8. **Question**: [Question about optimization, edge cases, or best practices]
       **Answer**: [Sophisticated answer with trade-offs and considerations]

    9. **Question**: [Question about recent developments or advanced applications]
       **Answer**: [Forward-looking answer demonstrating awareness of trends]

    ## System Design / Real World Application

    10. **Question**: How would you implement/apply {topic_title} in a real-world system?
        **Answer**: [Structured approach to implementation with considerations for:
        - Scale
        - Performance
        - Reliability
        - Trade-offs]

    ## Behavioral Questions

    11. **Question**: Describe a situation where you had to use {topic_title} to solve a problem.
        **Answer**: [STAR format answer template showing how to discuss experience with this topic]

    ## How to Demonstrate Your Knowledge

    [Provide specific advice on:
    - Key terminology to use
    - Common pitfalls to avoid
    - How to structure answers effectively
    - How to demonstrate both theoretical knowledge and practical experience]

    ## Questions to Ask the Interviewer

    [Suggest 3-5 thoughtful questions the candidate could ask about how the company uses or implements {topic_title}]

    {extra_instructions}
    """


class FirstPrinciplesMode(ModeConfig):
    """First principles learning mode that breaks topics down to fundamentals."""
    mode_type = ModeType.FIRST_PRINCIPLES
    name = "First Principles"
    description = "Break down complex topics into fundamental building blocks"

    prompt_template = """
    Create an explanation of {topic_title} from first principles.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown, breaking down the topic to its most fundamental concepts:

    # Understanding {topic_title} From First Principles

    ## What is First Principles Thinking? Start with a brief explanation of what it means to understand something 
    from first principles - breaking down complex ideas into fundamental truths that cannot be deduced from other 
    propositions.

    ## Foundational Concepts
    Identify the most basic elements or truths that underlie {topic_title}. These should be concepts that:
    - Are self-evident or previously well-established
    - Cannot be broken down further in a meaningful way
    - Form the building blocks for understanding the topic

    For each foundational concept, provide:
    1. A clear definition
    2. Why it's considered fundamental
    3. How it relates to {topic_title}

    ## Building Up From Fundamentals

    ### Step 1: [First logical step] Explain how the first fundamental concepts combine or lead to the next level of 
    understanding. Use clear reasoning and avoid skipping logical steps.

    ### Step 2: [Second logical step]
    Continue building on previous steps, showing how new concepts emerge from the combination of more fundamental ones.

    ### Step 3: [Third logical step]
    Progress through the logical sequence of understanding, always referring back to more fundamental concepts.

    [Continue with Steps 4, 5, etc. as needed]

    ## Final Synthesis: {topic_title} Show how the complete concept of {topic_title} emerges from the building blocks 
    you've established. Emphasize how each component is necessary and how they fit together.

    ## Why This Matters
    Explain why understanding {topic_title} from first principles:
    - Provides deeper insight than memorizing facts
    - Enables innovation and problem-solving
    - Allows adaptation to new situations
    - Prevents misconceptions

    ## Common Misconceptions Identify 3-5 common misconceptions about {topic_title} and explain why they arise when 
    people don't understand the first principles.

    ## Practical Understanding Provide a practical example that demonstrates how first-principles thinking about {
    topic_title} leads to better solutions or deeper understanding than surface-level knowledge.

    {extra_instructions}
    """


class PracticalMode(ModeConfig):
    """Practical application mode focused on hands-on examples."""
    mode_type = ModeType.PRACTICAL
    name = "Practical Applications"
    description = "Learn through hands-on examples and real-world applications"

    prompt_template = """
    Create a practical guide for applying {topic_title} in real-world scenarios.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with an emphasis on practical examples:

    # Practical Guide: {topic_title}

    ## Quick Theory Recap Provide a brief explanation of what {topic_title} is - no more than 2 paragraphs. Focus 
    only on the essential theory needed to understand the practical examples.

    ## Key Components/Prerequisites List any tools, libraries, technologies, or prior knowledge that will be needed 
    to work with the examples in this guide.

    ## Practical Example 1: [Specific real-world application]

    ### Problem Statement
    Clearly describe a realistic problem that {topic_title} can solve.

    ### Implementation
    ```
    [Detailed code example, step-by-step procedure, or implementation plan]
    ```

    ### Step-by-Step Explanation
    1. [First step with detailed explanation]
    2. [Second step with detailed explanation]
    3. [Continue with remaining steps]

    ### Key Points
    - Highlight critical aspects of this implementation
    - Explain any non-obvious decisions or techniques
    - Point out potential customization points

    ## Practical Example 2: [Different application]

    ### Problem Statement
    [Describe a different problem with different requirements or constraints]

    ### Implementation
    ```
    [Another detailed example with a different approach]
    ```

    ### Step-by-Step Explanation
    [Detailed walkthrough as with first example]

    ### Key Points
    [Highlight different aspects than in the first example]

    ## Common Pitfalls and Solutions

    1. **Pitfall**: [Common mistake people make when implementing {topic_title}]
       **Solution**: [Specific actionable solution with example]

    2. **Pitfall**: [Another common issue]
       **Solution**: [How to address it]

    3. **Pitfall**: [A third common problem]
       **Solution**: [Clear resolution]

    ## Performance Considerations
    Discuss practical aspects of implementation such as:
    - Efficiency and optimization techniques
    - Scalability concerns
    - Resource usage
    - Trade-offs between different approaches

    ## Best Practices
    Provide a checklist of best practices for implementing {topic_title}:

    - [Important practice 1]
    - [Important practice 2]
    - [Important practice 3]
    - [Important practice 4]
    - [Important practice 5]

    ## Project Ideas to Practice

    1. **Beginner**: [Simple project idea using this concept]
    2. **Intermediate**: [More complex project idea]
    3. **Advanced**: [Challenging project that incorporates multiple aspects]

    ## Resources for Further Practice
    Suggest tools, libraries, platforms, or resources that can help with practical implementation.

    {extra_instructions}
    """


class ComparativeMode(ModeConfig):
    """Comparative learning mode for understanding through comparison."""
    mode_type = ModeType.COMPARATIVE
    name = "Comparative Learning"
    description = "Understand this topic by comparing it with related concepts"

    prompt_template = """
    Create a comparative analysis of {topic_title} and related concepts.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with comparison tables and analysis:

    # Comparative Analysis: {topic_title}

    ## Core Concept Overview Start with a clear explanation of what {topic_title} is, focusing on aspects that will 
    be important for comparison. Keep this section focused and concise (2-3 paragraphs).

    ## Related Concepts Identify 3-4 closely related concepts or alternatives that are often compared or confused 
    with {topic_title}. For each related concept, provide:

    1. **[Related Concept 1]**: Brief definition and primary purpose (1 paragraph)
    2. **[Related Concept 2]**: Brief definition and primary purpose (1 paragraph)
    3. **[Related Concept 3]**: Brief definition and primary purpose (1 paragraph)
    4. **[Related Concept 4]** (if applicable): Brief definition and primary purpose (1 paragraph)

    ## Detailed Comparisons

    ### {topic_title} vs [Related Concept 1]

    | Feature | {topic_title} | [Related Concept 1] |
    |---------|---------------|---------------------|
    | Primary purpose | [Description] | [Description] |
    | Key strengths | [Description] | [Description] |
    | Limitations | [Description] | [Description] |
    | Implementation complexity | [Description] | [Description] |
    | Performance characteristics | [Description] | [Description] |
    | Learning curve | [Description] | [Description] |
    | Best use case | [When to use] | [When to use] |

    **Key Differences**: [Detailed explanation of the most important differences, including technical distinctions 
    and practical implications]

    **Similarities**:
    [Explanation of important commonalities or shared characteristics]

    ### {topic_title} vs [Related Concept 2]
    [Repeat the same table structure and analysis]

    ### {topic_title} vs [Related Concept 3]
    [Repeat the same table structure and analysis]

    [If applicable: {topic_title} vs [Related Concept 4]]

    ## Decision Framework: When to Choose Each Option

    Create a decision tree or flowchart in text form to help readers choose between these options:

    1. If your primary need is [specific requirement], then:
       - Choose **{topic_title}** when [specific conditions]
       - Choose **[Related Concept 1]** when [specific conditions]

    2. If your constraints include [specific constraint], then:
       - Choose **{topic_title}** when [specific conditions]
       - Choose **[Related Concept 2]** when [specific conditions]

    [Continue with additional decision points]

    ## Hybrid Approaches Explain how {topic_title} might be combined with one or more related concepts to create 
    hybrid solutions that leverage strengths of multiple approaches. Provide at least one concrete example of such a 
    hybrid approach.

    ## Common Transition Scenarios
    Describe common scenarios where a project might transition:
    - From {topic_title} to [Related Concept]
    - From [Related Concept] to {topic_title}

    Include the typical reasons for such transitions and implementation considerations.

    ## Historical Context
    Briefly explain how these concepts evolved in relation to each other:
    - Which came first?
    - How did they influence each other?
    - How have their relative positions changed over time?

    {extra_instructions}
    """


class QuizMode(ModeConfig):
    """Self-assessment quiz mode with practice questions."""
    mode_type = ModeType.QUIZ
    name = "Self-Assessment Quiz"
    description = "Test and reinforce your knowledge with practice questions"

    prompt_template = """
    Create a comprehensive self-assessment quiz for {topic_title}.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with questions and hidden answers using HTML details tags:

    # Quiz: {topic_title}

    ## Introduction
    Start with a brief introduction to this quiz, explaining:
    - What knowledge it will test
    - How the questions progress in difficulty
    - How to use the quiz effectively for learning

    ## Concept Check Questions

    1. **Question**: [Basic question testing fundamental understanding of {topic_title}]
       - A. [Option A]
       - B. [Option B]
       - C. [Option C]
       - D. [Option D]

       <details>
       <summary>See Answer</summary>

       **Correct Answer**: [Letter]

       **Explanation**: [Detailed explanation of why this answer is correct and why others are incorrect. Include any 
       relevant principles or concepts.] </details>

    2. **Question**: [Another fundamental question]
       [Options and answer format as above]

    3. **Question**: [A third fundamental question]
       [Options and answer format as above]

    ## Application Questions

    4. **Question**: [Question about applying {topic_title} to a specific scenario]
       [Options and answer format as above]

    5. **Question**: [Another application question]
       [Options and answer format as above]

    ## Problem-Solving Questions

    6. **Question**: [Open-ended problem that requires applying {topic_title}]

       <details>
       <summary>See Solution</summary>

       **Solution Approach**:
       1. [First step]
       2. [Second step]
       3. [Third step]

       **Complete Solution**: [Full solution with explanation]

       **Key Insights**:
       - [Important insight from this problem]
       - [Another insight]
       </details>

    7. **Question**: [Another problem-solving question]
       [Solution format as above]

    ## Advanced Concepts

    8. **Question**: [Question testing advanced understanding]
       [Options and answer format as above]

    9. **Question**: [Question about edge cases, optimizations, or advanced applications]
       [Options and answer format as above]

    10. **Question**: [Question connecting {topic_title} to related concepts]
        [Options and answer format as above]

    ## Self-Assessment

    ### Scoring Guide

    - **8-10 correct**: Expert understanding of {topic_title}
    - **6-7 correct**: Strong understanding with some gaps
    - **4-5 correct**: Basic understanding, review recommended
    - **0-3 correct**: Fundamental review needed

    ### Concept Mastery Guide Provide a breakdown of which concepts are tested by which questions, so learners can 
    identify specific areas for review.

    ## Additional Practice Resources
    Suggest resources for further practice and learning based on the topics covered in this quiz.

    {extra_instructions}
    """


class VisualMode(ModeConfig):
    """Visual learning mode with diagrams and visual explanations."""
    mode_type = ModeType.VISUAL
    name = "Visual Learning"
    description = "Understand concepts through diagrams, flowcharts, and visual explanations"

    prompt_template = """
    Create a visual explanation of {topic_title} using text-based diagrams and descriptions.

    This is a {difficulty} level topic in the category of {category_name}.

    Format your response in Markdown with ASCII diagrams, conceptual maps, and visual explanations:

    # Visual Guide: {topic_title}

    ## Concept Overview Start with a brief introduction to {topic_title} that emphasizes its visual or structural 
    aspects. Explain why visual representation helps in understanding this concept (1-2 paragraphs).

    ## Core Concept Visualization

    ```
    [ASCII diagram or representation of the core concept]

    Example structure:
    +----------------+
    |                |
    |  Main Concept  |----→ Related Element
    |                |
    +-------+--------+
            |
            ↓
      Sub-component
    ```

    **Diagram Explanation**:
    Provide a detailed explanation of each element in the diagram and how they relate to each other. Focus on:
    - What each symbol or node represents
    - The meaning of each connection or relationship
    - How this visual representation captures the essence of {topic_title}

    ## Process Flow

    If {topic_title} involves a process or sequence, create a flowchart:

    ```
    [ASCII flowchart showing steps or stages]

    Example structure:
    Start
      ↓
    [Step 1] -------+
      ↓      No     |
    Decision -------+
      ↓ Yes
    [Step 2]
      ↓
    [Step 3]
      ↓
    End
    ```

    **Process Explanation**:
    Provide a step-by-step walkthrough of the flow, explaining:
    - What happens at each stage
    - What criteria determine different paths
    - How the overall process works as a cohesive whole

    ## Component Breakdown

    ```
    [ASCII diagram showing the main components or parts]

    Example structure:
    +---------------------------------------+
    |                                       |
    |  +-------------+    +-------------+   |
    |  | Component A |    | Component B |   |
    |  +-------------+    +-------------+   |
    |         ↓                 ↓           |
    |  +-------------------------------+    |
    |  |        Component C           |    |
    |  +-------------------------------+    |
    |                                       |
    +---------------------------------------+
    ```

    **Component Explanation**:
    Explain each component in detail, including:
    - Its purpose and function
    - How it interacts with other components
    - Key characteristics or properties

    ## Hierarchical Structure

    If applicable, show hierarchical relationships:

    ```
    [ASCII tree diagram showing hierarchical relationships]

    Example structure:
                Root
              /  |  \
             /   |   \
        Child1 Child2 Child3
          /\           \
         /  \           \
    Leaf1  Leaf2      Leaf4
    ```

    **Hierarchy Explanation**:
    Explain the significance of the hierarchical structure and what each level represents.

    ## Comparative Visualization

    ```
    [ASCII comparison chart or diagram]

    Example structure:
    Approach A    |    Approach B
    --------------|---------------
    Feature 1     |    Feature 1'
    Feature 2     |    Feature 2'
    Feature 3     |    Feature 3'
    ```

    **Comparison Explanation**:
    Analyze the similarities and differences shown in the comparison.

    ## Key Visual Patterns to Recognize

    1. **Pattern 1**: [Description of a visual pattern] - [Explanation of significance]
    2. **Pattern 2**: [Description of a visual pattern] - [Explanation of significance]
    3. **Pattern 3**: [Description of a visual pattern] - [Explanation of significance]

    ## Visualizing Real-World Applications

    ```
    [ASCII diagram showing a practical application scenario]
    ```

    **Application Explanation**:
    Explain how the visual concepts translate to solving real-world problems or implementing practical solutions.

    ## Visual Memory Aids

    Provide visual mnemonics or memory aids for key aspects of {topic_title}:

    ```
    [ASCII memory aid diagram]
    ```

    **Memory Aid Usage**:
    Explain how to use this visual aid to remember important concepts.

    {extra_instructions}
    """
