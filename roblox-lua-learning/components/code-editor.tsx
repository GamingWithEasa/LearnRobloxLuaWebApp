"use client"

import { useEffect, useRef, useState } from "react"
import { Editor, type Monaco, type OnMount } from "@monaco-editor/react"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
}

export default function CodeEditor({ value, onChange, language = "lua", height = "200px" }: CodeEditorProps) {
  const { theme } = useTheme()
  const [isEditorReady, setIsEditorReady] = useState(false)
  const monacoRef = useRef<Monaco | null>(null)
  const editorRef = useRef<any>(null)

  // Configure Monaco editor on mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    setIsEditorReady(true)

    // Configure Lua language
    configureLuaLanguage(monaco)

    // Focus the editor
    editor.focus()

    // Set editor options for VS Code-like experience
    editor.updateOptions({
      fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 21,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      scrollbar: {
        vertical: "auto",
        horizontal: "auto",
      },
      lineNumbers: "on",
      glyphMargin: true,
      folding: true,
      bracketPairColorization: {
        enabled: true,
      },
      "semanticHighlighting.enabled": true,
      autoIndent: "full",
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "smart",
      snippetSuggestions: "inline",
      wordBasedSuggestions: "matchingDocuments",
      parameterHints: {
        enabled: true,
        cycle: true,
      },
      suggest: {
        snippetsPreventQuickSuggestions: false,
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        preview: true,
        showMethods: true,
        showVariables: true,
        filterGraceful: true,
        localityBonus: true,
      },
    })

    // Add custom key bindings for auto-completion
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      editor.trigger("keyboard", "editor.action.triggerSuggest", {})
    })

    // Add auto-closing brackets and auto-indentation
    editor.onDidType((text) => {
      if (text === "\n") {
        const model = editor.getModel()
        const position = editor.getPosition()

        if (!model || !position) return

        const lineContent = model.getLineContent(position.lineNumber - 1)

        // Auto-complete structures based on previous line
        if (lineContent.trim().match(/^if\s+.*\s+then$/)) {
          const indentation = getIndentation(lineContent)
          const nextIndentation = indentation + "  "

          const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          model.pushEditOperations([], [{ range, text: nextIndentation + "\n" + indentation + "end" }], () => null)

          editor.setPosition({
            lineNumber: position.lineNumber,
            column: nextIndentation.length + 1,
          })
        } else if (lineContent.trim().match(/^function\s+.*$$\s*.*\s*$$$/)) {
          const indentation = getIndentation(lineContent)
          const nextIndentation = indentation + "  "

          const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          model.pushEditOperations([], [{ range, text: nextIndentation + "\n" + indentation + "end" }], () => null)

          editor.setPosition({
            lineNumber: position.lineNumber,
            column: nextIndentation.length + 1,
          })
        } else if (lineContent.trim().match(/^for\s+.*\s+do$/)) {
          const indentation = getIndentation(lineContent)
          const nextIndentation = indentation + "  "

          const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          model.pushEditOperations([], [{ range, text: nextIndentation + "\n" + indentation + "end" }], () => null)

          editor.setPosition({
            lineNumber: position.lineNumber,
            column: nextIndentation.length + 1,
          })
        } else if (lineContent.trim().match(/^while\s+.*\s+do$/)) {
          const indentation = getIndentation(lineContent)
          const nextIndentation = indentation + "  "

          const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          model.pushEditOperations([], [{ range, text: nextIndentation + "\n" + indentation + "end" }], () => null)

          editor.setPosition({
            lineNumber: position.lineNumber,
            column: nextIndentation.length + 1,
          })
        } else if (lineContent.trim().match(/^repeat$/)) {
          const indentation = getIndentation(lineContent)
          const nextIndentation = indentation + "  "

          const range = {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          model.pushEditOperations([], [{ range, text: nextIndentation + "\n" + indentation + "until " }], () => null)

          editor.setPosition({
            lineNumber: position.lineNumber,
            column: nextIndentation.length + 1,
          })
        }
      }
    })
  }

  // Helper function to get indentation from a line
  const getIndentation = (line: string): string => {
    const match = line.match(/^(\s*)/)
    return match ? match[1] : ""
  }

  // Configure Lua language features
  const configureLuaLanguage = (monaco: Monaco) => {
    // Register Lua language if not already registered
    if (!monaco.languages.getLanguages().some((lang) => lang.id === "lua")) {
      // Define Lua keywords for syntax highlighting and auto-completion
      const luaKeywords = [
        "and",
        "break",
        "do",
        "else",
        "elseif",
        "end",
        "false",
        "for",
        "function",
        "if",
        "in",
        "local",
        "nil",
        "not",
        "or",
        "repeat",
        "return",
        "then",
        "true",
        "until",
        "while",
      ]

      // Roblox specific functions and libraries
      const robloxGlobals = [
        "game",
        "workspace",
        "script",
        "plugin",
        "Enum",
        "task",
        "settings",
        "UserSettings",
        "stats",
        "PluginManager",
        "DebuggerManager",
      ]

      const robloxFunctions = [
        // Core functions
        "print",
        "warn",
        "error",
        "assert",
        "collectgarbage",
        "gcinfo",
        "getfenv",
        "getmetatable",
        "ipairs",
        "loadstring",
        "newproxy",
        "next",
        "pairs",
        "pcall",
        "rawequal",
        "rawget",
        "rawset",
        "select",
        "setfenv",
        "setmetatable",
        "tonumber",
        "tostring",
        "type",
        "unpack",
        "xpcall",
        "_G",
        "_VERSION",
        "delay",
        "spawn",
        "wait",
        "tick",
        "time",

        // Instance related
        "Instance.new",
        "typeof",
        "FindFirstChild",
        "FindFirstAncestor",
        "GetChildren",
        "GetDescendants",
        "IsA",
        "WaitForChild",
        "Destroy",
        "Clone",
        "ClearAllChildren",
        "GetFullName",
        "GetPropertyChangedSignal",

        // Math functions
        "math.abs",
        "math.acos",
        "math.asin",
        "math.atan",
        "math.atan2",
        "math.ceil",
        "math.clamp",
        "math.cos",
        "math.cosh",
        "math.deg",
        "math.exp",
        "math.floor",
        "math.fmod",
        "math.frexp",
        "math.ldexp",
        "math.log",
        "math.log10",
        "math.max",
        "math.min",
        "math.modf",
        "math.noise",
        "math.pow",
        "math.rad",
        "math.random",
        "math.randomseed",
        "math.sign",
        "math.sin",
        "math.sinh",
        "math.sqrt",
        "math.tan",
        "math.tanh",
        "math.huge",
        "math.pi",

        // String functions
        "string.byte",
        "string.char",
        "string.find",
        "string.format",
        "string.gmatch",
        "string.gsub",
        "string.len",
        "string.lower",
        "string.match",
        "string.rep",
        "string.reverse",
        "string.split",
        "string.sub",
        "string.upper",

        // Table functions
        "table.concat",
        "table.create",
        "table.find",
        "table.foreach",
        "table.foreachi",
        "table.freeze",
        "table.getn",
        "table.insert",
        "table.maxn",
        "table.move",
        "table.pack",
        "table.remove",
        "table.sort",
        "table.unpack",

        // Roblox specific constructors
        "Vector2.new",
        "Vector3.new",
        "CFrame.new",
        "CFrame.fromEulerAnglesXYZ",
        "CFrame.Angles",
        "CFrame.fromOrientation",
        "CFrame.fromMatrix",
        "Color3.new",
        "Color3.fromRGB",
        "Color3.fromHSV",
        "BrickColor.new",
        "BrickColor.Random",
        "BrickColor.palette",
        "NumberSequence.new",
        "ColorSequence.new",
        "NumberRange.new",
        "Rect.new",
        "UDim.new",
        "UDim2.new",
        "UDim2.fromScale",
        "UDim2.fromOffset",
        "Ray.new",
        "Region3.new",
        "TweenInfo.new",
      ]

      // Register Lua language
      monaco.languages.register({ id: "lua" })

      // Define Lua language configuration
      monaco.languages.setMonarchTokensProvider("lua", {
        defaultToken: "",
        tokenPostfix: ".lua",

        keywords: luaKeywords,

        builtins: [...robloxFunctions, ...robloxGlobals],

        operators: [
          "+",
          "-",
          "*",
          "/",
          "%",
          "^",
          "#",
          "==",
          "~=",
          "<=",
          ">=",
          "<",
          ">",
          "=",
          "(",
          ")",
          "{",
          "}",
          "[",
          "]",
          ";",
          ":",
          ",",
          ".",
          "..",
          "...",
        ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*/^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        // The main tokenizer for our languages
        tokenizer: {
          root: [
            // identifiers and keywords
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@builtins": "type",
                  "@default": "identifier",
                },
              },
            ],

            // whitespace
            { include: "@whitespace" },

            // delimiters and operators
            [/[{}()[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],

            // numbers
            [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F]+/, "number.hex"],
            [/\d+/, "number"],

            // delimiter: after number because of .\d floats
            [/[;,.]/, "delimiter"],

            // strings
            [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
            [/'([^'\\]|\\.)*$/, "string.invalid"], // non-terminated string
            [/"/, "string", "@string_double"],
            [/'/, "string", "@string_single"],

            // comments
            [/--\[\[.*\]\]/, "comment"],
            [/--.*$/, "comment"],
          ],

          whitespace: [[/[ \t\r\n]+/, ""]],

          string_double: [
            [/[^\\"]+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/"/, "string", "@pop"],
          ],

          string_single: [
            [/[^\\']+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [/'/, "string", "@pop"],
          ],

          bracketCounting: [
            [/\{/, "delimiter.bracket", "@bracketCounting"],
            [/\}/, "delimiter.bracket", "@pop"],
            { include: "root" },
          ],
        },
      })

      // Set language configuration for auto-closing brackets, auto-indentation, etc.
      monaco.languages.setLanguageConfiguration("lua", {
        comments: {
          lineComment: "--",
          blockComment: ["--[[", "]]"],
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: "--[[", close: "]]" },
        ],
        surroundingPairs: [
          { open: "{", close: "}" },
          { open: "[", close: "]" },
          { open: "(", close: ")" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
        indentationRules: {
          increaseIndentPattern: /^.*(\bdo\b|\bthen\b|\belse\b|elseif|\brepeat\b|\bfunction\b|[({]).*$/,
          decreaseIndentPattern: /^.*(\bend\b|\buntil\b|[)}]).*$/,
        },
        folding: {
          markers: {
            start: /^\s*--\s*#?region\b/,
            end: /^\s*--\s*#?endregion\b/,
          },
        },
        onEnterRules: [
          {
            beforeText: /^\s*\b(function|if|for|while|repeat|else|elseif)\b.*$/,
            action: { indentAction: monaco.languages.IndentAction.Indent },
          },
        ],
      })

      // Register completions provider with comprehensive snippets
      monaco.languages.registerCompletionItemProvider("lua", {
        triggerCharacters: [".", ":", " "],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          const suggestions = []

          // Add keyword suggestions
          suggestions.push(
            ...luaKeywords.map((keyword) => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              detail: "Lua keyword",
            })),
          )

          // Add Roblox globals
          suggestions.push(
            ...robloxGlobals.map((global) => ({
              label: global,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: global,
              detail: "Roblox global",
            })),
          )

          // Add Roblox functions
          suggestions.push(
            ...robloxFunctions.map((func) => {
              // Extract function name without namespace
              const funcName = func.includes(".") ? func.split(".").pop() : func

              return {
                label: func,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: func,
                detail: "Roblox function",
              }
            }),
          )

          // Add comprehensive code snippets
          const snippets = [
            // Control structures
            {
              label: "if",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if ${1:condition} then\n\t${2}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "If statement",
              documentation: "Basic if statement",
            },
            {
              label: "if-else",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if ${1:condition} then\n\t${2}\nelse\n\t${3}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "If-else statement",
              documentation: "If statement with else clause",
            },
            {
              label: "if-elseif-else",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "if ${1:condition1} then\n\t${2}\nelseif ${3:condition2} then\n\t${4}\nelse\n\t${5}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "If-elseif-else statement",
              documentation: "If statement with elseif and else clauses",
            },

            // Loops
            {
              label: "for-numeric",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for ${1:i} = ${2:1}, ${3:10}, ${4:1} do\n\t${5}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Numeric for loop",
              documentation: "Numeric for loop with start, end, and step values",
            },
            {
              label: "for-pairs",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for ${1:key}, ${2:value} in pairs(${3:table}) do\n\t${4}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "For-pairs loop",
              documentation: "Iterate through all key-value pairs in a table",
            },
            {
              label: "for-ipairs",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "for ${1:index}, ${2:value} in ipairs(${3:array}) do\n\t${4}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "For-ipairs loop",
              documentation: "Iterate through array elements with indices",
            },
            {
              label: "while",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "while ${1:condition} do\n\t${2}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "While loop",
              documentation: "Execute code while condition is true",
            },
            {
              label: "repeat-until",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "repeat\n\t${1}\nuntil ${2:condition}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Repeat-until loop",
              documentation: "Execute code until condition is true",
            },

            // Functions
            {
              label: "function",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "function ${1:name}(${2:params})\n\t${3}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Function declaration",
              documentation: "Define a named function",
            },
            {
              label: "local-function",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "local function ${1:name}(${2:params})\n\t${3}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Local function declaration",
              documentation: "Define a local function",
            },
            {
              label: "anonymous-function",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "function(${1:params})\n\t${2}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Anonymous function",
              documentation: "Define an anonymous function",
            },

            // Tables
            {
              label: "table-declaration",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "local ${1:tableName} = {\n\t${2}\n}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Table declaration",
              documentation: "Create a new table",
            },
            {
              label: "table-array",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "local ${1:arrayName} = {${2:1}, ${3:2}, ${4:3}}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Array-like table",
              documentation: "Create a table with sequential numeric indices",
            },
            {
              label: "table-dictionary",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'local ${1:dictName} = {\n\t[${2:"key1"}] = ${3:value1},\n\t[${4:"key2"}] = ${5:value2}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Dictionary-like table",
              documentation: "Create a table with string keys",
            },

            // Roblox-specific snippets
            {
              label: "new-part",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                'local ${1:part} = Instance.new("Part")\n${1:part}.Position = Vector3.new(${2:0}, ${3:0}, ${4:0})\n${1:part}.Anchored = true\n${1:part}.Parent = workspace',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Create a new Part",
              documentation: "Create a new Part instance and set its properties",
            },
            {
              label: "connect-event",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "${1:instance}.${2:Touched}:Connect(function(${3:hit})\n\t${4}\nend)",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Connect to an event",
              documentation: "Connect a function to an event",
            },
            {
              label: "wait-for-child",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'local ${1:child} = ${2:parent}:WaitForChild("${3:childName}")',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Wait for child",
              documentation: "Wait for a child to be added to a parent",
            },
            {
              label: "create-script",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                'local ${1:script} = Instance.new("Script")\n${1:script}.Source = [[\n\t${2:-- Script code here}\n]]\n${1:script}.Parent = ${3:game.Workspace}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Create a new Script",
              documentation: "Create a new Script instance and set its source",
            },
            {
              label: "tween-object",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                'local ${1:tweenInfo} = TweenInfo.new(${2:1}, Enum.EasingStyle.${3:Quad}, Enum.EasingDirection.${4:Out})\nlocal ${5:tween} = game:GetService("TweenService"):Create(${6:object}, ${1:tweenInfo}, {${7:Property = Value}})\n${5:tween}:Play()',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Tween an object",
              documentation: "Create and play a tween to animate an object",
            },

            // Common patterns
            {
              label: "local-variable",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "local ${1:name} = ${2:value}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Local variable declaration",
              documentation: "Declare a local variable",
            },
            {
              label: "print-debug",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'print("${1:Debug}: " .. ${2:value})',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Print debug message",
              documentation: "Print a debug message to the output",
            },
            {
              label: "pcall",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText:
                'local ${1:success}, ${2:result} = pcall(function()\n\t${3:-- code that might error}\nend)\n\nif not ${1:success} then\n\twarn("Error: " .. ${2:result})\nend',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Protected call",
              documentation: "Execute code safely with error handling",
            },
          ]

          suggestions.push(...snippets)

          // Context-aware suggestions
          if (textUntilPosition.trim().endsWith("function") || textUntilPosition.trim().endsWith("function ")) {
            suggestions.push({
              label: "function-template",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: " ${1:name}(${2:params})\n\t${3}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "Function template",
              documentation: "Complete function declaration",
            })
          }

          if (textUntilPosition.trim().endsWith("if") || textUntilPosition.trim().endsWith("if ")) {
            suggestions.push({
              label: "if-template",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: " ${1:condition} then\n\t${2}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "If template",
              documentation: "Complete if statement",
            })
          }

          if (textUntilPosition.trim().endsWith("for") || textUntilPosition.trim().endsWith("for ")) {
            suggestions.push({
              label: "for-template",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: " ${1:i} = ${2:1}, ${3:10} do\n\t${4}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "For loop template",
              documentation: "Complete for loop",
            })
          }

          if (textUntilPosition.trim().endsWith("while") || textUntilPosition.trim().endsWith("while ")) {
            suggestions.push({
              label: "while-template",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: " ${1:condition} do\n\t${2}\nend",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: "While loop template",
              documentation: "Complete while loop",
            })
          }

          return { suggestions }
        },
      })
    }
  }

  // Update editor theme when site theme changes
  useEffect(() => {
    if (monacoRef.current) {
      const monaco = monacoRef.current
      monaco.editor.defineTheme("vs-dark-custom", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
          { token: "type", foreground: "4EC9B0" },
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "number", foreground: "B5CEA8" },
          { token: "string", foreground: "CE9178" },
          { token: "identifier", foreground: "9CDCFE" },
          { token: "operator", foreground: "D4D4D4" },
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#D4D4D4",
          "editor.lineHighlightBackground": "#2D2D30",
          "editor.selectionBackground": "#264F78",
          "editor.inactiveSelectionBackground": "#3A3D41",
          "editorCursor.foreground": "#AEAFAD",
          "editorWhitespace.foreground": "#3B3B3B",
          "editorLineNumber.foreground": "#858585",
        },
      })

      monaco.editor.defineTheme("vs-light-custom", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "0000FF", fontStyle: "bold" },
          { token: "type", foreground: "267F99" },
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "number", foreground: "098658" },
          { token: "string", foreground: "A31515" },
          { token: "identifier", foreground: "001080" },
          { token: "operator", foreground: "000000" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editor.lineHighlightBackground": "#F7F7F7",
          "editor.selectionBackground": "#ADD6FF",
          "editor.inactiveSelectionBackground": "#E5EBF1",
          "editorCursor.foreground": "#000000",
          "editorWhitespace.foreground": "#D3D3D3",
          "editorLineNumber.foreground": "#237893",
        },
      })

      const currentTheme = theme === "dark" ? "vs-dark-custom" : "vs-light-custom"
      monaco.editor.setTheme(currentTheme)
    }
  }, [theme, monacoRef.current])

  return (
    <div className="border rounded-md overflow-hidden">
      {!isEditorReady && (
        <div className="flex items-center justify-center p-4 h-[200px] bg-muted">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={{
          readOnly: false,
          minimap: { enabled: true },
          fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          fontSize: 14,
        }}
        loading={
          <div className="flex items-center justify-center p-4 h-full bg-muted">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      />
    </div>
  )
}

