import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ArrowLeft, CheckCircle } from "lucide-react"

// This would come from a database in a real application
const units = [
  {
    id: 1,
    title: "Introduction to Lua",
    description: "Learn the basics of Lua programming language",
    lessons: [
      { id: 1, title: "What is Lua?", completed: true },
      { id: 2, title: "Lua in Roblox", completed: true },
      { id: 3, title: "Your First Script", completed: true },
      { id: 4, title: "Comments and Print", completed: true },
      { id: 5, title: "Basic Operators", completed: true },
    ],
  },
  {
    id: 2,
    title: "Variables & Data Types",
    description: "Understanding variables and different data types in Lua",
    lessons: [
      { id: 1, title: "Variables and Assignment", completed: true },
      { id: 2, title: "Numbers and Strings", completed: true },
      { id: 3, title: "Booleans and Nil", completed: true },
      { id: 4, title: "Type Conversion", completed: false },
    ],
  },
  {
    id: 3,
    title: "Functions",
    description: "Creating and using functions in Lua",
    lessons: [
      { id: 1, title: "Function Basics", completed: true },
      { id: 2, title: "Parameters and Arguments", completed: true },
      { id: 3, title: "Return Values", completed: false },
      { id: 4, title: "Local and Global Functions", completed: false },
    ],
  },
  {
    id: 4,
    title: "Tables",
    description: "Working with Lua tables for data storage",
    lessons: [
      { id: 1, title: "Table Basics", completed: false },
      { id: 2, title: "Arrays in Lua", completed: false },
      { id: 3, title: "Dictionaries in Lua", completed: false },
      { id: 4, title: "Nested Tables", completed: false },
      { id: 5, title: "Table Methods", completed: false },
    ],
  },
  {
    id: 5,
    title: "Loops",
    description: "Different types of loops in Lua",
    lessons: [
      { id: 1, title: "For Loops", completed: false },
      { id: 2, title: "While Loops", completed: false },
      { id: 3, title: "Repeat Until Loops", completed: false },
    ],
  },
  {
    id: 6,
    title: "Control Structures",
    description: "Using if statements and other control structures",
    lessons: [
      { id: 1, title: 'if "condition" then', completed: false },
      { id: 2, title: "else and elseif", completed: false },
      { id: 3, title: "switch-case alternatives", completed: false },
      { id: 4, title: "Logical Operators", completed: false },
    ],
  },
]

export default function UnitPage({ params }: { params: { unitId: string } }) {
  const unitId = Number.parseInt(params.unitId)
  const unit = units.find((u) => u.id === unitId)

  if (!unit) {
    notFound()
  }

  const completedLessons = unit.lessons.filter((lesson) => lesson.completed).length
  const progressPercentage = (completedLessons / unit.lessons.length) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Units
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Unit {unit.id}: {unit.title}
        </h1>
        <p className="text-muted-foreground mb-4">{unit.description}</p>

        <div className="flex items-center gap-4 mb-2">
          <Progress value={progressPercentage} className="h-2" />
          <span className="text-sm whitespace-nowrap">
            {completedLessons}/{unit.lessons.length} completed
          </span>
        </div>

        {completedLessons === unit.lessons.length && (
          <Link href={`/units/${unitId}/test`}>
            <Button variant="outline" className="mt-2">
              Take Unit Test
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {unit.lessons.map((lesson, index) => (
          <Card key={lesson.id} className={lesson.completed ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                Lesson {index + 1}: {lesson.title}
                {lesson.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
            </CardHeader>
            <CardFooter className="pt-2">
              <Link href={`/units/${unitId}/lessons/${lesson.id}`} className="w-full">
                <Button variant={lesson.completed ? "outline" : "default"} className="w-full">
                  {lesson.completed ? "Review Lesson" : "Start Lesson"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

