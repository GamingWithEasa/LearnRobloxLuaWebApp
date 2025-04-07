import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BookOpen, Code, CheckCircle } from "lucide-react"

export default function Home() {
  const units = [
    {
      id: 1,
      title: "Introduction to Lua",
      description: "Learn the basics of Lua programming language",
      lessons: 5,
      completed: 5,
    },
    {
      id: 2,
      title: "Variables & Data Types",
      description: "Understanding variables and different data types in Lua",
      lessons: 4,
      completed: 3,
    },
    {
      id: 3,
      title: "Functions",
      description: "Creating and using functions in Lua",
      lessons: 4,
      completed: 2,
    },
    {
      id: 4,
      title: "Tables",
      description: "Working with Lua tables for data storage",
      lessons: 5,
      completed: 0,
    },
    {
      id: 5,
      title: "Loops",
      description: "Different types of loops in Lua",
      lessons: 3,
      completed: 0,
    },
    {
      id: 6,
      title: "Control Structures",
      description: "Using if statements and other control structures",
      lessons: 4,
      completed: 0,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Roblox Lua Learning Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          An interactive educational platform to learn Roblox Lua programming through structured lessons and practical
          challenges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card key={unit.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Unit {unit.id}: {unit.title}
                {unit.completed === unit.lessons && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{unit.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span>{unit.lessons} Challenges</span>
                </div>
              </div>
              <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(unit.completed / unit.lessons) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1">
                {unit.completed}/{unit.lessons} completed
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/units/${unit.id}`} className="w-full">
                <Button className="w-full">
                  {unit.completed === 0 ? "Start Unit" : "Continue Unit"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}

