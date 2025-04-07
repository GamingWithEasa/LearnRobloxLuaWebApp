"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import CodeEditor from "@/components/code-editor"

// This would come from a database in a real application
const unitTest = {
  unitId: 6,
  unitTitle: "Control Structures",
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Which keyword is used to start an if statement in Lua?",
      options: ["if", "when", "check", "condition"],
      correctAnswer: "if",
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "What symbol is used for 'not equal to' in Lua?",
      options: ["!=", "<>", "~=", "/="],
      correctAnswer: "~=",
    },
    {
      id: 3,
      type: "coding",
      question: "Write a function that returns 'Pass' if the score is 70 or higher, otherwise return 'Fail'.",
      initialCode: `function checkScore(score)
  -- Write your code here
  
  return "Unknown"
end`,
      solution: `function checkScore(score)
  if score >= 70 then
    return "Pass"
  else
    return "Fail"
  end
end`,
      testCases: [
        { input: 85, expected: "Pass" },
        { input: 70, expected: "Pass" },
        { input: 65, expected: "Fail" },
      ],
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Which of the following is NOT a valid comparison operator in Lua?",
      options: ["==", "<=", ">=", "=>"],
      correctAnswer: "=>",
    },
  ],
}

export default function UnitTestPage({ params }: { params: { unitId: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [codingResults, setCodingResults] = useState<Record<number, boolean[]>>({})

  const question = unitTest.questions[currentQuestion]
  const totalQuestions = unitTest.questions.length

  const handleAnswerSelect = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer })
  }

  const handleCodeChange = (code: string) => {
    setCodingAnswers({ ...codingAnswers, [question.id]: code })
  }

  const runCode = (questionId: number, code: string, testCases: any[]) => {
    // In a real application, this would run the Lua code in a sandbox
    // For this demo, we'll simulate the results

    const results = testCases.map((testCase) => {
      // Very basic simulation - in reality you'd use a Lua interpreter
      if (code.includes("if") && code.includes("score >= 70") && code.includes("Pass") && code.includes("Fail")) {
        // Assume correct implementation
        return true
      }
      return false
    })

    setCodingResults({ ...codingResults, [questionId]: results })
    return results.every((r) => r)
  }

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitTest = () => {
    // Run any unexecuted coding questions
    unitTest.questions.forEach((q) => {
      if (q.type === "coding" && codingAnswers[q.id] && !codingResults[q.id]) {
        runCode(q.id, codingAnswers[q.id], q.testCases)
      }
    })

    setSubmitted(true)
  }

  const calculateScore = () => {
    let correct = 0

    unitTest.questions.forEach((q) => {
      if (q.type === "multiple-choice" && answers[q.id] === q.correctAnswer) {
        correct++
      } else if (q.type === "coding" && codingResults[q.id]?.every((r) => r)) {
        correct++
      }
    })

    return {
      score: correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    }
  }

  const isQuestionAnswered = (q: any) => {
    if (q.type === "multiple-choice") {
      return !!answers[q.id]
    } else if (q.type === "coding") {
      return !!codingAnswers[q.id]
    }
    return false
  }

  const allQuestionsAnswered = unitTest.questions.every((q) => isQuestionAnswered(q))

  if (submitted) {
    const result = calculateScore()
    const passed = result.percentage >= 70

    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/units/${params.unitId}`}
          className="flex items-center text-muted-foreground mb-6 hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Unit {params.unitId}
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Unit Test Results</CardTitle>
            <CardDescription>
              Unit {params.unitId}: {unitTest.unitTitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-center p-6 ${passed ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"} rounded-lg mb-6`}
            >
              <div className="text-5xl font-bold mb-2">
                {result.score}/{result.total}
              </div>
              <div className="text-2xl font-semibold mb-4">{result.percentage}%</div>
              <div className="flex justify-center items-center">
                {passed ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <span className="text-xl font-medium text-green-700 dark:text-green-300">Passed!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500 mr-2" />
                    <span className="text-xl font-medium text-red-700 dark:text-red-300">Failed</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Summary:</h3>
              {unitTest.questions.map((q, index) => {
                const isCorrect =
                  q.type === "multiple-choice"
                    ? answers[q.id] === q.correctAnswer
                    : codingResults[q.id]?.every((r) => r)

                return (
                  <div key={q.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      Question {index + 1}:{" "}
                      {q.type === "coding" ? "Coding Challenge" : q.question.substring(0, 30) + "..."}
                    </div>
                    <div>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Link href={`/units/${params.unitId}`}>
                <Button variant="outline">Return to Unit</Button>
              </Link>
              {!passed && <Button onClick={() => setSubmitted(false)}>Retry Test</Button>}
              {passed && (
                <Link href="/">
                  <Button>Continue Learning</Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    )
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
        <h1 className="text-3xl font-bold mb-2">Unit Test: {unitTest.unitTitle}</h1>
        <div className="flex items-center gap-4">
          <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2 flex-1" />
          <span className="text-sm whitespace-nowrap">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1}
            {question.type === "coding" ? ": Coding Challenge" : ""}
          </CardTitle>
          <CardDescription>
            {question.type === "multiple-choice" ? question.question : "Write code to solve the following problem:"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {question.type === "multiple-choice" ? (
            <div className="space-y-2">
              {question.options.map((option) => (
                <div
                  key={option}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[question.id] === option ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="font-medium">{question.question}</div>
              <CodeEditor
                value={codingAnswers[question.id] || question.initialCode}
                onChange={(code) => handleCodeChange(code)}
                language="lua"
                height="200px"
              />

              {codingResults[question.id] && (
                <div className="space-y-2">
                  <div className="font-medium">Test Results:</div>
                  {question.testCases.map((testCase, i) => (
                    <div
                      key={i}
                      className={`p-2 text-sm rounded-md ${
                        codingResults[question.id][i]
                          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {codingResults[question.id][i] ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span>
                          Input: {JSON.stringify(testCase.input)} | Expected: {JSON.stringify(testCase.expected)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={() => runCode(question.id, codingAnswers[question.id] || "", question.testCases)}
                className="w-full"
              >
                Run Tests
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={nextQuestion} disabled={!isQuestionAnswered(question)}>
              Next
            </Button>
          ) : (
            <Button onClick={submitTest} disabled={!allQuestionsAnswered}>
              Submit Test
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex justify-center gap-2">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <Button
            key={i}
            variant={
              i === currentQuestion ? "default" : isQuestionAnswered(unitTest.questions[i]) ? "outline" : "ghost"
            }
            size="icon"
            className="w-8 h-8"
            onClick={() => setCurrentQuestion(i)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}

