const colors = {
  'bootstrap4-light-blue': {
    defaultColor: '#212529',
    activeColor: '#007bff'
  },
  'bootstrap4-light-purple': {
    defaultColor: '#212529',
    activeColor: '#883cae'
  },
  'bootstrap4-dark-blue': {
    defaultColor: '#ffffffde',
    activeColor: '#8dd0ff'
  },
  'bootstrap4-dark-purple': {
    defaultColor: '#ffffffde',
    activeColor: '#c298d8'
  },
  'md-light-indigo': {
    defaultColor: '#000000de',
    activeColor: '#3F51B5'
  },
  'md-light-deeppurple': {
    defaultColor: '#000000de',
    activeColor: '#673AB7'
  },
  'md-dark-indigo': {
    defaultColor: '#ffffffde',
    activeColor: '#9FA8DA'
  },
  'md-dark-deeppurple': {
    defaultColor: '#ffffffde',
    activeColor: '#CE93D8'
  },
  'mdc-light-indigo': {
    defaultColor: '#000000de',
    activeColor: '#3F51B5'
  },
  'mdc-light-deeppurple': {
    defaultColor: '#000000de',
    activeColor: '#673AB7'
  },
  'mdc-dark-indigo': {
    defaultColor: '#ffffffde',
    activeColor: '#9FA8DA'
  },
  'mdc-dark-deeppurple': {
    defaultColor: '#ffffffde',
    activeColor: '#CE93D8'
  },
  'tailwind-light': {
    defaultColor: '#3f3f46',
    activeColor: '#4F46E5'
  },
  'fluent-light': {
    defaultColor: '#323130',
    activeColor: '#0078d4'
  },
  'lara-light-indigo': {
    defaultColor: '#495057',
    activeColor: '#6366F1'
  },
  'lara-light-blue': {
    defaultColor: '#495057',
    activeColor: '#3B82F6'
  },
  'lara-light-purple': {
    defaultColor: '#495057',
    activeColor: '#8B5CF6'
  },
  'lara-light-teal': {
    defaultColor: '#495057',
    activeColor: '#14B8A6'
  },
  'lara-dark-indigo': {
    defaultColor: '#ffffffde',
    activeColor: '#A5B4FC'
  },
  'lara-dark-blue': {
    defaultColor: '#ffffffde',
    activeColor: '#93C5FD'
  },
  'lara-dark-purple': {
    defaultColor: '#ffffffde',
    activeColor: '#C4B5FD'
  },
  'lara-dark-teal': {
    defaultColor: '#ffffffde',
    activeColor: '#5EEAD4'
  },
  'saga-blue': {
    defaultColor: '#495057',
    activeColor: '#2196F3'
  },
  'saga-green': {
    defaultColor: '#495057',
    activeColor: '#4CAF50'
  },
  'saga-orange': {
    defaultColor: '#495057',
    activeColor: '#FFC107'
  },
  'saga-purple': {
    defaultColor: '#495057',
    activeColor: '#9C27B0'
  },
  'vela-blue': {
    defaultColor: '#ffffffde',
    activeColor: '#64B5F6'
  },
  'vela-green': {
    defaultColor: '#ffffffde',
    activeColor: '#81C784'
  },
  'vela-orange': {
    defaultColor: '#ffffffde',
    activeColor: '#FFD54F'
  },
  'vela-purple': {
    defaultColor: '#ffffffde',
    activeColor: '#BA68C8'
  },
  'arya-blue': {
    defaultColor: '#ffffffde',
    activeColor: '#64B5F6'
  },
  'arya-green': {
    defaultColor: '#ffffffde',
    activeColor: '#81C784'
  },
  'arya-orange': {
    defaultColor: '#ffffffde',
    activeColor: '#FFD54F'
  },
  'arya-purple': {
    defaultColor: '#ffffffde',
    activeColor: '#BA68C8'
  },
}


export function getThemeColors(theme) {
  return colors[theme]
}