import { isValidJsx, isValidJsxString } from './jsxString'

// Test examples to demonstrate the validation function

console.log('=== JSX Validation Tests ===\n')

// Valid JSX examples
const validExamples = [
  '<div className="container">Hello World</div>',
  '<button onClick={handleClick}>Click me</button>',
  '<input type="text" onChange={handleChange} />',
  '<div style={{color: "red", fontSize: "16px"}}>Styled text</div>',
  '<img src="image.jpg" alt="description" />',
  '<div aria-label="accessibility" data-testid="component">Content</div>',
  '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>',
  '<div>{/* This is a valid JSX comment */}<span>Content</span></div>',
]

console.log('✅ Valid JSX Examples:')
validExamples.forEach((jsx, index) => {
  const result = isValidJsxString(jsx)
  console.log(`${index + 1}. ${result.isValid ? '✅' : '❌'} ${jsx}`)
  if (!result.isValid) {
    console.log(`   Errors: ${result.errors.join(', ')}`)
  }
})

console.log('\n❌ Invalid JSX Examples:')

// Invalid JSX examples that should fail validation
const invalidExamples = [
  {
    jsx: '<div class="container">Hello World</div>',
    reason: 'Uses "class" instead of "className"',
  },
  {
    jsx: '<button click-handler={handleClick}>Click me</button>',
    reason: 'Uses kebab-case attribute "click-handler" instead of camelCase',
  },
  {
    jsx: '<div style="color: red; font-size: 16px;">Styled text</div>',
    reason: 'Style attribute should be an object, not a string',
  },
  {
    jsx: '<div background-color="blue">Content</div>',
    reason: 'Uses kebab-case attribute instead of camelCase',
  },
  {
    jsx: '<div>Unclosed tag',
    reason: 'Unclosed div tag',
  },
  {
    jsx: '<input for="email" />',
    reason: 'Uses "for" instead of "htmlFor"',
  },
  {
    jsx: '<div ARIA-LABEL="wrong">Content</div>',
    reason: 'Incorrect ARIA attribute case (should be aria-label)',
  },
  {
    jsx: '<div><!-- This is a comment -->Hello</div>',
    reason: 'HTML comments are not valid in JSX',
  },
  {
    jsx: '<!-- Comment at start --><div>Hello</div><!-- Comment at end -->',
    reason: 'Multiple HTML comments are not valid in JSX',
  },
]

invalidExamples.forEach((example, index) => {
  const result = isValidJsxString(example.jsx)
  console.log(`${index + 1}. ${result.isValid ? '✅' : '❌'} ${example.jsx}`)
  console.log(`   Expected issue: ${example.reason}`)
  if (!result.isValid) {
    console.log(`   Actual errors: ${result.errors.join(', ')}`)
  }
  console.log('')
})

// Quick validation examples
console.log('=== Quick Validation (boolean only) ===')
console.log(`Valid JSX: ${isValidJsx('<div>Hello</div>')}`)
console.log(`Invalid JSX: ${isValidJsx('<div class="test">Hello</div>')}`)
