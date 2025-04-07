"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BookOpen, Code, CheckCircle } from "lucide-react"
import CodeEditor from "@/components/code-editor"

// This would come from a database in a real application
const lessonData = {
  unitId: 6,
  unitTitle: "Control Structures",
  id: 1,
  title: 'if "condition" then',
  content: `
# If Statements in Lua

In Lua, the \`if\` statement allows you to execute code conditionally. The basic syntax is:

\`\`\`lua
if condition then
    -- code to execute if condition is true
end
\`\`\`

The condition is evaluated, and if it's true (any value other than \`false\` or \`nil\`), the code inside the if block is executed.

## Examples

### Basic if statement:

\`\`\`lua
local playerHealth = 50

if playerHealth < 100 then
    print("Player is not at full health!")
end
\`\`\`

### Using comparison operators:

- Equal to: \`==\`
- Not equal to: \`~=\`
- Greater than: \`>\`
- Less than: \`<\`
- Greater than or equal to: \`>=\`
- Less than or equal to: \`<=\`

\`\`\`lua
local playerLevel = 10

if playerLevel >= 10 then
    print("Player can use advanced weapons!")
end
\`\`\`

In Roblox, if statements are commonly used to check player conditions, part collisions, and game states.
  `,
  challenge: {
    title: "Health Status Challenge",
    description:
      "Create a function that takes a player's health value and returns a status message based on the health value.",
    instructions: [
      "Create a function called 'getHealthStatus' that takes a number parameter 'health'",
      "If health is 100 or greater, return 'Full Health'",
      "If health is between 50 and 99, return 'Moderate Health'",
      "If health is between 25 and 49, return 'Low Health'",
      "If health is below 25, return 'Critical Health'",
    ],
    initialCode: `function getHealthStatus(health)
  -- Write your code here
  
  return "Unknown Status"
end

-- Test your function with these values
print(getHealthStatus(100))
print(getHealthStatus(75))
print(getHealthStatus(30))
print(getHealthStatus(10))`,
    solution: `function getHealthStatus(health)
  if health >= 100 then
    return "Full Health"
  elseif health >= 50 then
    return "Moderate Health"
  elseif health >= 25 then
    return "Low Health"
  else
    return "Critical Health"
  end
end

-- Test your function with these values
print(getHealthStatus(100))
print(getHealthStatus(75))
print(getHealthStatus(30))
print(getHealthStatus(10))`,
    expectedOutput: ["Full Health", "Moderate Health", "Low Health", "Critical Health"],
  },
  nextLesson: {
    id: 2,
    title: "else and elseif",
  },
  prevLesson: null,
}

// Add lesson data for unit 3 (Functions)
const functionLessonData = {
  3: {
    1: {
      unitId: 3,
      unitTitle: "Functions",
      id: 1,
      title: "Function Basics",
      content: `
# Function Basics in Lua

Functions are blocks of code that can be called and reused throughout your program. In Lua, functions are defined using the \`function\` keyword.

## Basic Syntax

\`\`\`lua
function functionName()
    -- code to execute
end
\`\`\`

## Example

\`\`\`lua
function sayHello()
    print("Hello, Roblox developer!")
end

-- Call the function
sayHello()
\`\`\`

Functions help organize your code and make it more reusable. In Roblox, you'll use functions for everything from handling player actions to creating game mechanics.
      `,
      challenge: {
        title: "Create a Greeting Function",
        description: "Create a function that prints a greeting message.",
        instructions: [
          "Create a function called 'greet'",
          "Inside the function, print 'Welcome to Roblox Studio!'",
          "Call the function after defining it",
        ],
        initialCode: `-- Write your function here


-- Call your function here
`,
        solution: `-- Write your function here
function greet()
  print("Welcome to Roblox Studio!")
end

-- Call your function here
greet()`,
        expectedOutput: ["Welcome to Roblox Studio!"],
      },
      nextLesson: {
        id: 2,
        title: "Parameters and Arguments",
      },
      prevLesson: null,
    },
    2: {
      unitId: 3,
      unitTitle: "Functions",
      id: 2,
      title: "Parameters and Arguments",
      content: `
# Function Parameters and Arguments

Parameters allow functions to receive data when they are called. Arguments are the actual values passed to the function.

## Syntax

\`\`\`lua
function functionName(parameter1, parameter2)
    -- code using parameters
end

-- Call with arguments
functionName(argument1, argument2)
\`\`\`

## Example

\`\`\`lua
function addNumbers(a, b)
    print(a + b)
end

-- Call with arguments 5 and 3
addNumbers(5, 3)  -- Outputs: 8
\`\`\`

Parameters make your functions more flexible and reusable by allowing them to work with different values each time they're called.
      `,
      challenge: {
        title: "Create a Personalized Greeting",
        description: "Create a function that greets a player by name.",
        instructions: [
          "Create a function called 'greetPlayer' that takes a 'name' parameter",
          "Inside the function, print 'Hello, [name]! Welcome to the game!'",
          "Call the function with different names",
        ],
        initialCode: `-- Write your function here


-- Call your function with different names
-- greetPlayer("Alex")
-- greetPlayer("Taylor")
`,
        solution: `-- Write your function here
function greetPlayer(name)
  print("Hello, " .. name .. "! Welcome to the game!")
end

-- Call your function with different names
greetPlayer("Alex")
greetPlayer("Taylor")`,
        expectedOutput: ["Hello, Alex! Welcome to the game!", "Hello, Taylor! Welcome to the game!"],
      },
      nextLesson: {
        id: 3,
        title: "Return Values",
      },
      prevLesson: {
        id: 1,
        title: "Function Basics",
      },
    },
  },
}

