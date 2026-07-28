You're discovering something that many React tutorials don't emphasize:

React tutorials teach React. They don't teach how to architect an application.

There's a big difference.

Why you're confused

Most tutorials build things like:

Todo list
Counter
Weather app
Notes app

Those are CRUD apps.

Your logic simulator is an interactive editor + simulation engine.

That's much closer to building:

Figma
Logisim
Blender
Unreal Blueprint
Excalidraw

Those projects have a completely different architecture.

What you're actually missing

You're not missing React.

You're missing state architecture.

Questions like:

Where should the data live?
Who owns the data?
When should I call setState?
Should this be state or just a variable?
What should be immutable?

Those aren't React syntax questions. They're design questions.

Resources I'd recommend
1. React Docs (⭐⭐⭐⭐⭐)

Not the old docs.

Read the modern docs:

Thinking in React
Choosing the State Structure
Sharing State Between Components
Updating Arrays in State
Updating Objects in State

These chapters are short and much better than most YouTube tutorials.

2. Dave Ceddia's blog (⭐⭐⭐⭐⭐)

He explains React from the perspective of "how to think."

Topics like:

State
Immutability
Data flow
Components
3. Web Dev Simplified (⭐⭐⭐⭐)

His videos explain why, not just what.

4. Code with Josh (formerly Josh Comeau) (⭐⭐⭐⭐⭐)

Probably the best explanations of React's mental model.

He spends a lot of time explaining why React behaves the way it does.

For your specific project

I honestly wouldn't search for "React logic gate simulator."

I'd search for:

React node editor
React graph editor
React diagram editor
React flow architecture

because those problems are almost identical.

My recommendation for you

Knowing your background, I actually think you'd learn faster by building this project than by watching another 20-hour React course.

You've already done OpenGL and C++. Those are much harder than React.

The problem is just translating your thinking into React's model.

If we work together on this

I'd suggest we build it like a software engineering project, not like a tutorial.

Week 1:

✓ Draggable gate
✓ Gate data model
✓ SVG rendering

Week 2:

✓ Wires
✓ Pins
✓ Connections

Week 3:

✓ Graph evaluation
✓ Switches
✓ LEDs

Week 4:

✓ Save/load
✓ Delete
✓ Copy/paste

At every step, I'd explain why we're designing it that way, not just give you code.

One last thing

I noticed something in this conversation: every time you asked "how do I connect gates?", "how do I evaluate the graph?", or "when should I run the simulator?", those were software architecture questions, not React questions.

That's actually a good sign.

You're already thinking about the system like an engineer. The React syntax ({{}}, ..., immutable updates, JSX) is just the language you need to express that design. Once the architecture is clear, the React code becomes much less mysterious.