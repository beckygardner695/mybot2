export const FlairValidationRules = {
  // Example subreddit rules
  'programming': {
    required: true,
    allowedFlairs: [
      { id: '1', text: 'Discussion', backgroundColor: '#e2e8f0', textColor: '#1e293b' },
      { id: '2', text: 'Help', backgroundColor: '#fee2e2', textColor: '#991b1b' },
      { id: '3', text: 'Project', backgroundColor: '#dbeafe', textColor: '#1e40af' },
      { id: '4', text: 'Resource', backgroundColor: '#f3e8ff', textColor: '#6b21a8' },
    ],
    allowCustom: false,
    message: "r/programming requires a post flair from the approved list"
  },
  'webdev': {
    required: true,
    allowedFlairs: [
      { id: '5', text: 'Showoff', backgroundColor: '#f3e8ff', textColor: '#6b21a8' },
      { id: '6', text: 'Question', backgroundColor: '#ecfccb', textColor: '#3f6212' },
      { id: '7', text: 'Guide', backgroundColor: '#dbeafe', textColor: '#1e40af' },
    ],
    allowCustom: true,
    customValidation: (flair) => {
      // Example custom validation rule
      if (flair.text.length < 3) {
        return "Custom flair text must be at least 3 characters long"
      }
      return null
    },
    message: "r/webdev requires a post flair"
  },
  'reactjs': {
    required: true,
    allowedFlairs: [
      { id: '8', text: 'Help', backgroundColor: '#fee2e2', textColor: '#991b1b' },
      { id: '9', text: 'Discussion', backgroundColor: '#e2e8f0', textColor: '#1e293b' },
    ],
    allowCustom: false,
    message: "r/reactjs requires an approved post flair"
  }
}

export function validateFlair(subreddit, flair) {
  const rules = FlairValidationRules[subreddit]
  if (!rules) return null // No validation rules for this subreddit

  if (rules.required && !flair) {
    return rules.message
  }

  if (flair) {
    // Check if flair is in allowed list
    const isAllowedFlair = rules.allowedFlairs.some(
      allowed => allowed.id === flair.id || allowed.text === flair.text
    )

    if (!isAllowedFlair && !rules.allowCustom) {
      return `This flair is not allowed in r/${subreddit}`
    }

    // Run custom validation if exists and flair is custom
    if (!isAllowedFlair && rules.customValidation) {
      return rules.customValidation(flair)
    }
  }

  return null
}

export function getAvailableFlairs(subreddit) {
  return FlairValidationRules[subreddit]?.allowedFlairs || []
}

export function isCustomFlairAllowed(subreddit) {
  return FlairValidationRules[subreddit]?.allowCustom ?? true
}