export default function LessonPage({ params }: { params: { unitId: string; lessonId: string } }) {
  const unitId = Number.parseInt(params.unitId)
  const lessonId = Number.parseInt(params.lessonId)

  // Get the appropriate lesson data based on the unit
  let currentLessonData = lessonData

  if (unitId === 3) {
    currentLessonData = functionLessonData[3][lessonId]
  }

  const [code, setCode] = useState(currentLessonData.challenge.initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [activeTab, setActiveTab] = useState("lesson")

  const runCode = () => {
    // In a real application, this would run the Lua code in a sandbox
    // For this demo, we'll simulate the output based on expected values

    // Simple simulation of running the code
    let simulatedOutput: string[] = []
    let correct = false

    try {
      if (unitId === 6) {
        // Control Structures unit
        if (
          code.includes("health >= 100") &&
          code.includes("health >= 50") &&
          code.includes("health >= 25") &&
          code.includes("Full Health") &&
          code.includes("Moderate Health") &&
          code.includes("Low Health") &&
          code.includes("Critical Health")
        ) {
          simulatedOutput = currentLessonData.challenge.expectedOutput
          correct = true
        } else {
          simulatedOutput = ["Output doesn't match expected results. Try again!"]
        }
      } else if (unitId === 3) {
        // Functions unit
        if (lessonId === 1) {
          if (
            code.includes("function greet") &&
            code.includes("Welcome to Roblox Studio") &&
            code.includes("greet()")
          ) {
            simulatedOutput = currentLessonData.challenge.expectedOutput
            correct = true
          } else {
            simulatedOutput = ["Output doesn't match expected results. Try again!"]
          }
        } else if (lessonId === 2) {
          if (
            code.includes("function greetPlayer") &&
            code.includes("name") &&
            code.includes("Hello") &&
            code.includes("Welcome to the game") &&
            code.includes("greetPlayer(")
          ) {
            simulatedOutput = currentLessonData.challenge.expectedOutput
            correct = true
          } else {
            simulatedOutput = ["Output doesn't match expected results. Try again!"]
          }
        }
      }
    } catch (error) {
      simulatedOutput = [`Error: ${error}`]
    }

    setOutput(simulatedOutput)
    setIsCorrect(correct)
  }

  const resetCode = () => {
    setCode(currentLessonData.challenge.initialCode)
    setOutput([])
    setIsCorrect(false)
  }

  const showSolution = () => {
    setCode(currentLessonData.challenge.solution)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/units/${params.unitId}`}
        className="flex items-center text-muted-foreground mb-6 hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Unit {params.unitId}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Lesson {params.lessonId}: {currentLessonData.title}
        </h1>
        <p className="text-muted-foreground">
          Unit {params.unitId}: {currentLessonData.unitTitle}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lesson" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lesson Content
          </TabsTrigger>
          <TabsTrigger value="challenge" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Coding Challenge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                {/* In a real app, you'd use a markdown renderer here */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentLessonData.content
                      .replace(/\n/g, "<br />")
                      .replace(/`([^`]+)`/g, "<code>$1</code>")
                      .replace(/```lua\n([^`]+)```/g, "<pre><code>$1</code></pre>"),
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {currentLessonData.prevLesson ? (
                <Link href={`/units/${params.unitId}/lessons/${currentLessonData.prevLesson.id}`}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div></div>
              )}

              <Button onClick={() => setActiveTab("challenge")}>
                Try the Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenge" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{currentLessonData.challenge.title}</CardTitle>
              <CardDescription>{currentLessonData.challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Instructions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {currentLessonData.challenge.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Code:</h3>
                <CodeEditor value={code} onChange={setCode} language="lua" height="300px" />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Output:</h3>
                <div className="bg-black text-white p-4 rounded-md font-mono text-sm h-[100px] overflow-y-auto">
                  {output.length > 0 ? (
                    output.map((line, i) => <div key={i}>{line}</div>)
                  ) : (
                    <div className="text-gray-500">Run your code to see output</div>
                  )}
                </div>
              </div>

              {isCorrect && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 p-4 rounded-md flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>Great job! You've completed this challenge successfully!</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetCode}>
                  Reset Code
                </Button>
                <Button variant="outline" onClick={showSolution}>
                  Show Solution
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={runCode}>Run Code</Button>
                {isCorrect && currentLessonData.nextLesson && (
                  <Link href={`/units/${params.unitId}/lessons/${currentLessonData.nextLesson.id}`}>
                    <Button variant="default">
                      Next Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

